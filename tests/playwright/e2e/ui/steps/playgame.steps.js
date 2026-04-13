import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

//
// NAVIGATION
//
Given('I am on {string}', async ({ page }, url) => {
  await page.goto(url);
  await page.waitForURL(url);
});

Then('I am on {string}', async ({ page }, url) => {
  await page.waitForURL(url);
});

//
// ACTIONS
//
When('I press button {string}', async ({ page }, text) => {
  await page.getByRole('button', { name: text }).click();
});

//
// ASSERTIONS
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

Then('I see input {string}', async ({ page }, placeholder) => {
  const input = page.getByPlaceholder(placeholder);
  const visible = await input.isVisible();
  if (!visible) {
    throw new Error(`Expected to see input with placeholder "${placeholder}"`);
  }
});

Then('I see input value {string}', async ({ page }, value) => {
  await expect(page.locator('input')).toHaveValue(value);
});
