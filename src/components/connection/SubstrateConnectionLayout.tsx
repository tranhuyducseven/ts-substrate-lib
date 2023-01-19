import { IComponent } from '@types';
import React, { useEffect, useState } from 'react';

import { SubstrateProvider } from './SubstrateProvider';

interface SubstrateConnectionLayoutProps {
  loading?: () => IComponent | JSX.Element | null;
}

export const SubstrateConnectionLayout: IComponent<SubstrateConnectionLayoutProps> = ({ children, loading }) => {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="substrate-connection-layout">
      {!isLoading ? <SubstrateProvider>{children}</SubstrateProvider> : <>{loading?.()}</>}
    </div>
  );
};
