import { INTERACT_TYPE } from '@constants/index';
import { Button } from '@material-tailwind/react';
import { web3FromSource } from '@polkadot/extension-dapp';
import { IComponent, TTransactionButton } from '@types';
import React, { useEffect, useState } from 'react';

import { useSubstrateConnection } from '..';
import utils from './utils';

interface ITransactionButtonProps {
  attrs: any;
  disabled?: boolean;
  label?: string;
  color?: string;
  className?: string;
  type?: TTransactionButton;
  setStatus: React.Dispatch<React.SetStateAction<any>>;
  txOnClickHandler?: any;
}

export const TransactionButton: IComponent<ITransactionButtonProps> = ({
  attrs = null,
  disabled = false,
  label,
  className,
  color,
  type = INTERACT_TYPE.QUERY,
  setStatus,
  txOnClickHandler = null,
}) => {
  // Hooks

  const {
    substrateConnection: { api, currentAccount },
  } = useSubstrateConnection();
  const [unSub, setUnSub] = useState<any>(null);
  const [sudoKey, setSudoKey] = useState('');

  const { palletRpc, callable, inputParams, paramFields } = attrs;

  const loadSudoKey = () => {
    (async function () {
      if (!api || !api.query.sudo) {
        return;
      }
      const sudoKey = await api.query.sudo.key();
      sudoKey.isEmpty ? setSudoKey('') : setSudoKey(sudoKey.toString());
    })();
  };

  useEffect(loadSudoKey, [api]);

  const getFromAcct = currentAccount
    ? async () => {
        const {
          address,
          meta: { source, isInjected },
        } = currentAccount;

        if (!isInjected) {
          return [currentAccount];
        }

        // currentAccount is injected from polkadot-JS extension, need to return the addr and signer object.
        // ref: https://polkadot.js.org/docs/extension/cookbook#sign-and-send-a-transaction
        const injector = await web3FromSource(source as string);
        return [address, { signer: injector.signer }];
      }
    : null;

  const txResHandler = ({ status }: any) =>
    status.isFinalized
      ? setStatus(`😉 Finalized. Block hash: ${status.asFinalized.toString()}`)
      : setStatus(`Current transaction status: ${status.type}`);

  const txErrHandler = (err: any) => setStatus(`😞 Transaction Failed: ${err.toString()}`);

  const sudoTx = async () => {
    if (api && getFromAcct) {
      const fromAcct = await getFromAcct();
      const transformed = transformParams(paramFields, inputParams);
      // transformed can be empty parameters

      const txExecute = transformed
        ? api.tx.sudo.sudo(api.tx[palletRpc][callable](...transformed))
        : api.tx.sudo.sudo(api.tx[palletRpc][callable]());

      const unSub = txExecute.signAndSend(...fromAcct, txResHandler).catch(txErrHandler);

      setUnSub(() => unSub);
    }
  };

  const uncheckedSudoTx = async () => {
    if (api && getFromAcct) {
      const fromAcct = await getFromAcct();
      const txExecute = api.tx.sudo.sudoUncheckedWeight(api.tx[palletRpc][callable](...inputParams), 0);

      const unSub = txExecute.signAndSend(...fromAcct, txResHandler).catch(txErrHandler);

      setUnSub(() => unSub);
    }
  };

  const signedTx = async () => {
    if (api && getFromAcct) {
      const fromAcct = await getFromAcct();
      const transformed = transformParams(paramFields, inputParams);
      // transformed can be empty parameters

      const txExecute = transformed ? api.tx[palletRpc][callable](...transformed) : api.tx[palletRpc][callable]();

      const unSub = await txExecute.signAndSend(...fromAcct, txResHandler).catch(txErrHandler);

      setUnSub(() => unSub);
    }
  };

  const unsignedTx = async () => {
    if (api) {
      const transformed = transformParams(paramFields, inputParams);
      // transformed can be empty parameters
      const txExecute = transformed ? api.tx[palletRpc][callable](...transformed) : api.tx[palletRpc][callable]();

      const unSub = await txExecute.send(txResHandler).catch(txErrHandler);
      setUnSub(() => unSub);
    }
  };

  const queryResHandler = (result: any) => (result.isNone ? setStatus('None') : setStatus(result.toString()));

  const query = async () => {
    if (api) {
      const transformed = transformParams(paramFields, inputParams);
      const unSub = await api.query[palletRpc][callable](...transformed, queryResHandler);

      setUnSub(() => unSub);
    }
  };

  const rpc = async () => {
    if (api) {
      const transformed = transformParams(paramFields, inputParams, {
        emptyAsNull: false,
      });
      const unSub = await api.rpc[palletRpc][callable](...transformed, queryResHandler);
      setUnSub(() => unSub);
    }
  };

  const constant = () => {
    if (api) {
      const result = api.consts[palletRpc][callable];
      (result as any).isNone ? setStatus('None') : setStatus(result.toString());
    }
  };

  const transaction = async () => {
    if (typeof unSub === 'function') {
      unSub();
      setUnSub(null);
    }

    setStatus('Sending...');

    let asyncFunc;

    switch (type) {
      case INTERACT_TYPE.SUDO:
        asyncFunc = sudoTx;
        break;
      case INTERACT_TYPE.UNCHECKED_SUDO:
        asyncFunc = uncheckedSudoTx;
        break;
      case INTERACT_TYPE.SIGNED:
        asyncFunc = signedTx;
        break;
      case INTERACT_TYPE.UNSIGNED:
        asyncFunc = unsignedTx;
        break;
      case INTERACT_TYPE.QUERY:
        asyncFunc = query;
        break;
      case INTERACT_TYPE.RPC:
        asyncFunc = rpc;
        break;
      case INTERACT_TYPE.CONSTANT:
        asyncFunc = constant;
        break;
      default:
        asyncFunc = null;
        break;
    }

    console.log({ asyncFunc, type });

    await asyncFunc?.();

    return txOnClickHandler && typeof txOnClickHandler === 'function' ? txOnClickHandler(unSub) : null;
  };

  const transformParams = (paramFields: any, inputParams: any, opts = { emptyAsNull: true }) => {
    // if `opts.emptyAsNull` is true, empty param value will be added to res as `null`.
    //   Otherwise, it will not be added
    const paramVal = inputParams.map((inputParam: any) => {
      // To cater the js quirk that `null` is a type of `object`.
      if (typeof inputParam === 'object' && inputParam !== null && typeof inputParam.value === 'string') {
        return inputParam.value.trim();
      } else if (typeof inputParam === 'string') {
        return inputParam.trim();
      }
      return inputParam;
    });
    const params = paramFields.map((field: any, ind: any) => ({
      ...field,
      value: paramVal[ind] || null,
    }));

    return params.reduce((memo: any, { type = 'string', value }: any) => {
      if (value == null || value === '') return opts.emptyAsNull ? [...memo, null] : memo;

      let converted = value;

      // Deal with a vector
      if (type.indexOf('Vec<') >= 0) {
        converted = converted.split(',').map((e: any) => e.trim());
        converted = converted.map((single: any) =>
          isNumType(type) ? (single.indexOf('.') >= 0 ? Number.parseFloat(single) : Number.parseInt(single)) : single,
        );
        return [...memo, converted];
      }

      // Deal with a single value
      if (isNumType(type)) {
        converted = converted.indexOf('.') >= 0 ? Number.parseFloat(converted) : Number.parseInt(converted);
      }
      return [...memo, converted];
    }, []);
  };

  const isNumType = (type: any) => utils.paramConversion.num.some((el) => type.indexOf(el) >= 0);

  const allParamsFilled = () => {
    if (paramFields.length === 0) {
      return true;
    }

    return paramFields.every((paramField: any, ind: any) => {
      const param = inputParams[ind];
      if (paramField.optional) {
        return true;
      }
      if (param == null) {
        return false;
      }

      const value = typeof param === 'object' ? param.value : param;
      return value !== null && value !== '';
    });
  };

  const isSudoer = (acctPair: any) => {
    if (!sudoKey || !acctPair) {
      return false;
    }
    return acctPair.address === sudoKey;
  };
  const {
    setCurrentAccount,
    substrateConnection: { keyring },
  } = useSubstrateConnection();
  useEffect(() => {
    if (api) {
      const account = keyring?.getPairs()[0];
      account && setCurrentAccount(keyring.getPair(account.address));
    }
  }, [keyring]);

  console.log({ currentAccount });
  console.log((type === INTERACT_TYPE.SUDO || type === INTERACT_TYPE.UNCHECKED_SUDO) && !isSudoer(currentAccount));
  console.log(
    (type === INTERACT_TYPE.SUDO || type === INTERACT_TYPE.UNCHECKED_SUDO || type === INTERACT_TYPE.SIGNED) &&
      !currentAccount,
  );
  console.log({ type });
  return (
    <Button
      color={color as any}
      className={className}
      type="submit"
      onClick={transaction}
      disabled={
        disabled ||
        !palletRpc ||
        !callable ||
        !allParamsFilled() ||
        // These txs required currentAccount to be set
        ((type === INTERACT_TYPE.SUDO || type === INTERACT_TYPE.UNCHECKED_SUDO || type === INTERACT_TYPE.SIGNED) &&
          !currentAccount) ||
        ((type === INTERACT_TYPE.SUDO || type === INTERACT_TYPE.UNCHECKED_SUDO) && !isSudoer(currentAccount))
      }>
      {label}
    </Button>
  );
};

// prop type checking

export const TxGroupButton: IComponent = (props: any) => {
  return (
    <div>
      <TransactionButton label="Unsigned" type={INTERACT_TYPE.UNSIGNED} color="indigo" {...props} />
      <TransactionButton label="Signed" type={INTERACT_TYPE.SIGNED} color="blue" {...props} />
      <TransactionButton label="SUDO" type={INTERACT_TYPE.SUDO} color="red" {...props} />
    </div>
  );
};
