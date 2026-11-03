import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://127.0.0.1:3101', ...devices['Desktop Chrome'] },
  webServer: { command: 'npm run start -- --port 3101', url: 'http://127.0.0.1:3101', reuseExistingServer: false, timeout: 30000 },
});
