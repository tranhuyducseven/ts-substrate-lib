/** @type {import('tailwindcss').Config} */
const withMT = await import('@material-tailwind/react/utils/withMT');

module.exports = withMT({
  content: ['./src/components/**/*.tsx'],
  theme: {
    extend: {},
  },
  safelist: [{ pattern: /rounded-./ }],
  plugins: [],
});
