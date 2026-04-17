// Generated from: e2e\ui\features\homepage.feature
import { test } from "playwright-bdd";

test.describe('HomePage', () => {

  test('User sees homepage', async ({ Given, Then, And, page }) => { 
    await Given('I am on the homepage', null, { page }); 
    await Then('I see "Word Slayer"', null, { page }); 
    await And('I see button "New game"', null, { page }); 
    await And('I see button "Join Game"', null, { page }); 
    await And('I see button "Rules"', null, { page }); 
    await And('I see button "Welocme message"', null, { page }); 
  });

  test('User starts a new game from homepage', async ({ Given, When, Then, And, page }) => { 
    await Given('I am on the homepage', null, { page }); 
    await When('I intercept new game response', null, { page }); 
    await And('I press button "New game"', null, { page }); 
    await Then('I am on "/newgame/00000000-0000-0000-0000-000000000000"', null, { page }); 
    await And('I see "Start new game"', null, { page }); 
    await And('I see input value "00000000-0000-0000-0000-000000000000"', null, { page }); 
    await And('I see button "Start Game"', null, { page }); 
  });

  test('User clicks rules button', async ({ Given, When, Then, And, page }) => { 
    await Given('I am on the homepage', null, { page }); 
    await When('I press button "Rules"', null, { page }); 
    await Then('I am on "/rules"', null, { page }); 
    await And('I see "Rules"', null, { page }); 
  });

  test('User clicks Welcome message button', async ({ Given, When, Then, page }) => { 
    await Given('I am on the homepage', null, { page }); 
    await When('I press button "Welcome message"', null, { page }); 
    await Then('I see button "Welcome message"', null, { page }); 
  });

  test('User triggers autoplay by clicking anywhere', async ({ Given, When, Then, page }) => { 
    await Given('I am on the homepage', null, { page }); 
    await When('I click the "Word Slayer" button', null, { page }); 
    await Then('I see "Word Slayer"', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('e2e\\ui\\features\\homepage.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I am on the homepage","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Outcome","textWithKeyword":"Then I see \"Word Slayer\"","stepMatchArguments":[{"group":{"start":6,"value":"\"Word Slayer\"","children":[{"start":7,"value":"Word Slayer","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Outcome","textWithKeyword":"And I see button \"New game\"","stepMatchArguments":[{"group":{"start":13,"value":"\"New game\"","children":[{"start":14,"value":"New game","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Outcome","textWithKeyword":"And I see button \"Join Game\"","stepMatchArguments":[{"group":{"start":13,"value":"\"Join Game\"","children":[{"start":14,"value":"Join Game","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"And I see button \"Rules\"","stepMatchArguments":[{"group":{"start":13,"value":"\"Rules\"","children":[{"start":14,"value":"Rules","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"And I see button \"Welocme message\"","stepMatchArguments":[{"group":{"start":13,"value":"\"Welocme message\"","children":[{"start":14,"value":"Welocme message","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":15,"pickleLine":11,"tags":[],"steps":[{"pwStepLine":16,"gherkinStepLine":12,"keywordType":"Context","textWithKeyword":"Given I am on the homepage","stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":13,"keywordType":"Action","textWithKeyword":"When I intercept new game response","stepMatchArguments":[]},{"pwStepLine":18,"gherkinStepLine":14,"keywordType":"Action","textWithKeyword":"And I press button \"New game\"","stepMatchArguments":[{"group":{"start":15,"value":"\"New game\"","children":[{"start":16,"value":"New game","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":19,"gherkinStepLine":15,"keywordType":"Outcome","textWithKeyword":"Then I am on \"/newgame/00000000-0000-0000-0000-000000000000\"","stepMatchArguments":[{"group":{"start":8,"value":"\"/newgame/00000000-0000-0000-0000-000000000000\"","children":[{"start":9,"value":"/newgame/00000000-0000-0000-0000-000000000000","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":20,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"And I see \"Start new game\"","stepMatchArguments":[{"group":{"start":6,"value":"\"Start new game\"","children":[{"start":7,"value":"Start new game","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":21,"gherkinStepLine":17,"keywordType":"Outcome","textWithKeyword":"And I see input value \"00000000-0000-0000-0000-000000000000\"","stepMatchArguments":[{"group":{"start":18,"value":"\"00000000-0000-0000-0000-000000000000\"","children":[{"start":19,"value":"00000000-0000-0000-0000-000000000000","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":22,"gherkinStepLine":18,"keywordType":"Outcome","textWithKeyword":"And I see button \"Start Game\"","stepMatchArguments":[{"group":{"start":13,"value":"\"Start Game\"","children":[{"start":14,"value":"Start Game","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":25,"pickleLine":20,"tags":[],"steps":[{"pwStepLine":26,"gherkinStepLine":21,"keywordType":"Context","textWithKeyword":"Given I am on the homepage","stepMatchArguments":[]},{"pwStepLine":27,"gherkinStepLine":22,"keywordType":"Action","textWithKeyword":"When I press button \"Rules\"","stepMatchArguments":[{"group":{"start":15,"value":"\"Rules\"","children":[{"start":16,"value":"Rules","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":28,"gherkinStepLine":23,"keywordType":"Outcome","textWithKeyword":"Then I am on \"/rules\"","stepMatchArguments":[{"group":{"start":8,"value":"\"/rules\"","children":[{"start":9,"value":"/rules","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":29,"gherkinStepLine":24,"keywordType":"Outcome","textWithKeyword":"And I see \"Rules\"","stepMatchArguments":[{"group":{"start":6,"value":"\"Rules\"","children":[{"start":7,"value":"Rules","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":32,"pickleLine":26,"tags":[],"steps":[{"pwStepLine":33,"gherkinStepLine":27,"keywordType":"Context","textWithKeyword":"Given I am on the homepage","stepMatchArguments":[]},{"pwStepLine":34,"gherkinStepLine":28,"keywordType":"Action","textWithKeyword":"When I press button \"Welcome message\"","stepMatchArguments":[{"group":{"start":15,"value":"\"Welcome message\"","children":[{"start":16,"value":"Welcome message","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":35,"gherkinStepLine":29,"keywordType":"Outcome","textWithKeyword":"Then I see button \"Welcome message\"","stepMatchArguments":[{"group":{"start":13,"value":"\"Welcome message\"","children":[{"start":14,"value":"Welcome message","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":38,"pickleLine":31,"tags":[],"steps":[{"pwStepLine":39,"gherkinStepLine":32,"keywordType":"Context","textWithKeyword":"Given I am on the homepage","stepMatchArguments":[]},{"pwStepLine":40,"gherkinStepLine":33,"keywordType":"Action","textWithKeyword":"When I click the \"Word Slayer\" button","stepMatchArguments":[{"group":{"start":12,"value":"\"Word Slayer\"","children":[{"start":13,"value":"Word Slayer","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":41,"gherkinStepLine":34,"keywordType":"Outcome","textWithKeyword":"Then I see \"Word Slayer\"","stepMatchArguments":[{"group":{"start":6,"value":"\"Word Slayer\"","children":[{"start":7,"value":"Word Slayer","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end