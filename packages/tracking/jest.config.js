module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  globalSetup: "<rootDir>/tests/globalSetup.ts",
  setupFiles: ["<rootDir>/tests/env.ts"],
  moduleNameMapper: {
    "^@tracking/(.*)$": "<rootDir>/src/$1",
    "^@shared/(.*)$": "<rootDir>/../shared/src/$1",
  },
  transform: {
    "^.+\\.ts$": ["ts-jest", { diagnostics: false }],
  },
  maxWorkers: 1,
};
