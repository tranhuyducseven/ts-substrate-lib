import { useSubstrate } from '@components/SubstrateContext';
import { IComponent } from '@type';
import React from 'react';

const DeveloperConsole: IComponent<{
  title?: string;
}> = ({ title }) => {
  const substrateProvider = useSubstrate();
  const { api, apiState, keyring, keyringState } = substrateProvider?.substrateState;
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
export default DeveloperConsole;
