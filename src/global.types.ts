/**
 * This file contain all global type across library
 */

export interface ISubstrateContext {
  socket?: string;
  jsonrpc?: any;
  keyring?: any;
  keyringState?: string | null;
  api?: any;
  apiError?: any;
  apiState?: string | null;
  currentAccount?: any;
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
