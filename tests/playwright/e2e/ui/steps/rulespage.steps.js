import { createBdd } from 'playwright-bdd';

const { Given } = createBdd();

Given('I am on the rulespage', async ({ page }) => {
  await page.goto('/rules');
});