import { defineConfig, devices } from '@playwright/test';
import type { TestOptions } from './test-options';
require('dotenv').config()
export default defineConfig<TestOptions>({
  expect: {
    toMatchSnapshot: { maxDiffPixels: 50 }
  },
  //globalTimeout: 60000,//Time to execute all tests within a testrun -->default none
  //timeout: 10000,//Default Timeout is 30000 = 30s ->not longer than globalTimeout (if set)
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  //forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  // reporter: [
  //   ['json', { outputFile: 'test-results/jsonReport.json' }],
  //   ['junit', { outputFile: 'test-results/junitReport.xml' }],
  //   ['allure-playwright']
  // ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:4200/',
    globalsQaURL: 'http://www.globalsqa.com/demo-site/draganddrop/',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    //actionTimeout: 5000, //not longer than timeout
    //navigationTimeout: 5000 //not longer than timeout
    video: {
      mode: 'off',
      size: { width: 1920, height: 1080 }
    }
  },

  /* Configure projects for major browsers */
  projects: [
    //{
    //  name: 'dev',
    //  use: {
    //    ...devices['Desktop Chrome'],
    //    baseURL: 'http://localhost:4200/',
    //    globalsQaURL: 'http://www.globalsqa.com/demo-site/draganddrop/'
    //  },
    //},
    {
      name: 'staging',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://127.0.0.1:3002'
      },
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile',
      testMatch: 'testMobile.spec.ts',
      use: {
        //...devices['iPad (gen 5)'] //Use specific device
        viewport: { width: 414, height: 500 } //Or use a screen size
      }
    },
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
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
  //Starts and shuts down webserver
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:4200/'
  // },
});
