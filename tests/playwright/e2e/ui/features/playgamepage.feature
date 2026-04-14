Feature: PlayGame Page

 Scenario: User sees the PlayGame page
    Given I am on "/play"
    Then I see "Word Slayer"
    And I see "PlayerOne"
    And I see "PlayerTwo"
    And I see "VS"
    And I see "HP"
    And I see timer showing 30


  Scenario: Player 1 starts typing and timer begins
    Given I am on "/play"
    When I type the word "dragon"
    Then I see timer showing 29


  Scenario: Player 1 submits a word and deals damage
    Given I am on "/play"
    When I type the word "dragon"
    And I submit the word
    Then player 2 has 94 HP
    And the word history contains "dragon"
    And I see a damage popup with 6
    And it is player 2 turn

  Scenario: Timer runs out and turn switches
    Given I am on "/play"
    Then I see timer showing 30
    # Wait 31 seconds
    Then it is player 2 turn
    And I see timer showing 30

