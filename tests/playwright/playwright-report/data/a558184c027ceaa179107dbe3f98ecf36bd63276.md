# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\ui\features\playgamepage.feature.spec.js >> PlayGame Page >> User sees the PlayGame page
- Location: .features-gen\e2e\ui\features\playgamepage.feature.spec.js:6:7

# Error details

```
Error: locator.isVisible: Error: strict mode violation: getByText('HP') resolved to 2 elements:
    1) <div class="text-sm mt-1">100 HP</div> aka getByText('HP').first()
    2) <div class="text-sm mt-1">100 HP</div> aka getByText('HP').nth(1)

Call log:
    - checking visibility of getByText('HP')

```

# Page snapshot

```yaml
- main [ref=e3]:
  - heading "Word Slayer" [level=1] [ref=e5]
  - generic [ref=e6]:
    - heading "History" [level=2] [ref=e7]
    - generic [ref=e9]: No words yet
  - generic [ref=e10]:
    - generic [ref=e11]: PlayerOne
    - generic [ref=e14]: 100 HP
  - generic [ref=e15]:
    - generic [ref=e16]: PlayerTwo
    - generic [ref=e19]: 100 HP
  - generic:
    - heading "VS" [level=1]
    - generic:
      - generic: 30s
  - textbox "Type your word..." [ref=e21]
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
  16 | Then('I am on {string}', async ({ page }, url) => {
  17 |   await page.waitForURL(url);
  18 | });
  19 | 
  20 | 
  21 | // Navigation – ny, unik text för att undvika krockar
  22 | Given('I go to {string}', async ({ page }, url) => {
  23 |   await page.goto(url);
  24 |   await page.waitForURL(url);
  25 | });
  26 | 
  27 | //
  28 | // ACTIONS (When somethin happens etc pressing a button)
  29 | //
  30 | When('I press button {string}', async ({ page }, text) => {
  31 |   await page.getByRole('button', { name: text }).click();
  32 | });
  33 | 
  34 | //
  35 | // ASSERTIONS (for example i'm supposed to see a textfield)
  36 | //
  37 | Then('I see {string}', async ({ page }, text) => {
> 38 |   const visible = await page.getByText(text).isVisible();
     |                                              ^ Error: locator.isVisible: Error: strict mode violation: getByText('HP') resolved to 2 elements:
  39 |   if (!visible) {
  40 |     throw new Error(`Expected to see "${text}"`);
  41 |   }
  42 | });
  43 | 
  44 | Then('I see button {string}', async ({ page }, text) => {
  45 |   const visible = await page.getByRole('button', { name: text }).isVisible();
  46 |   if (!visible) {
  47 |     throw new Error(`Expected to see button "${text}"`);
  48 |   }
  49 | });
  50 | 
  51 | Then('I see input value {string}', async ({ page }, value) => {
  52 |   await expect(page.locator('input')).toHaveValue(value);
  53 | });
  54 | Given("the input is enabled", async ({ page }) => {
  55 |   await page.waitForSelector('input:not([disabled])');
  56 | });
  57 | 
  58 | 
  59 | //
  60 | // JOIN GAME SUPPORT STEPS
  61 | //
  62 | //
  63 | // JOIN GAME SUPPORT STEPS
  64 | //
  65 | 
  66 | When('I click the {string} button', async ({ page }, text) => {
  67 |   await page.getByRole('button', { name: text }).click();
  68 | });
  69 | 
  70 | Then('I should be redirected to {string}', async ({ page }, url) => {
  71 |   await page.waitForURL(url);
  72 | });
  73 | 
  74 | 
  75 | 
  76 | 
  77 | 
  78 | 
  79 | 
  80 | 
  81 | 
```