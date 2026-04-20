// Generated from: e2e\ui\features\newgamepage.feature
import { test } from "playwright-bdd";

test.describe('NewGamePage', () => {

  test('Copy game code to clipboard and see feedback', async ({ Given, When, Then, And, page }) => {
    await Given('I am on the newgame page', null, { page });
    await Then('I see the button "Copy Game Code"', null, { page });
    await When('I press the button "Copy Game Code"', null, { page });
    await Then('I see "Copied Game Code!"', null, { page });
    await And('the button should have a green styling', null, { page });
    await And('the clipboard should contain the game code', null, { page });
  });

  test('Copy game code to clipboard and see feedback', async ({ Given, When, Then, And, page }) => {
    await Given('I am on the newgame page', null, { page });
    await Then('I see the button "Copy Game Code"', null, { page });
    await When('I press the button "Copy Game Code"', null, { page });
    await Then('I see "Copied Game Code!"', null, { page });
    await And('the button should have a green styling', null, { page });
  });

});

// == technical section ==

test.use({
  $test: [({ }, use) => use(test), { scope: 'test', box: true }],
  $uri: [({ }, use) => use('e2e\\ui\\features\\newgamepage.feature'), { scope: 'test', box: true }],
  $bddFileData: [({ }, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  { "pwTestLine": 6, "pickleLine": 3, "tags": [], "steps": [{ "pwStepLine": 7, "gherkinStepLine": 4, "keywordType": "Context", "textWithKeyword": "Given I am on the newgame page", "stepMatchArguments": [] }, { "pwStepLine": 8, "gherkinStepLine": 5, "keywordType": "Outcome", "textWithKeyword": "Then I see the button \"Copy Game Code\"", "stepMatchArguments": [{ "group": { "start": 17, "value": "\"Copy Game Code\"", "children": [{ "start": 18, "value": "Copy Game Code", "children": [{ "children": [] }] }, { "children": [{ "children": [] }] }] }, "parameterTypeName": "string" }] }, { "pwStepLine": 9, "gherkinStepLine": 6, "keywordType": "Action", "textWithKeyword": "When I press the button \"Copy Game Code\"", "stepMatchArguments": [{ "group": { "start": 19, "value": "\"Copy Game Code\"", "children": [{ "start": 20, "value": "Copy Game Code", "children": [{ "children": [] }] }, { "children": [{ "children": [] }] }] }, "parameterTypeName": "string" }] }, { "pwStepLine": 10, "gherkinStepLine": 7, "keywordType": "Outcome", "textWithKeyword": "Then I see \"Copied Game Code!\"", "stepMatchArguments": [{ "group": { "start": 6, "value": "\"Copied Game Code!\"", "children": [{ "start": 7, "value": "Copied Game Code!", "children": [{ "children": [] }] }, { "children": [{ "children": [] }] }] }, "parameterTypeName": "string" }] }, { "pwStepLine": 11, "gherkinStepLine": 8, "keywordType": "Outcome", "textWithKeyword": "And the button should have a green styling", "stepMatchArguments": [] }, { "pwStepLine": 12, "gherkinStepLine": 9, "keywordType": "Outcome", "textWithKeyword": "And the clipboard should contain the game code", "stepMatchArguments": [] }] },
]; // bdd-data-end