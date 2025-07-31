import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  verbose: true,
  moduleDirectories: ['node_modules', 'src', "__tests__", __dirname],
  moduleFileExtensions: ['js', 'ts', 'json'],
  testPathIgnorePatterns: ['build'],
  extensionsToTreatAsEsm: ['.ts'],
  rootDir: "../",
  preset: 'ts-jest/presets/default-esm',
  testMatch: ['**/*.test.ts'],
  testEnvironment: 'node',
  forceExit: true,
  clearMocks: true,
  testTimeout: 10000,
  passWithNoTests: true,
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: "tsconfig.test.json",
      },
    ],
  }
};

export default config;
