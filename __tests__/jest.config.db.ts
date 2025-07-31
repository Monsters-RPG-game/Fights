import defaultConfig from './jest.config.default';
import type { Config } from 'jest';

const config: Config = {
  ...defaultConfig,
  roots: ['./__tests__/db'],
};

export default config;
