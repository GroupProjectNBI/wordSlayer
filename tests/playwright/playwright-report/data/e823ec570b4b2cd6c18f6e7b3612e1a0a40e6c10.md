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

Locator: getByTestId('overlay')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByTestId('overlay')

```

# Page snapshot

```yaml
- main [ref=e4]:
  - heading "Word Slayer" [level=1] [ref=e6]
  - generic [ref=e7]:
    - heading "History" [level=2] [ref=e8]
    - generic [ref=e10]: No words yet
  - generic [ref=e11]:
    - generic [ref=e12]: Player 1
    - generic [ref=e16]: 100 HP
  - generic [ref=e17]:
    - generic [ref=e18]: Player 2
    - generic [ref=e22]: 100 HP
  - generic:
    - heading "VS" [level=1]
    - generic:
      - generic: 30s
  - textbox "Type your word..." [ref=e24]
```

# Test source

```ts
  33  |       status: 200,
  34  |       contentType: 'application/json',
  35  |       body: JSON.stringify({
  36  |         sessionId: VALID_GUID,
  37  |         players: [
  38  |           { name: 'Player 1', health: 100 },
  39  |           { name: 'Player 2', health: 100 }
  40  |         ],
  41  |         currentTurn: 'player1'
  42  |       }),
  43  |     });
  44  |   });
  45  | });
  46  | 
  47  | Given('I intercept game session response with only one player', async ({ page }) => {
  48  |   await page.route(`**/api/game/${VALID_GUID}`, (route) => {
  49  |     route.fulfill({
  50  |       status: 200,
  51  |       contentType: 'application/json',
  52  |       body: JSON.stringify({
  53  |         sessionId: VALID_GUID,
  54  |         players: [{ name: 'Player 1', health: 100 }],
  55  |         currentTurn: 'player1'
  56  |       }),
  57  |     });
  58  |   });
  59  | });
  60  | 
  61  | Given('I intercept playword response', async ({ page }) => {
  62  |   await page.route(`**/api/game/${VALID_GUID}/playword`, (route) => {
  63  |     route.fulfill({
  64  |       status: 200,
  65  |       contentType: 'application/json',
  66  |       body: JSON.stringify({ message: "Success" }),
  67  |     });
  68  |   });
  69  | });
  70  | 
  71  | // --- 4. TIMER MOCKING ---
  72  | 
  73  | Given("the timer is mocked", async ({ page }) => {
  74  |   await page.addInitScript(() => {
  75  |     window.setInterval = () => 0;
  76  |     window.setTimeout = () => 0;
  77  |   });
  78  | });
  79  | 
  80  | When("the timer ticks {int} seconds", async ({ page }) => {
  81  |   await page.evaluate(() => {
  82  |     window.dispatchEvent(new Event("manual-timer-tick"));
  83  |   });
  84  | });
  85  | 
  86  | // --- 5. HANDLINGAR ---
  87  | 
  88  | Given("the game input is enabled", async ({ page }) => {
  89  |   const input = page.getByRole("textbox");
  90  |   await expect(input).toBeEnabled({ timeout: 10000 });
  91  | });
  92  | 
  93  | When("I type the word {string}", async ({ page }, text) => {
  94  |   await page.getByRole("textbox").fill(text);
  95  | });
  96  | 
  97  | When("I submit the word", async ({ page }) => {
  98  |   const input = page.getByRole("textbox");
  99  |   await input.press("Enter");
  100 | });
  101 | 
  102 | // --- 6. ASSERTIONS (TIMER, HP, TUR) ---
  103 | 
  104 | Then("the timer should show {int}", async ({ page }, value) => {
  105 |   const timer = page.getByText(new RegExp(`^\\s*${value}s\\s*$`));
  106 |   await expect(timer).toBeVisible();
  107 | });
  108 | 
  109 | Then("player {int} has {int} HP", async ({ page }, player, hp) => {
  110 |   const selector = `[data-player='player${player}'] >> text='${hp} HP'`;
  111 |   await expect(page.locator(selector)).toBeVisible();
  112 | });
  113 | 
  114 | Then("it is player {int} turn", async ({ page }, player) => {
  115 |   const selector = `[data-player='player${player}'][data-active='true']`;
  116 |   await expect(page.locator(selector)).toBeVisible();
  117 | });
  118 | 
  119 | Then("I see the player {int} username", async ({ page }, player) => {
  120 |   const selector = `[data-player='player${player}']`;
  121 |   await expect(page.locator(selector)).toBeVisible();
  122 | });
  123 | 
  124 | Then("I see a damage popup with {int}", async ({ page }, amount) => {
  125 |   // Vi letar efter texten "-6" var som helst i en div, istället för exakt matchning
  126 |   const popup = page.locator('div').filter({ hasText: `-${amount}` });
  127 |   await expect(popup.first()).toBeVisible({ timeout: 10000 });
  128 | });
  129 | // --- 7. OVERLAY (UNIKA NAMN) ---
  130 | 
  131 | Then("I see the game overlay", async ({ page }) => {
  132 |   // Regex täcker in både "Väntar på motståndare" och "Motståndaren tänker"
> 133 |   await expect(page.getByTestId("overlay")).toBeVisible();
      |                                             ^ Error: expect(locator).toBeVisible() failed
  134 | });
  135 | 
  136 | Then("I do not see the game overlay", async ({ page }) => {
  137 |   await expect(page.getByTestId("Overlay")).toHaveCount(0);
  138 | });
  139 | 
  140 | // --- 8. ORD-HISTORIK ---
  141 | 
  142 | Then("the word history should be empty", async ({ page }) => {
  143 |   const items = page.locator("[data-word-history] [data-word-entry]");
  144 |   await expect(items).toHaveCount(0);
  145 | });
  146 | 
  147 | Then("the word history contains {string}", async ({ page }, word) => {
  148 |   await expect(page.locator("[data-word-history]").getByText(word)).toBeVisible();
  149 | });
  150 | 
  151 | Then("the word history should show:", async ({ page }, table) => {
  152 |   const expected = table.rows().flat();
  153 |   const items = page.locator("[data-word-history] [data-word-entry]");
  154 |   const count = await items.count();
  155 |   const offset = count - expected.length;
  156 | 
  157 |   for (let i = 0; i < expected.length; i++) {
  158 |     const text = await items.nth(offset + i).innerText();
  159 |     expect(text).toContain(expected[i]);
  160 |   }
  161 | });
  162 | 
  163 | Then("the word history entry {string} belongs to player {int}", async ({ page }, word, player) => {
  164 |   const entry = page.locator("[data-word-history] [data-word-entry]").filter({ hasText: word });
  165 |   await expect(entry).toHaveAttribute("data-player", `player${player}`);
  166 | });
  167 | 
  168 | Then("the word history shows damage {int} for {string}", async ({ page }, damage, word) => {
  169 |   const entry = page.locator("[data-word-history] [data-word-entry]").filter({ hasText: word });
  170 |   await expect(entry).toHaveAttribute("data-damage", `${damage}`);
  171 | });
```