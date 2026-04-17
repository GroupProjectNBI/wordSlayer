# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\ui\features\playgame.feature.spec.js >> PlayGame Page >> User sees the PlayGame page
- Location: .features-gen\e2e\ui\features\playgame.feature.spec.js:32:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-player=\'player2\']')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('[data-player=\'player2\']')

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
  145 |   ).toBeVisible();
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
> 245 |   await expect(page.locator(`[data-player='player${player}']`)).toBeVisible();
      |                                                                 ^ Error: expect(locator).toBeVisible() failed
  246 | });
  247 | 
  248 | Then("player {int} HP bar is at {int} percent", async ({ page }, player, percent) => {
  249 |   const bar = page.locator(`[data-player='player${player}'] .hp-fill`);
  250 |   const wrapper = page.locator(`[data-player='player${player}'] .hp-bar`);
  251 | 
  252 |   const barWidth = await bar.evaluate(el => el.getBoundingClientRect().width);
  253 |   const wrapperWidth = await wrapper.evaluate(el => el.getBoundingClientRect().width);
  254 | 
  255 |   const actualPercent = Math.round((barWidth / wrapperWidth) * 100);
  256 |   const diff = Math.abs(actualPercent - percent);
  257 | 
  258 |   if (diff > 1) {
  259 |     throw new Error(`Expected HP bar to be ${percent}% but was ${actualPercent}%`);
  260 |   }
  261 | });
  262 | 
  263 | When("I simulate a second player joining", async ({ page }) => {
  264 |   await page.getByRole("button", { name: /Motståndare anslöt/i }).click();
  265 | });
  266 | 
```