import jestConfig from './jest.config';

export default {
  ...jestConfig,
  displayName: 'api-e2e',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.e2e.spec.json',
    },
  },
  coverageDirectory: '../../coverage/apps/api-e2e',
  modulePathIgnorePatterns: ['<rootDir>/src/'],
  maxWorkers: 1,
};
