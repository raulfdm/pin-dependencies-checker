// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov'],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '.history/'],
};
