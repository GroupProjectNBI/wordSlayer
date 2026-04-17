import { createBdd } from "playwright-bdd";
import { expect } from "@playwright/test";

const { Given, When, Then } = createBdd();

// Vi använder den befintliga navigationen
Given('I am on the newgame page', async ({ page }) => {
  await page.goto('/newgame/00000000-0000-0000-0000-000000000000?test');
});

Then('I see the button {string}', async ({ page }, name) => {
  const button = page.getByRole('button', { name: name });
  await expect(button).toBeVisible();
});

When('I press the button {string}', async ({ page }, name) => {
  // Vi måste ge webbläsaren tillåtelse att läsa/skriva till clipboard i test-miljön
  // Detta görs oftast i playwright.config.ts, men kan också göras här:
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);

  const button = page.getByRole('button', { name: name });
  await button.click();
});

Then('the button should have a green styling', async ({ page }) => {
  const button = page.locator('button').filter({ hasText: 'Copied to clipboard!' });
  // Vi kollar om den gröna klassen finns (från Tailwind)
  await expect(button).toHaveClass(/text-green-400/);
});

// EXTRA: Verifiera att rätt kod faktiskt kopierades
Then('the clipboard should contain the game code', async ({ page }) => {
  const handle = await page.evaluateHandle(() => navigator.clipboard.readText());
  const clipboardText = await handle.jsonValue();
  expect(clipboardText).toBe("00000000-0000-0000-0000-000000000000");
});