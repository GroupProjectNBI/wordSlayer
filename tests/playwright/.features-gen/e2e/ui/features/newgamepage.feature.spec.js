// Generated from: e2e\ui\features\newgamepage.feature
import { test } from "playwright-bdd";

test.describe('NewGame', () => {

  test('User sees NewGame page', async ({ Given, Then, And, page }) => { 
    await Given('I am on the newgame page', null, { page }); 
    await Then('I see "Start new game"', null, { page }); 
    await And('I see input value "here should be a pin code later"', null, { page }); 
    await And('I see button "Start Game"', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('e2e\\ui\\features\\newgamepage.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I am on the newgame page","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Outcome","textWithKeyword":"Then I see \"Start new game\"","stepMatchArguments":[{"group":{"start":6,"value":"\"Start new game\"","children":[{"start":7,"value":"Start new game","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Outcome","textWithKeyword":"And I see input value \"here should be a pin code later\"","stepMatchArguments":[{"group":{"start":18,"value":"\"here should be a pin code later\"","children":[{"start":19,"value":"here should be a pin code later","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Outcome","textWithKeyword":"And I see button \"Start Game\"","stepMatchArguments":[{"group":{"start":13,"value":"\"Start Game\"","children":[{"start":14,"value":"Start Game","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end