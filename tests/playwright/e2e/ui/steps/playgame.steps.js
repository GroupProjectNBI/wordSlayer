import { createBdd } from "playwright-bdd";
import { expect } from "@playwright/test";

const { Given, When, Then } = createBdd();

//
// ─────────────────────────────────────────────
//   BACKEND INTERCEPTS
// ─────────────────────────────────────────────
//

Given("I intercept game session response", async ({ page }) => {
  await page.route("**/api/game/test-session-id", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        sessionId: "test-session-id",
        players: [
          { name: "PlayerOne", health: 100 },
          { name: "PlayerTwo", health: 100 }
        ]
      }),
    });
  });
});

Given("I intercept playword response", async ({ page }) => {
  await page.route("**/api/game/test-session-id/playword", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({}),
    });
  });
});

Given(
  "I intercept game session response with only one player",
  async ({ page }) => {
    await page.route("**/api/game/test-session-id", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          sessionId: "test-session-id",
          players: [{ name: "PlayerOne", health: 100 }]
        }),
      });
    });
  }
);

//
// ─────────────────────────────────────────────
//   TIMER MOCKING
// ─────────────────────────────────────────────
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
// ─────────────────────────────────────────────
//   WORD INPUT
// ─────────────────────────────────────────────
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
// ─────────────────────────────────────────────
//   ASSERTIONS: TIMER
// ─────────────────────────────────────────────
//

Then("the timer should show {int}", async ({ page }, value) => {
  const timer = page.getByText(new RegExp(`^\\s*${value}s\\s*$`));
  await expect(timer).toBeVisible();
});

//
// ─────────────────────────────────────────────
//   ASSERTIONS: HP + TURN + HIGHLIGHT
// ─────────────────────────────────────────────
//

Then("player {int} has {int} HP", async ({ page }, player, hp) => {
  const selector = `[data-player='player${player}'] >> text='${hp} HP'`;
  await expect(page.locator(selector)).toBeVisible();
});

Then("it is player {int} turn", async ({ page }, player) => {
  const selector = `[data-player='player${player}'][data-active='true']`;
  await expect(page.locator(selector)).toBeVisible();
});

// NEW: highlight test
Then("player {int} is highlighted", async ({ page }, player) => {
  const locator = page.locator(`[data-player='player${player}']`);
  await expect(locator).toHaveAttribute("data-active", "true");
});

//
// ─────────────────────────────────────────────
//   ASSERTIONS: DAMAGE POPUPS + HP BAR
// ─────────────────────────────────────────────
//

Then("I see a damage popup with {int}", async ({ page }, amount) => {
  const popup = page.locator("div", {
    hasText: new RegExp(`^-${amount}$`)
  });
  await expect(popup).toBeVisible();
});

Then(
  "player {int} HP bar is at {int} percent",
  async ({ page }, player, percent) => {
    await expect(
      page.locator(`[data-player='player${player}'] >> text='${percent} HP'`)
    ).toBeVisible();

    await page.waitForTimeout(400);

    const bar = page.locator(`[data-player='player${player}'] .hp-fill`);
    const wrapper = page.locator(`[data-player='player${player}'] .hp-bar`);

    const barWidth = await bar.evaluate(el => el.getBoundingClientRect().width);
    const wrapperWidth = await wrapper.evaluate(el => el.getBoundingClientRect().width);

    const actualPercent = Math.round((barWidth / wrapperWidth) * 100);

    const diff = Math.abs(actualPercent - percent);
    if (diff > 1) {
      throw new Error(
        `Expected HP bar to be ${percent}% but was ${actualPercent}%`
      );
    }
  }
);

//
// ─────────────────────────────────────────────
//   OVERLAY (handled in common.steps.js)
// ─────────────────────────────────────────────
//

When("I simulate a second player joining", async ({ page }) => {
  await page.evaluate(() => {
    window.location.reload();
  });
});

//
// ─────────────────────────────────────────────
//   WORD HISTORY
// ─────────────────────────────────────────────
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

  const count = await items.count();
  if (count < expected.length) {
    throw new Error(
      `Expected at least ${expected.length} word history entries, but found ${count}`
    );
  }

  const offset = count - expected.length;

  for (let i = 0; i < expected.length; i++) {
    const text = await items.nth(offset + i).innerText();
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

//
// ─────────────────────────────────────────────
//   GAME MUSIC MUTE BUTTON
// ─────────────────────────────────────────────
//

When("I toggle the music mute button", async ({ page }) => {
  const button = page.getByRole("button", { name: /Music/i });
  await button.click();
});

Then("the music mute button shows {string}", async ({ page }, label) => {
  const button = page.getByRole("button", { name: label });
  await expect(button).toBeVisible();
});
