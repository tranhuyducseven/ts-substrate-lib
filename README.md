# ts-substrate-lib

### Using [DevinUI Template](https://github.com/de-v-in/react-lib-template)

### Technologies

- Polkadot API
- Typescript
- SCSS
- React
- Jest
- Rollup
- Storybook

### Maintainer

@tranhuyducseven

### Usage:

1. SubstrateState's interface:

```ts
interface ISubstrateContext {
  socket?: string;
  jsonrpc?: any;
  keyring?: any;
  keyringState?: string | null;
  api?: any;
  apiError?: any;
  apiState?: string | null;
  currentAccount?: any;
}
```

2.

```ts
  useSubstrate = () =>
  {
    substrateState: ISubstrateContext;
    setSubstrateAccount?: (acc: string) => void;
  } : ISubstrateContextProviderProps
```

3. Place the `<SubstrateContext />` component at the first level:

```
<SubstrateContext>
  <MainApp />
</SubstrateContext>
```
