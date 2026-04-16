# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\ui\features\playgamepage.feature.spec.js >> PlayGame Page >> Overlay is visible when only one player is present and disappears when two players are present
- Location: .features-gen\e2e\ui\features\playgamepage.feature.spec.js:81:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('div').filter({ hasText: 'Väntar på att en motståndare ska ansluta' })
Expected: visible
Error: strict mode violation: locator('div').filter({ hasText: 'Väntar på att en motståndare ska ansluta' }) resolved to 4 elements:
    1) <div id="root">…</div> aka locator('#root')
    2) <div>…</div> aka getByText('Word SlayerHistoryNo words yetPlayerOne100 HPPlayerTwo100 HPVS30sVäntar på att')
    3) <div>…</div> aka locator('div').filter({ hasText: 'Väntar på att en motståndare' }).nth(2)
    4) <div>…</div> aka getByText('Väntar på att en motståndare ska ansluta... ⏳Test: Motståndare anslöt')

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('div').filter({ hasText: 'Väntar på att en motståndare ska ansluta' })

```

# Page snapshot

```yaml
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
  - textbox "Type your word..." [ref=e24]
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
  29 |   await page.getByRole('button', { name: text }).click();
  30 | });
  31 | 
  32 | When('I click the {string} button', async ({ page }, text) => {
  33 |   await page.getByRole('button', { name: text }).click();
  34 | });
  35 | 
  36 | //
  37 | // ASSERTIONS (for example i'm supposed to see a textfield)
  38 | //
  39 | Then('I see {string}', async ({ page }, text) => {
  40 |   const visible = await page.getByText(text).isVisible();
  41 |   if (!visible) {
  42 |     throw new Error(`Expected to see "${text}"`);
  43 |   }
  44 | });
  45 | 
  46 | Then('I see button {string}', async ({ page }, text) => {
  47 |   const visible = await page.getByRole('button', { name: text }).isVisible();
  48 |   if (!visible) {
  49 |     throw new Error(`Expected to see button "${text}"`);
  50 |   }
  51 | });
  52 | 
  53 | Then('I see input value {string}', async ({ page }, value) => {
  54 |   await expect(page.locator('input')).toHaveValue(value);
  55 | });
  56 | 
  57 | Given("the input is enabled", async ({ page }) => {
  58 |   await page.waitForSelector('input:not([disabled])');
  59 |   await page.locator('input:not([disabled])').waitFor({ state: 'visible' });
  60 | });
  61 | 
  62 | Then('I should be redirected to {string}', async ({ page }, url) => {
  63 |   await page.waitForURL(url);
  64 | });
  65 | 
  66 | Then('I see input {string}', async ({ page }, placeholder) => {
  67 |   const input = page.getByPlaceholder(placeholder);
  68 |   const visible = await input.isVisible();
  69 |   if (!visible) {
  70 |     throw new Error(`Expected to see input with placeholder "${placeholder}"`);
  71 |   }
  72 | });
  73 | 
  74 | Then('I see the overlay', async ({ page }) => {
  75 |   // Looks for the overlay message or overlay container
  76 |   const overlay = await page.locator('div', { hasText: 'Väntar på att en motståndare ska ansluta' });
> 77 |   await expect(overlay).toBeVisible();
     |                         ^ Error: expect(locator).toBeVisible() failed
  78 | });
  79 | 
  80 | Then('I do not see the overlay', async ({ page }) => {
  81 |   // Overlay should not be visible
  82 |   const overlay = page.locator('div', { hasText: 'Väntar på att en motståndare ska ansluta' });
  83 |   await expect(overlay).toHaveCount(0);
  84 | });
```