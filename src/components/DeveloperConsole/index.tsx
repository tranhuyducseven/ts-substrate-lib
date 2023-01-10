import { IComponent } from '@type';
import React from 'react';

import { useSubstrate } from '..';

export const DeveloperConsole: IComponent<{
  title?: string;
}> = ({ title }) => {
  const { api, apiState, keyring, keyringState } = useSubstrate()?.substrateState;
  if (apiState === 'READY') {
    window.api = api;
  }
  if (keyringState === 'READY') {
    window.keyring = keyring;
  }
  window.util = require('@polkadot/util');
  window.utilCrypto = require('@polkadot/util-crypto');

  return <div>{title}</div>;
};
