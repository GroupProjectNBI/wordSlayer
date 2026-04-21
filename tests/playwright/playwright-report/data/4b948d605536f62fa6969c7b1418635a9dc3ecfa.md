# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\ui\features\game_winner.feature.spec.js >> Game winner >> Player 1 wins the game
- Location: .features-gen\e2e\ui\features\game_winner.feature.spec.js:14:7

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "you win"
Received string:    "🏆 player 1 wins! 🏆"
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - main [ref=e4]:
    - heading "Word Slayer" [level=1] [ref=e6]
    - img "English Dictionary" [ref=e8]
    - generic [ref=e9]:
      - heading "History" [level=2] [ref=e10]
      - generic [ref=e12]: No words yet
    - generic [ref=e13]:
      - generic [ref=e14]: Player 1
      - generic [ref=e18]: 100 HP
    - generic [ref=e19]:
      - generic [ref=e20]: Player 2
      - generic [ref=e23]: 0 HP
    - generic:
      - generic: Player 1
      - heading "VS" [level=1]
      - generic:
        - generic: 30s
    - textbox "Type your word..." [ref=e25]
  - generic [ref=e27]:
    - paragraph [ref=e28]: 🏆 Player 1 WINS! 🏆
    - button "Play again" [ref=e30] [cursor=pointer]
```

# Test source

```ts
  103 |   await page.evaluate(({ nextTurn, p1Hp, p2Hp }) => {
  104 |     window.dispatchEvent(new CustomEvent("signalr-turn-changed", {
  105 |       detail: { nextTurn, p1Hp, p2Hp }
  106 |     }));
  107 |   }, { nextTurn, p1Hp, p2Hp });
  108 | });
  109 | 
  110 | // API mocking
  111 | Given('I intercept game session response', async ({ page }) => {
  112 |   await page.route(`**/api/game/${VALID_GUID}`, (route) => {
  113 |     route.fulfill({
  114 |       status: 200,
  115 |       contentType: 'application/json',
  116 |       body: JSON.stringify({
  117 |         sessionId: VALID_GUID,
  118 |         players: [
  119 |           { name: 'Player 1', health: 100 },
  120 |           { name: 'Player 2', health: 100 }
  121 |         ],
  122 |         currentTurn: 'player1'
  123 |       }),
  124 |     });
  125 |   });
  126 | });
  127 | Given('I intercept game session response with only one player', async ({ page }) => {
  128 |   await page.route(`**/api/game/${VALID_GUID}`, (route) => {
  129 |     route.fulfill({
  130 |       status: 200,
  131 |       contentType: 'application/json',
  132 |       body: JSON.stringify({
  133 |         sessionId: VALID_GUID,
  134 |         players: [{ name: 'Player 1', health: 100 }],
  135 |         currentTurn: 'player1'
  136 |       }),
  137 |     });
  138 |   });
  139 | });
  140 | Given('I intercept playword response', async ({ page }) => {
  141 |   await page.route(`**/api/game/${VALID_GUID}/playword`, (route) => {
  142 |     route.fulfill({
  143 |       status: 200,
  144 |       contentType: 'application/json',
  145 |       body: JSON.stringify({ message: "Success" }),
  146 |     });
  147 |   });
  148 | });
  149 | 
  150 | // Timer mocking
  151 | Given("the timer is mocked", async ({ page }) => {
  152 |   await page.addInitScript(() => {
  153 |     window.setInterval = () => 0;
  154 |     window.setTimeout = () => 0;
  155 |   });
  156 | });
  157 | When("the timer ticks {int} seconds", async ({ page }) => {
  158 |   await page.evaluate(() => {
  159 |     window.dispatchEvent(new Event("manual-timer-tick"));
  160 |   });
  161 | });
  162 | 
  163 | 
  164 | // --- Game Over / Overlay logic ---
  165 | Then('I see the game overlay', async ({ page }) => {
  166 |   // Vi väntar lite extra så att animationen hinner starta
  167 |   await expect(page.locator('[data-testid="overlay"]')).toBeVisible({ timeout: 10000 });
  168 | });
  169 | 
  170 | When('player {int} reaches {int} HP', async ({ page }, playerNum, hp) => {
  171 |   await page.evaluate(({ playerNum, hp }) => {
  172 |     window.dispatchEvent(new CustomEvent('signalr-turn-changed', {
  173 |       detail: {
  174 |         nextTurn: 'player1',
  175 |         p1Hp: playerNum === 1 ? hp : 100,
  176 |         p2Hp: playerNum === 2 ? hp : 100,
  177 |       },
  178 |     }));
  179 |   }, { playerNum, hp });
  180 |   
  181 |   // Kontrollera att HP faktiskt uppdaterades i UI innan vi går vidare
  182 |   const hpSelector = `[data-testid="player${playerNum}-hp"]`;
  183 |   await expect(page.locator(hpSelector)).toContainText(hp.toString());
  184 | });
  185 | 
  186 | Then('I should see winner message {string}', async ({ page }, winnerMessage) => {
  187 |   const winnerElement = page.locator('[data-testid="winner-message"]');
  188 |   await expect(winnerElement).toBeVisible({ timeout: 10000 });
  189 | 
  190 |   // HÄR ÄR FIXEN
  191 |   const actualText = (await winnerElement.innerText())
  192 |     .trim()
  193 |     .toLowerCase();
  194 | 
  195 |   const expectedText = winnerMessage
  196 |     .trim()
  197 |     .toLowerCase();
  198 | 
  199 |   // DEBUG (kan ta bort sen)
  200 |   console.log("ACTUAL TEXT:", actualText);
  201 |   console.log("EXPECTED TEXT:", expectedText);
  202 | 
> 203 |   expect(actualText).toContain(expectedText);
      |                      ^ Error: expect(received).toContain(expected) // indexOf
  204 | });
  205 | 
  206 | 
  207 | // En kopia av din vanliga "game session response", men den tar emot språket.
  208 | Given('I intercept game session response with language {string}', async ({ page }, language) => {
  209 |   const VALID_GUID = "00000000-0000-0000-0000-000000000000";
  210 | 
  211 |   await page.route(`**/api/game/${VALID_GUID}`, (route) => {
  212 |     // För att undvika att krocka med POST-anrop etc.
  213 |     if (route.request().method() !== 'GET') {
  214 |       return route.fallback();
  215 |     }
  216 | 
  217 |     route.fulfill({
  218 |       status: 200,
  219 |       contentType: 'application/json',
  220 |       body: JSON.stringify({
  221 |         sessionId: VALID_GUID,
  222 |         language: language, // <-- Här tvingar vi in "swe" eller "eng"
  223 |         players: [
  224 |           { name: 'Player 1', health: 100 },
  225 |           { name: 'Player 2', health: 100 }
  226 |         ],
  227 |         currentTurn: 'player1'
  228 |       }),
  229 |     });
  230 |   });
  231 | });
```