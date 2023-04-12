import { devices, defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'http://localhost:3001',
    navigationTimeout: 30000,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },
  testDir: './tests',
  /* Maximum time one test can run for. */
  timeout: 60000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 30000,
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  maxFailures: 0,
  workers: 1,
  reporter: 'html',
  retries: 0,
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      retries: 5,
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
  webServer: [
    {
      command: 'yarn start:core',
      url: 'http://localhost:3000/health',
      reuseExistingServer: !process.env.CI,
      timeout: 300 * 1000, // 5 minutes
    },
    {
      command: 'yarn start:client',
      url: 'http://localhost:3001',
      reuseExistingServer: !process.env.CI,
      timeout: 300 * 1000, // 5 minutes
    },
  ],
});
