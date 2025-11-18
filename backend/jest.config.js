/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/*.test.ts', '**/*.spec.ts'],
  collectCoverageFrom: [
    'src/controllers/subscribeController.ts',
    'src/services/emailOctopusService.ts',
    'src/models/subscribeSchema.ts',
    'src/middleware/rateLimiter.ts',
    'src/controllers/inventoryController.ts',
    'src/controllers/squadController.ts',
    'src/services/inventoryService.ts',
    'src/services/squadService.ts',
    'src/middleware/authenticate.ts',
    'src/models/Squad.ts',
    'src/models/UserInventory.ts',
    '!src/**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  coverageDirectory: 'coverage',
  verbose: true,
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'test-results',
      outputName: 'junit.xml',
      classNameTemplate: '{classname}',
      titleTemplate: '{title}',
      ancestorSeparator: ' › ',
      usePathForSuiteName: true,
    }],
  ],
};
