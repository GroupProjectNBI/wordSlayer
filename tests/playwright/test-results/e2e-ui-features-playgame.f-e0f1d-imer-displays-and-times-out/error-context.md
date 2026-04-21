# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\ui\features\playgame.feature.spec.js >> PlayGame Page >> Timer displays and times out
- Location: .features-gen\e2e\ui\features\playgame.feature.spec.js:37:7

# Error details

```
Error: Expected to see turn indicator with text "Player 1"
```

# Page snapshot

```yaml
- main [ref=e4]:
  - heading "Word Slayer" [level=1] [ref=e6]
  - generic [ref=e7]:
    - heading "History" [level=2] [ref=e8]
    - generic [ref=e10]: No words yet
  - generic [ref=e11]:
    - generic [ref=e12]: Player 1
    - generic [ref=e16]: 100 HP
  - generic [ref=e17]:
    - generic [ref=e18]: Player 2
    - generic [ref=e22]: 100 HP
  - generic:
    - generic: Player 1
    - heading "VS" [level=1]
    - generic:
      - generic:
        - img
        - generic: 30s
  - textbox "Type your word..." [ref=e24]
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
> 52  |     throw new Error(`Expected to see turn indicator with text "${text}"`);
      |           ^ Error: Expected to see turn indicator with text "Player 1"
  53  |   }
  54  | });
  55  | 
  56  | 
  57  | Given('I am logged in as {string}', async ({ }, arg) => { });
  58  | 
  59  | Given('I am on the PlayGame page', async ({ page }) => {
  60  |   await page.goto('/game/00000000-0000-0000-0000-000000000000?test');
  61  | });
  62  | 
  63  | Given('the game input is enabled', async ({ page }) => {
  64  |   const input = page.getByRole('textbox');
  65  |   await expect(input).toBeEnabled({ timeout: 10000 });
  66  | });
  67  | 
  68  | When('I type the word {string}', async ({ page }, word) => {
  69  |   await page.getByRole('textbox').fill(word);
  70  | });
  71  | 
  72  | When('I submit the word', async ({ page }) => {
  73  |   const input = page.getByRole('textbox');
  74  |   await input.press('Enter');
  75  | });
  76  | 
  77  | // Custom assertions for legacy feature steps
  78  | Then('player {int} has {int} HP', async ({ page }, playerNum, hp) => {
  79  |   const selector = `[data-testid="player${playerNum}-hp"]`;
  80  |   const hpText = await page.locator(selector).innerText();
  81  |   const hpValue = parseInt(hpText, 10);
  82  |   expect(hpValue).toBe(hp);
  83  | });
  84  | 
  85  | Then('it is player {int} turn', async ({ page }, playerNum) => {
  86  |   const turnText = await page.locator('[data-testid="turn-indicator"]').innerText();
  87  |   expect(turnText).toContain(`Player ${playerNum}`);
  88  | });
  89  | 
  90  | 
  91  | // SignalR simulation
  92  | When('the server signals turn changed to {string} with HP {int} and {int}', async ({ page }, nextTurn, p1Hp, p2Hp) => {
  93  |   await page.evaluate(({ nextTurn, p1Hp, p2Hp }) => {
  94  |     window.dispatchEvent(new CustomEvent("signalr-turn-changed", {
  95  |       detail: { nextTurn, p1Hp, p2Hp }
  96  |     }));
  97  |   }, { nextTurn, p1Hp, p2Hp });
  98  | });
  99  | 
  100 | // API mocking
  101 | Given('I intercept game session response', async ({ page }) => {
  102 |   await page.route(`**/api/game/${VALID_GUID}`, (route) => {
  103 |     route.fulfill({
  104 |       status: 200,
  105 |       contentType: 'application/json',
  106 |       body: JSON.stringify({
  107 |         sessionId: VALID_GUID,
  108 |         players: [
  109 |           { name: 'Player 1', health: 100 },
  110 |           { name: 'Player 2', health: 100 }
  111 |         ],
  112 |         currentTurn: 'player1'
  113 |       }),
  114 |     });
  115 |   });
  116 | });
  117 | Given('I intercept game session response with only one player', async ({ page }) => {
  118 |   await page.route(`**/api/game/${VALID_GUID}`, (route) => {
  119 |     route.fulfill({
  120 |       status: 200,
  121 |       contentType: 'application/json',
  122 |       body: JSON.stringify({
  123 |         sessionId: VALID_GUID,
  124 |         players: [{ name: 'Player 1', health: 100 }],
  125 |         currentTurn: 'player1'
  126 |       }),
  127 |     });
  128 |   });
  129 | });
  130 | Given('I intercept playword response', async ({ page }) => {
  131 |   await page.route(`**/api/game/${VALID_GUID}/playword`, (route) => {
  132 |     route.fulfill({
  133 |       status: 200,
  134 |       contentType: 'application/json',
  135 |       body: JSON.stringify({ message: "Success" }),
  136 |     });
  137 |   });
  138 | });
  139 | 
  140 | // Timer mocking
  141 | Given("the timer is mocked", async ({ page }) => {
  142 |   await page.addInitScript(() => {
  143 |     window.setInterval = () => 0;
  144 |     window.setTimeout = () => 0;
  145 |   });
  146 | });
  147 | When("the timer ticks {int} seconds", async ({ page }) => {
  148 |   await page.evaluate(() => {
  149 |     window.dispatchEvent(new Event("manual-timer-tick"));
  150 |   });
  151 | });
  152 | 
```