import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

Given("I am on the PlayGame page", async ({ page }) => {
  await page.goto("/play/");
});

Then("");