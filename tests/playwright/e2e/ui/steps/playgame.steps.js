import { createBdd } from "playwright-bdd";
import { expect } from "@playwright/test";

const { Given, When, Then } = createBdd();

//
// TIMER MOCKING
//
Given("the timer is mocked", async ({ page }) => {
  await page.addInitScript(() => {
    // @ts-ignore
    window.originalSetInterval = window.setInterval;
    // @ts-ignore
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


When("I type the word {string}", async ({ page }, text) => {
  await page.getByRole("textbox").fill(text);
});

When("I submit the word", async ({ page }) => {
  await page.getByRole("textbox").press("Enter");
});

//
// ASSERTIONS
//
Then("the timer should show {int}", async ({ page }, value) => {
  const timer = page.getByText(new RegExp(`^\\s*${value}s\\s*$`));
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
  const popup = page.locator("div", { hasText: new RegExp(`^-${amount}$`) });
  await expect(popup).toBeVisible();
});
Then("player {int} HP bar is at {int} percent", async ({ page }, player, percent) => {
  const selector = player === 1
    ? "div[data-player='player1'] .hp-fill"
    : "div[data-player='player2'] .hp-fill";

  const bar = page.locator(selector);
  await expect(bar).toHaveCSS("width", `${percent}%`);
});
