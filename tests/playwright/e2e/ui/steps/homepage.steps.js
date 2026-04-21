import { createBdd } from 'playwright-bdd';
const { Given, When } = createBdd();

Given('I am on the homepage', async ({ page }) => {
  await page.goto('/');
  await page.waitForURL('/');
});

When('I intercept new game response', async ({ page }) => {
  await page.route('**/api/newGame', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ sessionId: '00000000-0000-0000-0000-000000000000' }),
    });
  });
});