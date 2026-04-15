# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\ui\features\playgamepage.feature.spec.js >> PlayGame Page >> Word history shows multiple words in order
- Location: .features-gen\e2e\ui\features\playgamepage.feature.spec.js:91:7

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('[data-word-history] [data-word-entry]')
Expected: 1
Received: 2
Timeout:  10000ms

Call log:
  - Expect "toHaveCount" with timeout 10000ms
  - waiting for locator('[data-word-history] [data-word-entry]')
    14 × locator resolved to 2 elements
       - unexpected value "2"

```

# Page snapshot

```yaml
- main [ref=e3]:
  - heading "Word Slayer" [level=1] [ref=e5]
  - generic [ref=e6]:
    - heading "History" [level=2] [ref=e7]
    - generic [ref=e8]:
      - generic [ref=e9]:
        - generic [ref=e10]: dragon
        - generic [ref=e11]: "-6"
      - generic [ref=e12]:
        - generic [ref=e13]: hello
        - generic [ref=e14]: "-5"
  - generic [ref=e15]:
    - generic [ref=e16]: PlayerOne
    - generic [ref=e20]: 95 HP
  - generic [ref=e21]:
    - generic [ref=e22]: PlayerTwo
    - generic [ref=e26]: 94 HP
  - generic:
    - heading "VS" [level=1]
    - generic:
      - generic: 30s
  - textbox "Type your word..." [active] [ref=e28]
  - generic: "-6"
  - generic: "-5"
```

# Test source

```ts
  32  | });
  33  | 
  34  | //
  35  | // WORD INPUT
  36  | //
  37  | When("I type the word {string}", async ({ page }, text) => {
  38  |   await page.getByRole("textbox").fill(text);
  39  | });
  40  | 
  41  | When("I submit the word", async ({ page }) => {
  42  |   const input = page.getByRole("textbox");
  43  |   await input.focus();
  44  |   await input.press("Enter");
  45  | });
  46  | 
  47  | //
  48  | // ASSERTIONS
  49  | //
  50  | Then("the timer should show {int}", async ({ page }, value) => {
  51  |   const timer = page.getByText(new RegExp(`^\\s*${value}s\\s*$`));
  52  |   await expect(timer).toBeVisible();
  53  | });
  54  | 
  55  | //
  56  | // HP TEXT ASSERTIONS
  57  | //
  58  | Then("player {int} has {int} HP", async ({ page }, player, hp) => {
  59  |   const selector = `[data-player='player${player}'] >> text='${hp} HP'`;
  60  |   await expect(page.locator(selector)).toBeVisible();
  61  | });
  62  | 
  63  | //
  64  | // TURN ASSERTIONS
  65  | //
  66  | Then("it is player {int} turn", async ({ page }, player) => {
  67  |   const selector = `[data-player='player${player}'][data-active='true']`;
  68  |   await expect(page.locator(selector)).toBeVisible();
  69  | });
  70  | 
  71  | //
  72  | // USERNAME ASSERTION
  73  | //
  74  | Then("I see the player {int} username", async ({ page }, player) => {
  75  |   const selector = `[data-player='player${player}']`;
  76  |   await expect(page.locator(selector)).toBeVisible();
  77  | });
  78  | 
  79  | //
  80  | // DAMAGE POPUP
  81  | //
  82  | Then("I see a damage popup with {int}", async ({ page }, amount) => {
  83  |   const popup = page.locator("div", { hasText: new RegExp(`^-${amount}$`) });
  84  |   await expect(popup).toBeVisible();
  85  | });
  86  | 
  87  | //
  88  | // HP BAR WIDTH ASSERTION (wait for animation, then measure)
  89  | //
  90  | Then("player {int} HP bar is at {int} percent", async ({ page }, player, percent) => {
  91  |   // 1. Wait for HP text to show the expected value
  92  |   await expect(
  93  |     page.locator(`[data-player='player${player}'] >> text='${percent} HP'`)
  94  |   ).toBeVisible();
  95  | 
  96  |   // 2. Give the 300ms transition time to settle
  97  |   await page.waitForTimeout(400);
  98  | 
  99  |   // 3. Measure bar and wrapper
  100 |   const bar = page.locator(`[data-player='player${player}'] .hp-fill`);
  101 |   const wrapper = page.locator(`[data-player='player${player}'] .hp-bar`);
  102 | 
  103 |   const barWidth = await bar.evaluate(el => el.getBoundingClientRect().width);
  104 |   const wrapperWidth = await wrapper.evaluate(el => el.getBoundingClientRect().width);
  105 | 
  106 |   const actualPercent = Math.round((barWidth / wrapperWidth) * 100);
  107 | 
  108 |   const diff = Math.abs(actualPercent - percent);
  109 |   if (diff > 1) {
  110 |     throw new Error(`Expected HP bar to be ${percent}% but was ${actualPercent}%`);
  111 |   }
  112 | });
  113 | 
  114 | //
  115 | // WORD HISTORY ASSERTIONS
  116 | //
  117 | Then("the word history should be empty", async ({ page }) => {
  118 |   const items = page.locator("[data-word-history] [data-word-entry]");
  119 |   await expect(items).toHaveCount(0);
  120 | });
  121 | 
  122 | Then("the word history contains {string}", async ({ page }, word) => {
  123 |   await expect(
  124 |     page.locator("[data-word-history]").getByText(word)
  125 |   ).toBeVisible();
  126 | });
  127 | 
  128 | Then("the word history should show:", async ({ page }, table) => {
  129 |   const expected = table.rows().flat();
  130 |   const items = page.locator("[data-word-history] [data-word-entry]");
  131 | 
> 132 |   await expect(items).toHaveCount(expected.length);
      |                       ^ Error: expect(locator).toHaveCount(expected) failed
  133 | 
  134 |   for (let i = 0; i < expected.length; i++) {
  135 |     const text = await items.nth(i).innerText();
  136 |     expect(text).toContain(expected[i]);
  137 |   }
  138 | });
  139 | 
  140 | Then(
  141 |   "the word history entry {string} belongs to player {int}",
  142 |   async ({ page }, word, player) => {
  143 |     const entry = page
  144 |       .locator("[data-word-history] [data-word-entry]")
  145 |       .filter({ hasText: word });
  146 | 
  147 |     await expect(entry).toHaveAttribute("data-player", `player${player}`);
  148 |   }
  149 | );
  150 | 
  151 | Then(
  152 |   "the word history shows damage {int} for {string}",
  153 |   async ({ page }, damage, word) => {
  154 |     const entry = page
  155 |       .locator("[data-word-history] [data-word-entry]")
  156 |       .filter({ hasText: word });
  157 | 
  158 |     await expect(entry).toHaveAttribute("data-damage", `${damage}`);
  159 |   }
  160 | );
  161 | 
```