import { createBdd } from "playwright-bdd";
import { expect } from "@playwright/test";
const { Given, When, Then } = createBdd();

Given('I am on the newgame page', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('lang', 'en');
  });

  await page.goto('/newgame/00000000-0000-0000-0000-000000000000');
  await page.waitForURL('/newgame/00000000-0000-0000-0000-000000000000');
});
When('I press the button {string}', async ({ page }, name) => {
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  const button = page.getByRole('button', { name: name });
  await button.click();
});

Then('the button should have a green styling', async ({ page }) => {
  const button = page.locator('button').filter({ hasText: 'Copied Game Code!' });
  await expect(button).toHaveClass(/text-green-400/);
});

Then('the clipboard should contain the game code', async ({ page }) => {
  const handle = await page.evaluateHandle(() => navigator.clipboard.readText());
  const clipboardText = await handle.jsonValue();
  expect(clipboardText).toBe("00000000-0000-0000-0000-000000000000");
});