// Generated from: e2e\ui\features\playgamepage.feature
import { test } from "playwright-bdd";

test.describe('PlayGame Page', () => {

  test('User sees the PlayGame Page', async ({ Given, Then, And, page }) => { 
    await Given('I intercept game session response', null, { page }); 
    await And('I go to "/game/test-session-id"', null, { page }); 
    await Then('I see "Word Slayer"', null, { page }); 
    await And('I see "PlayerOne"', null, { page }); 
    await And('I see "PlayerTwo"', null, { page }); 
    await And('I see "VS"', null, { page }); 
    await And('I see input "Type your word..."', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('e2e\\ui\\features\\playgamepage.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I intercept game session response","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And I go to \"/game/test-session-id\"","stepMatchArguments":[{"group":{"start":8,"value":"\"/game/test-session-id\"","children":[{"start":9,"value":"/game/test-session-id","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Outcome","textWithKeyword":"Then I see \"Word Slayer\"","stepMatchArguments":[{"group":{"start":6,"value":"\"Word Slayer\"","children":[{"start":7,"value":"Word Slayer","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Outcome","textWithKeyword":"And I see \"PlayerOne\"","stepMatchArguments":[{"group":{"start":6,"value":"\"PlayerOne\"","children":[{"start":7,"value":"PlayerOne","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"And I see \"PlayerTwo\"","stepMatchArguments":[{"group":{"start":6,"value":"\"PlayerTwo\"","children":[{"start":7,"value":"PlayerTwo","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"And I see \"VS\"","stepMatchArguments":[{"group":{"start":6,"value":"\"VS\"","children":[{"start":7,"value":"VS","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"And I see input \"Type your word...\"","stepMatchArguments":[{"group":{"start":12,"value":"\"Type your word...\"","children":[{"start":13,"value":"Type your word...","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end