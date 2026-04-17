import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given } = createBdd();

Given('I am on the newgame page', async ({ page }) => {
  await page.goto('/newgame/00000000-0000-0000-0000-000000000000');
  await page.waitForURL('/newgame/00000000-0000-0000-0000-000000000000');
});

