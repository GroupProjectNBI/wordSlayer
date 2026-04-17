# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\ui\features\homepage.feature.spec.js >> HomePage >> User clicks Play Music button
- Location: .features-gen\e2e\ui\features\homepage.feature.spec.js:31:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Play Music' })

```

# Page snapshot

```yaml
- main [ref=e3]:
  - generic [ref=e4]:
    - heading "Word Slayer" [level=1] [ref=e5]
    - generic [ref=e6]:
      - button "New game" [ref=e7]
      - button "Join Game" [ref=e8]
      - button "Rules" [ref=e9]
      - button "Welcome message" [ref=e10]
```

# Test source

```ts
  1  | import { createBdd } from 'playwright-bdd';
  2  | import { expect } from '@playwright/test';
  3  | 
  4  | const { Given, When, Then } = createBdd();
  5  | 
  6  | //Jag har delat upp testerna i kategorier,
  7  | //eftersom scenariot beskriver vad den gör så använder den bara det den behöver från steps
  8  | //Alltså är detta allt som behövs för att testa alla på homepage
  9  | // Vilket innebär att Edvin och Zhantea behöver bara skriva sina scenarion i feature
  10 | 
  11 | 
  12 | //
  13 | // NAVIGATION (Going from one place to another)
  14 | //
  15 | 
  16 | Given('I go to {string}', async ({ page }, url) => {
  17 |   await page.goto(url);
  18 |   await page.waitForURL(url);
  19 | });
  20 | 
  21 | Then('I am on {string}', async ({ page }, url) => {
  22 |   await page.waitForURL(url);
  23 | });
  24 | 
  25 | //
  26 | // ACTIONS (When somethin happens etc pressing a button)
  27 | //
  28 | When('I press button {string}', async ({ page }, text) => {
> 29 |   await page.getByRole('button', { name: text }).click();
     |                                                  ^ Error: locator.click: Test timeout of 30000ms exceeded.
  30 | });
  31 | 
  32 | When('I click the {string} button', async ({ page }, text) => {
  33 |   await page.getByRole('button', { name: text }).click();
  34 | });
  35 | 
  36 | When('I click on text {string}', async ({ page }, text) => {
  37 |   await page.getByText(text).click();
  38 | });
  39 | 
  40 | 
  41 | //
  42 | // ASSERTIONS (for example i'm supposed to see a textfield)
  43 | //
  44 | Then('I see {string}', async ({ page }, text) => {
  45 |   const visible = await page.getByText(text).isVisible();
  46 |   if (!visible) {
  47 |     throw new Error(`Expected to see "${text}"`);
  48 |   }
  49 | });
  50 | 
  51 | Then('I see button {string}', async ({ page }, text) => {
  52 |   const visible = await page.getByRole('button', { name: text }).isVisible();
  53 |   if (!visible) {
  54 |     throw new Error(`Expected to see button "${text}"`);
  55 |   }
  56 | });
  57 | 
  58 | Then('I see input value {string}', async ({ page }, value) => {
  59 |   await expect(page.locator('input')).toHaveValue(value);
  60 | });
  61 | 
  62 | Given("the input is enabled", async ({ page }) => {
  63 |   await page.waitForSelector('input:not([disabled])');
  64 |   await page.locator('input:not([disabled])').waitFor({ state: 'visible' });
  65 | });
  66 | 
  67 | Then('I should be redirected to {string}', async ({ page }, url) => {
  68 |   await page.waitForURL(url);
  69 | });
  70 | 
  71 | Then('I see input {string}', async ({ page }, placeholder) => {
  72 |   const input = page.getByPlaceholder(placeholder);
  73 |   const visible = await input.isVisible();
  74 |   if (!visible) {
  75 |     throw new Error(`Expected to see input with placeholder "${placeholder}"`);
  76 |   }
  77 | });
  78 | 
  79 | Then('I see the overlay', async ({ page }) => {
  80 |   const overlay = page.locator('[data-testid="overlay"]');
  81 |   await expect(overlay).toBeVisible();
  82 | });
  83 | 
  84 | Then('I do not see the overlay', async ({ page }) => {
  85 |   const overlay = page.locator('[data-testid="overlay"]');
  86 |   await expect(overlay).toHaveCount(0);
  87 | });
```