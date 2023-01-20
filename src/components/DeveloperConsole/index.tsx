// This component will simply add utility functions to your developer console.
import { useEffect } from 'react';

import { useSubstrateConnection } from '..';

export const DeveloperConsole = () => {
  const { substrateConnection } = useSubstrateConnection();
  const { api, apiState, keyring, keyringState } = substrateConnection;
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (apiState === 'READY') {
        window.api = api;
      }
      if (keyringState === 'READY') {
        window.keyring = keyring;
      }
      window.util = import('@polkadot/util');
      window.utilCrypto = import('@polkadot/util-crypto');
    }
  }, []);
  useEffect(() => {
    console.log({ window });
  }, [window]);
  return null;
};
