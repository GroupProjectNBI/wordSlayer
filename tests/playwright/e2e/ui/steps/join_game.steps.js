import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test'; // Lade till denna för assertions

const { Given, When, Then } = createBdd(); // Lade till Then i destructureringen

Given('I am on the join page', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('lang', 'en');
  });

  await page.goto('/join');
  await page.waitForURL('/join');
});

When('I enter game code {string}', async ({ page }, code) => {
  // ÄNDRING: Nu använder vi variabeln 'code' från feature-filen istället för en hårdkodad sträng
  await page.fill('#game-code-input', code);
});

When('I intercept join response', async ({ page }) => {
  await page.route('**/api/game/*/join', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({}),
    });
  });
});


Given('I intercept game info response with language {string}', async ({ page }, language) => {
  // Vi mockar GET-anropet som useEffect gör när koden är 36 tecken lång
  await page.route('**/api/game/00000000-0000-0000-0000-000000000000', async (route) => {

    // Säkerställ att vi bara fångar GET-requests
    if (route.request().method() !== 'GET') {
      return route.fallback();
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        sessionId: '00000000-0000-0000-0000-000000000000',
        language: language, // Här matar vi in "swe" eller "eng" från scenariot!
        players: [{ name: 'Player 1', health: 100 }],
        currentTurn: 'player1'
      }),
    });
  });
});

Then('I see the {string} flag image', async ({ page }, altText) => {
  const image = page.getByRole('img', { name: altText });
  await expect(image).toBeVisible();
});