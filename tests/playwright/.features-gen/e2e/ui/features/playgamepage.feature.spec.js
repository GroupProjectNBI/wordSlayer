// Generated from: e2e\ui\features\playgamepage.feature
import { test } from "playwright-bdd";

test.describe('PlayGame Page', () => {

  test('User sees the PlayGame page', async ({ Given, Then, And, page }) => { 
    await Given('the timer is mocked', null, { page }); 
    await And('I go to "/play"', null, { page }); 
    await Then('I see "WORD SLAYER"', null, { page }); 
    await And('I see "PlayerOne"', null, { page }); 
    await And('I see "PlayerTwo"', null, { page }); 
    await And('I see "VS"', null, { page }); 
    await And('I see "HP"', null, { page }); 
    await And('the timer should show 30', null, { page }); 
  });

  test('Player 1 starts typing and timer begins', async ({ Given, When, Then, And, page }) => { 
    await Given('the timer is mocked', null, { page }); 
    await And('I go to "/play"', null, { page }); 
    await When('I type the word "dragon"', null, { page }); 
    await Then('the timer should show 30', null, { page }); 
  });

  test('Player 1 submits a word and deals damage', async ({ Given, When, Then, And, page }) => { 
    await Given('the timer is mocked', null, { page }); 
    await And('I go to "/play"', null, { page }); 
    await When('I type the word "dragon"', null, { page }); 
    await And('I submit the word', null, { page }); 
    await Then('player 2 has 94 HP', null, { page }); 
    await And('the word history contains "dragon"', null, { page }); 
    await And('I see a damage popup with 6', null, { page }); 
    await And('it is player 2 turn', null, { page }); 
    await And('the timer should show 30', null, { page }); 
  });

  test('Timer runs out and turn switches', async ({ Given, When, Then, And, page }) => { 
    await Given('the timer is mocked', null, { page }); 
    await And('I go to "/play"', null, { page }); 
    await Then('the timer should show 30', null, { page }); 
    await When('the timer ticks 30 seconds', null, { page }); 
    await Then('it is player 2 turn', null, { page }); 
    await And('the timer should show 30', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('e2e\\ui\\features\\playgamepage.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given the timer is mocked","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And I go to \"/play\"","stepMatchArguments":[{"group":{"start":8,"value":"\"/play\"","children":[{"start":9,"value":"/play","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Outcome","textWithKeyword":"Then I see \"WORD SLAYER\"","stepMatchArguments":[{"group":{"start":6,"value":"\"WORD SLAYER\"","children":[{"start":7,"value":"WORD SLAYER","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Outcome","textWithKeyword":"And I see \"PlayerOne\"","stepMatchArguments":[{"group":{"start":6,"value":"\"PlayerOne\"","children":[{"start":7,"value":"PlayerOne","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"And I see \"PlayerTwo\"","stepMatchArguments":[{"group":{"start":6,"value":"\"PlayerTwo\"","children":[{"start":7,"value":"PlayerTwo","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"And I see \"VS\"","stepMatchArguments":[{"group":{"start":6,"value":"\"VS\"","children":[{"start":7,"value":"VS","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"And I see \"HP\"","stepMatchArguments":[{"group":{"start":6,"value":"\"HP\"","children":[{"start":7,"value":"HP","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"And the timer should show 30","stepMatchArguments":[{"group":{"start":22,"value":"30","children":[]},"parameterTypeName":"int"}]}]},
  {"pwTestLine":17,"pickleLine":13,"tags":[],"steps":[{"pwStepLine":18,"gherkinStepLine":14,"keywordType":"Context","textWithKeyword":"Given the timer is mocked","stepMatchArguments":[]},{"pwStepLine":19,"gherkinStepLine":15,"keywordType":"Context","textWithKeyword":"And I go to \"/play\"","stepMatchArguments":[{"group":{"start":8,"value":"\"/play\"","children":[{"start":9,"value":"/play","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":20,"gherkinStepLine":16,"keywordType":"Action","textWithKeyword":"When I type the word \"dragon\"","stepMatchArguments":[{"group":{"start":16,"value":"\"dragon\"","children":[{"start":17,"value":"dragon","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":21,"gherkinStepLine":17,"keywordType":"Outcome","textWithKeyword":"Then the timer should show 30","stepMatchArguments":[{"group":{"start":22,"value":"30","children":[]},"parameterTypeName":"int"}]}]},
  {"pwTestLine":24,"pickleLine":19,"tags":[],"steps":[{"pwStepLine":25,"gherkinStepLine":20,"keywordType":"Context","textWithKeyword":"Given the timer is mocked","stepMatchArguments":[]},{"pwStepLine":26,"gherkinStepLine":21,"keywordType":"Context","textWithKeyword":"And I go to \"/play\"","stepMatchArguments":[{"group":{"start":8,"value":"\"/play\"","children":[{"start":9,"value":"/play","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":27,"gherkinStepLine":22,"keywordType":"Action","textWithKeyword":"When I type the word \"dragon\"","stepMatchArguments":[{"group":{"start":16,"value":"\"dragon\"","children":[{"start":17,"value":"dragon","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":28,"gherkinStepLine":23,"keywordType":"Action","textWithKeyword":"And I submit the word","stepMatchArguments":[]},{"pwStepLine":29,"gherkinStepLine":24,"keywordType":"Outcome","textWithKeyword":"Then player 2 has 94 HP","stepMatchArguments":[{"group":{"start":13,"value":"94","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":30,"gherkinStepLine":25,"keywordType":"Outcome","textWithKeyword":"And the word history contains \"dragon\"","stepMatchArguments":[{"group":{"start":26,"value":"\"dragon\"","children":[{"start":27,"value":"dragon","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":31,"gherkinStepLine":26,"keywordType":"Outcome","textWithKeyword":"And I see a damage popup with 6","stepMatchArguments":[{"group":{"start":26,"value":"6","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":32,"gherkinStepLine":27,"keywordType":"Outcome","textWithKeyword":"And it is player 2 turn","stepMatchArguments":[]},{"pwStepLine":33,"gherkinStepLine":28,"keywordType":"Outcome","textWithKeyword":"And the timer should show 30","stepMatchArguments":[{"group":{"start":22,"value":"30","children":[]},"parameterTypeName":"int"}]}]},
  {"pwTestLine":36,"pickleLine":30,"tags":[],"steps":[{"pwStepLine":37,"gherkinStepLine":31,"keywordType":"Context","textWithKeyword":"Given the timer is mocked","stepMatchArguments":[]},{"pwStepLine":38,"gherkinStepLine":32,"keywordType":"Context","textWithKeyword":"And I go to \"/play\"","stepMatchArguments":[{"group":{"start":8,"value":"\"/play\"","children":[{"start":9,"value":"/play","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":39,"gherkinStepLine":33,"keywordType":"Outcome","textWithKeyword":"Then the timer should show 30","stepMatchArguments":[{"group":{"start":22,"value":"30","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":40,"gherkinStepLine":34,"keywordType":"Action","textWithKeyword":"When the timer ticks 30 seconds","stepMatchArguments":[{"group":{"start":16,"value":"30","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":41,"gherkinStepLine":35,"keywordType":"Outcome","textWithKeyword":"Then it is player 2 turn","stepMatchArguments":[]},{"pwStepLine":42,"gherkinStepLine":36,"keywordType":"Outcome","textWithKeyword":"And the timer should show 30","stepMatchArguments":[{"group":{"start":22,"value":"30","children":[]},"parameterTypeName":"int"}]}]},
]; // bdd-data-end