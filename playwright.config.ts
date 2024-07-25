import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

import { CI, PORT, TEST_HOST_NAME } from '@/constants/env';
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
if (!CI) {
  dotenv.config({ path: '.env' });
}

// Use process.env.PORT by default and fallback to port 3000
const PORT_NO = PORT || 3000;

// Set webServer.url and use.baseURL with the location of the WebServer respecting the correct set port
export const baseURL = TEST_HOST_NAME || `http://localhost:${PORT_NO}`;

export const storageStatePath = 'tests/e2e/storage-states';
const authStorageState = `${storageStatePath}/auth.json`;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests/e2e',
  outputDir: './tests/e2e-results',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!CI,
  /* Retry on CI only */
  retries: CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: CI ? 1 : 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Adding more timeout in local because of additional time needed for lazy compilation of routes */
  timeout: (CI ? 60 : 180) * 1000,
  expect: {
    timeout: (CI ? 10 : 30) * 1000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'auth',
      testMatch: 'auth.setup.ts',
    },
    {
      name: 'chromium-setup',
      use: { ...devices['Desktop Chrome'], storageState: authStorageState },
      testMatch: 'create.setup.ts',
      dependencies: ['auth'],
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: `${storageStatePath}/chromium.json`,
      },
      dependencies: ['chromium-setup'],
    },
    // {
    //   name: 'chromium',
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     storageState: authStorageState,
    //     launchOptions: {
    //       slowMo: 0,
    //     },
    //   },
    //   dependencies: ['auth'],
    // },
    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     storageState: authStorageState,
    //     launchOptions: {
    //       slowMo: 0,
    //     },
    //   },
    //   dependencies: ['auth'],
    // },
    // {
    //   name: 'webkit',
    //   use: {
    //     ...devices['Desktop Safari'],
    //     storageState: authStorageState,
    //     launchOptions: {
    //       slowMo: 0,
    //     },
    //   },
    //   dependencies: ['auth'],
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: baseURL,
    timeout: 120 * 1000,
    reuseExistingServer: true,
  },
});
