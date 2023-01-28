import { Meta, Story } from '@storybook/react';
import { IComponent } from '@types';
import * as React from 'react';

import { ISubstrateConfigs, SubstrateConnectionLayout } from '.';
import { useSubstrateConnection } from '.';

const Children: IComponent = () => {
  const { substrateConnection } = useSubstrateConnection();
  React.useEffect(() => {
    console.log({ substrateConnection });
  }, [substrateConnection]);
  const msg = React.useMemo(
    () => (substrateConnection?.socket ? `Connected to ${substrateConnection?.socket}` : 'No connection'),
    [substrateConnection],
  );
  return (
    <div className="bg-amber-500 text-white h-screen w-full flex items-center justify-center font-bold text-lg rounded-lg">
      <span>{msg}</span>
    </div>
  );
};

export const SubstrateConnectionLayoutDemo: Story = (args) => {
  const configs: ISubstrateConfigs = {
    providerSocket: 'ws://127.0.0.1:9944',
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

SubstrateConnectionLayoutDemo.args = {};

export default {
  title: 'SubstrateConnectionLayout Demo',
  component: SubstrateConnectionLayoutDemo,
} as Meta;
