import type { JestConfigWithTsJest } from 'ts-jest';
import defaultConfig from './jest.config.default';

const config: JestConfigWithTsJest = {
  ...defaultConfig,
  roots: ['./__tests__/e2e'],
  setupFilesAfterEnv: ['./__tests__/utils/setup.ts'],
};

export default config;
