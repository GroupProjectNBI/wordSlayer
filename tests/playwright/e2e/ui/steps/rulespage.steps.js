import { createBdd } from 'playwright-bdd';

const { Given } = createBdd();

Given('I am on the rulespage', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('lang', 'en');
  });

  await page.goto('/rules');
  await page.waitForURL('/rules');
});