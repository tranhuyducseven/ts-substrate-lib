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

```ts
const SubstrateContextProvider = dynamic(
  () =>
    import("@components/SubstrateContextProvider").then(
      (data) => data.SubstrateContextProvider
    ),
  {
    ssr: false,
  }
);

...

<SubstrateContextProvider>
  <MainLayout>{getLayout(<PageContent {...pageProps} />)}</MainLayout>;
</SubstrateContextProvider>
```

4. Dependencies

```json
    "@polkadot/api": "^9.11.2",
    "@polkadot/extension-dapp": "^0.44.6",
    "@polkadot/keyring": "^10.2.6",
    "@polkadot/networks": "^8.4.1",
    "@polkadot/types": "^9.11.2",
    "@polkadot/ui-keyring": "^2.9.15",
    "@polkadot/ui-settings": "^2.9.15",
    "@polkadot/util": "^10.2.6",
    "@polkadot/util-crypto": "^10.2.6",
    "zustand": "^4.3.1",
```
