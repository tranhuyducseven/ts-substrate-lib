import configCommon from './common';
import developmentConfig from './development';
import productionConfig from './production';
import testConfig from './testConfig';

let configEnv = null;
switch (process.env.NODE_ENV) {
  case 'development':
    configEnv = developmentConfig;
    break;
  case 'production':
    configEnv = productionConfig;
    break;
  case 'test':
    configEnv = testConfig;
    break;
  default:
    throw Error('Not provided env...');
}

const envVarNames = ['REACT_APP_PROVIDER_SOCKET'];
const envVars = envVarNames.reduce((mem: any, n: any) => {
  // Remove the `REACT_APP_` prefix
  if (process.env[n] !== undefined) mem[n.slice(10)] = process.env[n];
  return mem;
}, {});

const configs = { ...configCommon, ...configEnv, ...envVars };
export { configs };
