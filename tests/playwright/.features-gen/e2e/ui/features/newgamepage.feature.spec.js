// Generated from: e2e\ui\features\newgamepage.feature
import { test } from "playwright-bdd";

test.describe('NewGame', () => {

  test('User sees NewGame page', async ({ Given, Then, And, page }) => { 
    await Given('I am on the newgame page', null, { page }); 
    await Then('I see "Start new game"', null, { page }); 
    await And('I see input value "test-session-id"', null, { page }); 
    await And('I see button "Start Game"', null, { page }); 
  });

  test('User starts the game from NewGame page', async ({ Given, When, Then, page }) => { 
    await Given('I am on the newgame page', null, { page }); 
    await When('I press button "Start Game"', null, { page }); 
    await Then('I am on "/game/test-session-id"', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('e2e\\ui\\features\\newgamepage.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I am on the newgame page","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Outcome","textWithKeyword":"Then I see \"Start new game\"","stepMatchArguments":[{"group":{"start":6,"value":"\"Start new game\"","children":[{"start":7,"value":"Start new game","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Outcome","textWithKeyword":"And I see input value \"test-session-id\"","stepMatchArguments":[{"group":{"start":18,"value":"\"test-session-id\"","children":[{"start":19,"value":"test-session-id","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Outcome","textWithKeyword":"And I see button \"Start Game\"","stepMatchArguments":[{"group":{"start":13,"value":"\"Start Game\"","children":[{"start":14,"value":"Start Game","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":13,"pickleLine":9,"tags":[],"steps":[{"pwStepLine":14,"gherkinStepLine":10,"keywordType":"Context","textWithKeyword":"Given I am on the newgame page","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":11,"keywordType":"Action","textWithKeyword":"When I press button \"Start Game\"","stepMatchArguments":[{"group":{"start":15,"value":"\"Start Game\"","children":[{"start":16,"value":"Start Game","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":16,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"Then I am on \"/game/test-session-id\"","stepMatchArguments":[{"group":{"start":8,"value":"\"/game/test-session-id\"","children":[{"start":9,"value":"/game/test-session-id","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end