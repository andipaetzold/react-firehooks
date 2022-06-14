export default {
    transform: {
        "^.+\\.ts$": "ts-jest",
    },
    testRegex: "^.+\\.spec\\.ts$",
    coverageDirectory: "test-results/coverage",
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    globals: {
        "ts-jest": {
            tsconfig: "tsconfig.json",
            useESM: true,
        },
    },
    testEnvironment: "jsdom"
};
