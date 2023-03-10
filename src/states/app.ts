import { API_STATES, KEYRING_STATES } from '@constants/index';
import { ApiPromise } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
import jsonrpc from '@polkadot/types/interfaces/jsonrpc';
import { Keyring } from '@polkadot/ui-keyring';
import { create } from 'zustand';

import { IJsonRpc, ISubstrateConnection } from './../global.types';

interface ISubstrateStore {
  substrateState: ISubstrateConnection;
  setSocket: (socket: string) => void;
  loadJsonRpc: (customRpcMethods: IJsonRpc) => void;
  handleConnectInit: () => void;
  handleConnect: (api: ApiPromise) => void;
  handleConnectSuccess: () => void;
  handleConnectError: (err: any) => void;
  handleLoadKeyring: () => void;
  handleSetKeyring: (keyring: Keyring) => void;
  handleKeyringError: () => void;
  handleSetCurrentAccount: (currentAccount: KeyringPair) => void;
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
      substrateState: { ...get().substrateState, apiState: API_STATES.CONNECT_INIT },
    }),
  loadJsonRpc: (customRpcMethods: IJsonRpc) =>
    set({
      substrateState: { ...get().substrateState, jsonrpc: { ...get().substrateState.jsonrpc, ...customRpcMethods } },
    }),
  handleConnect: (api: ApiPromise) =>
    set({
      substrateState: { ...get().substrateState, apiState: API_STATES.CONNECTING, api },
    }),

  handleConnectSuccess: () => set({ substrateState: { ...get().substrateState, apiState: API_STATES.READY } }),
  handleConnectError: (err: any) =>
    set({
      substrateState: {
        ...get().substrateState,
        apiState: API_STATES.ERROR,
        apiError: err,
      },
    }),
  handleLoadKeyring: () =>
    set({
      substrateState: { ...get().substrateState, keyringState: KEYRING_STATES.LOADING },
    }),
  handleSetKeyring: (keyring: Keyring) =>
    set({
      substrateState: {
        ...get().substrateState,
        keyringState: KEYRING_STATES.READY,
        keyring,
      },
    }),
  handleKeyringError: () =>
    set({
      substrateState: {
        ...get().substrateState,
        keyringState: KEYRING_STATES.ERROR,
        keyring: null,
      },
    }),
  handleSetCurrentAccount: (currentAccount: KeyringPair) =>
    set({ substrateState: { ...get().substrateState, currentAccount } }),
}));

export { useSubstrateStore };
