import { configs } from '@configs/index';
import { API_EVENTS } from '@constants/index';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { TypeRegistry } from '@polkadot/types';
import { keyring as Keyring } from '@polkadot/ui-keyring';
import { isTestChain } from '@polkadot/util';
import { useSubstrateStore } from '@states/app';
import { IComponent } from '@types';
import React, { useEffect } from 'react';

import { SubstrateContext } from './useSubstrateConnection';

const registry = new TypeRegistry();
let keyringLoadAll = false;

export const SubstrateProvider: IComponent = ({ children }) => {
  const {
    substrateState,
    setSocket,
    handleConnectInit,
    handleConnect,
    handleConnectSuccess,
    handleConnectError,
    handleLoadKeyring,
    handleSetKeyring,
    handleKeyringError,
    handleSetCurrentAccount,
  } = useSubstrateStore();
  const { api, apiState, socket, jsonrpc, keyringState } = substrateState;
  const connectToOffChain = () => {
    // We only want this function to be performed once
    if (socket !== '') {
      if (apiState) return;
      handleConnectInit();

      const provider = new WsProvider(socket);
      const _api = new ApiPromise({ provider, rpc: jsonrpc });

      // Set listeners for disconnection and reconnection event.
      _api.on(API_EVENTS.CONNECTED, () => {
        console.log(`Connected socket: ${socket}`);
        handleConnect(_api);
        _api.isReady.then(() => handleConnectSuccess());
      });
      _api.on(API_EVENTS.READY, () => handleConnectSuccess());
      _api.on(API_EVENTS.ERROR, (err: any) => handleConnectError(err));
    }
  };

  const retrieveChainInfo = async (api: any) => {
    const [systemChain, systemChainType] = await Promise.all([
      api.rpc.system.chain(),
      api.rpc.system.chainType ? api.rpc.system.chainType() : Promise.resolve(registry.createType('ChainType', 'Live')),
    ]);

    return {
      systemChain: (systemChain || '<unknown>').toString(),
      systemChainType,
    };
  };
  const loadAccounts = () => {
    handleLoadKeyring();
    const asyncLoadAccounts = async () => {
      try {
        await web3Enable(configs.APP_NAME);
        let allAccounts = await web3Accounts();
        allAccounts = allAccounts.map((account: any) => {
          const address: any = account.address;
          const meta: any = account.meta;
          return {
            address,
            meta: { ...meta, name: `${meta.name} (${meta.source})` },
          };
        });

        // Logics to check if the connecting chain is a dev chain
        const { systemChain, systemChainType } = await retrieveChainInfo(api);
        const isDevelopment = systemChainType.isDevelopment || systemChainType.isLocal || isTestChain(systemChain);

        Keyring.loadAll({ isDevelopment }, allAccounts);
        handleSetKeyring(Keyring);
      } catch (e) {
        console.error(e);
        handleKeyringError();
      }
    };
    asyncLoadAccounts();
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const parsedQuery = new URLSearchParams(window?.location.search);
      const connectedSocket = parsedQuery?.get('rpc') || configs.PROVIDER_SOCKET;
      setSocket(connectedSocket);
      connectToOffChain();
    }
  }, [window, socket]);
  useEffect(() => {
    if (apiState === 'READY' && !keyringState && !keyringLoadAll) {
      keyringLoadAll = true;
      loadAccounts();
    }
  }, [apiState, keyringState]);

  const setCurrentAccount = (account: any) => {
    handleSetCurrentAccount(account);
  };

  return (
    <SubstrateContext.Provider value={{ substrateConnection: substrateState, setCurrentAccount }}>
      {children}
    </SubstrateContext.Provider>
  );
};
