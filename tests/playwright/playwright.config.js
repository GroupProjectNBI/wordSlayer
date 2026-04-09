import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
  features: 'e2e/ui/features/**/*.feature',
  steps: ['e2e/ui/steps/**/*.js', 'e2e/ui/pages/**/*.js']
});

export default defineConfig({
  testDir,
  timeout: 30_000,
  expect: {
    timeout: 10_000
  },
  reporter: [['list', { open: 'always' }], ['html', { open: 'on-failure' }]],
  use: {
    baseURL: 'http://localhost:5002/',  // Ändra till din applikations URL, t ex http://localhost:5010 
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  reporter: 'html',
});
