import { ApiPromise } from '@polkadot/api';
import jsonrpc from '@polkadot/types/interfaces/jsonrpc';
import { Keyring } from '@polkadot/ui-keyring';
import { create } from 'zustand';

import { ISubstrateConnection } from './../global.types';

interface ISubstrateStore {
  substrateState: ISubstrateConnection;
  setSocket: (socket: string) => void;
  loadJsonRpc: (customRpcMethods: any) => void;
  handleConnectInit: () => void;
  handleConnect: (api: any) => void;
  handleConnectSuccess: () => void;
  handleConnectError: (err: any) => void;
  handleLoadKeyring: () => void;
  handleSetKeyring: (keyring: Keyring) => void;
  handleKeyringError: () => void;
  handleSetCurrentAccount: (currentAccount: any) => void;
}
const initialSubstrateState: ISubstrateConnection = {
  socket: '',
  jsonrpc: { ...jsonrpc },
  keyring: null,
  keyringState: '',
  api: null,
  apiError: null,
  apiState: '',
  currentAccount: null,
};

const useSubstrateStore = create<ISubstrateStore>((set, get) => ({
  substrateState: initialSubstrateState,
  setSocket: (socket: string) => {
    set({ substrateState: { ...get().substrateState, socket } });
  },
  handleConnectInit: () =>
    set({
      substrateState: { ...get().substrateState, apiState: 'CONNECT_INIT' },
    }),
  loadJsonRpc: (customRpcMethods: any) =>
    set({
      substrateState: { ...get().substrateState, jsonrpc: { ...get().substrateState.jsonrpc, ...customRpcMethods } },
    }),
  handleConnect: (api: ApiPromise) =>
    set({
      substrateState: { ...get().substrateState, apiState: 'CONNECTING', api },
    }),

  handleConnectSuccess: () => set({ substrateState: { ...get().substrateState, apiState: 'READY' } }),
  handleConnectError: (err: any) =>
    set({
      substrateState: {
        ...get().substrateState,
        apiState: 'ERROR',
        apiError: err,
      },
    }),
  handleLoadKeyring: () =>
    set({
      substrateState: { ...get().substrateState, keyringState: 'LOADING' },
    }),
  handleSetKeyring: (keyring: Keyring) =>
    set({
      substrateState: {
        ...get().substrateState,
        keyringState: 'READY',
        keyring,
      },
    }),
  handleKeyringError: () =>
    set({
      substrateState: {
        ...get().substrateState,
        keyringState: 'ERROR',
        keyring: null,
      },
    }),
  handleSetCurrentAccount: (currentAccount: any) =>
    set({ substrateState: { ...get().substrateState, currentAccount } }),
}));

export { useSubstrateStore };
