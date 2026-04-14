import { createBdd } from "playwright-bdd";
import { expect } from "@playwright/test";

const { Given, When, Then } = createBdd();

//
// TIMER MOCKING
//
Given("the timer is mocked", async ({ page }) => {
  await page.addInitScript(() => {
    window.originalSetInterval = window.setInterval;
    window.originalSetTimeout = window.setTimeout;

    window.setInterval = () => 0;
    window.setTimeout = () => 0;
  });
});

When("the timer ticks {int} seconds", async ({ page }, seconds) => {
  for (let i = 0; i < seconds; i++) {
    await page.evaluate(() => {
      window.dispatchEvent(new Event("manual-timer-tick"));
    });
  }
});

//
// WORD INPUT
//
When("I type the word {string}", async ({ page }, text) => {
  await page.locator("input").fill(text);
});

When("I submit the word", async ({ page }) => {
  await page.locator("input").press("Enter");
});

//
// ASSERTIONS
//
Then("I see timer showing {int}", async ({ page }, value) => {
  const timer = page.getByText(new RegExp(`^${value}s$`));
  await expect(timer).toBeVisible();
});

Then("player 1 has {int} HP", async ({ page }, hp) => {
  await expect(page.getByText(`${hp} HP`)).toBeVisible();
});

Then("player 2 has {int} HP", async ({ page }, hp) => {
  await expect(page.getByText(`${hp} HP`)).toBeVisible();
});

Then("it is player 1 turn", async ({ page }) => {
  await expect(page.getByText("PlayerOne")).toBeVisible();
});

Then("it is player 2 turn", async ({ page }) => {
  await expect(page.getByText("PlayerTwo")).toBeVisible();
});

Then("the word history contains {string}", async ({ page }, word) => {
  await expect(page.getByText(word)).toBeVisible();
});

Then("I see a damage popup with {int}", async ({ page }, amount) => {
  await expect(page.getByText(`-${amount}`)).toBeVisible();
});
