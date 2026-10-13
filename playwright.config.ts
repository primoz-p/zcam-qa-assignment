import {defineConfig, devices} from '@playwright/test';
import {CONFIG} from './config/env.config';

export default defineConfig({
  testDir: './tests',
  timeout: 60 * 60 * 1000,
  expect: {
    timeout: 30 * 1000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  globalTimeout: 60 * 60 * 1000,
  reporter: [['html', {open: 'never'}], ['list']],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'UI: chromium',
      testDir: 'tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: CONFIG.UI.BASE_URL
      },
    },
    // {
    //   name: 'UI: Google Chrome',
    //   testDir: './tests/ui',
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     channel: 'chrome',
    //     baseURL: CONFIG.UI.BASE_URL
    //   },
    // },
    // {
    //   name: 'UI: Mobile Chrome',
    //   testDir: './tests/ui',
    //   use: {
    //     ...devices['Pixel 9'],
    //     baseURL: CONFIG.UI.BASE_URL
    //   },
    // },
    {
      name: 'UI: Firefox',
      testDir: 'tests/ui',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: CONFIG.UI.BASE_URL
      },
    },
    {
      name: 'API-Tests',
      testDir: 'tests/api',
      use: {
        baseURL: CONFIG.API.BASE_URL
      },
    },
  ],
});
