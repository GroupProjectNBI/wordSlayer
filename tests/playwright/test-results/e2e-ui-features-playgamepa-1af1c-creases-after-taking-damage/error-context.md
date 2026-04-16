# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\ui\features\playgamepage.feature.spec.js >> PlayGame Page >> Player 2 HP bar decreases after taking damage
- Location: .features-gen\e2e\ui\features\playgamepage.feature.spec.js:55:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-player=\'player2\']').locator('text=\'94 HP\'')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('[data-player=\'player2\']').locator('text=\'94 HP\'')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - main [ref=e4]:
    - heading "Word Slayer" [level=1] [ref=e6]
    - generic [ref=e7]:
      - heading "History" [level=2] [ref=e8]
      - generic [ref=e10]: No words yet
    - generic [ref=e11]:
      - generic [ref=e12]: PlayerOne
      - generic [ref=e16]: 100 HP
    - generic [ref=e17]:
      - generic [ref=e18]: PlayerTwo
      - generic [ref=e22]: 100 HP
    - generic:
      - heading "VS" [level=1]
      - generic:
        - generic: 30s
    - textbox "Type your word..." [active] [ref=e24]: dragon
  - generic [ref=e26]:
    - paragraph [ref=e27]: Väntar på att en motståndare ska ansluta... ⏳
    - 'button "Test: Motståndare anslöt" [ref=e29]'
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
  26  | When("the timer ticks {int} seconds", async ({ page }, seconds) => {
  27  |   for (let i = 0; i < seconds; i++) {
  28  |     await page.evaluate(() => {
  29  |       window.dispatchEvent(new Event("manual-timer-tick"));
  30  |     });
  31  |   }
  32  | });
  33  | 
  34  | //
  35  | // WORD INPUT
  36  | //
  37  | When("I type the word {string}", async ({ page }, text) => {
  38  |   await page.getByRole("textbox").fill(text);
  39  | });
  40  | 
  41  | When("I submit the word", async ({ page }) => {
  42  |   const input = page.getByRole("textbox");
  43  |   await input.focus();
  44  |   await input.press("Enter");
  45  | });
  46  | 
  47  | //
  48  | // ASSERTIONS
  49  | //
  50  | Then("the timer should show {int}", async ({ page }, value) => {
  51  |   const timer = page.getByText(new RegExp(`^\\s*${value}s\\s*$`));
  52  |   await expect(timer).toBeVisible();
  53  | });
  54  | 
  55  | //
  56  | // HP TEXT ASSERTIONS
  57  | //
  58  | Then("player {int} has {int} HP", async ({ page }, player, hp) => {
  59  |   const selector = `[data-player='player${player}'] >> text='${hp} HP'`;
> 60  |   await expect(page.locator(selector)).toBeVisible();
      |                                        ^ Error: expect(locator).toBeVisible() failed
  61  | });
  62  | 
  63  | //
  64  | // TURN ASSERTIONS
  65  | //
  66  | Then("it is player {int} turn", async ({ page }, player) => {
  67  |   const selector = `[data-player='player${player}'][data-active='true']`;
  68  |   await expect(page.locator(selector)).toBeVisible();
  69  | });
  70  | 
  71  | //
  72  | // USERNAME ASSERTION
  73  | //
  74  | Then("I see the player {int} username", async ({ page }, player) => {
  75  |   const selector = `[data-player='player${player}']`;
  76  |   await expect(page.locator(selector)).toBeVisible();
  77  | });
  78  | 
  79  | //
  80  | // WORD HISTORY
  81  | //
  82  | Then("the word history contains {string}", async ({ page }, word) => {
  83  |   await expect(page.getByText(word)).toBeVisible();
  84  | });
  85  | 
  86  | //
  87  | // DAMAGE POPUP
  88  | //
  89  | Then("I see a damage popup with {int}", async ({ page }, amount) => {
  90  |   const popup = page.locator("div", { hasText: new RegExp(`^-${amount}$`) });
  91  |   await expect(popup).toBeVisible();
  92  | });
  93  | 
  94  | //
  95  | // HP BAR WIDTH ASSERTION (wait for animation, then measure)
  96  | //
  97  | Then("player {int} HP bar is at {int} percent", async ({ page }, player, percent) => {
  98  |   // 1. Wait for HP text to show the expected value
  99  |   await expect(
  100 |     page.locator(`[data-player='player${player}'] >> text='${percent} HP'`)
  101 |   ).toBeVisible();
  102 | 
  103 |   // 2. Give the 300ms transition time to settle
  104 |   await page.waitForTimeout(400);
  105 | 
  106 |   // 3. Measure bar and wrapper
  107 |   const bar = page.locator(`[data-player='player${player}'] .hp-fill`);
  108 |   const wrapper = page.locator(`[data-player='player${player}'] .hp-bar`);
  109 | 
  110 |   const barWidth = await bar.evaluate(el => el.getBoundingClientRect().width);
  111 |   const wrapperWidth = await wrapper.evaluate(el => el.getBoundingClientRect().width);
  112 | 
  113 |   const actualPercent = Math.round((barWidth / wrapperWidth) * 100);
  114 | 
  115 |   const diff = Math.abs(actualPercent - percent);
  116 |   if (diff > 1) {
  117 |     throw new Error(`Expected HP bar to be ${percent}% but was ${actualPercent}%`);
  118 |   }
  119 | });
  120 | 
```