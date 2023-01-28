/* eslint @typescript-eslint/no-var-requires: "off" */
/** @type {import('tailwindcss').Config} */
const withMT = require('@material-tailwind/react/utils/withMT');

module.exports = withMT({
  content: ['./src/components/**/*.tsx'],
  theme: {
    extend: {},
  },
  safelist: [{ pattern: /rounded-./ }],
  plugins: [],
});
