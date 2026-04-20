# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\ui\features\homepage.feature.spec.js >> HomePage >> User starts a new game from homepage
- Location: .features-gen\e2e\ui\features\homepage.feature.spec.js:14:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5002/
Call log:
  - navigating to "http://localhost:5002/", waiting until "load"

```

# Test source

```ts
  1  | import { createBdd } from 'playwright-bdd';
  2  | const { Given, When } = createBdd();
  3  | 
  4  | Given('I am on the homepage', async ({ page }) => {
> 5  |   await page.goto('/');
     |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5002/
  6  |   await page.waitForURL('/');
  7  | });
  8  | 
  9  | When('I intercept new game response', async ({ page }) => {
  10 |   await page.route('**/api/newGame', (route) => {
  11 |     route.fulfill({
  12 |       status: 200,
  13 |       contentType: 'application/json',
  14 |       body: JSON.stringify({ sessionId: '00000000-0000-0000-0000-000000000000' }),
  15 |     });
  16 |   });
  17 | });
```