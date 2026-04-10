import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
const { Given, When,Then } = createBdd();

Given('I am on the homepage', async ({ page }) => {
  await page.goto('/');
});

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
//Join Game 
Given('I am on the homepage', async ({ page }) => {
  await page.goto('/');
});

When('I click the {string} button', async ({ page }, text) => {
  if (text === "Join Game") {
    // Klickar på knappen på startsidan
    await page.locator('#btn-join-game').click(); 
  } else {
    await page.getByRole('button', { name: text }).click();
  }
});

Then('I should be redirected to the {string} page', async ({ page }, pageName) => {
  if (pageName === "Join Game") {
    await expect(page).toHaveURL(/.*join/);
  }
});