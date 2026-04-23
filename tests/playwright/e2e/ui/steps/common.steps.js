import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

//
// NAVIGATION (Going from one place to another)
//

Given('I go to {string}', async ({ page }, url) => {
  await page.goto(url);
  await page.waitForURL(url);
});

Then('I am on {string}', async ({ page }, url) => {
  await page.waitForURL(url);
});

//
// ACTIONS (When somethin happens etc pressing a button)
//
When('I press button {string}', async ({ page }, text) => {
  if (text === 'New game' || text === 'New Game') {
    await page.locator('#btn-new-game').click();
    return;
  }

  if (text === 'Join Game') {
    await page.locator('#btn-join-game').click();
    return;
  }

  if (text === 'Rules') {
    await page.locator('#btn-rules').click();
    return;
  }

  await page.getByRole('button', { name: text }).click();
});

When('I click the {string} button', async ({ page }, text) => {
  if (text === 'New game' || text === 'New Game' || text === 'Nytt spel') {
    await page.locator('#btn-new-game').click();
    return;
  }

  if (text === 'Join Game' || text === 'Gå med i spel') {
    await page.locator('#btn-join-game').click();
    return;
  }

  if (text === 'Rules' || text === 'Regler') {
    await page.locator('#btn-rules').click();
    return;
  }

  await page.getByRole('button', { name: text }).click();
});

//
// ASSERTIONS (for example i'm supposed to see a textfield)
//
Then('I see {string}', async ({ page }, text) => {
  // Regex 'i' gör sökningen oberoende av stora/små bokstäver (från dev-grenen)
  const regex = new RegExp(text, 'i');

  const heading = page.getByRole('heading', { name: regex });
  const plainText = page.getByText(regex);

  // Playwrights .or() låter oss söka efter båda varianterna samtidigt,
  await expect(heading.or(plainText).first()).toBeVisible();
});

Then('I see button {string}', async ({ page }, text) => {
  if (text === 'New game' || text === 'New Game' || text === 'Nytt spel') {
    await expect(page.locator('#btn-new-game')).toBeVisible();
    return;
  }

  if (text === 'Join Game' || text === 'Gå med i spel') {
    await expect(page.locator('#btn-join-game')).toBeVisible();
    return;
  }

  if (text === 'Rules' || text === 'Regler') {
    await expect(page.locator('#btn-rules')).toBeVisible();
    return;
  }

  await expect(page.getByRole('button', { name: text })).toBeVisible();
});

Then('I see input value {string}', async ({ page }, value) => {
  // Letar upp det första input-fältet på sidan och verifierar dess inmatade värde
  const input = page.locator('input').first();
  await expect(input).toHaveValue(value);
});

Then('I see turn indicator {string}', async ({ page }, text) => {
  // expect() väntar automatiskt tills React har hunnit uppdatera DOM:en!
  const turnIndicator = page.getByTestId('turn-indicator').filter({ hasText: text });
  await expect(turnIndicator).toBeVisible();
});

Given("the input is enabled", async ({ page }) => {
  await page.waitForSelector('input:not([disabled])');
  await page.locator('input:not([disabled])').waitFor({ state: 'visible' });
});

Then('I should be redirected to {string}', async ({ page }, url) => {
  await page.waitForURL(url);
});

Then('I see input {string}', async ({ page }, placeholder) => {
  // FIX: Bytte ut den manuella if(!visible)-satsen mot expect för att förhindra framtida race-conditions!
  const input = page.getByPlaceholder(placeholder);
  await expect(input).toBeVisible();
});

Then('I see the overlay', async ({ page }) => {
  const overlay = page.locator('[data-testid="overlay"]');
  await expect(overlay).toBeVisible();
});

Then('I do not see the overlay', async ({ page }) => {
  const overlay = page.locator('[data-testid="overlay"]');
  await expect(overlay).toHaveCount(0);
});

Then('I see the button {string}', async ({ page }, name) => {
  const button = page.getByRole('button', { name });
  await expect(button).toBeVisible();
});