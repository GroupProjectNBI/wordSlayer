# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\ui\features\playgame.feature.spec.js >> PlayGame Page >> Timer timeout switches turn
- Location: .features-gen\e2e\ui\features\playgame.feature.spec.js:24:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-player=\'player2\'][data-active=\'true\']')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('[data-player=\'player2\'][data-active=\'true\']')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - button "Mute Music" [ref=e4]
  - button "Motståndare anslöt" [ref=e5]
  - main [ref=e6]:
    - heading "Word Slayer" [level=1] [ref=e8]
    - generic [ref=e9]:
      - heading "History" [level=2] [ref=e10]
      - generic [ref=e12]: No words yet
    - generic [ref=e13]:
      - generic [ref=e14]: Player 1
      - generic [ref=e17]: 100 HP
    - generic:
      - heading "VS" [level=1]
      - generic:
        - generic:
          - img
          - generic: 30s
    - textbox "Type your word..." [ref=e19]
  - generic [ref=e20]: Väntar på motståndare... ⏳
```

# Test source

```ts
  45  |   await page.route(`**/api/game/${VALID_GUID}`, (route) => {
  46  |     route.fulfill({
  47  |       status: 200,
  48  |       contentType: 'application/json',
  49  |       body: JSON.stringify({
  50  |         sessionId: VALID_GUID,
  51  |         players: [
  52  |           { name: 'Player 1', health: 100 },
  53  |           { name: 'Player 2', health: 100 }
  54  |         ],
  55  |         currentTurn: 'player1'
  56  |       }),
  57  |     });
  58  |   });
  59  | });
  60  | 
  61  | Given('I intercept game session response with only one player', async ({ page }) => {
  62  |   await page.route(`**/api/game/${VALID_GUID}`, (route) => {
  63  |     route.fulfill({
  64  |       status: 200,
  65  |       contentType: 'application/json',
  66  |       body: JSON.stringify({
  67  |         sessionId: VALID_GUID,
  68  |         players: [{ name: 'Player 1', health: 100 }],
  69  |         currentTurn: 'player1'
  70  |       }),
  71  |     });
  72  |   });
  73  | });
  74  | 
  75  | Given('I intercept playword response', async ({ page }) => {
  76  |   await page.route(`**/api/game/${VALID_GUID}/playword`, (route) => {
  77  |     route.fulfill({
  78  |       status: 200,
  79  |       contentType: 'application/json',
  80  |       body: JSON.stringify({ message: "Success" }),
  81  |     });
  82  |   });
  83  | });
  84  | 
  85  | //
  86  | // ─────────────────────────────────────────────
  87  | //   4. TIMER MOCKING
  88  | // ─────────────────────────────────────────────
  89  | //
  90  | 
  91  | Given("the timer is mocked", async ({ page }) => {
  92  |   await page.addInitScript(() => {
  93  |     window.setInterval = () => 0;
  94  |     window.setTimeout = () => 0;
  95  |   });
  96  | });
  97  | 
  98  | When("the timer ticks {int} seconds", async ({ page }, seconds) => {
  99  |   for (let i = 0; i < seconds; i++) {
  100 |     await page.evaluate(() => {
  101 |       window.dispatchEvent(new Event("manual-timer-tick"));
  102 |     });
  103 |   }
  104 | });
  105 | 
  106 | //
  107 | // ─────────────────────────────────────────────
  108 | //   5. INPUT
  109 | // ─────────────────────────────────────────────
  110 | //
  111 | 
  112 | Given("the game input is enabled", async ({ page }) => {
  113 |   const input = page.getByRole("textbox");
  114 |   await expect(input).toBeEnabled({ timeout: 10000 });
  115 | });
  116 | 
  117 | When("I type the word {string}", async ({ page }, text) => {
  118 |   await page.getByRole("textbox").fill(text);
  119 | });
  120 | 
  121 | When("I submit the word", async ({ page }) => {
  122 |   await page.getByRole("textbox").press("Enter");
  123 | });
  124 | 
  125 | //
  126 | // ─────────────────────────────────────────────
  127 | //   6. TIMER + HP + TURN + HIGHLIGHT
  128 | // ─────────────────────────────────────────────
  129 | //
  130 | 
  131 | Then("the timer should show {int}", async ({ page }, value) => {
  132 |   const timer = page.getByText(new RegExp(`^\\s*${value}s\\s*$`));
  133 |   await expect(timer).toBeVisible();
  134 | });
  135 | 
  136 | Then("player {int} has {int} HP", async ({ page }, player, hp) => {
  137 |   await expect(
  138 |     page.locator(`[data-player='player${player}'] >> text='${hp} HP'`)
  139 |   ).toBeVisible();
  140 | });
  141 | 
  142 | Then("it is player {int} turn", async ({ page }, player) => {
  143 |   await expect(
  144 |     page.locator(`[data-player='player${player}'][data-active='true']`)
> 145 |   ).toBeVisible();
      |     ^ Error: expect(locator).toBeVisible() failed
  146 | });
  147 | 
  148 | Then("player {int} is highlighted", async ({ page }, player) => {
  149 |   await expect(
  150 |     page.locator(`[data-player='player${player}']`)
  151 |   ).toHaveAttribute("data-active", "true");
  152 | });
  153 | 
  154 | //
  155 | // ─────────────────────────────────────────────
  156 | //   7. DAMAGE POPUP
  157 | // ─────────────────────────────────────────────
  158 | //
  159 | 
  160 | Then("I see a damage popup with {int}", async ({ page }, amount) => {
  161 |   const popup = page.locator("div").filter({ hasText: `-${amount}` });
  162 |   await expect(popup.first()).toBeVisible({ timeout: 10000 });
  163 | });
  164 | 
  165 | //
  166 | // ─────────────────────────────────────────────
  167 | //   8. WORD HISTORY
  168 | // ─────────────────────────────────────────────
  169 | //
  170 | 
  171 | Then("the word history should be empty", async ({ page }) => {
  172 |   await expect(
  173 |     page.locator("[data-word-history] [data-word-entry]")
  174 |   ).toHaveCount(0);
  175 | });
  176 | 
  177 | Then("the word history contains {string}", async ({ page }, word) => {
  178 |   await expect(
  179 |     page.locator("[data-word-history]").getByText(word)
  180 |   ).toBeVisible();
  181 | });
  182 | 
  183 | Then("the word history should show:", async ({ page }, table) => {
  184 |   const expected = table.rows().flat();
  185 |   const items = page.locator("[data-word-history] [data-word-entry]");
  186 |   const count = await items.count();
  187 | 
  188 |   if (count < expected.length) {
  189 |     throw new Error(
  190 |       `Expected at least ${expected.length} entries, found ${count}`
  191 |     );
  192 |   }
  193 | 
  194 |   const offset = count - expected.length;
  195 | 
  196 |   for (let i = 0; i < expected.length; i++) {
  197 |     const text = await items.nth(offset + i).innerText();
  198 |     expect(text).toContain(expected[i]);
  199 |   }
  200 | });
  201 | 
  202 | Then("the word history entry {string} belongs to player {int}", async ({ page }, word, player) => {
  203 |   const entry = page.locator("[data-word-history] [data-word-entry]").filter({ hasText: word });
  204 |   await expect(entry).toHaveAttribute("data-player", `player${player}`);
  205 | });
  206 | 
  207 | Then("the word history shows damage {int} for {string}", async ({ page }, damage, word) => {
  208 |   const entry = page.locator("[data-word-history] [data-word-entry]").filter({ hasText: word });
  209 |   await expect(entry).toHaveAttribute("data-damage", `${damage}`);
  210 | });
  211 | 
  212 | //
  213 | // ─────────────────────────────────────────────
  214 | //   9. MUSIC MUTE BUTTON
  215 | // ─────────────────────────────────────────────
  216 | //
  217 | 
  218 | When("I toggle the music mute button", async ({ page }) => {
  219 |   await page.getByRole("button", { name: /Music/i }).click();
  220 | });
  221 | 
  222 | Then("the music mute button shows {string}", async ({ page }, label) => {
  223 |   await expect(
  224 |     page.getByRole("button", { name: label })
  225 |   ).toBeVisible();
  226 | });
  227 | Given("I am on the PlayGame page", async ({ page }) => {
  228 |   await page.goto(`/game/00000000-0000-0000-0000-000000000000?test`);
  229 |   await page.waitForURL(`/game/00000000-0000-0000-0000-000000000000?test`);
  230 | });
  231 | 
  232 | Then("I see the game overlay", async ({ page }) => {
  233 |   await expect(
  234 |     page.getByText(/Väntar på motståndare|Motståndaren tänker/i)
  235 |   ).toBeVisible();
  236 | });
  237 | 
  238 | Then("I do not see the game overlay", async ({ page }) => {
  239 |   await expect(
  240 |     page.getByText(/Väntar på motståndare|Motståndaren tänker/i)
  241 |   ).toHaveCount(0);
  242 | });
  243 | 
  244 | Then("I see the player {int} username", async ({ page }, player) => {
  245 |   await expect(page.locator(`[data-player='player${player}']`)).toBeVisible();
```