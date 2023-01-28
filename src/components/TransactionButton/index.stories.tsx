// import { TxButton, TxGroupButton } from './substrate-lib/components';
import { API_STATES, INTERACT_TYPE } from '@constants/index';
import { Input, Option, Radio, Select, ThemeProvider, Typography } from '@material-tailwind/react';
import { ApiPromise } from '@polkadot/api';
import { DefinitionRpcParam } from '@polkadot/types/types';
import { Meta, Story } from '@storybook/react';
import { IComponent } from '@types';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { SubstrateConnectionLayout, useSubstrateConnection } from '..';
import { TransactionButton, TxGroupButton } from './TransactionButton';

const argIsOptional = (arg: any) => arg.type.toString().startsWith('Option<');

/**Selection Component **/

interface ISelectionProps {
  key: string | number;
  value: string;
  text: string;
}

interface ISelectionData {
  label: string;
  selection: ISelectionProps;
  state?: string | {};
}

interface IFilterSelectionProps {
  value?: string;
  label: string;
  className?: string;
  state?: string | {};
  selections: ISelectionProps[];
  onSelect?: (value: string) => void;
  onUpdate?: (data: any) => void;
}
const FilterSelection: IComponent<IFilterSelectionProps> = ({
  label,
  value,
  className,
  state,
  selections,
  onSelect,
  onUpdate,
}) => {
  return (
    <div>
      <Select
        value={value}
        label={`${label}`}
        className={className}
        onChange={
          onUpdate
            ? (value) => {
                const data: ISelectionData = {
                  label,
                  selection: selections.find((s) => s.value === value) as ISelectionProps,
                  state,
                };
                onUpdate(data);
              }
            : onSelect
        }
        nonce={undefined}
        onResize={undefined}
        onResizeCapture={undefined}>
        {selections.map(({ key, value, text }) => {
          return (
            <Option key={key} value={value}>
              {text}
            </Option>
          );
        })}
      </Select>
    </div>
  );
};

//* CustomInput Component */

export interface IInputData {
  label: string;
  placeholder?: string;
  state?: string | {};
  value: string;
}
interface ICustomInputProps {
  placeholder?: string;
  label: string;
  value: string;
  type?: string;
  variant?: string;
  state?: string | {};
  onUpdate?: (data: any) => void;
}
const CustomInput: IComponent<ICustomInputProps> = ({ placeholder, label, value, type = 'text', state, onUpdate }) => {
  return (
    <Input
      placeholder={placeholder}
      type={type}
      label={label}
      value={value}
      onChange={
        onUpdate
          ? (event) => {
              const data: IInputData = {
                label,
                state,
                placeholder,
                value: event.target.value,
              };
              onUpdate(data);
            }
          : undefined
      }
    />
  );
};

//InteractionSubmit Component
interface IInteractionSubmit {
  setStatus: React.Dispatch<React.SetStateAction<any>>;
  attrs: {
    interType: string;
    palletRpc: string;
    callable: string;
    inputParams: any[];
    paramFields: IParamFieldProps[];
  };
}

const InteractionSubmit: IComponent<IInteractionSubmit> = (props) => {
  const {
    attrs: { interType },
  } = props;
  if (interType === INTERACT_TYPE.QUERY) {
    return <TransactionButton label="Query" type={INTERACT_TYPE.QUERY} color="blue" {...props} />;
  } else if (interType === INTERACT_TYPE.EXTRINSIC) {
    return <TxGroupButton {...props} />;
  } else if (interType === INTERACT_TYPE.RPC || interType === INTERACT_TYPE.CONSTANT) {
    return <TransactionButton label="Submit" type={interType} color="blue" {...props} />;
  }
  return null;
};

interface ICallableProps {
  key: string;
  value: string;
  text: string;
}
interface IParamFieldProps {
  name: string;
  type: string;
  optional: boolean;
}
interface IFormStateProps {
  palletRpc: string;
  callable: string;
  inputParams: any[];
}

