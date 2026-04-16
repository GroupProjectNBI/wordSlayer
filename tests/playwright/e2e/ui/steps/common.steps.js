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
  await page.getByRole('button', { name: text }).click();
});

When('I click the {string} button', async ({ page }, text) => {
  await page.getByRole('button', { name: text }).click();
});

//
// ASSERTIONS (for example i'm supposed to see a textfield)
//
Then('I see {string}', async ({ page }, text) => {
  const visible = await page.getByText(text).isVisible();
  if (!visible) {
    throw new Error(`Expected to see "${text}"`);
  }
});

Then('I see button {string}', async ({ page }, text) => {
  const visible = await page.getByRole('button', { name: text }).isVisible();
  if (!visible) {
    throw new Error(`Expected to see button "${text}"`);
  }
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