# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\ui\features\join_game.feature.spec.js >> JoinGame >> Player 2 joins an existing game
- Location: .features-gen\e2e\ui\features\join_game.feature.spec.js:12:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5002/join
Call log:
  - navigating to "http://localhost:5002/join", waiting until "load"

```

# Test source

```ts
  1  | import { createBdd } from 'playwright-bdd';
  2  | const { Given, When } = createBdd();
  3  | 
  4  | Given('I am on the join page', async ({ page }) => {
> 5  |   await page.goto('/join');
     |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5002/join
  6  |   await page.waitForURL('/join');
  7  | });
  8  | 
  9  | When('I enter game code {string}', async ({ page }, code) => {
  10 |   const targetCode = "00000000-0000-0000-0000-000000000000";
  11 |   await page.fill('#game-code-input', targetCode);
  12 | });
  13 | 
  14 | When('I intercept join response', async ({ page }) => {
  15 |   await page.route('**/api/game/*/join', (route) => {
  16 |     route.fulfill({
  17 |       status: 200,
  18 |       contentType: 'application/json',
  19 |       body: JSON.stringify({}),
  20 |     });
  21 |   });
  22 | });
```