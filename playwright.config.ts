import { defineConfig, devices } from '@playwright/test';
import process from 'process';

// When running via `npm run test:allure:dated`, RUN_TIMESTAMP is injected by
// scripts/run-allure.js so each run's results land in their own dated folder.
const runTimestamp = process.env.RUN_TIMESTAMP;
const allureResultsDir = runTimestamp
  ? `allure-results/${runTimestamp}`
  : 'allure-results';

export default defineConfig({
  testDir: './tests/',

  fullyParallel: true,

  // Serial test suites (e.g. CAL0101) legitimately run on 1 worker —
  // suppress the "slow test file" warning that would otherwise appear.
  reportSlowTests: null,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : 4,

  reporter: [
     // HTML Report in report folder
    ['html', { outputFolder: 'reports/html-report', open: 'never' }],
    // ['html', { outputFolder: 'playwright-report/' + (new Date()).toISOString()}],
    
    //allure report
    ['allure-playwright', { resultsDir: allureResultsDir }],

     ['junit', { outputFile: 'reports/results.xml' }],
  ],


  outputDir: 'reports/artifacts', // Store output logs & artifacts in the report folder

  timeout: 60000, // Global test timeout — 1 minute per test

  expect: {
    timeout: 30000, // Timeout for expect assertions — 30 seconds
  },

  globalSetup: require.resolve('./tests/globalSetup'),

  use: {
    screenshot: 'on', // capture screenshots as attachments
    video: 'retain-on-failure', // only keep videos for failed tests — reduces storage
    trace: 'retain-on-failure', // only keep traces for failed tests — reduces storage
    actionTimeout: 100000, // Timeout for individual actions
    navigationTimeout: 100000, // Timeout for navigations
  },

  projects: [
    // ─── Calendar setup: CAL0101 must complete before ANY other test starts ───
    // This guarantees that week-type / shift data created by CAL0101 is present
    // in the database when CAL0102 (and the rest of the suite) runs.
    {
      name: 'cal-setup',
      testMatch: /.*CAL0101\.spec\.ts/,
      use: {
        browserName: 'firefox',
        headless: !!process.env.CI, // headed locally, headless in CI
        viewport: null,
        video: 'retain-on-failure',
      },
    },

    // {
    //   name: 'chromium',
    //   use: {
    //     browserName: 'chromium',
    //     headless: process.env.CI ? true : false, // Run headless in CI
    //     viewport: null, // Disable fixed viewport
    //     launchOptions: {
    //       args: ['--start-maximized'], // Maximize the window
    //     },
    //   },
    // },


    // headed mode
    // {
    //   name: 'edge',
    //   use: {
    //     browserName: 'chromium',
    //     channel: 'msedge', // Use the Edge browser
    //     headless:false, // Run headless in CI
    //     viewport: null, // Disable fixed viewport
    //     launchOptions: {
    //       args: ['--start-maximized'], // Maximize the window
    //     },
    //    },
    // },

    {
      name: 'firefox',
      // CAL0101 already runs in the 'cal-setup' project above — skip it here
      // so it is not executed twice.
      testIgnore: /.*CAL0101\.spec\.ts/,
      dependencies: ['cal-setup'],
      use: {
        browserName: 'firefox',
        headless: !!process.env.CI, // headed locally, headless in CI
        viewport: null,
        video: 'retain-on-failure',
      },
    },

    //   //headless mode
    // {
    //   name: 'edge',
    //   use: {
    //     browserName: 'chromium',
    //     channel: 'msedge',
    //     headless: true,
    //     viewport: process.env.CI ? { width: 1920, height: 1080 } : null,
    //     launchOptions: {
    //       args: [
    //         '--window-size=1920,1080',
    //         '--force-device-scale-factor=1',
    //       ],
    //     },
    //     screenshot: 'only-on-failure',
    //     video: 'retain-on-failure',
    //   },
    // }
  ],
});
