/**
 * This file contain all global type across library
 */

import { ApiPromise } from '@polkadot/api';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { KeyringPair } from '@polkadot/keyring/types';
import { DefinitionRpcExt } from '@polkadot/types/types';
import { Keyring } from '@polkadot/ui-keyring';

export interface ISubstrateConnection {
  socket: string;
  jsonrpc: IJsonRpc;
  keyring: Keyring | null;
  keyringState: string | null;
  api: ApiPromise | null;
  apiError: any;
  apiState: string;
  currentAccount: KeyringPair | null;
}

declare global {
  interface Window {
    api: ApiPromise;
    keyring: Keyring;
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

export type IJsonRpc = Record<string, Record<string, DefinitionRpcExt>>;

export type web3ReturnedAccountsType = InjectedAccountWithMeta;

export type TTransactionButton =
  | 'EXTRINSIC'
  | 'QUERY'
  | 'RPC'
  | 'CONSTANT'
  | 'SUDO'
  | 'UNCHECKED_SUDO'
  | 'UNSIGNED'
  | 'SIGNED';
