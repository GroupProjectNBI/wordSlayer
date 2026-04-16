import { createBdd } from 'playwright-bdd';
const { When } = createBdd();

When('I intercept game session response', async ({ page }) => {
  await page.route('**/api/game/test-session-id', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        sessionId: 'test-session-id',
        players: [
          { name: 'PlayerOne', health: 100 },
          { name: 'PlayerTwo', health: 100 }
        ]
      }),
    });
  });
});
