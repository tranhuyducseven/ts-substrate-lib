import { ISubstrateConnection } from '@types';
import { createContext, useContext } from 'react';

export interface ISubstrateContextProps {
  substrateConnection: ISubstrateConnection;
  setCurrentAccount: (acc: any) => void;
}

export const SubstrateContext = createContext<ISubstrateContextProps>({} as ISubstrateContextProps);

export const useSubstrateConnection = (): ISubstrateContextProps => {
  return useContext(SubstrateContext);
};
