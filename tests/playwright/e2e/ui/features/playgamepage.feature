Feature: PlayGame Page

  Scenario: User sees the PlayGame page
    Given the timer is mocked
    And I intercept game session response
    And I go to "/game/test-session-id"
    And the input is enabled
    Then I see "Word Slayer"
    And I see "PlayerOne"
    And I see "PlayerTwo"
    And I see "VS"
    And the timer should show 30

  Scenario: Player 1 starts typing and timer begins
    Given the timer is mocked
    And I intercept game session response
    And I go to "/game/test-session-id"
    And the input is enabled
    When I type the word "dragon"
    Then the timer should show 30

  Scenario: Player 1 submits a word and deals damage
    Given the timer is mocked
    And I intercept game session response
    And I intercept playword response
    And I go to "/game/test-session-id"
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
    And I intercept game session response
    And I go to "/game/test-session-id"
    And the input is enabled
    Then the timer should show 30
    When the timer ticks 30 seconds
    Then it is player 2 turn
    And the timer should show 30
