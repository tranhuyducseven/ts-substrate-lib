import { Meta, Story } from '@storybook/react';
import { IComponent } from '@types';
import * as React from 'react';

import { DeveloperConsole, SubstrateConnectionLayout } from '..';

const Children: IComponent = () => {
  React.useEffect(() => {
    console.log({ window });
  }, [window]);
  return (
    <div className="bg-amber-500 text-white h-screen w-full flex items-center justify-center font-bold text-lg rounded-lg">
      Children Component
    </div>
  );
};

export const DeveloperConsoleDemo: Story = (args) => {
  return (
    <SubstrateConnectionLayout {...args}>
      <Children />
      <DeveloperConsole />
    </SubstrateConnectionLayout>
  );
};
DeveloperConsoleDemo.args = {};
export default {
  title: 'DeveloperConsole Demo',
  component: DeveloperConsoleDemo,
} as Meta;
