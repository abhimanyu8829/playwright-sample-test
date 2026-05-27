const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 90_000,
  expect: {
    timeout: 15_000,
  },
  fullyParallel: false,
  workers: process.env.CI ? 1 : 2,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'https://app.nitroberry.com',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    navigationTimeout: 60_000,
    actionTimeout: 20_000,
  },
  projects: [
    {
      name: 'auth',
      testMatch: /tests\/auth\/.*\.spec\.js/,
      use: { ...devices['Desktop Chrome'], storageState: undefined },
    },
    {
      name: 'setup',
      testMatch: /tests\/auth\.setup\.js/,
      use: { ...devices['Desktop Chrome'], storageState: undefined },
    },
    {
      name: 'chromium',
      dependencies: ['setup'],
      testIgnore: [/tests\/auth\/.*\.spec\.js/, /tests\/auth\.setup\.js/],
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/admin.json',
      },
    },
  ],
});
