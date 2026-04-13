# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\ui\features\rulespage.feature.spec.js >> RulesPage >> User goes from rulespage to homepage
- Location: .features-gen\e2e\ui\features\rulespage.feature.spec.js:12:7

# Error details

```
Error: Expected to see "Game Rules"
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
  20 | //
  21 | // ACTIONS (When somethin happens etc pressing a button)
  22 | //
  23 | When('I press button {string}', async ({ page }, text) => {
  24 |   await page.getByRole('button', { name: text }).click();
  25 | });
  26 | 
  27 | //
  28 | // ASSERTIONS (for example i'm supposed to see a textfield)
  29 | //
  30 | Then('I see {string}', async ({ page }, text) => {
  31 |   const visible = await page.getByText(text).isVisible();
  32 |   if (!visible) {
> 33 |     throw new Error(`Expected to see "${text}"`);
     |           ^ Error: Expected to see "Game Rules"
  34 |   }
  35 | });
  36 | 
  37 | Then('I see button {string}', async ({ page }, text) => {
  38 |   const visible = await page.getByRole('button', { name: text }).isVisible();
  39 |   if (!visible) {
  40 |     throw new Error(`Expected to see button "${text}"`);
  41 |   }
  42 | });
  43 | 
  44 | Then('I see input value {string}', async ({ page }, value) => {
  45 |   await expect(page.locator('input')).toHaveValue(value);
  46 | });
```