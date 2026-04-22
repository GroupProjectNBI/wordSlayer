// Generated from: e2e\ui\features\game_winner.feature
import { test } from "playwright-bdd";

test.describe('Game winner', () => {

  test.beforeEach('Background', async ({ Given, And, page }, testInfo) => { if (testInfo.error) return;
    await Given('I am logged in as "Player 1"', null, { page }); 
    await And('the timer is mocked', null, { page }); 
    await And('I intercept game session response', null, { page }); 
    await And('I intercept playword response', null, { page }); 
    await And('I am on the PlayGame page', null, { page }); 
  });
  
  test('Player 1 wins the game', async ({ Given, When, Then, And, page }) => { 
    await Given('the game input is enabled', null, { page }); 
    await When('player 2 reaches 0 HP', null, { page }); 
    await Then('I see the game overlay', null, { page }); 
    await And('I should see winner message "YOU WIN"', null, { page }); 
  });

  test('Player 2 wins the game', async ({ Given, When, Then, And, page }) => { 
    await Given('the game input is enabled', null, { page }); 
    await When('player 1 reaches 0 HP', null, { page }); 
    await Then('I see the game overlay', null, { page }); 
    await And('I should see winner message "YOU LOSE"', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('e2e\\ui\\features\\game_winner.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":14,"pickleLine":10,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I am logged in as \"Player 1\"","isBg":true,"stepMatchArguments":[{"group":{"start":18,"value":"\"Player 1\"","children":[{"start":19,"value":"Player 1","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And the timer is mocked","isBg":true,"stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"And I intercept game session response","isBg":true,"stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"And I intercept playword response","isBg":true,"stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And I am on the PlayGame page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":11,"keywordType":"Context","textWithKeyword":"Given the game input is enabled","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":12,"keywordType":"Action","textWithKeyword":"When player 2 reaches 0 HP","stepMatchArguments":[{"group":{"start":7,"value":"2","children":[]},"parameterTypeName":"int"},{"group":{"start":17,"value":"0","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":17,"gherkinStepLine":13,"keywordType":"Outcome","textWithKeyword":"Then I see the game overlay","stepMatchArguments":[]},{"pwStepLine":18,"gherkinStepLine":14,"keywordType":"Outcome","textWithKeyword":"And I should see winner message \"YOU WIN\"","stepMatchArguments":[{"group":{"start":28,"value":"\"YOU WIN\"","children":[{"start":29,"value":"YOU WIN","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":21,"pickleLine":16,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I am logged in as \"Player 1\"","isBg":true,"stepMatchArguments":[{"group":{"start":18,"value":"\"Player 1\"","children":[{"start":19,"value":"Player 1","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And the timer is mocked","isBg":true,"stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"And I intercept game session response","isBg":true,"stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"And I intercept playword response","isBg":true,"stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And I am on the PlayGame page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":22,"gherkinStepLine":17,"keywordType":"Context","textWithKeyword":"Given the game input is enabled","stepMatchArguments":[]},{"pwStepLine":23,"gherkinStepLine":18,"keywordType":"Action","textWithKeyword":"When player 1 reaches 0 HP","stepMatchArguments":[{"group":{"start":7,"value":"1","children":[]},"parameterTypeName":"int"},{"group":{"start":17,"value":"0","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":24,"gherkinStepLine":19,"keywordType":"Outcome","textWithKeyword":"Then I see the game overlay","stepMatchArguments":[]},{"pwStepLine":25,"gherkinStepLine":20,"keywordType":"Outcome","textWithKeyword":"And I should see winner message \"YOU LOSE\"","stepMatchArguments":[{"group":{"start":28,"value":"\"YOU LOSE\"","children":[{"start":29,"value":"YOU LOSE","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end