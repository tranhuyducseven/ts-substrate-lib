const path = require('path');

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    {
      name: '@storybook/addon-postcss',
      options: {
        postcssLoaderOptions: {
          implementation: require('postcss'),
        },
      },
    },
  ],
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
          '@configs': path.resolve(__dirname, '../src/configs'),
          '@types': path.resolve(__dirname, '../src/global.types.ts'),
          '@components': path.resolve(__dirname, '../src/components'),
          '@constants': path.resolve(__dirname, '../src/constants'),
          '@states': path.resolve(__dirname, '../src/states'),
          '@styles': path.resolve(__dirname, '../src/styles'),
        },
      },
    };
  },
};
