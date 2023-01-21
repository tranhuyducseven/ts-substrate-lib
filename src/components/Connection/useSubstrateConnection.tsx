import { KeyringPair } from '@polkadot/keyring/types';
import { ISubstrateConnection } from '@types';
import { createContext, useContext } from 'react';

export interface ISubstrateContextProps {
  substrateConnection: ISubstrateConnection;
  setCurrentAccount: (acc: KeyringPair) => void;
}

export const SubstrateContext = createContext<ISubstrateContextProps>({} as ISubstrateContextProps);

export const useSubstrateConnection = (): ISubstrateContextProps => {
  return useContext(SubstrateContext);
};
