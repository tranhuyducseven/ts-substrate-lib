/**
 * This file contain all global type across library
 */

import { ApiPromise } from '@polkadot/api';
import { Keyring } from '@polkadot/ui-keyring';

export interface ISubstrateConnection {
  socket: string;
  jsonrpc: any;
  keyring: Keyring | null;
  keyringState: string | null;
  api: ApiPromise | null;
  apiError: any;
  apiState: string;
  currentAccount: any;
}

declare global {
  interface Window {
    api: any;
    keyring: any;
    util: any;
    utilCrypto: any;
  }
}

export interface ISvgComponentProps {
  // Width of svg
  width?: string | number;
  // Height of svg
  height?: string | number;
  // Color of svg
  color?: string;
  viewBox?: string;
  opacity?: string | number;
  className?: string;
}

export type IComponent<T = {}> = React.FC<React.PropsWithChildren<T>>;
export type ISvgComponent<T = {}> = IComponent<ISvgComponentProps & T>;
