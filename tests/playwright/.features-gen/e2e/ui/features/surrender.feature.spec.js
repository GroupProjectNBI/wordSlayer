// Generated from: e2e\ui\features\surrender.feature
import { test } from "playwright-bdd";

test.describe('Game Surrender', () => {

  test.beforeEach('Background', async ({ Given, And, page }, testInfo) => { if (testInfo.error) return;
    await Given('I am logged in as "Player 1"', null, { page }); 
    await And('I intercept game session response', null, { page }); 
    await And('I intercept surrender response', null, { page }); 
    await And('I am on the PlayGame page', null, { page }); 
  });
  
  test('Surrendering as Player 1 redirects to lobby', async ({ Given, When, Then, page }) => { 
    await Given('the game input is enabled', null, { page }); 
    await When('I click the surrender button', null, { page }); 
    await Then('I should be redirected to "/"', null, { page }); 
  });

  test('Winning by opponent surrender', async ({ Given, When, Then, And, page }) => { 
    await Given('the game input is enabled', null, { page }); 
    await When('the server signals turn changed to "gameover" with HP 100 and -1', null, { page }); 
    await Then('I see the game overlay', null, { page }); 
    await And('the overlay contains "YOU WIN (OPPONENT LEFT)"', null, { page }); 
    await And('the game input is disabled', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('e2e\\ui\\features\\surrender.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":13,"pickleLine":9,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I am logged in as \"Player 1\"","isBg":true,"stepMatchArguments":[{"group":{"start":18,"value":"\"Player 1\"","children":[{"start":19,"value":"Player 1","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And I intercept game session response","isBg":true,"stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"And I intercept surrender response","isBg":true,"stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"And I am on the PlayGame page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":10,"keywordType":"Context","textWithKeyword":"Given the game input is enabled","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":11,"keywordType":"Action","textWithKeyword":"When I click the surrender button","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"Then I should be redirected to \"/\"","stepMatchArguments":[{"group":{"start":26,"value":"\"/\"","children":[{"start":27,"value":"/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":19,"pickleLine":14,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I am logged in as \"Player 1\"","isBg":true,"stepMatchArguments":[{"group":{"start":18,"value":"\"Player 1\"","children":[{"start":19,"value":"Player 1","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And I intercept game session response","isBg":true,"stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"And I intercept surrender response","isBg":true,"stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"And I am on the PlayGame page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":20,"gherkinStepLine":15,"keywordType":"Context","textWithKeyword":"Given the game input is enabled","stepMatchArguments":[]},{"pwStepLine":21,"gherkinStepLine":16,"keywordType":"Action","textWithKeyword":"When the server signals turn changed to \"gameover\" with HP 100 and -1","stepMatchArguments":[{"group":{"start":35,"value":"\"gameover\"","children":[{"start":36,"value":"gameover","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":54,"value":"100","children":[]},"parameterTypeName":"int"},{"group":{"start":62,"value":"-1","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":22,"gherkinStepLine":17,"keywordType":"Outcome","textWithKeyword":"Then I see the game overlay","stepMatchArguments":[]},{"pwStepLine":23,"gherkinStepLine":18,"keywordType":"Outcome","textWithKeyword":"And the overlay contains \"YOU WIN (OPPONENT LEFT)\"","stepMatchArguments":[{"group":{"start":21,"value":"\"YOU WIN (OPPONENT LEFT)\"","children":[{"start":22,"value":"YOU WIN (OPPONENT LEFT)","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":24,"gherkinStepLine":19,"keywordType":"Outcome","textWithKeyword":"And the game input is disabled","stepMatchArguments":[]}]},
]; // bdd-data-end