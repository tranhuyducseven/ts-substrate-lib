import { config } from '@config';
import jsonrpc from '@polkadot/types/interfaces/jsonrpc';
import { Keyring } from '@polkadot/ui-keyring';
import { ISubstrateContext } from '@type';
import { create } from 'zustand';

const parsedQuery = new URLSearchParams(window.location.search);
const connectedSocket = parsedQuery.get('rpc') || config.PROVIDER_SOCKET;

interface ISubstrateStore {
  substrateState: ISubstrateContext;
  handleConnectInit: () => void;
  handleConnect: (api: any) => void;
  handleConnectSuccess: () => void;
  handleConnectError: (err: any) => void;
  handleLoadKeyring: () => void;
  handleSetKeyring: (keyring: Keyring) => void;
  handleKeyringError: () => void;
  handleSetCurrentAccount: (currentAccount: any) => void;
}
export const initialSubstrateState: ISubstrateContext = {
  socket: connectedSocket,
  jsonrpc: { ...jsonrpc, ...config.CUSTOM_RPC_METHODS },
  keyring: null,
  keyringState: '',
  api: null,
  apiError: null,
  apiState: '',
  currentAccount: null,
};

const useSubstrateStore = create<ISubstrateStore>((set, get) => ({
  substrateState: initialSubstrateState,
  handleConnectInit: () => set({ substrateState: { ...get().substrateState, apiState: 'CONNECT_INIT' } }),
  handleConnect: (api) => set({ substrateState: { ...get().substrateState, apiState: 'CONNECTING', api } }),
  handleConnectSuccess: () => set({ substrateState: { ...get().substrateState, apiState: 'READY' } }),
  handleConnectError: (err) => set({ substrateState: { ...get().substrateState, apiState: 'ERROR', apiError: err } }),
  handleLoadKeyring: () => set({ substrateState: { ...get().substrateState, keyringState: 'LOADING' } }),
  handleSetKeyring: (keyring) => set({ substrateState: { ...get().substrateState, keyringState: 'READY', keyring } }),
  handleKeyringError: () => set({ substrateState: { ...get().substrateState, keyringState: 'ERROR', keyring: null } }),
  handleSetCurrentAccount: (currentAccount) => set({ substrateState: { ...get().substrateState, currentAccount } }),
}));

export { useSubstrateStore };
