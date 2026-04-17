import { createBdd } from 'playwright-bdd';
const { Given, When } = createBdd();

Given('I am on the join page', async ({ page }) => {
  await page.goto('/join');
  await page.waitForURL('/join');
});

When('I enter game code {string}', async ({ page }, code) => {
  // Om du vill att Player 2 ska hamna i rätt rum, skicka med GUID här i testet
  const targetCode = "00000000-0000-0000-0000-000000000000";
  await page.fill('#game-code-input', targetCode);
});

When('I intercept join response', async ({ page }) => {
  // Se till att API-anropet för JOIN också använder rätt format
  await page.route('**/api/game/*/join', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({}),
    });
  });
});