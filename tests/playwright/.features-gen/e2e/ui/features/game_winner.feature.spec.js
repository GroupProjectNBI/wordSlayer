// Generated from: e2e\ui\features\game_winner.feature
import { test } from "playwright-bdd";

test.describe('Game Winner', () => {

  test('Player 1 wins the game', async ({ Given, When, Then, page }) => { 
    await Given('a game is in progress', null, { page }); 
    await When('Player 2\'s HP reaches 0', null, { page }); 
    await Then('I should see a message "Player 1 Wins!"', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('e2e\\ui\\features\\game_winner.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given a game is in progress","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Action","textWithKeyword":"When Player 2's HP reaches 0","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Outcome","textWithKeyword":"Then I should see a message \"Player 1 Wins!\"","stepMatchArguments":[{"group":{"start":23,"value":"\"Player 1 Wins!\"","children":[{"start":24,"value":"Player 1 Wins!","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end