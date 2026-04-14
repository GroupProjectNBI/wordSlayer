# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\ui\features\playgamepage.feature.spec.js >> PlayGame Page >> Player 2 HP bar decreases after taking damage
- Location: .features-gen\e2e\ui\features\playgamepage.feature.spec.js:55:7

# Error details

```
Error: Expected HP bar to be 94% but was 100%
```

# Page snapshot

```yaml
- main [ref=e3]:
  - heading "Word Slayer" [level=1] [ref=e5]
  - generic [ref=e6]:
    - heading "History" [level=2] [ref=e7]
    - generic [ref=e9]:
      - generic [ref=e10]: dragon
      - generic [ref=e11]: "-6"
  - generic [ref=e15]: 100 HP
  - generic [ref=e19]: 94 HP
  - generic:
    - heading "VS" [level=1]
    - generic:
      - generic: 30s
  - textbox "Type your word..." [active] [ref=e21]
  - generic: "-6"
```

# Test source

```ts
  1   | import { createBdd } from "playwright-bdd";
  2   | import { expect } from "@playwright/test";
  3   | 
  4   | const { Given, When, Then } = createBdd();
  5   | 
  6   | //
  7   | // TIMER MOCKING
  8   | //
  9   | Given("the timer is mocked", async ({ page }) => {
  10  |   await page.addInitScript(() => {
  11  |     window.originalSetInterval = window.setInterval;
  12  |     window.originalSetTimeout = window.setTimeout;
  13  | 
  14  |     window.setInterval = () => 0;
  15  |     window.setTimeout = () => 0;
  16  |   });
  17  | });
  18  | 
  19  | When("the timer ticks {int} seconds", async ({ page }, seconds) => {
  20  |   for (let i = 0; i < seconds; i++) {
  21  |     await page.evaluate(() => {
  22  |       window.dispatchEvent(new Event("manual-timer-tick"));
  23  |     });
  24  |   }
  25  | });
  26  | 
  27  | //
  28  | // WORD INPUT
  29  | //
  30  | When("I type the word {string}", async ({ page }, text) => {
  31  |   await page.getByRole("textbox").fill(text);
  32  | });
  33  | 
  34  | When("I submit the word", async ({ page }) => {
  35  |   await page.getByRole("textbox").press("Enter");
  36  | });
  37  | 
  38  | //
  39  | // ASSERTIONS
  40  | //
  41  | Then("the timer should show {int}", async ({ page }, value) => {
  42  |   const timer = page.getByText(new RegExp(`^\\s*${value}s\\s*$`));
  43  |   await expect(timer).toBeVisible();
  44  | });
  45  | 
  46  | //
  47  | // HP TEXT ASSERTIONS (player 1 & 2)
  48  | //
  49  | Then("player {int} has {int} HP", async ({ page }, player, hp) => {
  50  |   const selector = `[data-player='player${player}'] >> text='${hp} HP'`;
  51  |   await expect(page.locator(selector)).toBeVisible();
  52  | });
  53  | 
  54  | //
  55  | // TURN ASSERTIONS
  56  | //
  57  | Then("it is player {int} turn", async ({ page }, player) => {
  58  |   const selector = `[data-player='player${player}'][data-active='true']`;
  59  |   await expect(page.locator(selector)).toBeVisible();
  60  | });
  61  | 
  62  | //
  63  | // USERNAME ASSERTION (backend-ready)
  64  | //
  65  | Then("I see the player {int} username", async ({ page }, player) => {
  66  |   const selector = `[data-player='player${player}']`;
  67  |   await expect(page.locator(selector)).toBeVisible();
  68  | });
  69  | 
  70  | //
  71  | // WORD HISTORY
  72  | //
  73  | Then("the word history contains {string}", async ({ page }, word) => {
  74  |   await expect(page.getByText(word)).toBeVisible();
  75  | });
  76  | 
  77  | //
  78  | // DAMAGE POPUP
  79  | //
  80  | Then("I see a damage popup with {int}", async ({ page }, amount) => {
  81  |   const popup = page.locator("div", { hasText: new RegExp(`^-${amount}$`) });
  82  |   await expect(popup).toBeVisible();
  83  | });
  84  | 
  85  | //
  86  | // HP BAR WIDTH ASSERTION (px → percent)
  87  | //
  88  | Then("player {int} HP bar is at {int} percent", async ({ page }, player, percent) => {
  89  |   const bar = page.locator(`[data-player='player${player}'] .hp-fill`);
  90  |   const wrapper = page.locator(`[data-player='player${player}'] .hp-bar`);
  91  | 
  92  |   const barWidth = await bar.evaluate(el => el.getBoundingClientRect().width);
  93  |   const wrapperWidth = await wrapper.evaluate(el => el.getBoundingClientRect().width);
  94  | 
  95  |   const actualPercent = Math.round((barWidth / wrapperWidth) * 100);
  96  | 
  97  |   if (actualPercent !== percent) {
> 98  |     throw new Error(`Expected HP bar to be ${percent}% but was ${actualPercent}%`);
      |           ^ Error: Expected HP bar to be 94% but was 100%
  99  |   }
  100 | });
  101 | 
```