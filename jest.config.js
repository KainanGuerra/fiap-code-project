/** @type {import('jest').Config} */
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: 'specs/.*\\.(spec|e2e-spec)\\.ts$', // ajustado para rodar testes dentro da pasta specs
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  preset: 'ts-jest',
  moduleNameMapper: {
    '^@App/(.*)$': '<rootDir>/src/$1',
    '^@Common/(.*)$': '<rootDir>/src/common/$1',
    '^@Modules/(.*)$': '<rootDir>/src/modules/$1',
    '^@Shared/(.*)$': '<rootDir>/src/shared/$1',
  },
  
};
