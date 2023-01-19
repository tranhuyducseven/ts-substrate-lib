import { Meta, Story } from '@storybook/react';
import { IComponent } from '@types';
import * as React from 'react';

import { ISubstrateConfigs, SubstrateConnectionLayout } from './SubstrateConnectionLayout';
import { useSubstrateConnection } from './useSubstrateConnection';

export default {
  title: 'Table',
  component: SubstrateConnectionLayout,
} as Meta;

export const Children: IComponent = () => {
  const value = useSubstrateConnection();
  const { substrateConnection } = value;
  React.useEffect(() => {
    console.log({ substrateConnection });
  }, [substrateConnection]);
  const msg = substrateConnection.socket ? `Connected to ${substrateConnection.socket}` : 'No connected';
  return (
    <div className="bg-amber-500 text-white h-screen w-full flex items-center justify-center font-bold text-lg rounded-lg">
      <span>{msg}</span>
      <span></span>
    </div>
  );
};

export const TemplateDemo: Story = (args) => {
  const configs: ISubstrateConfigs = {
    providerSocket: 'ws://127.0.0.1:9999',
    appName: 'Payment Application',
    customRpcMethods: {
      POST: '/api/book',
      GET: '/api/book/:id',
    },
  };
  return (
    <SubstrateConnectionLayout configs={configs} {...args}>
      <Children />
    </SubstrateConnectionLayout>
  );
};
TemplateDemo.args = {};
