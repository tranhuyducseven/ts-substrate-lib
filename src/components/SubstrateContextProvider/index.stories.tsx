import { useSubstrateStore } from '@states/app';
import { Meta, Story } from '@storybook/react';
import { IComponent } from '@types';
import * as React from 'react';

import { SubstrateContextProvider } from '.';

export default {
  title: 'Table',
  component: SubstrateContextProvider,
} as Meta;

export const Children: IComponent = () => {
  const { substrateState } = useSubstrateStore();
  React.useEffect(() => {
    console.log({ substrateState });
  }, [substrateState]);
  const msg = substrateState.socket ? `Connected to ${substrateState.socket}` : 'No connected';
  return (
    <div className="bg-amber-500 text-white h-screen w-full flex items-center justify-center font-bold text-lg rounded-lg">
      <span>{msg}</span>
    </div>
  );
};

export const TemplateDemo: Story = (args) => (
  <SubstrateContextProvider {...args}>
    <Children />
  </SubstrateContextProvider>
);
TemplateDemo.args = {};
