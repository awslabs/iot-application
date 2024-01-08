import { devices, defineConfig } from '@playwright/test';

// Read environment variables
// baseURL defaults to http://localhost:3000
const baseURL = process.env.ENDPOINT ?? 'http://localhost:3000';
// launchWebServer defaults to true
const launchWebServer = process.env.LAUNCH_WEB_SERVER != 'false';

// Configuration for launching the web server
const launchWebServerConfig = [
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
];
// If launchWebServer is true, add the web server launching configuration
const webServer = launchWebServer ? launchWebServerConfig : undefined;

export default defineConfig({
  use: {
    baseURL,
    navigationTimeout: 30000,
    screenshot: 'only-on-failure',
    trace: 'on',
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
  updateSnapshots: 'all',
  webServer,
});
