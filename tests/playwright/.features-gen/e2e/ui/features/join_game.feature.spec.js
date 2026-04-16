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
    await When('I enter game code "test-session-id"', null, { page }); 
    await And('I press button "Join"', null, { page }); 
    await Then('I am on "/game/test-session-id"', null, { page }); 
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
  {"pwTestLine":12,"pickleLine":8,"tags":[],"steps":[{"pwStepLine":13,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"Given I am on the join page","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":10,"keywordType":"Context","textWithKeyword":"And I intercept join response","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":11,"keywordType":"Action","textWithKeyword":"When I enter game code \"test-session-id\"","stepMatchArguments":[{"group":{"start":18,"value":"\"test-session-id\"","children":[{"start":19,"value":"test-session-id","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":16,"gherkinStepLine":12,"keywordType":"Action","textWithKeyword":"And I press button \"Join\"","stepMatchArguments":[{"group":{"start":15,"value":"\"Join\"","children":[{"start":16,"value":"Join","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":17,"gherkinStepLine":13,"keywordType":"Outcome","textWithKeyword":"Then I am on \"/game/test-session-id\"","stepMatchArguments":[{"group":{"start":8,"value":"\"/game/test-session-id\"","children":[{"start":9,"value":"/game/test-session-id","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end