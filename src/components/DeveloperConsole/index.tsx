import { useSubstrate } from '@components/SubstrateContext';
import polkadotUtil from '@polkadot/util';
import polkadotUtilCrypto from '@polkadot/util-crypto';
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
  window.util = polkadotUtil;
  window.utilCrypto = polkadotUtilCrypto;

  return <div>{title}</div>;
};
export default DeveloperConsole;
