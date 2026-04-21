// Generated from: e2e\ui\features\join_game.feature
import { test } from "playwright-bdd";

test.describe('JoinGame', () => {

  test('User navigates to Join Game page', async ({ Given, When, Then, page }) => { 
    await Given('I am on the homepage', null, { page }); 
    await When('I press button "Join Game"', null, { page }); 
    await Then('I am on "/join"', null, { page }); 
  });

  test('Player 2 joins an existing game', async ({ Given, When, Then, And, page }) => { 
    await Given('I am on the join page', null, { page }); 
    await And('I intercept join response', null, { page }); 
    await When('I enter game code "00000000-0000-0000-0000-000000000000"', null, { page }); 
    await And('I press button "Join"', null, { page }); 
    await Then('I am on "/game/00000000-0000-0000-0000-000000000000"', null, { page }); 
  });

  test('User enters game code and sees Swedish dictionary info', async ({ Given, When, Then, And, page }) => { 
    await Given('I am on the join page', null, { page }); 
    await And('I intercept game info response with language "swe"', null, { page }); 
    await When('I enter game code "00000000-0000-0000-0000-000000000000"', null, { page }); 
    await Then('I see "Dictionary set to:"', null, { page }); 
    await And('I see "Svenska"', null, { page }); 
    await And('I see the "Svenska" flag image', null, { page }); 
  });

  test('User enters game code and sees English dictionary info', async ({ Given, When, Then, And, page }) => { 
    await Given('I am on the join page', null, { page }); 
    await And('I intercept game info response with language "eng"', null, { page }); 
    await When('I enter game code "00000000-0000-0000-0000-000000000000"', null, { page }); 
    await Then('I see "Dictionary set to:"', null, { page }); 
    await And('I see "English"', null, { page }); 
    await And('I see the "English" flag image', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('e2e\\ui\\features\\join_game.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I am on the homepage","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Action","textWithKeyword":"When I press button \"Join Game\"","stepMatchArguments":[{"group":{"start":15,"value":"\"Join Game\"","children":[{"start":16,"value":"Join Game","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Outcome","textWithKeyword":"Then I am on \"/join\"","stepMatchArguments":[{"group":{"start":8,"value":"\"/join\"","children":[{"start":9,"value":"/join","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":12,"pickleLine":8,"tags":[],"steps":[{"pwStepLine":13,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"Given I am on the join page","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":10,"keywordType":"Context","textWithKeyword":"And I intercept join response","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":11,"keywordType":"Action","textWithKeyword":"When I enter game code \"00000000-0000-0000-0000-000000000000\"","stepMatchArguments":[{"group":{"start":18,"value":"\"00000000-0000-0000-0000-000000000000\"","children":[{"start":19,"value":"00000000-0000-0000-0000-000000000000","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":16,"gherkinStepLine":12,"keywordType":"Action","textWithKeyword":"And I press button \"Join\"","stepMatchArguments":[{"group":{"start":15,"value":"\"Join\"","children":[{"start":16,"value":"Join","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":17,"gherkinStepLine":13,"keywordType":"Outcome","textWithKeyword":"Then I am on \"/game/00000000-0000-0000-0000-000000000000\"","stepMatchArguments":[{"group":{"start":8,"value":"\"/game/00000000-0000-0000-0000-000000000000\"","children":[{"start":9,"value":"/game/00000000-0000-0000-0000-000000000000","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":20,"pickleLine":16,"tags":[],"steps":[{"pwStepLine":21,"gherkinStepLine":17,"keywordType":"Context","textWithKeyword":"Given I am on the join page","stepMatchArguments":[]},{"pwStepLine":22,"gherkinStepLine":18,"keywordType":"Context","textWithKeyword":"And I intercept game info response with language \"swe\"","stepMatchArguments":[{"group":{"start":45,"value":"\"swe\"","children":[{"start":46,"value":"swe","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":23,"gherkinStepLine":19,"keywordType":"Action","textWithKeyword":"When I enter game code \"00000000-0000-0000-0000-000000000000\"","stepMatchArguments":[{"group":{"start":18,"value":"\"00000000-0000-0000-0000-000000000000\"","children":[{"start":19,"value":"00000000-0000-0000-0000-000000000000","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":24,"gherkinStepLine":20,"keywordType":"Outcome","textWithKeyword":"Then I see \"Dictionary set to:\"","stepMatchArguments":[{"group":{"start":6,"value":"\"Dictionary set to:\"","children":[{"start":7,"value":"Dictionary set to:","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":25,"gherkinStepLine":21,"keywordType":"Outcome","textWithKeyword":"And I see \"Svenska\"","stepMatchArguments":[{"group":{"start":6,"value":"\"Svenska\"","children":[{"start":7,"value":"Svenska","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":26,"gherkinStepLine":22,"keywordType":"Outcome","textWithKeyword":"And I see the \"Svenska\" flag image","stepMatchArguments":[{"group":{"start":10,"value":"\"Svenska\"","children":[{"start":11,"value":"Svenska","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":29,"pickleLine":24,"tags":[],"steps":[{"pwStepLine":30,"gherkinStepLine":25,"keywordType":"Context","textWithKeyword":"Given I am on the join page","stepMatchArguments":[]},{"pwStepLine":31,"gherkinStepLine":26,"keywordType":"Context","textWithKeyword":"And I intercept game info response with language \"eng\"","stepMatchArguments":[{"group":{"start":45,"value":"\"eng\"","children":[{"start":46,"value":"eng","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":32,"gherkinStepLine":27,"keywordType":"Action","textWithKeyword":"When I enter game code \"00000000-0000-0000-0000-000000000000\"","stepMatchArguments":[{"group":{"start":18,"value":"\"00000000-0000-0000-0000-000000000000\"","children":[{"start":19,"value":"00000000-0000-0000-0000-000000000000","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":33,"gherkinStepLine":28,"keywordType":"Outcome","textWithKeyword":"Then I see \"Dictionary set to:\"","stepMatchArguments":[{"group":{"start":6,"value":"\"Dictionary set to:\"","children":[{"start":7,"value":"Dictionary set to:","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":34,"gherkinStepLine":29,"keywordType":"Outcome","textWithKeyword":"And I see \"English\"","stepMatchArguments":[{"group":{"start":6,"value":"\"English\"","children":[{"start":7,"value":"English","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":35,"gherkinStepLine":30,"keywordType":"Outcome","textWithKeyword":"And I see the \"English\" flag image","stepMatchArguments":[{"group":{"start":10,"value":"\"English\"","children":[{"start":11,"value":"English","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end