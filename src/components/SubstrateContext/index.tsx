import { SubstrateContextAtom } from '@atoms/app';
import { config } from '@config';
import { API_EVENTS } from '@constants/index';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { TypeRegistry } from '@polkadot/types/create';
import { keyring as Keyring } from '@polkadot/ui-keyring';
import { isTestChain } from '@polkadot/util';
import { IComponent, ISubstrateContext } from '@type';
import React, { useCallback, useContext, useEffect } from 'react';
import { useRecoilState } from 'recoil';

const registry = new TypeRegistry();

let keyringLoadAll = false;

interface ISubstrateContextProviderProps {
  substrateState: ISubstrateContext;
  setSubstrateAccount?: (acc: string) => void;
}

const SubstrateContext = React.createContext<ISubstrateContextProviderProps>({
  substrateState: {},
  setSubstrateAccount: undefined,
});

const SubstrateContextProvider: IComponent<{
  socket?: string;
}> = (props) => {
  const [substrateContext, setSubstrateContext] = useRecoilState(SubstrateContextAtom);

  const connectToOffChain = useCallback(() => {
    const { apiState, socket, jsonrpc } = substrateContext;
    // We only want this function to be performed once
    if (apiState) return;
    setSubstrateContext((prev) => ({ ...prev, apiState: 'CONNECT_INIT' }));

    console.log(`Connected socket: ${socket}`);
    const provider = new WsProvider(socket);
    const _api = new ApiPromise({ provider, rpc: jsonrpc });

    // Set listeners for disconnection and reconnection event.
    _api.on(API_EVENTS.CONNECTED, () => {
      setSubstrateContext((prev) => ({ ...prev, api: _api, apiState: 'CONNECTING' }));
      _api.isReady.then(() => setSubstrateContext((prev) => ({ ...prev, apiState: 'READY' })));
    });
    _api.on(API_EVENTS.READY, () => setSubstrateContext((prev) => ({ ...prev, apiState: 'READY' })));
    _api.on(API_EVENTS.ERROR, (err) => setSubstrateContext((prev) => ({ ...prev, apiState: 'ERROR', apiError: err })));
  }, [substrateContext]);

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
    const { api } = substrateContext;
    setSubstrateContext((prev) => ({ ...prev, keyringState: 'LOADING' }));
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
        setSubstrateContext((prev) => ({ ...prev, keyringState: 'READY', keyring: Keyring }));
      } catch (e) {
        console.error(e);
        setSubstrateContext((prev) => ({ ...prev, keyringState: 'ERROR', keyring: null }));
      }
    };
    asyncLoadAccounts();
  }, []);

  useEffect(() => {
    connectToOffChain();
  }, [connectToOffChain]);

  useEffect(() => {
    const { apiState, keyringState } = substrateContext;
    if (apiState === 'READY' && !keyringState && !keyringLoadAll) {
      keyringLoadAll = true;
      loadAccounts();
    }
  }, [substrateContext]);

  const setCurrentAccount = (account: string) => {
    setSubstrateContext((prev) => ({ ...prev, currentAccount: account }));
  };

  return (
    <SubstrateContext.Provider value={{ substrateState: substrateContext, setSubstrateAccount: setCurrentAccount }}>
      {props.children}
    </SubstrateContext.Provider>
  );
};

const useSubstrate = () => useContext(SubstrateContext);
export { useSubstrate };
export default SubstrateContextProvider;
