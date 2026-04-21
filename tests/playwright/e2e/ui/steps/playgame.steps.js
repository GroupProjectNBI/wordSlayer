import { createBdd } from "playwright-bdd";
import { expect } from "@playwright/test";
const { Given, When, Then } = createBdd();
const VALID_GUID = "00000000-0000-0000-0000-000000000000";

// Username assertion
Then('I see the player {int} username', async ({ page }, playerNum) => {
  const selector = `[data-player="player${playerNum}"]`;
  await expect(page.locator(selector)).toBeVisible();
});

// Damage popup assertion
Then('I see a damage popup with {int}', async ({ page }, amount) => {
  const popup = page.locator('div').filter({ hasText: `-${amount}` });
  await expect(popup.first()).toBeVisible({ timeout: 10000 });
});

// Word history assertions
Then('the word history should be empty', async ({ page }) => {
  const items = page.locator('[data-word-history] [data-word-entry]');
  await expect(items).toHaveCount(0);
});

Then('the word history contains {string}', async ({ page }, word) => {
  await expect(page.locator('[data-word-history]').getByText(word)).toBeVisible();
});

Then('the word history should show:', async ({ page }, table) => {
  const expected = table.rows().flat();
  const items = page.locator('[data-word-history] [data-word-entry]');
  const count = await items.count();
  const offset = count - expected.length;
  for (let i = 0; i < expected.length; i++) {
    const text = await items.nth(offset + i).innerText();
    expect(text).toContain(expected[i]);
  }
});

Then('the word history entry {string} belongs to player {int}', async ({ page }, word, playerNum) => {
  const entry = page.locator('[data-word-history] [data-word-entry]').filter({ hasText: word });
  await expect(entry).toHaveAttribute('data-player', `player${playerNum}`);
});

Then('the word history shows damage {int} for {string}', async ({ page }, damage, word) => {
  const entry = page.locator('[data-word-history] [data-word-entry]').filter({ hasText: word });
  await expect(entry).toHaveAttribute('data-damage', `${damage}`);
});


Given('I am logged in as {string}', async ({ }, arg) => { });

Given('I am on the PlayGame page', async ({ page }) => {
  await page.goto('/game/00000000-0000-0000-0000-000000000000?test');
});

Given('the game input is enabled', async ({ page }) => {
  const input = page.getByRole('textbox');
  await expect(input).toBeEnabled({ timeout: 10000 });
});

When('I type the word {string}', async ({ page }, word) => {
  await page.getByRole('textbox').fill(word);
});

When('I submit the word', async ({ page }) => {
  const input = page.getByRole('textbox');

  // 1. Vi ber Playwright vara beredd på att ett anrop till /playword kommer ske
  const responsePromise = page.waitForResponse(response =>
    response.url().includes('playword')
  );

  // 2. Vi trycker på Enter
  await input.press('Enter');

  // 3. Vi tvingar Playwright att pausa här TILLS anropet har svarat "Success"
  await responsePromise;
});

// Custom assertions for legacy feature steps
Then('player {int} has {int} HP', async ({ page }, playerNum, hp) => {
  const selector = `[data-testid="player${playerNum}-hp"]`;
  const hpText = await page.locator(selector).innerText();
  const hpValue = parseInt(hpText, 10);
  expect(hpValue).toBe(hp);
});

Then('it is player {int} turn', async ({ page }, playerNum) => {
  const turnText = await page.locator('[data-testid="turn-indicator"]').innerText();
  expect(turnText).toContain(`Player ${playerNum}`);
});


// SignalR simulation
When('the server signals turn changed to {string} with HP {int} and {int}', async ({ page }, nextTurn, p1Hp, p2Hp) => {
  await page.evaluate(({ nextTurn, p1Hp, p2Hp }) => {
    window.dispatchEvent(new CustomEvent("signalr-turn-changed", {
      detail: { nextTurn, p1Hp, p2Hp }
    }));
  }, { nextTurn, p1Hp, p2Hp });
});

// API mocking
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

// Timer mocking
Given("the timer is mocked", async ({ page }) => {
  await page.addInitScript(() => {
    window.setInterval = () => 0;
    window.setTimeout = () => 0;
  });
});
When("the timer ticks {int} seconds", async ({ page }) => {
  await page.evaluate(() => {
    window.dispatchEvent(new Event("manual-timer-tick"));
  });
});


Then('I see the game overlay', async ({ page }) => {
  const overlay = page.locator('[data-testid="overlay"]');
  await expect(overlay).toBeVisible();
});

When('player {int} reaches 0 HP', async ({ page }, playerNum) => {
  const p1Hp = playerNum === 1 ? 0 : 100;
  const p2Hp = playerNum === 2 ? 0 : 100;

  await page.evaluate(({ p1Hp, p2Hp }) => {
    window.dispatchEvent(new CustomEvent('signalr-turn-changed', {
      detail: {
        nextTurn: 'player1',
        p1Hp,
        p2Hp,
      },
    }));
  }, { p1Hp, p2Hp });

  const defeatedPlayer = playerNum;
  await expect(page.locator(`[data-testid="player${defeatedPlayer}-hp"]`)).toHaveText('0 HP');
});

Then('I should see winner message {string}', async ({ page }, winnerMessage) => {
  const winnerElement = page.locator('[data-testid="winner-message"]');
  await expect(winnerElement).toBeVisible();
  await expect(winnerElement).toHaveText(winnerMessage);
});


// En kopia av din vanliga "game session response", men den tar emot språket.
Given('I intercept game session response with language {string}', async ({ page }, language) => {
  const VALID_GUID = "00000000-0000-0000-0000-000000000000";

  await page.route(`**/api/game/${VALID_GUID}`, (route) => {
    // För att undvika att krocka med POST-anrop etc.
    if (route.request().method() !== 'GET') {
      return route.fallback();
    }

    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        sessionId: VALID_GUID,
        language: language, // <-- Här tvingar vi in "swe" eller "eng"
        players: [
          { name: 'Player 1', health: 100 },
          { name: 'Player 2', health: 100 }
        ],
        currentTurn: 'player1'
      }),
    });
  });
});
