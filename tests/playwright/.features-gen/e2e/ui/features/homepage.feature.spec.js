// Generated from: e2e\ui\features\homepage.feature
import { test } from "playwright-bdd";

test.describe('HomePage', () => {

  test('User sees homepage', async ({ Given, Then, And, page }) => { 
    await Given('I am on the homepage', null, { page }); 
    await Then('I see "Word Slayer"', null, { page }); 
    await And('I see button "New Game"', null, { page }); 
    await And('I see button "Join Game"', null, { page }); 
    await And('I see button "Rules"', null, { page }); 
  });

  test('User clicks rules button', async ({ Given, When, Then, And, page }) => { 
    await Given('I am on the homepage', null, { page }); 
    await When('I press button "Rules"', null, { page }); 
    await Then('I am on "/rules"', null, { page }); 
    await And('I see "Rules"', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('e2e\\ui\\features\\homepage.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I am on the homepage","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Outcome","textWithKeyword":"Then I see \"Word Slayer\"","stepMatchArguments":[{"group":{"start":6,"value":"\"Word Slayer\"","children":[{"start":7,"value":"Word Slayer","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Outcome","textWithKeyword":"And I see button \"New Game\"","stepMatchArguments":[{"group":{"start":13,"value":"\"New Game\"","children":[{"start":14,"value":"New Game","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Outcome","textWithKeyword":"And I see button \"Join Game\"","stepMatchArguments":[{"group":{"start":13,"value":"\"Join Game\"","children":[{"start":14,"value":"Join Game","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"And I see button \"Rules\"","stepMatchArguments":[{"group":{"start":13,"value":"\"Rules\"","children":[{"start":14,"value":"Rules","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":14,"pickleLine":10,"tags":[],"steps":[{"pwStepLine":15,"gherkinStepLine":11,"keywordType":"Context","textWithKeyword":"Given I am on the homepage","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":12,"keywordType":"Action","textWithKeyword":"When I press button \"Rules\"","stepMatchArguments":[{"group":{"start":15,"value":"\"Rules\"","children":[{"start":16,"value":"Rules","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":17,"gherkinStepLine":13,"keywordType":"Outcome","textWithKeyword":"Then I am on \"/rules\"","stepMatchArguments":[{"group":{"start":8,"value":"\"/rules\"","children":[{"start":9,"value":"/rules","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":18,"gherkinStepLine":14,"keywordType":"Outcome","textWithKeyword":"And I see \"Rules\"","stepMatchArguments":[{"group":{"start":6,"value":"\"Rules\"","children":[{"start":7,"value":"Rules","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end