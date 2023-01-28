import { ApiInterfaceEvents } from '@polkadot/api/types';

import { TTransactionButton } from './../global.types';

export const DEFAULT_SOCKET = 'ws://127.0.0.1:9944';

export const API_EVENTS: { [key: string]: ApiInterfaceEvents } = {
  CONNECTED: 'connected',
  ERROR: 'error',
  READY: 'ready',
};

export const API_STATES: { [key: string]: string } = {
  CONNECT_INIT: 'CONNECT_INIT',
  CONNECTING: 'CONNECTING',
  READY: 'READY',
  ERROR: 'ERROR',
};

export const KEYRING_STATES: { [key: string]: string } = {
  LOADING: 'LOADING',
  READY: 'READY',
  ERROR: 'ERROR',
};

export const INTERACT_TYPE: {
  [key: string]: TTransactionButton;
} = {
  EXTRINSIC: 'EXTRINSIC',
  QUERY: 'QUERY',
  RPC: 'RPC',
  CONSTANT: 'CONSTANT',
  SUDO: 'SUDO',
  UNCHECKED_SUDO: 'UNCHECKED_SUDO',
  UNSIGNED: 'UNSIGNED',
  SIGNED: 'SIGNED',
};
