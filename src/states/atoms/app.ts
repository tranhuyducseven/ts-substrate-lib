import { config } from '@config';
import jsonrpc from '@polkadot/types/interfaces/jsonrpc';
import { ISubstrateContext } from '@type';
import { atom } from 'recoil';

const parsedQuery = new URLSearchParams(window.location.search);
const connectedSocket = parsedQuery.get('rpc') || config.PROVIDER_SOCKET;

const SubstrateContextAtom = atom<ISubstrateContext>({
  key: 'SUBSTRATE_CONTEXT',
  default: {
    socket: connectedSocket,
    jsonrpc: { ...jsonrpc, ...config.CUSTOM_RPC_METHODS },
    keyring: null,
    keyringState: null,
    api: null,
    apiError: null,
    apiState: null,
    currentAccount: null,
  },
});

export { SubstrateContextAtom };
