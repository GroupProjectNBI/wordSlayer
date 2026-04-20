# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\ui\features\newgamepage.feature.spec.js >> NewGamePage >> Copy game code to clipboard and see feedback
- Location: .features-gen\e2e\ui\features\newgamepage.feature.spec.js:6:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5002/newgame/00000000-0000-0000-0000-000000000000
Call log:
  - navigating to "http://localhost:5002/newgame/00000000-0000-0000-0000-000000000000", waiting until "load"

```

# Test source

```ts
  1  | import { createBdd } from "playwright-bdd";
  2  | import { expect } from "@playwright/test";
  3  | const { Given, When, Then } = createBdd();
  4  | 
  5  | Given('I am on the newgame page', async ({ page }) => {
> 6  |   await page.goto('/newgame/00000000-0000-0000-0000-000000000000');
     |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5002/newgame/00000000-0000-0000-0000-000000000000
  7  |   await page.waitForURL('/newgame/00000000-0000-0000-0000-000000000000');
  8  | });
  9  | 
  10 | When('I press the button {string}', async ({ page }, name) => {
  11 |   await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  12 |   const button = page.getByRole('button', { name: name });
  13 |   await button.click();
  14 | });
  15 | 
  16 | Then('the button should have a green styling', async ({ page }) => {
  17 |   const button = page.locator('button').filter({ hasText: 'Copied Game Code!' });
  18 |   await expect(button).toHaveClass(/text-green-400/);
  19 | });
  20 | 
  21 | Then('the clipboard should contain the game code', async ({ page }) => {
  22 |   const handle = await page.evaluateHandle(() => navigator.clipboard.readText());
  23 |   const clipboardText = await handle.jsonValue();
  24 |   expect(clipboardText).toBe("00000000-0000-0000-0000-000000000000");
  25 | });
```