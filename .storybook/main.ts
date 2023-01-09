const path = require('path');

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  core: {
    builder: '@storybook/builder-vite', // 👈 The builder enabled here.
  },
  staticDirs: ['../public'],
  async viteFinal(config, options) {
    // Add your configuration here
    return {
      ...config,
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '../src'),
          '@config': path.resolve(__dirname, './src/config'),
          '@type': path.resolve(__dirname, '../src/global.types.ts'),
          '@components': path.resolve(__dirname, '../src/components'),
        },
      },
    };
  },
};
