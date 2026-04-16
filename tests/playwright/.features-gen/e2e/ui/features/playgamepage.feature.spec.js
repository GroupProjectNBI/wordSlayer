// Generated from: e2e\ui\features\playgamepage.feature
import { test } from "playwright-bdd";

test.describe('PlayGame Page', () => {

  test('User sees the PlayGame page', async ({ Given, Then, And, page }) => { 
    await Given('the timer is mocked', null, { page }); 
    await And('I intercept game session response', null, { page }); 
    await And('I go to "/game/test-session-id"', null, { page }); 
    await And('the input is enabled', null, { page }); 
    await Then('I see "Word Slayer"', null, { page }); 
    await And('I see the player 1 username', null, { page }); 
    await And('I see the player 2 username', null, { page }); 
    await And('I see "VS"', null, { page }); 
    await And('the timer should show 30', null, { page }); 
  });

  test('Player 1 starts typing and timer begins', async ({ Given, When, Then, And, page }) => { 
    await Given('the timer is mocked', null, { page }); 
    await And('I intercept game session response', null, { page }); 
    await And('I go to "/game/test-session-id"', null, { page }); 
    await And('the input is enabled', null, { page }); 
    await When('I type the word "dragon"', null, { page }); 
    await Then('the timer should show 30', null, { page }); 
  });

  test('Player 1 submits a word and deals damage', async ({ Given, When, Then, And, page }) => { 
    await Given('the timer is mocked', null, { page }); 
    await And('I intercept game session response', null, { page }); 
    await And('I intercept playword response', null, { page }); 
    await And('I go to "/game/test-session-id"', null, { page }); 
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
    await And('I go to "/game/test-session-id?test"', null, { page }); 
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

  test('Word history starts empty', async ({ Given, Then, And, page }) => { 
    await Given('the timer is mocked', null, { page }); 
    await And('I go to "/game?test"', null, { page }); 
    await Then('the word history should be empty', null, { page }); 
  });

  test('Word history shows a submitted word', async ({ Given, When, Then, And, page }) => { 
    await Given('the timer is mocked', null, { page }); 
    await And('I go to "/game?test"', null, { page }); 
    await When('I type the word "dragon"', null, { page }); 
    await And('I submit the word', null, { page }); 
    await Then('the word history contains "dragon"', null, { page }); 
  });

  test('Word history shows multiple words in order', async ({ Given, When, Then, And, page }) => { 
    await Given('the timer is mocked', null, { page }); 
    await And('I go to "/game?test"', null, { page }); 
    await When('I type the word "dragon"', null, { page }); 
    await And('I submit the word', null, { page }); 
    await And('I type the word "hello"', null, { page }); 
    await And('I submit the word', null, { page }); 
    await Then('the word history should show:', {"dataTable":{"rows":[{"cells":[{"value":"dragon"}]},{"cells":[{"value":"hello"}]}]}}, { page }); 
  });

  test('Word history shows which player submitted each word', async ({ Given, When, Then, And, page }) => { 
    await Given('the timer is mocked', null, { page }); 
    await And('I go to "/game?test"', null, { page }); 
    await When('I type the word "dragon"', null, { page }); 
    await And('I submit the word', null, { page }); 
    await And('I type the word "hello"', null, { page }); 
    await And('I submit the word', null, { page }); 
    await Then('the word history entry "dragon" belongs to player 1', null, { page }); 
    await And('the word history entry "hello" belongs to player 2', null, { page }); 
  });

  test('Word history shows correct damage values', async ({ Given, When, Then, And, page }) => { 
    await Given('the timer is mocked', null, { page }); 
    await And('I go to "/game?test"', null, { page }); 
    await When('I type the word "dragon"', null, { page }); 
    await And('I submit the word', null, { page }); 
    await Then('the word history shows damage 6 for "dragon"', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('e2e\\ui\\features\\playgamepage.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given the timer is mocked","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And I intercept game session response","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"And I go to \"/game/test-session-id\"","stepMatchArguments":[{"group":{"start":8,"value":"\"/game/test-session-id\"","children":[{"start":9,"value":"/game/test-session-id","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"And the input is enabled","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"Then I see \"Word Slayer\"","stepMatchArguments":[{"group":{"start":6,"value":"\"Word Slayer\"","children":[{"start":7,"value":"Word Slayer","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"And I see the player 1 username","stepMatchArguments":[{"group":{"start":17,"value":"1","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"And I see the player 2 username","stepMatchArguments":[{"group":{"start":17,"value":"2","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"And I see \"VS\"","stepMatchArguments":[{"group":{"start":6,"value":"\"VS\"","children":[{"start":7,"value":"VS","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":15,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"And the timer should show 30","stepMatchArguments":[{"group":{"start":22,"value":"30","children":[]},"parameterTypeName":"int"}]}]},
  {"pwTestLine":18,"pickleLine":14,"tags":[],"steps":[{"pwStepLine":19,"gherkinStepLine":15,"keywordType":"Context","textWithKeyword":"Given the timer is mocked","stepMatchArguments":[]},{"pwStepLine":20,"gherkinStepLine":16,"keywordType":"Context","textWithKeyword":"And I intercept game session response","stepMatchArguments":[]},{"pwStepLine":21,"gherkinStepLine":17,"keywordType":"Context","textWithKeyword":"And I go to \"/game/test-session-id\"","stepMatchArguments":[{"group":{"start":8,"value":"\"/game/test-session-id\"","children":[{"start":9,"value":"/game/test-session-id","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":22,"gherkinStepLine":18,"keywordType":"Context","textWithKeyword":"And the input is enabled","stepMatchArguments":[]},{"pwStepLine":23,"gherkinStepLine":19,"keywordType":"Action","textWithKeyword":"When I type the word \"dragon\"","stepMatchArguments":[{"group":{"start":16,"value":"\"dragon\"","children":[{"start":17,"value":"dragon","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":24,"gherkinStepLine":20,"keywordType":"Outcome","textWithKeyword":"Then the timer should show 30","stepMatchArguments":[{"group":{"start":22,"value":"30","children":[]},"parameterTypeName":"int"}]}]},
  {"pwTestLine":27,"pickleLine":22,"tags":[],"steps":[{"pwStepLine":28,"gherkinStepLine":23,"keywordType":"Context","textWithKeyword":"Given the timer is mocked","stepMatchArguments":[]},{"pwStepLine":29,"gherkinStepLine":24,"keywordType":"Context","textWithKeyword":"And I intercept game session response","stepMatchArguments":[]},{"pwStepLine":30,"gherkinStepLine":25,"keywordType":"Context","textWithKeyword":"And I intercept playword response","stepMatchArguments":[]},{"pwStepLine":31,"gherkinStepLine":26,"keywordType":"Context","textWithKeyword":"And I go to \"/game/test-session-id\"","stepMatchArguments":[{"group":{"start":8,"value":"\"/game/test-session-id\"","children":[{"start":9,"value":"/game/test-session-id","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":32,"gherkinStepLine":27,"keywordType":"Context","textWithKeyword":"And the input is enabled","stepMatchArguments":[]},{"pwStepLine":33,"gherkinStepLine":28,"keywordType":"Action","textWithKeyword":"When I type the word \"dragon\"","stepMatchArguments":[{"group":{"start":16,"value":"\"dragon\"","children":[{"start":17,"value":"dragon","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":34,"gherkinStepLine":29,"keywordType":"Action","textWithKeyword":"And I submit the word","stepMatchArguments":[]},{"pwStepLine":35,"gherkinStepLine":30,"keywordType":"Outcome","textWithKeyword":"Then player 2 has 94 HP","stepMatchArguments":[{"group":{"start":7,"value":"2","children":[]},"parameterTypeName":"int"},{"group":{"start":13,"value":"94","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":36,"gherkinStepLine":31,"keywordType":"Outcome","textWithKeyword":"And the word history contains \"dragon\"","stepMatchArguments":[{"group":{"start":26,"value":"\"dragon\"","children":[{"start":27,"value":"dragon","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":37,"gherkinStepLine":32,"keywordType":"Outcome","textWithKeyword":"And I see a damage popup with 6","stepMatchArguments":[{"group":{"start":26,"value":"6","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":38,"gherkinStepLine":33,"keywordType":"Outcome","textWithKeyword":"And it is player 2 turn","stepMatchArguments":[{"group":{"start":13,"value":"2","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":39,"gherkinStepLine":34,"keywordType":"Outcome","textWithKeyword":"And the timer should show 30","stepMatchArguments":[{"group":{"start":22,"value":"30","children":[]},"parameterTypeName":"int"}]}]},
  {"pwTestLine":42,"pickleLine":36,"tags":[],"steps":[{"pwStepLine":43,"gherkinStepLine":37,"keywordType":"Context","textWithKeyword":"Given the timer is mocked","stepMatchArguments":[]},{"pwStepLine":44,"gherkinStepLine":38,"keywordType":"Context","textWithKeyword":"And I go to \"/game/test-session-id?test\"","stepMatchArguments":[{"group":{"start":8,"value":"\"/game/test-session-id?test\"","children":[{"start":9,"value":"/game/test-session-id?test","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":45,"gherkinStepLine":39,"keywordType":"Context","textWithKeyword":"And the input is enabled","stepMatchArguments":[]},{"pwStepLine":46,"gherkinStepLine":40,"keywordType":"Outcome","textWithKeyword":"Then the timer should show 30","stepMatchArguments":[{"group":{"start":22,"value":"30","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":47,"gherkinStepLine":41,"keywordType":"Action","textWithKeyword":"When the timer ticks 30 seconds","stepMatchArguments":[{"group":{"start":16,"value":"30","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":48,"gherkinStepLine":42,"keywordType":"Outcome","textWithKeyword":"Then it is player 2 turn","stepMatchArguments":[{"group":{"start":13,"value":"2","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":49,"gherkinStepLine":43,"keywordType":"Outcome","textWithKeyword":"And the timer should show 30","stepMatchArguments":[{"group":{"start":22,"value":"30","children":[]},"parameterTypeName":"int"}]}]},
  {"pwTestLine":52,"pickleLine":45,"tags":[],"steps":[{"pwStepLine":53,"gherkinStepLine":46,"keywordType":"Context","textWithKeyword":"Given the timer is mocked","stepMatchArguments":[]},{"pwStepLine":54,"gherkinStepLine":47,"keywordType":"Context","textWithKeyword":"And I go to \"/game?test\"","stepMatchArguments":[{"group":{"start":8,"value":"\"/game?test\"","children":[{"start":9,"value":"/game?test","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":55,"gherkinStepLine":48,"keywordType":"Outcome","textWithKeyword":"Then player 1 has 100 HP","stepMatchArguments":[{"group":{"start":7,"value":"1","children":[]},"parameterTypeName":"int"},{"group":{"start":13,"value":"100","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":56,"gherkinStepLine":49,"keywordType":"Outcome","textWithKeyword":"And player 1 HP bar is at 100 percent","stepMatchArguments":[{"group":{"start":7,"value":"1","children":[]},"parameterTypeName":"int"},{"group":{"start":22,"value":"100","children":[]},"parameterTypeName":"int"}]}]},
  {"pwTestLine":59,"pickleLine":51,"tags":[],"steps":[{"pwStepLine":60,"gherkinStepLine":52,"keywordType":"Context","textWithKeyword":"Given the timer is mocked","stepMatchArguments":[]},{"pwStepLine":61,"gherkinStepLine":53,"keywordType":"Context","textWithKeyword":"And I go to \"/game?test\"","stepMatchArguments":[{"group":{"start":8,"value":"\"/game?test\"","children":[{"start":9,"value":"/game?test","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":62,"gherkinStepLine":54,"keywordType":"Context","textWithKeyword":"And the input is enabled","stepMatchArguments":[]},{"pwStepLine":63,"gherkinStepLine":55,"keywordType":"Action","textWithKeyword":"When I type the word \"dragon\"","stepMatchArguments":[{"group":{"start":16,"value":"\"dragon\"","children":[{"start":17,"value":"dragon","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":64,"gherkinStepLine":56,"keywordType":"Action","textWithKeyword":"And I submit the word","stepMatchArguments":[]},{"pwStepLine":65,"gherkinStepLine":57,"keywordType":"Outcome","textWithKeyword":"Then player 2 has 94 HP","stepMatchArguments":[{"group":{"start":7,"value":"2","children":[]},"parameterTypeName":"int"},{"group":{"start":13,"value":"94","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":66,"gherkinStepLine":58,"keywordType":"Outcome","textWithKeyword":"And player 2 HP bar is at 94 percent","stepMatchArguments":[{"group":{"start":7,"value":"2","children":[]},"parameterTypeName":"int"},{"group":{"start":22,"value":"94","children":[]},"parameterTypeName":"int"}]}]},
  {"pwTestLine":69,"pickleLine":60,"tags":[],"steps":[{"pwStepLine":70,"gherkinStepLine":61,"keywordType":"Context","textWithKeyword":"Given the timer is mocked","stepMatchArguments":[]},{"pwStepLine":71,"gherkinStepLine":62,"keywordType":"Context","textWithKeyword":"And I go to \"/game?test\"","stepMatchArguments":[{"group":{"start":8,"value":"\"/game?test\"","children":[{"start":9,"value":"/game?test","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":72,"gherkinStepLine":63,"keywordType":"Context","textWithKeyword":"And the input is enabled","stepMatchArguments":[]},{"pwStepLine":73,"gherkinStepLine":64,"keywordType":"Action","textWithKeyword":"When I type the word \"dragon\"","stepMatchArguments":[{"group":{"start":16,"value":"\"dragon\"","children":[{"start":17,"value":"dragon","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":74,"gherkinStepLine":65,"keywordType":"Action","textWithKeyword":"And I submit the word","stepMatchArguments":[]},{"pwStepLine":75,"gherkinStepLine":66,"keywordType":"Action","textWithKeyword":"And I type the word \"hello\"","stepMatchArguments":[{"group":{"start":16,"value":"\"hello\"","children":[{"start":17,"value":"hello","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":76,"gherkinStepLine":67,"keywordType":"Action","textWithKeyword":"And I submit the word","stepMatchArguments":[]},{"pwStepLine":77,"gherkinStepLine":68,"keywordType":"Outcome","textWithKeyword":"Then player 1 has 95 HP","stepMatchArguments":[{"group":{"start":7,"value":"1","children":[]},"parameterTypeName":"int"},{"group":{"start":13,"value":"95","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":78,"gherkinStepLine":69,"keywordType":"Outcome","textWithKeyword":"And player 1 HP bar is at 95 percent","stepMatchArguments":[{"group":{"start":7,"value":"1","children":[]},"parameterTypeName":"int"},{"group":{"start":22,"value":"95","children":[]},"parameterTypeName":"int"}]}]},
  {"pwTestLine":81,"pickleLine":71,"tags":[],"steps":[{"pwStepLine":82,"gherkinStepLine":72,"keywordType":"Context","textWithKeyword":"Given the timer is mocked","stepMatchArguments":[]},{"pwStepLine":83,"gherkinStepLine":73,"keywordType":"Context","textWithKeyword":"And I go to \"/game?test\"","stepMatchArguments":[{"group":{"start":8,"value":"\"/game?test\"","children":[{"start":9,"value":"/game?test","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":84,"gherkinStepLine":74,"keywordType":"Outcome","textWithKeyword":"Then the word history should be empty","stepMatchArguments":[]}]},
  {"pwTestLine":87,"pickleLine":76,"tags":[],"steps":[{"pwStepLine":88,"gherkinStepLine":77,"keywordType":"Context","textWithKeyword":"Given the timer is mocked","stepMatchArguments":[]},{"pwStepLine":89,"gherkinStepLine":78,"keywordType":"Context","textWithKeyword":"And I go to \"/game?test\"","stepMatchArguments":[{"group":{"start":8,"value":"\"/game?test\"","children":[{"start":9,"value":"/game?test","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":90,"gherkinStepLine":79,"keywordType":"Action","textWithKeyword":"When I type the word \"dragon\"","stepMatchArguments":[{"group":{"start":16,"value":"\"dragon\"","children":[{"start":17,"value":"dragon","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":91,"gherkinStepLine":80,"keywordType":"Action","textWithKeyword":"And I submit the word","stepMatchArguments":[]},{"pwStepLine":92,"gherkinStepLine":81,"keywordType":"Outcome","textWithKeyword":"Then the word history contains \"dragon\"","stepMatchArguments":[{"group":{"start":26,"value":"\"dragon\"","children":[{"start":27,"value":"dragon","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":95,"pickleLine":83,"tags":[],"steps":[{"pwStepLine":96,"gherkinStepLine":84,"keywordType":"Context","textWithKeyword":"Given the timer is mocked","stepMatchArguments":[]},{"pwStepLine":97,"gherkinStepLine":85,"keywordType":"Context","textWithKeyword":"And I go to \"/game?test\"","stepMatchArguments":[{"group":{"start":8,"value":"\"/game?test\"","children":[{"start":9,"value":"/game?test","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":98,"gherkinStepLine":86,"keywordType":"Action","textWithKeyword":"When I type the word \"dragon\"","stepMatchArguments":[{"group":{"start":16,"value":"\"dragon\"","children":[{"start":17,"value":"dragon","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":99,"gherkinStepLine":87,"keywordType":"Action","textWithKeyword":"And I submit the word","stepMatchArguments":[]},{"pwStepLine":100,"gherkinStepLine":88,"keywordType":"Action","textWithKeyword":"And I type the word \"hello\"","stepMatchArguments":[{"group":{"start":16,"value":"\"hello\"","children":[{"start":17,"value":"hello","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":101,"gherkinStepLine":89,"keywordType":"Action","textWithKeyword":"And I submit the word","stepMatchArguments":[]},{"pwStepLine":102,"gherkinStepLine":90,"keywordType":"Outcome","textWithKeyword":"Then the word history should show:","stepMatchArguments":[]}]},
  {"pwTestLine":105,"pickleLine":94,"tags":[],"steps":[{"pwStepLine":106,"gherkinStepLine":95,"keywordType":"Context","textWithKeyword":"Given the timer is mocked","stepMatchArguments":[]},{"pwStepLine":107,"gherkinStepLine":96,"keywordType":"Context","textWithKeyword":"And I go to \"/game?test\"","stepMatchArguments":[{"group":{"start":8,"value":"\"/game?test\"","children":[{"start":9,"value":"/game?test","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":108,"gherkinStepLine":97,"keywordType":"Action","textWithKeyword":"When I type the word \"dragon\"","stepMatchArguments":[{"group":{"start":16,"value":"\"dragon\"","children":[{"start":17,"value":"dragon","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":109,"gherkinStepLine":98,"keywordType":"Action","textWithKeyword":"And I submit the word","stepMatchArguments":[]},{"pwStepLine":110,"gherkinStepLine":99,"keywordType":"Action","textWithKeyword":"And I type the word \"hello\"","stepMatchArguments":[{"group":{"start":16,"value":"\"hello\"","children":[{"start":17,"value":"hello","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":111,"gherkinStepLine":100,"keywordType":"Action","textWithKeyword":"And I submit the word","stepMatchArguments":[]},{"pwStepLine":112,"gherkinStepLine":101,"keywordType":"Outcome","textWithKeyword":"Then the word history entry \"dragon\" belongs to player 1","stepMatchArguments":[{"group":{"start":23,"value":"\"dragon\"","children":[{"start":24,"value":"dragon","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":50,"value":"1","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":113,"gherkinStepLine":102,"keywordType":"Outcome","textWithKeyword":"And the word history entry \"hello\" belongs to player 2","stepMatchArguments":[{"group":{"start":23,"value":"\"hello\"","children":[{"start":24,"value":"hello","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":49,"value":"2","children":[]},"parameterTypeName":"int"}]}]},
  {"pwTestLine":116,"pickleLine":104,"tags":[],"steps":[{"pwStepLine":117,"gherkinStepLine":105,"keywordType":"Context","textWithKeyword":"Given the timer is mocked","stepMatchArguments":[]},{"pwStepLine":118,"gherkinStepLine":106,"keywordType":"Context","textWithKeyword":"And I go to \"/game?test\"","stepMatchArguments":[{"group":{"start":8,"value":"\"/game?test\"","children":[{"start":9,"value":"/game?test","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":119,"gherkinStepLine":107,"keywordType":"Action","textWithKeyword":"When I type the word \"dragon\"","stepMatchArguments":[{"group":{"start":16,"value":"\"dragon\"","children":[{"start":17,"value":"dragon","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":120,"gherkinStepLine":108,"keywordType":"Action","textWithKeyword":"And I submit the word","stepMatchArguments":[]},{"pwStepLine":121,"gherkinStepLine":109,"keywordType":"Outcome","textWithKeyword":"Then the word history shows damage 6 for \"dragon\"","stepMatchArguments":[{"group":{"start":30,"value":"6","children":[]},"parameterTypeName":"int"},{"group":{"start":36,"value":"\"dragon\"","children":[{"start":37,"value":"dragon","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end