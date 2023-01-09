import { ApiInterfaceEvents } from '@polkadot/api/types';

const API_EVENTS: { [key: string]: ApiInterfaceEvents } = {
  CONNECTED: 'connected',
  ERROR: 'error',
  READY: 'ready',
};

export { API_EVENTS };
