import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

Given('a game is in progress', async ({ page }) => {
  // Gå till spelsidan. (Justera URL:en till vad ni använder för pågående spel)
  await page.goto('/play'); 
});

When('Player 2\'s HP reaches 0', async ({ page }) => {
  // För testets skull klickar vi kanske på en "Debug: Kill P2"-knapp ni satt upp, 
  // eller så simulerar vi att ett vinnande ord spelas.
  // Här antar vi att du klickar på en knapp för att skada P2:
  await page.getByTestId('damage-p2-button').click(); 
});

Then('I should see a message {string}', async ({ page }, winnerMessage) => {
  // Verifierar att vinnarskärmen dyker upp och visar rätt text!
  const winnerElement = page.locator('[data-testid="winner-message"]');
  await expect(winnerElement).toBeVisible();
  await expect(winnerElement).toHaveText(winnerMessage);
});