export const PalletController: IComponent = () => {
  const { substrateConnection } = useSubstrateConnection();
  const { api, apiState, jsonrpc } = substrateConnection;
  const [status, setStatus] = useState(null);

  const [interType, setInterType] = useState(INTERACT_TYPE.EXTRINSIC);
  const [palletRPCs, setPalletRPCs] = useState<ICallableProps[]>([]);
  const [callables, setCallables] = useState<ICallableProps[]>([]);
  const [paramFields, setParamFields] = useState<IParamFieldProps[]>([]);

  const initFormState: IFormStateProps = {
    palletRpc: '',
    callable: '',
    inputParams: [],
  };

  const [formState, setFormState] = useState<IFormStateProps>(initFormState);
  const { palletRpc, callable, inputParams } = formState;

  const getApiType = (api: ApiPromise, interType: string) => {
    if (interType === INTERACT_TYPE.QUERY) {
      return api.query;
    } else if (interType === INTERACT_TYPE.EXTRINSIC) {
      return api.tx;
    } else if (interType === INTERACT_TYPE.RPC) {
      return api.rpc;
    } else {
      return api.consts;
    }
  };

  const updatePalletRPCs = () => {
    if (!api || apiState !== API_STATES.READY) {
      return;
    }
    const apiType = getApiType(api, interType) as { [key: string]: any };

    const palletRPCs = Object.keys(apiType)
      .sort()
      .filter((pr) => Object.keys(apiType[pr]).length > 0)
      .map((pr) => ({ key: pr, value: pr, text: pr }));
    setPalletRPCs(palletRPCs);
  };

  const updateCallables = () => {
    if (!api || apiState !== API_STATES.READY || palletRpc === '') {
      return;
    }
    const callables = Object.keys((getApiType(api, interType) as { [key: string]: any })[palletRpc])
      .sort()
      .map((c) => ({ key: c, value: c, text: c }));
    setCallables(callables);
  };

  const updateParamFields = () => {
    if (!api || palletRpc === '' || callable === '') {
      setParamFields([]);
      return;
    }

    let paramFields: IParamFieldProps[] = [];

    if (interType === INTERACT_TYPE.QUERY) {
      const metaType = (api.query[palletRpc][callable] as any).meta.type;
      if (metaType.isPlain) {
        // Do nothing as `paramFields` is already set to []
      } else if (metaType.isMap) {
        paramFields = [
          {
            name: metaType.asMap.key.toString(),
            type: metaType.asMap.key.toString(),
            optional: false,
          },
        ];
      } else if (metaType.isDoubleMap) {
        paramFields = [
          {
            name: metaType.asDoubleMap.key1.toString(),
            type: metaType.asDoubleMap.key1.toString(),
            optional: false,
          },
          {
            name: metaType.asDoubleMap.key2.toString(),
            type: metaType.asDoubleMap.key2.toString(),
            optional: false,
          },
        ];
      }
    } else if (interType === INTERACT_TYPE.EXTRINSIC) {
      const metaArgs = api.tx[palletRpc][callable].meta.args;

      if (metaArgs && metaArgs.length > 0) {
        paramFields = metaArgs.map((arg) => ({
          name: arg.name.toString(),
          type: arg.type.toString(),
          optional: argIsOptional(arg),
        }));
      }
    } else if (interType === INTERACT_TYPE.RPC) {
      let metaParam: DefinitionRpcParam[] = [];

      if (jsonrpc[palletRpc] && jsonrpc[palletRpc][callable]) {
        metaParam = jsonrpc[palletRpc][callable].params;
      }

      if (metaParam.length > 0) {
        paramFields = metaParam.map((arg) => ({
          name: arg.name,
          type: arg.type,
          optional: arg.isOptional || false,
        }));
      }
    } else if (interType === INTERACT_TYPE.CONSTANT) {
      paramFields = [];
    }

    setParamFields(paramFields);
  };

  useEffect(updatePalletRPCs, [api, interType, apiState]);
  useEffect(updateCallables, [api, interType, palletRpc, apiState]);
  useEffect(updateParamFields, [api, interType, palletRpc, callable, jsonrpc]);

  const onPalletCallableParamChange = (data: any) => {
    setFormState((formState) => {
      let res: IFormStateProps = {
        palletRpc: '',
        callable: '',
        inputParams: [],
      };
      const { state } = data;

      if (typeof state === 'object') {
        // Input parameter updated
        const {
          ind,
          paramField: { type },
        } = state as any;
        const inputParams = [...formState.inputParams];
        inputParams[ind] = { type, value: data?.selection?.value || data?.value };
        res = { ...formState, inputParams };
      } else if (state === 'palletRpc') {
        res = { ...formState, [state]: data?.selection?.value || data?.value, callable: '', inputParams: [] };
      } else if (state === 'callable') {
        res = { ...formState, [state]: data?.selection?.value || data?.value, inputParams: [] };
      }
      return res;
    });
  };

  const onInterTypeChange = (event: any) => {
    setInterType(event.target.value);
    setFormState(initFormState);
  };

  const getOptionalMsg = (interType: string) =>
    interType === INTERACT_TYPE.RPC ? 'Optional Parameter' : 'Leaving this field as blank will submit a NONE value';
  return api ? (
    <div>
      <Typography>Pallet Interactor</Typography>
      <div className="form flex flex-col gap-4">
        <div className="form-group flex justify-around">
          <label>Interaction Type</label>
          <Radio
            label="Extrinsic"
            name="interType"
            value="EXTRINSIC"
            color="pink"
            defaultChecked
            onChange={onInterTypeChange}
          />
          <Radio label="Query" name="interType" value="QUERY" color="pink" onChange={onInterTypeChange} />
          <Radio label="RPC" name="interType" value="RPC" color="pink" onChange={onInterTypeChange} />
          <Radio label="Constant" name="interType" value="CONSTANT" color="pink" onChange={onInterTypeChange} />
        </div>
        <div className="form-field">
          {palletRPCs.length > 0 && (
            <FilterSelection
              label="Pallets / RPC"
              state="palletRpc"
              onUpdate={onPalletCallableParamChange}
              selections={palletRPCs}
              value={palletRpc}
            />
          )}
        </div>
        <div className="form-field">
          {palletRPCs.length > 0 && callables.length > 0 && (
            <FilterSelection
              label="Callable"
              state="callable"
              onUpdate={onPalletCallableParamChange}
              selections={callables}
              value={callable}
            />
          )}
        </div>
        {paramFields.map((paramField, ind) => (
          <div key={`${paramField.name}-${paramField.type}`}>
            <CustomInput
              placeholder={paramField.type}
              type="text"
              label={paramField.name}
              value={inputParams[ind] ? inputParams[ind].value : ''}
              state={{ ind, paramField }}
              onUpdate={onPalletCallableParamChange}
            />
            {paramField.optional ? <div>{getOptionalMsg(interType)}</div> : null}
          </div>
        ))}

        <div style={{ textAlign: 'center' }}>
          <InteractionSubmit
            setStatus={setStatus}
            attrs={{
              interType,
              palletRpc,
              callable,
              inputParams,
              paramFields,
            }}
          />
        </div>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </div>
    </div>
  ) : null;
};

export const TransactionButtonDemo: Story = (args) => {
  return (
    <ThemeProvider value={undefined}>
      <SubstrateConnectionLayout {...args}>
        <PalletController />
      </SubstrateConnectionLayout>
    </ThemeProvider>
  );
};
TransactionButtonDemo.args = {};
export default {
  title: 'TransactionButton Demo',
  component: TransactionButtonDemo,
} as Meta;
