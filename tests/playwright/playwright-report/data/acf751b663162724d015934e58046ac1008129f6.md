# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\ui\features\playgame.feature.spec.js >> PlayGame Page >> Player HP is updated after word submission
- Location: .features-gen\e2e\ui\features\playgame.feature.spec.js:44:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5002/game/00000000-0000-0000-0000-000000000000?test
Call log:
  - navigating to "http://localhost:5002/game/00000000-0000-0000-0000-000000000000?test", waiting until "load"

```

# Test source

```ts
  1   | import { createBdd } from "playwright-bdd";
  2   | import { expect } from "@playwright/test";
  3   | const { Given, When, Then } = createBdd();
  4   | const VALID_GUID = "00000000-0000-0000-0000-000000000000";
  5   | 
  6   | // Username assertion
  7   | Then('I see the player {int} username', async ({ page }, playerNum) => {
  8   |   const selector = `[data-player="player${playerNum}"]`;
  9   |   await expect(page.locator(selector)).toBeVisible();
  10  | });
  11  | 
  12  | // Damage popup assertion
  13  | Then('I see a damage popup with {int}', async ({ page }, amount) => {
  14  |   const popup = page.locator('div').filter({ hasText: `-${amount}` });
  15  |   await expect(popup.first()).toBeVisible({ timeout: 10000 });
  16  | });
  17  | 
  18  | // Word history assertions
  19  | Then('the word history should be empty', async ({ page }) => {
  20  |   const items = page.locator('[data-word-history] [data-word-entry]');
  21  |   await expect(items).toHaveCount(0);
  22  | });
  23  | 
  24  | Then('the word history contains {string}', async ({ page }, word) => {
  25  |   await expect(page.locator('[data-word-history]').getByText(word)).toBeVisible();
  26  | });
  27  | 
  28  | Then('the word history should show:', async ({ page }, table) => {
  29  |   const expected = table.rows().flat();
  30  |   const items = page.locator('[data-word-history] [data-word-entry]');
  31  |   const count = await items.count();
  32  |   const offset = count - expected.length;
  33  |   for (let i = 0; i < expected.length; i++) {
  34  |     const text = await items.nth(offset + i).innerText();
  35  |     expect(text).toContain(expected[i]);
  36  |   }
  37  | });
  38  | 
  39  | Then('the word history entry {string} belongs to player {int}', async ({ page }, word, playerNum) => {
  40  |   const entry = page.locator('[data-word-history] [data-word-entry]').filter({ hasText: word });
  41  |   await expect(entry).toHaveAttribute('data-player', `player${playerNum}`);
  42  | });
  43  | 
  44  | Then('the word history shows damage {int} for {string}', async ({ page }, damage, word) => {
  45  |   const entry = page.locator('[data-word-history] [data-word-entry]').filter({ hasText: word });
  46  |   await expect(entry).toHaveAttribute('data-damage', `${damage}`);
  47  | });
  48  | 
  49  | Then('I see turn indicator {string}', async ({ page }, text) => {
  50  |   const visible = await page.getByTestId('turn-indicator').filter({ hasText: text }).isVisible();
  51  |   if (!visible) {
  52  |     throw new Error(`Expected to see turn indicator with text "${text}"`);
  53  |   }
  54  | });
  55  | 
  56  | Given('I am logged in as {string}', async ({ }, arg) => { });
  57  | 
  58  | Given('I am on the PlayGame page', async ({ page }) => {
> 59  |   await page.goto('/game/00000000-0000-0000-0000-000000000000?test');
      |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5002/game/00000000-0000-0000-0000-000000000000?test
  60  | });
  61  | 
  62  | Given('the game input is enabled', async ({ page }) => {
  63  |   const input = page.getByRole('textbox');
  64  |   await expect(input).toBeEnabled({ timeout: 10000 });
  65  | });
  66  | 
  67  | When('I type the word {string}', async ({ page }, word) => {
  68  |   await page.getByRole('textbox').fill(word);
  69  | });
  70  | 
  71  | When('I submit the word', async ({ page }) => {
  72  |   const input = page.getByRole('textbox');
  73  |   await input.press('Enter');
  74  | });
  75  | 
  76  | // Custom assertions for legacy feature steps
  77  | Then('player {int} has {int} HP', async ({ page }, playerNum, hp) => {
  78  |   const selector = `[data-testid="player${playerNum}-hp"]`;
  79  |   const hpText = await page.locator(selector).innerText();
  80  |   const hpValue = parseInt(hpText, 10);
  81  |   expect(hpValue).toBe(hp);
  82  | });
  83  | 
  84  | Then('it is player {int} turn', async ({ page }, playerNum) => {
  85  |   const turnText = await page.locator('[data-testid="turn-indicator"]').innerText();
  86  |   expect(turnText).toContain(`Player ${playerNum}`);
  87  | });
  88  | 
  89  | // SignalR simulation
  90  | When('the server signals turn changed to {string} with HP {int} and {int}', async ({ page }, nextTurn, p1Hp, p2Hp) => {
  91  |   await page.evaluate(({ nextTurn, p1Hp, p2Hp }) => {
  92  |     window.dispatchEvent(new CustomEvent("signalr-turn-changed", {
  93  |       detail: { nextTurn, p1Hp, p2Hp }
  94  |     }));
  95  |   }, { nextTurn, p1Hp, p2Hp });
  96  | });
  97  | 
  98  | // API mocking
  99  | Given('I intercept game session response', async ({ page }) => {
  100 |   await page.route(`**/api/game/${VALID_GUID}`, (route) => {
  101 |     route.fulfill({
  102 |       status: 200,
  103 |       contentType: 'application/json',
  104 |       body: JSON.stringify({
  105 |         sessionId: VALID_GUID,
  106 |         players: [
  107 |           { name: 'Player 1', health: 100 },
  108 |           { name: 'Player 2', health: 100 }
  109 |         ],
  110 |         currentTurn: 'player1'
  111 |       }),
  112 |     });
  113 |   });
  114 | });
  115 | Given('I intercept game session response with only one player', async ({ page }) => {
  116 |   await page.route(`**/api/game/${VALID_GUID}`, (route) => {
  117 |     route.fulfill({
  118 |       status: 200,
  119 |       contentType: 'application/json',
  120 |       body: JSON.stringify({
  121 |         sessionId: VALID_GUID,
  122 |         players: [{ name: 'Player 1', health: 100 }],
  123 |         currentTurn: 'player1'
  124 |       }),
  125 |     });
  126 |   });
  127 | });
  128 | Given('I intercept playword response', async ({ page }) => {
  129 |   await page.route(`**/api/game/${VALID_GUID}/playword`, (route) => {
  130 |     route.fulfill({
  131 |       status: 200,
  132 |       contentType: 'application/json',
  133 |       body: JSON.stringify({ message: "Success" }),
  134 |     });
  135 |   });
  136 | });
  137 | 
  138 | // Timer mocking
  139 | Given("the timer is mocked", async ({ page }) => {
  140 |   await page.addInitScript(() => {
  141 |     window.setInterval = () => 0;
  142 |     window.setTimeout = () => 0;
  143 |   });
  144 | });
  145 | When("the timer ticks {int} seconds", async ({ page }) => {
  146 |   await page.evaluate(() => {
  147 |     window.dispatchEvent(new Event("manual-timer-tick"));
  148 |   });
  149 | });
  150 | 
  151 | // Overlay assertions
  152 | Then('I see the game overlay', async ({ page }) => {
  153 |   await expect(page.getByTestId("overlay")).toBeVisible();
  154 | });
  155 | Then('I do not see the game overlay', async ({ page }) => {
  156 |   await expect(page.getByTestId("overlay")).toHaveCount(0);
  157 | });
```