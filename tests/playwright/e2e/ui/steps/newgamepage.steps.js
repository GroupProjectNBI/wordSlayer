import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

//
// NAVIGATION
//
Given('I am on the newgame page', async ({ page }) => {
  await page.goto('/newgame');
});

