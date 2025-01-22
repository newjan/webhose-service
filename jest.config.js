/* eslint-disable */
/** @type {import('ts-jest').JestConfigWithTsJest} */;
import { pathsToModuleNameMapper } from 'ts-jest';
import ts from 'typescript';

/** @type {import('jest').Config} */

const configFileName = ts.findConfigFile('./', ts.sys.fileExists, 'tsconfig.json');
const configFile = ts.readConfigFile(configFileName, ts.sys.readFile);
const compilerOptions = ts.parseJsonConfigFileContent(configFile.config, ts.sys, './');

const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts?$": ["ts-jest", {}],
  },
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
  moduleFileExtensions: ["ts", "js", "json"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.options.paths, {
    prefix: "<rootDir>/",
  }),

  clearMocks: false,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};

export default config;
