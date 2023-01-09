import { ApiInterfaceEvents } from '@polkadot/api/types';

export const API_EVENTS: { [key: string]: ApiInterfaceEvents } = {
  CONNECTED: 'connected',
  ERROR: 'error',
  READY: 'ready',
};
