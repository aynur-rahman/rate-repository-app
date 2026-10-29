const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
module.exports = defineConfig([expoConfig, { ignores: ['dist/*', 'coverage/*', 'tests/*', 'e2e/*', 'jest.config.js', 'playwright.config.ts'] }]);
