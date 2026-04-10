import { createBdd } from 'playwright-bdd';

const { Given, When, Then } = createBdd();

//Jag har delat upp testerna i kategorier,
//eftersom scenariot beskriver vad den gör så använder den bara det den behöver från steps
//Alltså är detta allt som behövs för att testa alla på homepage
// Vilket innebär att Edvin och Zhantea behöver bara skriva sina scenarion i feature


//
// NAVIGATION (Going from one place to another)
//
Given('I am on the homepage', async ({ page }) => {
  await page.goto('/');
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