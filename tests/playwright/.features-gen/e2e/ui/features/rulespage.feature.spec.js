// Generated from: e2e\ui\features\rulespage.feature
import { test } from "playwright-bdd";

test.describe('RulesPage', () => {

  test('User sees rulespage', async ({ Given, Then, And, page }) => { 
    await Given('I am on the rulespage', null, { page }); 
    await Then('I see "Game Rules"', null, { page }); 
    await And('I see button "Home"', null, { page }); 
  });

  test('User goes from rulespage to homepage', async ({ Given, When, Then, And, page }) => { 
    await Given('I am on the rulespage', null, { page }); 
    await Then('I see "Game Rules"', null, { page }); 
    await And('I see button "Home"', null, { page }); 
    await When('I press button "Home"', null, { page }); 
    await Then('I am on "/"', null, { page }); 
    await And('I see "Word Slayer"', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('e2e\\ui\\features\\rulespage.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I am on the rulespage","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Outcome","textWithKeyword":"Then I see \"Game Rules\"","stepMatchArguments":[{"group":{"start":6,"value":"\"Game Rules\"","children":[{"start":7,"value":"Game Rules","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Outcome","textWithKeyword":"And I see button \"Home\"","stepMatchArguments":[{"group":{"start":13,"value":"\"Home\"","children":[{"start":14,"value":"Home","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":12,"pickleLine":8,"tags":[],"steps":[{"pwStepLine":13,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"Given I am on the rulespage","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"Then I see \"Game Rules\"","stepMatchArguments":[{"group":{"start":6,"value":"\"Game Rules\"","children":[{"start":7,"value":"Game Rules","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":15,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"And I see button \"Home\"","stepMatchArguments":[{"group":{"start":13,"value":"\"Home\"","children":[{"start":14,"value":"Home","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":16,"gherkinStepLine":12,"keywordType":"Action","textWithKeyword":"When I press button \"Home\"","stepMatchArguments":[{"group":{"start":15,"value":"\"Home\"","children":[{"start":16,"value":"Home","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":17,"gherkinStepLine":13,"keywordType":"Outcome","textWithKeyword":"Then I am on \"/\"","stepMatchArguments":[{"group":{"start":8,"value":"\"/\"","children":[{"start":9,"value":"/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":18,"gherkinStepLine":14,"keywordType":"Outcome","textWithKeyword":"And I see \"Word Slayer\"","stepMatchArguments":[{"group":{"start":6,"value":"\"Word Slayer\"","children":[{"start":7,"value":"Word Slayer","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end