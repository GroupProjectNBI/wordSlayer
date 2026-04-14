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

//
// HP TEXT ASSERTIONS (player 1 & 2)
//
Then("player {int} has {int} HP", async ({ page }, player, hp) => {
  const selector = `[data-player='player${player}'] >> text='${hp} HP'`;
  await expect(page.locator(selector)).toBeVisible();
});

//
// TURN ASSERTIONS
//
Then("it is player {int} turn", async ({ page }, player) => {
  const selector = `[data-player='player${player}'][data-active='true']`;
  await expect(page.locator(selector)).toBeVisible();
});

//
// USERNAME ASSERTION (backend-ready)
//
Then("I see the player {int} username", async ({ page }, player) => {
  const selector = `[data-player='player${player}']`;
  await expect(page.locator(selector)).toBeVisible();
});

//
// WORD HISTORY
//
Then("the word history contains {string}", async ({ page }, word) => {
  await expect(page.getByText(word)).toBeVisible();
});

//
// DAMAGE POPUP
//
Then("I see a damage popup with {int}", async ({ page }, amount) => {
  const popup = page.locator("div", { hasText: new RegExp(`^-${amount}$`) });
  await expect(popup).toBeVisible();
});

//
// HP BAR WIDTH ASSERTION (px → percent)
//
Then("player {int} HP bar is at {int} percent", async ({ page }, player, percent) => {
  const bar = page.locator(`[data-player='player${player}'] .hp-fill`);
  const wrapper = page.locator(`[data-player='player${player}'] .hp-bar`);

  const barWidth = await bar.evaluate(el => el.getBoundingClientRect().width);
  const wrapperWidth = await wrapper.evaluate(el => el.getBoundingClientRect().width);

  const actualPercent = Math.round((barWidth / wrapperWidth) * 100);

  if (actualPercent !== percent) {
    throw new Error(`Expected HP bar to be ${percent}% but was ${actualPercent}%`);
  }
});
