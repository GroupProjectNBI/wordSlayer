# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\ui\features\playgamepage.feature.spec.js >> PlayGame Page >> Player 1 starts typing and timer begins
- Location: .features-gen\e2e\ui\features\playgamepage.feature.spec.js:17:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input')

```

# Test source

```ts
  1  | import { createBdd } from "playwright-bdd";
  2  | import { expect } from "@playwright/test";
  3  | 
  4  | const { Given, When, Then } = createBdd();
  5  | 
  6  | //
  7  | // TIMER MOCKING
  8  | //
  9  | Given("the timer is mocked", async ({ page }) => {
  10 |   await page.addInitScript(() => {
  11 |     // @ts-ignore
  12 |     window.originalSetInterval = window.setInterval;
  13 |     // @ts-ignore
  14 |     window.originalSetTimeout = window.setTimeout;
  15 | 
  16 |     window.setInterval = () => 0;
  17 |     window.setTimeout = () => 0;
  18 |   });
  19 | });
  20 | 
  21 | When("the timer ticks {int} seconds", async ({ page }, seconds) => {
  22 |   for (let i = 0; i < seconds; i++) {
  23 |     await page.evaluate(() => {
  24 |       window.dispatchEvent(new Event("manual-timer-tick"));
  25 |     });
  26 |   }
  27 | });
  28 | 
  29 | //
  30 | // WORD INPUT
  31 | //
  32 | When("I type the word {string}", async ({ page }, text) => {
> 33 |   await page.locator("input").fill(text);
     |                               ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  34 | });
  35 | 
  36 | When("I submit the word", async ({ page }) => {
  37 |   await page.locator("input").press("Enter");
  38 | });
  39 | 
  40 | //
  41 | // ASSERTIONS
  42 | //
  43 | Then("the timer should show {int}", async ({ page }, value) => {
  44 |   const timer = page.getByText(new RegExp(`^${value}s$`));
  45 |   await expect(timer).toBeVisible();
  46 | });
  47 | 
  48 | Then("player 1 has {int} HP", async ({ page }, hp) => {
  49 |   await expect(page.getByText(`${hp} HP`)).toBeVisible();
  50 | });
  51 | 
  52 | Then("player 2 has {int} HP", async ({ page }, hp) => {
  53 |   await expect(page.getByText(`${hp} HP`)).toBeVisible();
  54 | });
  55 | 
  56 | Then("it is player 1 turn", async ({ page }) => {
  57 |   await expect(page.getByText("PlayerOne")).toBeVisible();
  58 | });
  59 | 
  60 | Then("it is player 2 turn", async ({ page }) => {
  61 |   await expect(page.getByText("PlayerTwo")).toBeVisible();
  62 | });
  63 | 
  64 | Then("the word history contains {string}", async ({ page }, word) => {
  65 |   await expect(page.getByText(word)).toBeVisible();
  66 | });
  67 | 
  68 | Then("I see a damage popup with {int}", async ({ page }, amount) => {
  69 |   await expect(page.getByText(`-${amount}`)).toBeVisible();
  70 | });
  71 | 
```