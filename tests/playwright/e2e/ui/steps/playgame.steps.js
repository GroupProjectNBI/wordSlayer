import { createBdd } from "playwright-bdd";
import { expect } from "@playwright/test";

const { Given, When, Then } = createBdd();

//
// NAVIGATION (used only where referenced in features)
//
Given("I am on the PlayGame page", async ({ page }) => {
  await page.goto("/game/test-session-id?test");
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

Given('I intercept game session response', async ({ page }) => {
  await page.route('**/api/game/test-session-id', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        sessionId: 'test-session-id',
        players: [
          { name: 'PlayerOne', health: 100 },
          { name: 'PlayerTwo', health: 100 }
        ]
      }),
    });
  });
});

Given('I intercept playword response', async ({ page }) => {
  await page.route('**/api/game/test-session-id/playword', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({}),
    });
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

// Overlay test helpers
Given('I intercept game session response with only one player', async ({ page }) => {
  await page.route('**/api/game/test-session-id', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        sessionId: 'test-session-id',
        players: [
          { name: 'PlayerOne', health: 100 }
        ]
      }),
    });
  });
});

When('I simulate a second player joining', async ({ page }) => {
  // Simulate SignalR event by dispatching PlayerJoined event manually
  await page.evaluate(() => {
    // This assumes the frontend listens for PlayerJoined via SignalR
    // We'll dispatch a custom event or call the handler directly if exposed
    // For test, we can trigger the callback if it's on window or dispatch a custom event
    // Here, we simulate the effect by updating the DOM/state as the real event would
    // If your app exposes a global for test, call it here. Otherwise, reload with two players.
    // For now, reload the page with two players (simulate backend update)
    window.location.reload();
  });
});
