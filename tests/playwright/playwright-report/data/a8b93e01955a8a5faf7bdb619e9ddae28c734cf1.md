# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\features\smoke.feature.spec.js >> Smoke >> Startsidan går att öppna
- Location: .features-gen\e2e\features\smoke.feature.spec.js:6:7

# Error details

```
Error: Expected title to include "MinApplikation" but got "client"
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - img "React logo" [ref=e5]
      - img "Vite logo" [ref=e6]
    - generic [ref=e7]:
      - heading "Get started" [level=1] [ref=e8]
      - paragraph [ref=e9]:
        - text: Edit
        - code [ref=e10]: src/App.tsx
        - text: and save to test
        - code [ref=e11]: HMR
    - button "Count is 0" [ref=e12]
  - generic [ref=e13]:
    - generic [ref=e14]:
      - img [ref=e15]
      - heading "Documentation" [level=2] [ref=e17]
      - paragraph [ref=e18]: Your questions, answered
      - list [ref=e19]:
        - listitem [ref=e20]:
          - link "Explore Vite" [ref=e21] [cursor=pointer]:
            - /url: https://vite.dev/
        - listitem [ref=e22]:
          - link "Learn more" [ref=e23] [cursor=pointer]:
            - /url: https://react.dev/
    - generic [ref=e24]:
      - img [ref=e25]
      - heading "Connect with us" [level=2] [ref=e27]
      - paragraph [ref=e28]: Join the Vite community
      - list [ref=e29]:
        - listitem [ref=e30]:
          - link "GitHub" [ref=e31] [cursor=pointer]:
            - /url: https://github.com/vitejs/vite
            - img [ref=e32]
            - text: GitHub
        - listitem [ref=e34]:
          - link "Discord" [ref=e35] [cursor=pointer]:
            - /url: https://chat.vite.dev/
            - img [ref=e36]
            - text: Discord
        - listitem [ref=e38]:
          - link "X.com" [ref=e39] [cursor=pointer]:
            - /url: https://x.com/vite_js
            - img [ref=e40]
            - text: X.com
        - listitem [ref=e42]:
          - link "Bluesky" [ref=e43] [cursor=pointer]:
            - /url: https://bsky.app/profile/vite.dev
            - img [ref=e44]
            - text: Bluesky
```

# Test source

```ts
  1  | import { createBdd } from 'playwright-bdd';
  2  | const { Given, When, Then } = createBdd();
  3  | 
  4  | Given('att jag öppnar startsidan', async ({ page }) => {
  5  |   await page.goto('/');
  6  | });
  7  | 
  8  | Then('ska jag se sidans titel innehåller {string}', async ({ page }, expected) => {
  9  |   const title = await page.title();
  10 |   if (!title.includes(expected)) {
> 11 |     throw new Error(`Expected title to include "${expected}" but got "${title}"`);
     |           ^ Error: Expected title to include "MinApplikation" but got "client"
  12 |   }
  13 | });
```