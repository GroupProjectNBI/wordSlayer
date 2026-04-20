# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\ui\features\rulespage.feature.spec.js >> RulesPage >> User sees rulespage
- Location: .features-gen\e2e\ui\features\rulespage.feature.spec.js:6:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5002/rules
Call log:
  - navigating to "http://localhost:5002/rules", waiting until "load"

```

# Test source

```ts
  1 | import { createBdd } from 'playwright-bdd';
  2 | 
  3 | const { Given } = createBdd();
  4 | 
  5 | Given('I am on the rulespage', async ({ page }) => {
> 6 |   await page.goto('/rules');
    |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5002/rules
  7 | });
```