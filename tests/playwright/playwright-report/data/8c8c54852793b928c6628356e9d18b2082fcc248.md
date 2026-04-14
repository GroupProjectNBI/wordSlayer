# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\ui\features\playgamepage.feature.spec.js >> PlayGame Page >> Timer runs out and turn switches
- Location: .features-gen\e2e\ui\features\playgamepage.feature.spec.js:36:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/^30s$/)
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByText(/^30s$/)

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
  33 |   await page.getByRole("textbox").fill(text);
  34 | });
  35 | 
  36 | When("I submit the word", async ({ page }) => {
  37 |   await page.getByRole("textbox").press("Enter");
  38 | });
  39 | 
  40 | //
  41 | // ASSERTIONS
  42 | //
  43 | Then("the timer should show {int}", async ({ page }, value) => {
  44 |   // Timer.tsx visar exakt: 30s
  45 |   const timer = page.getByText(new RegExp(`^${value}s$`));
> 46 |   await expect(timer).toBeVisible();
     |                       ^ Error: expect(locator).toBeVisible() failed
  47 | });
  48 | 
  49 | Then("player 1 has {int} HP", async ({ page }, hp) => {
  50 |   await expect(page.getByText(`${hp} HP`)).toBeVisible();
  51 | });
  52 | 
  53 | Then("player 2 has {int} HP", async ({ page }, hp) => {
  54 |   await expect(page.getByText(`${hp} HP`)).toBeVisible();
  55 | });
  56 | 
  57 | Then("it is player 1 turn", async ({ page }) => {
  58 |   await expect(page.getByText("PlayerOne")).toBeVisible();
  59 | });
  60 | 
  61 | Then("it is player 2 turn", async ({ page }) => {
  62 |   await expect(page.getByText("PlayerTwo")).toBeVisible();
  63 | });
  64 | 
  65 | Then("the word history contains {string}", async ({ page }, word) => {
  66 |   await expect(page.getByText(word)).toBeVisible();
  67 | });
  68 | 
  69 | Then("I see a damage popup with {int}", async ({ page }, amount) => {
  70 |   await expect(page.getByText(`-${amount}`)).toBeVisible();
  71 | });
  72 | 
```