import { defineConfig } from '@playwright/test';

export default defineConfig({
  globalSetup: './e2e/playwright.setup.ts', // reset db before tests
  testDir: './e2e',
  webServer: {
    command: 'npm run dev-test',
    port: 4000,
  },
  projects: [
    {
      name: 'Chrome',
      use: {
        browserName: 'chromium',
        channel: 'chrome',
        baseURL: 'http://localhost:4000',
      },
    },
  ],
});
