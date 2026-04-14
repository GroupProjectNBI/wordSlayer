// Generated from: e2e\ui\features\playgamepage.feature
import { test } from "playwright-bdd";

test.describe('PlayGame Page', () => {

  test('User sees the PlayGame page', async ({ Given, Then, And, page }) => { 
    await Given('the timer is mocked', null, { page }); 
    await And('I go to "/game?test"', null, { page }); 
    await And('the input is enabled', null, { page }); 
    await Then('I see "Word Slayer"', null, { page }); 
    await And('I see the player 1 username', null, { page }); 
    await And('I see the player 2 username', null, { page }); 
    await And('I see "VS"', null, { page }); 
    await And('the timer should show 30', null, { page }); 
  });

  test('Player 1 starts typing and timer begins', async ({ Given, When, Then, And, page }) => { 
    await Given('the timer is mocked', null, { page }); 
    await And('I go to "/game?test"', null, { page }); 
    await And('the input is enabled', null, { page }); 
    await When('I type the word "dragon"', null, { page }); 
    await Then('the timer should show 30', null, { page }); 
  });

  test('Player 1 submits a word and deals damage', async ({ Given, When, Then, And, page }) => { 
    await Given('the timer is mocked', null, { page }); 
    await And('I go to "/game?test"', null, { page }); 
    await And('the input is enabled', null, { page }); 
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
    await And('I go to "/game?test"', null, { page }); 
    await And('the input is enabled', null, { page }); 
    await Then('the timer should show 30', null, { page }); 
    await When('the timer ticks 30 seconds', null, { page }); 
    await Then('it is player 2 turn', null, { page }); 
    await And('the timer should show 30', null, { page }); 
  });

  test('Player 1 HP bar shows correct initial value', async ({ Given, Then, And, page }) => { 
    await Given('the timer is mocked', null, { page }); 
    await And('I go to "/game?test"', null, { page }); 
    await Then('player 1 has 100 HP', null, { page }); 
    await And('player 1 HP bar is at 100 percent', null, { page }); 
  });

  test('Player 2 HP bar decreases after taking damage', async ({ Given, When, Then, And, page }) => { 
    await Given('the timer is mocked', null, { page }); 
    await And('I go to "/game?test"', null, { page }); 
    await And('the input is enabled', null, { page }); 
    await When('I type the word "dragon"', null, { page }); 
    await And('I submit the word', null, { page }); 
    await Then('player 2 has 94 HP', null, { page }); 
    await And('player 2 HP bar is at 94 percent', null, { page }); 
  });

  test('Player 1 HP bar decreases after taking damage', async ({ Given, When, Then, And, page }) => { 
    await Given('the timer is mocked', null, { page }); 
    await And('I go to "/game?test"', null, { page }); 
    await And('the input is enabled', null, { page }); 
    await When('I type the word "dragon"', null, { page }); 
    await And('I submit the word', null, { page }); 
    await And('I type the word "hello"', null, { page }); 
    await And('I submit the word', null, { page }); 
    await Then('player 1 has 95 HP', null, { page }); 
    await And('player 1 HP bar is at 95 percent', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('e2e\\ui\\features\\playgamepage.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given the timer is mocked","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And I go to \"/game?test\"","stepMatchArguments":[{"group":{"start":8,"value":"\"/game?test\"","children":[{"start":9,"value":"/game?test","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"And the input is enabled","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Outcome","textWithKeyword":"Then I see \"Word Slayer\"","stepMatchArguments":[{"group":{"start":6,"value":"\"Word Slayer\"","children":[{"start":7,"value":"Word Slayer","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"And I see the player 1 username","stepMatchArguments":[{"group":{"start":17,"value":"1","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"And I see the player 2 username","stepMatchArguments":[{"group":{"start":17,"value":"2","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"And I see \"VS\"","stepMatchArguments":[{"group":{"start":6,"value":"\"VS\"","children":[{"start":7,"value":"VS","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"And the timer should show 30","stepMatchArguments":[{"group":{"start":22,"value":"30","children":[]},"parameterTypeName":"int"}]}]},
  {"pwTestLine":17,"pickleLine":13,"tags":[],"steps":[{"pwStepLine":18,"gherkinStepLine":14,"keywordType":"Context","textWithKeyword":"Given the timer is mocked","stepMatchArguments":[]},{"pwStepLine":19,"gherkinStepLine":15,"keywordType":"Context","textWithKeyword":"And I go to \"/game?test\"","stepMatchArguments":[{"group":{"start":8,"value":"\"/game?test\"","children":[{"start":9,"value":"/game?test","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":20,"gherkinStepLine":16,"keywordType":"Context","textWithKeyword":"And the input is enabled","stepMatchArguments":[]},{"pwStepLine":21,"gherkinStepLine":17,"keywordType":"Action","textWithKeyword":"When I type the word \"dragon\"","stepMatchArguments":[{"group":{"start":16,"value":"\"dragon\"","children":[{"start":17,"value":"dragon","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":22,"gherkinStepLine":18,"keywordType":"Outcome","textWithKeyword":"Then the timer should show 30","stepMatchArguments":[{"group":{"start":22,"value":"30","children":[]},"parameterTypeName":"int"}]}]},
  {"pwTestLine":25,"pickleLine":20,"tags":[],"steps":[{"pwStepLine":26,"gherkinStepLine":21,"keywordType":"Context","textWithKeyword":"Given the timer is mocked","stepMatchArguments":[]},{"pwStepLine":27,"gherkinStepLine":22,"keywordType":"Context","textWithKeyword":"And I go to \"/game?test\"","stepMatchArguments":[{"group":{"start":8,"value":"\"/game?test\"","children":[{"start":9,"value":"/game?test","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":28,"gherkinStepLine":23,"keywordType":"Context","textWithKeyword":"And the input is enabled","stepMatchArguments":[]},{"pwStepLine":29,"gherkinStepLine":24,"keywordType":"Action","textWithKeyword":"When I type the word \"dragon\"","stepMatchArguments":[{"group":{"start":16,"value":"\"dragon\"","children":[{"start":17,"value":"dragon","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":30,"gherkinStepLine":25,"keywordType":"Action","textWithKeyword":"And I submit the word","stepMatchArguments":[]},{"pwStepLine":31,"gherkinStepLine":26,"keywordType":"Outcome","textWithKeyword":"Then player 2 has 94 HP","stepMatchArguments":[{"group":{"start":7,"value":"2","children":[]},"parameterTypeName":"int"},{"group":{"start":13,"value":"94","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":32,"gherkinStepLine":27,"keywordType":"Outcome","textWithKeyword":"And the word history contains \"dragon\"","stepMatchArguments":[{"group":{"start":26,"value":"\"dragon\"","children":[{"start":27,"value":"dragon","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":33,"gherkinStepLine":28,"keywordType":"Outcome","textWithKeyword":"And I see a damage popup with 6","stepMatchArguments":[{"group":{"start":26,"value":"6","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":34,"gherkinStepLine":29,"keywordType":"Outcome","textWithKeyword":"And it is player 2 turn","stepMatchArguments":[{"group":{"start":13,"value":"2","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":35,"gherkinStepLine":30,"keywordType":"Outcome","textWithKeyword":"And the timer should show 30","stepMatchArguments":[{"group":{"start":22,"value":"30","children":[]},"parameterTypeName":"int"}]}]},
  {"pwTestLine":38,"pickleLine":32,"tags":[],"steps":[{"pwStepLine":39,"gherkinStepLine":33,"keywordType":"Context","textWithKeyword":"Given the timer is mocked","stepMatchArguments":[]},{"pwStepLine":40,"gherkinStepLine":34,"keywordType":"Context","textWithKeyword":"And I go to \"/game?test\"","stepMatchArguments":[{"group":{"start":8,"value":"\"/game?test\"","children":[{"start":9,"value":"/game?test","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":41,"gherkinStepLine":35,"keywordType":"Context","textWithKeyword":"And the input is enabled","stepMatchArguments":[]},{"pwStepLine":42,"gherkinStepLine":36,"keywordType":"Outcome","textWithKeyword":"Then the timer should show 30","stepMatchArguments":[{"group":{"start":22,"value":"30","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":43,"gherkinStepLine":37,"keywordType":"Action","textWithKeyword":"When the timer ticks 30 seconds","stepMatchArguments":[{"group":{"start":16,"value":"30","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":44,"gherkinStepLine":38,"keywordType":"Outcome","textWithKeyword":"Then it is player 2 turn","stepMatchArguments":[{"group":{"start":13,"value":"2","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":45,"gherkinStepLine":39,"keywordType":"Outcome","textWithKeyword":"And the timer should show 30","stepMatchArguments":[{"group":{"start":22,"value":"30","children":[]},"parameterTypeName":"int"}]}]},
  {"pwTestLine":48,"pickleLine":41,"tags":[],"steps":[{"pwStepLine":49,"gherkinStepLine":42,"keywordType":"Context","textWithKeyword":"Given the timer is mocked","stepMatchArguments":[]},{"pwStepLine":50,"gherkinStepLine":43,"keywordType":"Context","textWithKeyword":"And I go to \"/game?test\"","stepMatchArguments":[{"group":{"start":8,"value":"\"/game?test\"","children":[{"start":9,"value":"/game?test","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":51,"gherkinStepLine":44,"keywordType":"Outcome","textWithKeyword":"Then player 1 has 100 HP","stepMatchArguments":[{"group":{"start":7,"value":"1","children":[]},"parameterTypeName":"int"},{"group":{"start":13,"value":"100","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":52,"gherkinStepLine":45,"keywordType":"Outcome","textWithKeyword":"And player 1 HP bar is at 100 percent","stepMatchArguments":[{"group":{"start":7,"value":"1","children":[]},"parameterTypeName":"int"},{"group":{"start":22,"value":"100","children":[]},"parameterTypeName":"int"}]}]},
  {"pwTestLine":55,"pickleLine":47,"tags":[],"steps":[{"pwStepLine":56,"gherkinStepLine":48,"keywordType":"Context","textWithKeyword":"Given the timer is mocked","stepMatchArguments":[]},{"pwStepLine":57,"gherkinStepLine":49,"keywordType":"Context","textWithKeyword":"And I go to \"/game?test\"","stepMatchArguments":[{"group":{"start":8,"value":"\"/game?test\"","children":[{"start":9,"value":"/game?test","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":58,"gherkinStepLine":50,"keywordType":"Context","textWithKeyword":"And the input is enabled","stepMatchArguments":[]},{"pwStepLine":59,"gherkinStepLine":51,"keywordType":"Action","textWithKeyword":"When I type the word \"dragon\"","stepMatchArguments":[{"group":{"start":16,"value":"\"dragon\"","children":[{"start":17,"value":"dragon","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":60,"gherkinStepLine":52,"keywordType":"Action","textWithKeyword":"And I submit the word","stepMatchArguments":[]},{"pwStepLine":61,"gherkinStepLine":53,"keywordType":"Outcome","textWithKeyword":"Then player 2 has 94 HP","stepMatchArguments":[{"group":{"start":7,"value":"2","children":[]},"parameterTypeName":"int"},{"group":{"start":13,"value":"94","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":62,"gherkinStepLine":54,"keywordType":"Outcome","textWithKeyword":"And player 2 HP bar is at 94 percent","stepMatchArguments":[{"group":{"start":7,"value":"2","children":[]},"parameterTypeName":"int"},{"group":{"start":22,"value":"94","children":[]},"parameterTypeName":"int"}]}]},
  {"pwTestLine":65,"pickleLine":56,"tags":[],"steps":[{"pwStepLine":66,"gherkinStepLine":57,"keywordType":"Context","textWithKeyword":"Given the timer is mocked","stepMatchArguments":[]},{"pwStepLine":67,"gherkinStepLine":58,"keywordType":"Context","textWithKeyword":"And I go to \"/game?test\"","stepMatchArguments":[{"group":{"start":8,"value":"\"/game?test\"","children":[{"start":9,"value":"/game?test","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":68,"gherkinStepLine":59,"keywordType":"Context","textWithKeyword":"And the input is enabled","stepMatchArguments":[]},{"pwStepLine":69,"gherkinStepLine":60,"keywordType":"Action","textWithKeyword":"When I type the word \"dragon\"","stepMatchArguments":[{"group":{"start":16,"value":"\"dragon\"","children":[{"start":17,"value":"dragon","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":70,"gherkinStepLine":61,"keywordType":"Action","textWithKeyword":"And I submit the word","stepMatchArguments":[]},{"pwStepLine":71,"gherkinStepLine":62,"keywordType":"Action","textWithKeyword":"And I type the word \"hello\"","stepMatchArguments":[{"group":{"start":16,"value":"\"hello\"","children":[{"start":17,"value":"hello","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":72,"gherkinStepLine":63,"keywordType":"Action","textWithKeyword":"And I submit the word","stepMatchArguments":[]},{"pwStepLine":73,"gherkinStepLine":64,"keywordType":"Outcome","textWithKeyword":"Then player 1 has 95 HP","stepMatchArguments":[{"group":{"start":7,"value":"1","children":[]},"parameterTypeName":"int"},{"group":{"start":13,"value":"95","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":74,"gherkinStepLine":65,"keywordType":"Outcome","textWithKeyword":"And player 1 HP bar is at 95 percent","stepMatchArguments":[{"group":{"start":7,"value":"1","children":[]},"parameterTypeName":"int"},{"group":{"start":22,"value":"95","children":[]},"parameterTypeName":"int"}]}]},
]; // bdd-data-end