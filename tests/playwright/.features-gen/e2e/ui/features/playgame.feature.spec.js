// Generated from: e2e\ui\features\playgame.feature
import { test } from "playwright-bdd";

test.describe('PlayGame Page', () => {

  test.beforeEach('Background', async ({ Given, And, page }, testInfo) => { if (testInfo.error) return;
    await Given('I am logged in as "Player 1"', null, { page }); 
    await And('the timer is mocked', null, { page }); 
    await And('I intercept game session response', null, { page }); 
    await And('I intercept playword response', null, { page }); 
    await And('I am on the PlayGame page', null, { page }); 
  });
  
  test('Player 1 submits a word and triggers turn switch', async ({ When, Then, And, page }) => { 
    await And('the game input is enabled', null, { page }); 
    await When('I type the word "dragon"', null, { page }); 
    await And('I submit the word', null, { page }); 
    await And('the server signals turn changed to "player2" with HP 100 and 94', null, { page }); 
    await Then('player 2 has 94 HP', null, { page }); 
    await And('it is player 2 turn', null, { page }); 
    await And('I see the game overlay', null, { page }); 
  });

  test('Timer timeout switches turn', async ({ When, Then, And, page }) => { 
    await And('the game input is enabled', null, { page }); 
    await When('the timer ticks 30 seconds', null, { page }); 
    await And('the server signals turn changed to "player2" with HP 100 and 100', null, { page }); 
    await Then('it is player 2 turn', null, { page }); 
    await And('I see the game overlay', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('e2e\\ui\\features\\playgame.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":14,"pickleLine":10,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I am logged in as \"Player 1\"","isBg":true,"stepMatchArguments":[{"group":{"start":18,"value":"\"Player 1\"","children":[{"start":19,"value":"Player 1","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And the timer is mocked","isBg":true,"stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"And I intercept game session response","isBg":true,"stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"And I intercept playword response","isBg":true,"stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And I am on the PlayGame page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":11,"keywordType":"Context","textWithKeyword":"And the game input is enabled","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":12,"keywordType":"Action","textWithKeyword":"When I type the word \"dragon\"","stepMatchArguments":[{"group":{"start":16,"value":"\"dragon\"","children":[{"start":17,"value":"dragon","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":17,"gherkinStepLine":13,"keywordType":"Action","textWithKeyword":"And I submit the word","stepMatchArguments":[]},{"pwStepLine":18,"gherkinStepLine":14,"keywordType":"Action","textWithKeyword":"And the server signals turn changed to \"player2\" with HP 100 and 94","stepMatchArguments":[{"group":{"start":35,"value":"\"player2\"","children":[{"start":36,"value":"player2","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":53,"value":"100","children":[]},"parameterTypeName":"int"},{"group":{"start":61,"value":"94","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":19,"gherkinStepLine":15,"keywordType":"Outcome","textWithKeyword":"Then player 2 has 94 HP","stepMatchArguments":[{"group":{"start":7,"value":"2","children":[]},"parameterTypeName":"int"},{"group":{"start":13,"value":"94","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":20,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"And it is player 2 turn","stepMatchArguments":[{"group":{"start":13,"value":"2","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":21,"gherkinStepLine":17,"keywordType":"Outcome","textWithKeyword":"And I see the game overlay","stepMatchArguments":[]}]},
  {"pwTestLine":24,"pickleLine":19,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I am logged in as \"Player 1\"","isBg":true,"stepMatchArguments":[{"group":{"start":18,"value":"\"Player 1\"","children":[{"start":19,"value":"Player 1","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And the timer is mocked","isBg":true,"stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"And I intercept game session response","isBg":true,"stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"And I intercept playword response","isBg":true,"stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And I am on the PlayGame page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":25,"gherkinStepLine":20,"keywordType":"Context","textWithKeyword":"And the game input is enabled","stepMatchArguments":[]},{"pwStepLine":26,"gherkinStepLine":21,"keywordType":"Action","textWithKeyword":"When the timer ticks 30 seconds","stepMatchArguments":[{"group":{"start":16,"value":"30","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":27,"gherkinStepLine":22,"keywordType":"Action","textWithKeyword":"And the server signals turn changed to \"player2\" with HP 100 and 100","stepMatchArguments":[{"group":{"start":35,"value":"\"player2\"","children":[{"start":36,"value":"player2","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":53,"value":"100","children":[]},"parameterTypeName":"int"},{"group":{"start":61,"value":"100","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":28,"gherkinStepLine":23,"keywordType":"Outcome","textWithKeyword":"Then it is player 2 turn","stepMatchArguments":[{"group":{"start":13,"value":"2","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":29,"gherkinStepLine":24,"keywordType":"Outcome","textWithKeyword":"And I see the game overlay","stepMatchArguments":[]}]},
]; // bdd-data-end