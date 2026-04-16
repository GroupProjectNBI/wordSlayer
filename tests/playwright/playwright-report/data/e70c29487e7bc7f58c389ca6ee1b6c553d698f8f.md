# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\ui\features\playgamepage.feature.spec.js >> PlayGame Page >> Word history shows which player submitted each word
- Location: .features-gen\e2e\ui\features\playgamepage.feature.spec.js:105:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('textbox')

```

# Test source

```ts
  1   | import { createBdd } from "playwright-bdd";
  2   | import { expect } from "@playwright/test";
  3   | 
  4   | const { Given, When, Then } = createBdd();
  5   | 
  6   | //
  7   | // NAVIGATION (used only where referenced in features)
  8   | //
  9   | Given("I am on the PlayGame page", async ({ page }) => {
  10  |   await page.goto("/game?test");
  11  | });
  12  | 
  13  | //
  14  | // TIMER MOCKING
  15  | //
  16  | Given("the timer is mocked", async ({ page }) => {
  17  |   await page.addInitScript(() => {
  18  |     window.originalSetInterval = window.setInterval;
  19  |     window.originalSetTimeout = window.setTimeout;
  20  | 
  21  |     window.setInterval = () => 0;
  22  |     window.setTimeout = () => 0;
  23  |   });
  24  | });
  25  | 
  26  | Given('I intercept game session response', async ({ page }) => {
  27  |   await page.route('**/api/game/test-session-id', (route) => {
  28  |     route.fulfill({
  29  |       status: 200,
  30  |       contentType: 'application/json',
  31  |       body: JSON.stringify({
  32  |         sessionId: 'test-session-id',
  33  |         players: [
  34  |           { name: 'PlayerOne', health: 100 },
  35  |           { name: 'PlayerTwo', health: 100 }
  36  |         ]
  37  |       }),
  38  |     });
  39  |   });
  40  | });
  41  | 
  42  | Given('I intercept playword response', async ({ page }) => {
  43  |   await page.route('**/api/game/test-session-id/playword', (route) => {
  44  |     route.fulfill({
  45  |       status: 200,
  46  |       contentType: 'application/json',
  47  |       body: JSON.stringify({}),
  48  |     });
  49  |   });
  50  | });
  51  | 
  52  | When("the timer ticks {int} seconds", async ({ page }, seconds) => {
  53  |   for (let i = 0; i < seconds; i++) {
  54  |     await page.evaluate(() => {
  55  |       window.dispatchEvent(new Event("manual-timer-tick"));
  56  |     });
  57  |   }
  58  | });
  59  | 
  60  | //
  61  | // WORD INPUT
  62  | //
  63  | When("I type the word {string}", async ({ page }, text) => {
> 64  |   await page.getByRole("textbox").fill(text);
      |                                   ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  65  | });
  66  | 
  67  | When("I submit the word", async ({ page }) => {
  68  |   const input = page.getByRole("textbox");
  69  |   await input.focus();
  70  |   await input.press("Enter");
  71  | });
  72  | 
  73  | //
  74  | // ASSERTIONS
  75  | //
  76  | Then("the timer should show {int}", async ({ page }, value) => {
  77  |   const timer = page.getByText(new RegExp(`^\\s*${value}s\\s*$`));
  78  |   await expect(timer).toBeVisible();
  79  | });
  80  | 
  81  | Then("player {int} has {int} HP", async ({ page }, player, hp) => {
  82  |   const selector = `[data-player='player${player}'] >> text='${hp} HP'`;
  83  |   await expect(page.locator(selector)).toBeVisible();
  84  | });
  85  | 
  86  | Then("it is player {int} turn", async ({ page }, player) => {
  87  |   const selector = `[data-player='player${player}'][data-active='true']`;
  88  |   await expect(page.locator(selector)).toBeVisible();
  89  | });
  90  | 
  91  | Then("I see the player {int} username", async ({ page }, player) => {
  92  |   const selector = `[data-player='player${player}']`;
  93  |   await expect(page.locator(selector)).toBeVisible();
  94  | });
  95  | 
  96  | Then("I see a damage popup with {int}", async ({ page }, amount) => {
  97  |   const popup = page.locator("div", { hasText: new RegExp(`^-${amount}$`) });
  98  |   await expect(popup).toBeVisible();
  99  | });
  100 | 
  101 | Then("player {int} HP bar is at {int} percent", async ({ page }, player, percent) => {
  102 |   await expect(
  103 |     page.locator(`[data-player='player${player}'] >> text='${percent} HP'`)
  104 |   ).toBeVisible();
  105 | 
  106 |   await page.waitForTimeout(400);
  107 | 
  108 |   const bar = page.locator(`[data-player='player${player}'] .hp-fill`);
  109 |   const wrapper = page.locator(`[data-player='player${player}'] .hp-bar`);
  110 | 
  111 |   const barWidth = await bar.evaluate(el => el.getBoundingClientRect().width);
  112 |   const wrapperWidth = await wrapper.evaluate(el => el.getBoundingClientRect().width);
  113 | 
  114 |   const actualPercent = Math.round((barWidth / wrapperWidth) * 100);
  115 | 
  116 |   const diff = Math.abs(actualPercent - percent);
  117 |   if (diff > 1) {
  118 |     throw new Error(`Expected HP bar to be ${percent}% but was ${actualPercent}%`);
  119 |   }
  120 | });
  121 | 
  122 | //
  123 | // WORD HISTORY
  124 | //
  125 | Then("the word history should be empty", async ({ page }) => {
  126 |   const items = page.locator("[data-word-history] [data-word-entry]");
  127 |   await expect(items).toHaveCount(0);
  128 | });
  129 | 
  130 | Then("the word history contains {string}", async ({ page }, word) => {
  131 |   await expect(
  132 |     page.locator("[data-word-history]").getByText(word)
  133 |   ).toBeVisible();
  134 | });
  135 | 
  136 | Then("the word history should show:", async ({ page }, table) => {
  137 |   const expected = table.rows().flat();
  138 |   const items = page.locator("[data-word-history] [data-word-entry]");
  139 | 
  140 |   const count = await items.count();
  141 |   if (count < expected.length) {
  142 |     throw new Error(
  143 |       `Expected at least ${expected.length} word history entries, but found ${count}`
  144 |     );
  145 |   }
  146 | 
  147 |   // Jämför de sista N entries med expected (suffix-match)
  148 |   const offset = count - expected.length;
  149 | 
  150 |   for (let i = 0; i < expected.length; i++) {
  151 |     const text = await items.nth(offset + i).innerText();
  152 |     expect(text).toContain(expected[i]);
  153 |   }
  154 | });
  155 | 
  156 | Then(
  157 |   "the word history entry {string} belongs to player {int}",
  158 |   async ({ page }, word, player) => {
  159 |     const entry = page
  160 |       .locator("[data-word-history] [data-word-entry]")
  161 |       .filter({ hasText: word });
  162 | 
  163 |     await expect(entry).toHaveAttribute("data-player", `player${player}`);
  164 |   }
```