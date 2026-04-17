import { createBdd } from "playwright-bdd";
import { expect } from "@playwright/test";

const { Given, When, Then } = createBdd();
const VALID_GUID = "00000000-0000-0000-0000-000000000000";

//
// ─────────────────────────────────────────────
//   1. IDENTITET
// ─────────────────────────────────────────────
//

Given('I am logged in as {string}', async ({ page }, playerName) => {
  await page.addInitScript((name) => {
    window.sessionStorage.setItem("playerName", name);
  }, playerName);
});

//
// ─────────────────────────────────────────────
//   2. SIGNALR SIMULERING
// ─────────────────────────────────────────────
//

When(
  'the server signals turn changed to {string} with HP {int} and {int}',
  async ({ page }, nextTurn, p1Hp, p2Hp) => {
    await page.evaluate(({ nextTurn, p1Hp, p2Hp }) => {
      window.dispatchEvent(
        new CustomEvent("signalr-turn-changed", {
          detail: { nextTurn, p1Hp, p2Hp }
        })
      );
    }, { nextTurn, p1Hp, p2Hp });
  }
);

//
// ─────────────────────────────────────────────
//   3. API MOCKING
// ─────────────────────────────────────────────
//

Given('I intercept game session response', async ({ page }) => {
  await page.route(`**/api/game/${VALID_GUID}`, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        sessionId: VALID_GUID,
        players: [
          { name: 'Player 1', health: 100 },
          { name: 'Player 2', health: 100 }
        ],
        currentTurn: 'player1'
      }),
    });
  });
});

Given('I intercept game session response with only one player', async ({ page }) => {
  await page.route(`**/api/game/${VALID_GUID}`, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        sessionId: VALID_GUID,
        players: [{ name: 'Player 1', health: 100 }],
        currentTurn: 'player1'
      }),
    });
  });
});

Given('I intercept playword response', async ({ page }) => {
  await page.route(`**/api/game/${VALID_GUID}/playword`, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ message: "Success" }),
    });
  });
});

//
// ─────────────────────────────────────────────
//   4. TIMER MOCKING
// ─────────────────────────────────────────────
//

Given("the timer is mocked", async ({ page }) => {
  await page.addInitScript(() => {
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
//   5. INPUT
// ─────────────────────────────────────────────
//

Given("the game input is enabled", async ({ page }) => {
  const input = page.getByRole("textbox");
  await expect(input).toBeEnabled({ timeout: 10000 });
});

When("I type the word {string}", async ({ page }, text) => {
  await page.getByRole("textbox").fill(text);
});

When("I submit the word", async ({ page }) => {
  await page.getByRole("textbox").press("Enter");
});

//
// ─────────────────────────────────────────────
//   6. TIMER + HP + TURN + HIGHLIGHT
// ─────────────────────────────────────────────
//

Then("the timer should show {int}", async ({ page }, value) => {
  const timer = page.getByText(new RegExp(`^\\s*${value}s\\s*$`));
  await expect(timer).toBeVisible();
});

Then("player {int} has {int} HP", async ({ page }, player, hp) => {
  await expect(
    page.locator(`[data-player='player${player}'] >> text='${hp} HP'`)
  ).toBeVisible();
});

Then("it is player {int} turn", async ({ page }, player) => {
  await expect(
    page.locator(`[data-player='player${player}'][data-active='true']`)
  ).toBeVisible();
});

Then("player {int} is highlighted", async ({ page }, player) => {
  await expect(
    page.locator(`[data-player='player${player}']`)
  ).toHaveAttribute("data-active", "true");
});

//
// ─────────────────────────────────────────────
//   7. DAMAGE POPUP
// ─────────────────────────────────────────────
//

Then("I see a damage popup with {int}", async ({ page }, amount) => {
  const popup = page.locator("div").filter({ hasText: `-${amount}` });
  await expect(popup.first()).toBeVisible({ timeout: 10000 });
});

//
// ─────────────────────────────────────────────
//   8. WORD HISTORY
// ─────────────────────────────────────────────
//

Then("the word history should be empty", async ({ page }) => {
  await expect(
    page.locator("[data-word-history] [data-word-entry]")
  ).toHaveCount(0);
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
      `Expected at least ${expected.length} entries, found ${count}`
    );
  }

  const offset = count - expected.length;

  for (let i = 0; i < expected.length; i++) {
    const text = await items.nth(offset + i).innerText();
    expect(text).toContain(expected[i]);
  }
});

Then("the word history entry {string} belongs to player {int}", async ({ page }, word, player) => {
  const entry = page.locator("[data-word-history] [data-word-entry]").filter({ hasText: word });
  await expect(entry).toHaveAttribute("data-player", `player${player}`);
});

Then("the word history shows damage {int} for {string}", async ({ page }, damage, word) => {
  const entry = page.locator("[data-word-history] [data-word-entry]").filter({ hasText: word });
  await expect(entry).toHaveAttribute("data-damage", `${damage}`);
});

//
// ─────────────────────────────────────────────
//   9. MUSIC MUTE BUTTON
// ─────────────────────────────────────────────
//

When("I toggle the music mute button", async ({ page }) => {
  await page.getByRole("button", { name: /Music/i }).click();
});

Then("the music mute button shows {string}", async ({ page }, label) => {
  await expect(
    page.getByRole("button", { name: label })
  ).toBeVisible();
});
Given("I am on the PlayGame page", async ({ page }) => {
  await page.goto(`/game/00000000-0000-0000-0000-000000000000?test`);
  await page.waitForURL(`/game/00000000-0000-0000-0000-000000000000?test`);
});

Then("I see the game overlay", async ({ page }) => {
  await expect(
    page.getByText(/Väntar på motståndare|Motståndaren tänker/i)
  ).toBeVisible();
});

Then("I do not see the game overlay", async ({ page }) => {
  await expect(
    page.getByText(/Väntar på motståndare|Motståndaren tänker/i)
  ).toHaveCount(0);
});

Then("I see the player {int} username", async ({ page }, player) => {
  await expect(page.locator(`[data-player='player${player}']`)).toBeVisible();
});

Then("player {int} HP bar is at {int} percent", async ({ page }, player, percent) => {
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

When("I simulate a second player joining", async ({ page }) => {
  await page.getByRole("button", { name: /Motståndare anslöt/i }).click();
});
