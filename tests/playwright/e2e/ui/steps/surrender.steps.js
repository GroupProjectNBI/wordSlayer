import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

// --- INTERCEPTS ---

// Denna behövs för att testerna ska fungera utan en riktig backend-server igång
Given('I intercept surrender response', async ({ page }) => {
  // Vi fångar anropet till surrender-endpointen
  await page.route('**/api/game/*/surrender*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ message: "Surrender successful" }),
    });
  });
});

// --- ACTIONS ---

When('I click the surrender button', async ({ page }) => {
  // Om din handleLeaveGame triggar en window.confirm, accepterar vi den här:
  page.on('dialog', async (dialog) => {
    await dialog.accept();
  });

  // Vi letar upp "Ge upp"-knappen via dess test-id.
  // I din GameBoard skickas handleLeaveGame in som prop 'onLeaveGame'.
  // Se till att knappen i GameBoard har data-testid="surrender-button"
  const surrenderBtn = page.getByTestId('surrender-button');
  await surrenderBtn.click();
});

// --- ASSERTIONS ---

Then('I am redirected to the "/" page', async ({ page }) => {
  // Verifierar att navigate("/") i din handleLeaveGame skickar användaren till startsidan
  // (Anpassa regex om du navigerar till /lobby istället för /)
  await page.waitForURL(url => url.pathname === '/');
  expect(page.url()).not.toContain('/game/');
});

Then('the overlay contains {string}', async ({ page }, message) => {
  // Vi använder overlay-elementet från din PlayGame.tsx
  const winnerMessage = page.locator('[data-testid="winner-message"]');

  // Vi väntar på att texten dyker upp (viktigt om det är nätverkslatens)
  await expect(winnerMessage).toBeVisible({ timeout: 10000 });

  // Vi kollar att texten matchar (t.ex. "YOU WIN (OPPONENT LEFT) ")
  await expect(winnerMessage).toContainText(message);
});

Then('the game input is disabled', async ({ page }) => {
  // När isGameOver är true i PlayGame, renderas overlayen.
  // Vi kontrollerar att textboxen (ord-fältet) antingen är borta eller disabled
  const input = page.getByRole('textbox');

  // Eftersom overlayen ligger ovanpå (zIndex 100), ska inputen inte gå att interagera med
  // Alternativt, om din GameBoard disablar inputen vid isGameOver:
  await expect(input).toBeDisabled();
});

// --- UTÖKAD SIGNALR MOCK FÖR SURRENDER ---
// (Återanvänder din befintliga logik men förtydligar HP -1 hanteringen)
When('the server signals surrender with HP {int} and {int}', async ({ page }, p1Hp, p2Hp) => {
  await page.evaluate(({ p1Hp, p2Hp }) => {
    window.dispatchEvent(new CustomEvent("signalr-turn-changed", {
      detail: {
        nextTurn: "gameover",
        p1Hp: p1Hp,
        p2Hp: p2Hp
      }
    }));
  }, { p1Hp, p2Hp });
});