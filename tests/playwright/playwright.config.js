import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
  features: 'e2e/ui/features/**/*.feature',
  steps: ['e2e/ui/steps/**/*.js', 'e2e/ui/pages/**/*.js']
});

export default defineConfig({
  testDir,

  // Öka timeout till 60s i pipelinen, annars 30s
  timeout: process.env.CI ? 60_000 : 30_000,

  expect: {
    timeout: 10_000
  },

  // Kör bara 1 test i taget i pipelinen
  workers: process.env.CI ? 1 : undefined,

  // Ge testerna 2 extra chanser om de failar i pipelinen
  retries: process.env.CI ? 2 : 0,

  // Enbart en reporter-definition!
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: 'http://localhost:5002/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  }
});