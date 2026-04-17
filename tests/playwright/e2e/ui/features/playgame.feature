Feature: PlayGame Page

  Background:
    Given I am logged in as "Player 1"
    And the timer is mocked
    And I intercept game session response
    And I intercept playword response
    And I am on the PlayGame page

  Scenario: Player 1 submits a word and triggers turn switch
    And the game input is enabled
    When I type the word "dragon"
    And I submit the word
    And the server signals turn changed to "player2" with HP 100 and 94
    Then player 2 has 94 HP
    And it is player 2 turn
    And I see the game overlay

  Scenario: Timer timeout switches turn
    And the game input is enabled
    When the timer ticks 30 seconds
    And the server signals turn changed to "player2" with HP 100 and 100
    Then it is player 2 turn
    And I see the game overlay