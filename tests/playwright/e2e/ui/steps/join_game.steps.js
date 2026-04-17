import { createBdd } from 'playwright-bdd';
const { Given, When } = createBdd();

Given('I am on the join page', async ({ page }) => {
  await page.goto('/join');
  await page.waitForURL('/join');
});

When('I enter game code {string}', async ({ page }, code) => {
  await page.fill('#game-code-input', code);
});

When('I intercept join response', async ({ page }) => {
  await page.route('**/api/game/test-session-id/join', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({}),
    });
  });
});
