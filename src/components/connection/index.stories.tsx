import { Meta, Story } from '@storybook/react';
import { IComponent } from '@types';
import * as React from 'react';

import { SubstrateConnectionLayout } from './SubstrateConnectionLayout';
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
    </div>
  );
};

export const TemplateDemo: Story = (args) => (
  <SubstrateConnectionLayout {...args}>
    <Children />
  </SubstrateConnectionLayout>
);
TemplateDemo.args = {};
