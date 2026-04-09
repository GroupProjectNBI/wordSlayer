import { createBdd } from 'playwright-bdd';
const { Given, Then } = createBdd();

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