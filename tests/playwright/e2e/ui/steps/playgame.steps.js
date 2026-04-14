import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

//
// PLAYGAME-SPECIFIC ACTIONS
//

When('I type the word {string}', async ({ page }, text) => {
  await page.locator('input').fill(text);
});

When('I submit the word', async ({ page }) => {
  await page.locator('input').press('Enter');
});

//
// PLAYGAME-SPECIFIC ASSERTIONS
//

Then('I see timer showing {int}', async ({ page }, value) => {
  const timer = page.getByText(new RegExp(`^${value}s$`));
  await expect(timer).toBeVisible();
});

Then('player 1 has {int} HP', async ({ page }, hp) => {
  const hpText = page.getByText(`${hp} HP`);
  await expect(hpText).toBeVisible();
});

Then('player 2 has {int} HP', async ({ page }, hp) => {
  const hpText = page.getByText(`${hp} HP`);
  await expect(hpText).toBeVisible();
});

Then('it is player 1 turn', async ({ page }) => {
  const active = page.getByText('PlayerOne');
  await expect(active).toHaveClass(/text-yellow|ring-yellow/);
});

Then('it is player 2 turn', async ({ page }) => {
  const active = page.getByText('PlayerTwo');
  await expect(active).toHaveClass(/text-yellow|ring-yellow/);
});

Then('the word history contains {string}', async ({ page }, word) => {
  await expect(page.getByText(word)).toBeVisible();
});

Then('I see a damage popup with {int}', async ({ page }, amount) => {
  const popup = page.getByText(`-${amount}`);
  await expect(popup).toBeVisible();
});
