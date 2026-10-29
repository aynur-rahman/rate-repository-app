import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './e2e', workers: 1, retries: 0, timeout: 45000,
  reporter: 'list', use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:8081', trace: 'retain-on-failure' },
});
