Feature: PlayGame Page

  Scenario: User sees the PlayGame page
    Given the timer is mocked
    And I go to "/game?test"
    And the input is enabled
    Then I see "Word Slayer"
    And I see the player 1 username
    And I see the player 2 username
    And I see "VS"
    And the timer should show 30

  Scenario: Player 1 starts typing and timer begins
    Given the timer is mocked
    And I go to "/game?test"
    And the input is enabled
    When I type the word "dragon"
    Then the timer should show 30

  Scenario: Player 1 submits a word and deals damage
    Given the timer is mocked
    And I go to "/game?test"
    And the input is enabled
    When I type the word "dragon"
    And I submit the word
    Then player 2 has 94 HP
    And the word history contains "dragon"
    And I see a damage popup with 6
    And it is player 2 turn
    And the timer should show 30

  Scenario: Timer runs out and turn switches
    Given the timer is mocked
    And I go to "/game?test"
    And the input is enabled
    Then the timer should show 30
    When the timer ticks 30 seconds
    Then it is player 2 turn
    And the timer should show 30

    Scenario: Player 1 HP bar shows correct initial value
  Given the timer is mocked
  And I go to "/game?test"
  Then player 1 has 100 HP
  And player 1 HP bar is at 100 percent

Scenario: Player 2 HP bar decreases after taking damage
  Given the timer is mocked
  And I go to "/game?test"
  And the input is enabled
  When I type the word "dragon"
  And I submit the word
  Then player 2 has 94 HP
  And player 2 HP bar is at 94 percent

Scenario: Player 1 HP bar decreases after taking damage
  Given the timer is mocked
  And I go to "/game?test"
  And the input is enabled
  When I type the word "dragon"
  And I submit the word
  And I type the word "hello"
  And I submit the word
  Then player 1 has 95 HP
  And player 1 HP bar is at 95 percent

  Scenario: Word history starts empty
  Given the timer is mocked
  And I go to "/game?test"
  Then the word history should be empty

Scenario: Word history shows a submitted word
  Given the timer is mocked
  And I go to "/game?test"
  When I type the word "dragon"
  And I submit the word
  Then the word history contains "dragon"

Scenario: Word history shows multiple words in order
  Given the timer is mocked
  And I go to "/game?test"
  When I type the word "dragon"
  And I submit the word
  And I type the word "hello"
  And I submit the word
  Then the word history should show:
    | dragon |
    | hello  |

Scenario: Word history shows which player submitted each word
  Given the timer is mocked
  And I go to "/game?test"
  When I type the word "dragon"
  And I submit the word
  And I type the word "hello"
  And I submit the word
  Then the word history entry "dragon" belongs to player 1
  And the word history entry "hello" belongs to player 2

Scenario: Word history shows correct damage values
  Given the timer is mocked
  And I go to "/game?test"
  When I type the word "dragon"
  And I submit the word
  Then the word history shows damage 6 for "dragon"


