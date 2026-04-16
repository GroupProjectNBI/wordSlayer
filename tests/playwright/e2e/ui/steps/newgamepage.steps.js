import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given } = createBdd();

Given('I am on the newgame page', async ({ page }) => {
  await page.goto('/newgame/test-session-id');
  await page.waitForURL('/newgame/test-session-id');
});

