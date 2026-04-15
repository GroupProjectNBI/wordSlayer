import { createBdd } from "playwright-bdd";
import { expect } from "@playwright/test";

const { Given, When, Then } = createBdd();

//
// NAVIGATION (used only where referenced in features)
//
Given("I am on the PlayGame page", async ({ page }) => {
  await page.goto("/game?test");
});

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
  const input = page.getByRole("textbox");
  await input.focus();
  await input.press("Enter");
});

//
// ASSERTIONS
//
Then("the timer should show {int}", async ({ page }, value) => {
  const timer = page.getByText(new RegExp(`^\\s*${value}s\\s*$`));
  await expect(timer).toBeVisible();
});

//
// HP TEXT ASSERTIONS
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
// USERNAME ASSERTION
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
// HP BAR WIDTH ASSERTION (wait for animation, then measure)
//
Then("player {int} HP bar is at {int} percent", async ({ page }, player, percent) => {
  // 1. Wait for HP text to show the expected value
  await expect(
    page.locator(`[data-player='player${player}'] >> text='${percent} HP'`)
  ).toBeVisible();

  // 2. Give the 300ms transition time to settle
  await page.waitForTimeout(400);

  // 3. Measure bar and wrapper
  const bar = page.locator(`[data-player='player${player}'] .hp-fill`);
  const wrapper = page.locator(`[data-player='player${player}'] .hp-bar`);

  const barWidth = await bar.evaluate(el => el.getBoundingClientRect().width);
  const wrapperWidth = await wrapper.evaluate(el => el.getBoundingClientRect().width);

  const actualPercent = Math.round((barWidth / wrapperWidth) * 100);

  const diff = Math.abs(actualPercent - percent);
  if (diff > 1) {
    throw new Error(`Expected HP bar to be ${percent}% but was ${actualPercent}%`);
  }
});
//
// WORD HISTORY ASSERTIONS
//
Then("the word history should be empty", async ({ page }) => {
  const items = page.locator("[data-word-history] [data-word-entry]");
  await expect(items).toHaveCount(0);
});

Then("the word history contains {string}", async ({ page }, word) => {
  await expect(
    page.locator("[data-word-history]").getByText(word)
  ).toBeVisible();
});

Then("the word history should show:", async ({ page }, table) => {
  const expected = table.rows().flat();
  const items = page.locator("[data-word-history] [data-word-entry]");

  await expect(items).toHaveCount(expected.length);

  for (let i = 0; i < expected.length; i++) {
    const text = await items.nth(i).innerText();
    expect(text).toContain(expected[i]);
  }
});

Then(
  "the word history entry {string} belongs to player {int}",
  async ({ page }, word, player) => {
    const entry = page
      .locator("[data-word-history] [data-word-entry]")
      .filter({ hasText: word });

    await expect(entry).toHaveAttribute("data-player", `player${player}`);
  }
);

Then(
  "the word history shows damage {int} for {string}",
  async ({ page }, damage, word) => {
    const entry = page
      .locator("[data-word-history] [data-word-entry]")
      .filter({ hasText: word });

    await expect(entry).toHaveAttribute("data-damage", `${damage}`);
  }
);
