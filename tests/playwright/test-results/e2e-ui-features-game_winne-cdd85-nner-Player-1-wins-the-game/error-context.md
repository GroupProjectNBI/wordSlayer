# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\ui\features\game_winner.feature.spec.js >> Game Winner >> Player 1 wins the game
- Location: .features-gen\e2e\ui\features\game_winner.feature.spec.js:6:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByTestId('damage-p2-button')

```

# Test source

```ts
  1  | import { createBdd } from 'playwright-bdd';
  2  | import { expect } from '@playwright/test';
  3  | 
  4  | const { Given, When, Then } = createBdd();
  5  | 
  6  | Given('a game is in progress', async ({ page }) => {
  7  |   // Gå till spelsidan. (Justera URL:en till vad ni använder för pågående spel)
  8  |   await page.goto('/play'); 
  9  | });
  10 | 
  11 | When('Player 2\'s HP reaches 0', async ({ page }) => {
  12 |   // För testets skull klickar vi kanske på en "Debug: Kill P2"-knapp ni satt upp, 
  13 |   // eller så simulerar vi att ett vinnande ord spelas.
  14 |   // Här antar vi att du klickar på en knapp för att skada P2:
> 15 |   await page.getByTestId('damage-p2-button').click(); 
     |                                              ^ Error: locator.click: Test timeout of 30000ms exceeded.
  16 | });
  17 | 
  18 | Then('I should see a message {string}', async ({ page }, winnerMessage) => {
  19 |   // Verifierar att vinnarskärmen dyker upp och visar rätt text!
  20 |   const winnerElement = page.locator('[data-testid="winner-message"]');
  21 |   await expect(winnerElement).toBeVisible();
  22 |   await expect(winnerElement).toHaveText(winnerMessage);
  23 | });
  24 | 
```