import { createBdd } from 'playwright-bdd';

const { Given } = createBdd();

Given('I am on the homepage', async ({ page }) => {
  await page.goto('/');
});