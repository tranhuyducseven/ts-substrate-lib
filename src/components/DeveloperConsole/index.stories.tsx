import { Meta, Story } from '@storybook/react';
import * as React from 'react';

import DeveloperConsole from '.';

export default {
  title: 'DeveloperConsole',
  component: DeveloperConsole,
} as Meta;

const StoryTemplate: Story = () => <DeveloperConsole title="substrate-lib" />;

export const TemplateNormal = StoryTemplate.bind({});
TemplateNormal.args = {
  title: 'Hello substrate lib',
};
