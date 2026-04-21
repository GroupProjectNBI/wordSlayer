// Generated from: e2e\ui\features\playgame-timer.feature
import { test } from "playwright-bdd";

test.describe('PlayGame Timer', () => {

  test('Timer starts immediately when it becomes the player\'s turn', async ({ Given, When, Then, And, page }) => { 
    await Given('I am logged in as "Player 1"', null, { page }); 
    await And('I intercept game session response', null, { page }); 
    await And('I intercept playword response', null, { page }); 
    await And('I am on the PlayGame page without test mode', null, { page }); 
    await When('I wait without typing'); 
    await Then('the timer should count down', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('e2e\\ui\\features\\playgame-timer.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I am logged in as \"Player 1\"","stepMatchArguments":[{"group":{"start":18,"value":"\"Player 1\"","children":[{"start":19,"value":"Player 1","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And I intercept game session response","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"And I intercept playword response","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"And I am on the PlayGame page without test mode","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"When I wait without typing","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"Then the timer should count down","stepMatchArguments":[]}]},
]; // bdd-data-end