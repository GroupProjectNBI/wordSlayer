import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

//Jag har delat upp testerna i kategorier,
//eftersom scenariot beskriver vad den gör så använder den bara det den behöver från steps
//Alltså är detta allt som behövs för att testa alla på homepage
// Vilket innebär att Edvin och Zhantea behöver bara skriva sina scenarion i feature


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
  const heading = page.getByRole('heading', { name: new RegExp(text, 'i') });

  if (await heading.count()) {
    await expect(heading.first()).toBeVisible();
    return;
  }

  await expect(page.getByText(new RegExp(text, 'i'))).toBeVisible();
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
  await expect(page.locator('input')).toHaveValue(value);
});

Given("the input is enabled", async ({ page }) => {
  await page.waitForSelector('input:not([disabled])');
  await page.locator('input:not([disabled])').waitFor({ state: 'visible' });
});

Then('I should be redirected to {string}', async ({ page }, url) => {
  await page.waitForURL(url);
});

Then('I see input {string}', async ({ page }, placeholder) => {
  const input = page.getByPlaceholder(placeholder);
  const visible = await input.isVisible();
  if (!visible) {
    throw new Error(`Expected to see input with placeholder "${placeholder}"`);
  }
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