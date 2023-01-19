import { IComponent } from '@types';
import React, { useEffect, useState } from 'react';

import { SubstrateProvider } from './SubstrateProvider';

export interface ISubstrateConfigs {
  providerSocket?: string;
  appName?: string;
  customRpcMethods?: {};
}
interface ISubstrateConnectionLayoutProps {
  configs?: ISubstrateConfigs;
}

export const SubstrateConnectionLayout: IComponent<ISubstrateConnectionLayoutProps> = ({ children, configs }) => {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="substrate-connection-layout">
      {!isLoading ? <SubstrateProvider configs={configs}>{children}</SubstrateProvider> : <></>}
    </div>
  );
};
