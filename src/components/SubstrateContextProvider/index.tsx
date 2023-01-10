import { config } from '@config';
import { API_EVENTS } from '@constants/index';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { TypeRegistry } from '@polkadot/types/create';
import { keyring as Keyring } from '@polkadot/ui-keyring';
import { isTestChain } from '@polkadot/util';
import { initialSubstrateState, useSubstrateStore } from '@states/app';
import { IComponent, ISubstrateContext } from '@type';
import React, { useCallback, useContext, useEffect } from 'react';

const registry = new TypeRegistry();

let keyringLoadAll = false;

interface ISubstrateContextProviderProps {
  substrateState: ISubstrateContext;
  setSubstrateAccount?: (acc: string) => void;
}
const initialSubstrateStateContextProvider = { ...initialSubstrateState };

const SubstrateContext = React.createContext<ISubstrateContextProviderProps>({
  substrateState: initialSubstrateStateContextProvider,
  setSubstrateAccount: undefined,
});

export const SubstrateContextProvider: IComponent<{
  socket?: string;
}> = (props) => {
  const {
    substrateState,
    handleConnectInit,
    handleConnect,
    handleConnectSuccess,
    handleConnectError,
    handleLoadKeyring,
    handleSetKeyring,
    handleKeyringError,
    handleSetCurrentAccount,
  } = useSubstrateStore();

  const connectToOffChain = useCallback(() => {
    const { apiState, socket, jsonrpc } = substrateState;
    // We only want this function to be performed once
    if (apiState) return;
    handleConnectInit();

    console.log(`Connected socket: ${socket}`);
    const provider = new WsProvider(socket);
    const _api = new ApiPromise({ provider, rpc: jsonrpc });

    // Set listeners for disconnection and reconnection event.
    _api.on(API_EVENTS.CONNECTED, () => {
      handleConnect(_api);
      _api.isReady.then(() => handleConnectSuccess());
    });
    _api.on(API_EVENTS.READY, () => handleConnectSuccess());
    _api.on(API_EVENTS.ERROR, (err) => handleConnectError(err));
  }, [substrateState]);

  const retrieveChainInfo = useCallback(async (api: any) => {
    const [systemChain, systemChainType] = await Promise.all([
      api.rpc.system.chain(),
      api.rpc.system.chainType ? api.rpc.system.chainType() : Promise.resolve(registry.createType('ChainType', 'Live')),
    ]);

    return {
      systemChain: (systemChain || '<unknown>').toString(),
      systemChainType,
    };
  }, []);

  const loadAccounts = useCallback(() => {
    const { api } = substrateState;
    handleLoadKeyring();
    const asyncLoadAccounts = async () => {
      try {
        await web3Enable(config.APP_NAME);
        let allAccounts = await web3Accounts();

        allAccounts = allAccounts.map(({ address, meta }) => ({
          address,
          meta: { ...meta, name: `${meta.name} (${meta.source})` },
        }));

        // Logics to check if the connecting chain is a dev chain
        const { systemChain, systemChainType } = await retrieveChainInfo(api);
        const isDevelopment = systemChainType.isDevelopment || systemChainType.isLocal || isTestChain(systemChain);

        Keyring.loadAll({ isDevelopment }, allAccounts);
        // setSubstrateContext((prev) => ({ ...prev, keyringState: 'READY', keyring: Keyring }));
        handleSetKeyring(Keyring);
      } catch (e) {
        console.error(e);
        handleKeyringError();
      }
    };
    asyncLoadAccounts();
  }, []);

  useEffect(() => {
    connectToOffChain();
  }, [connectToOffChain]);

  useEffect(() => {
    const { apiState, keyringState } = substrateState;
    if (apiState === 'READY' && !keyringState && !keyringLoadAll) {
      keyringLoadAll = true;
      loadAccounts();
    }
  }, [substrateState]);

  const setCurrentAccount = (account: string) => {
    handleSetCurrentAccount(account);
  };

  return (
    <SubstrateContext.Provider value={{ substrateState, setSubstrateAccount: setCurrentAccount }}>
      {props.children}
    </SubstrateContext.Provider>
  );
};

export const useSubstrate = () => useContext(SubstrateContext);
