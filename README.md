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
export interface ISubstrateConnection {
  socket: string;
  jsonrpc: IJsonRpc;
  keyring: Keyring | null;
  keyringState: string | null;
  api: ApiPromise | null;
  apiError: any;
  apiState: string;
  currentAccount: KeyringPair | null;
}
```

2.

```ts
  useSubstrateConnection = () =>
  {
    substrateConnection: ISubstrateConnection;
    setSubstrateAccount?: (acc: any) => void;
  } : ISubstrateContextProps
```

3. Place the `<SubstrateConnectionLayout />` component at the first level:

```ts
const SubstrateConnectionLayout = dynamic(
  () =>
    import("ts-substrate-lib").then(
      (data) => data.SubstrateConnectionLayout
    ),
  {
    ssr: false,
    loading: ()=> <></>
  }
);

...

<SubstrateConnectionLayout>
  <MainLayout>{getLayout(<PageContent {...pageProps} />)}</MainLayout>;
</SubstrateConnectionLayout>
```

4. With the screen use `useSubstrateConnection()` hook, it's necessary to dynamic import

```ts
import { ScreenLayout } from '@layouts/ScreenLayout';
import dynamic from 'next/dynamic';
const AppScreen = dynamic(() => import('@screens/app').then((data) => data.AppScreen), {
  ssr: false,
});

const App: IPageComponent = () => {
  return <AppScreen />;
};

App.getLayout = (screen) => <ScreenLayout>{screen}</ScreenLayout>;

export default App;
```

5. Dependencies

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

6. Config env

```ts
interface ISubstrateConfigs {
  providerSocket?: string;
  appName?: string;
  customRpcMethods?: {};
}
...
export const TemplateDemo: Story = (args) => {
  const configs: ISubstrateConfigs = {
    providerSocket: 'ws://127.0.0.1:9999',
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
```

7. constant

```ts
import { ApiInterfaceEvents } from '@polkadot/api/types';

export const DEFAULT_SOCKET = 'ws://127.0.0.1:9944';

export const API_EVENTS: { [key: string]: ApiInterfaceEvents } = {
  CONNECTED: 'connected',
  ERROR: 'error',
  READY: 'ready',
};

export const API_STATES: { [key: string]: string } = {
  CONNECT_INIT: 'CONNECT_INIT',
  CONNECTING: 'CONNECTING',
  READY: 'READY',
  ERROR: 'ERROR',
};

export const KEYRING_STATES: { [key: string]: string } = {
  LOADING: 'LOADING',
  READY: 'READY',
  ERROR: 'ERROR',
};
```
