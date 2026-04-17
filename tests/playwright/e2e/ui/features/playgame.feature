
Feature: PlayGame Page

  Background:
    Given I am logged in as "Player 1"
    And the timer is mocked
    And I intercept game session response
    And I intercept playword response
    And I am on the PlayGame page

  Scenario: Player username is visible
    Then I see the player 1 username
    And I see the player 2 username

  Scenario: Damage popup appears after word submission
    Given the game input is enabled
    When I type the word "dragon"
    And I submit the word
    And the server signals turn changed to "player2" with HP 100 and 94
    Then I see a damage popup with 6

  Scenario: Word history is updated
    Given the game input is enabled
    When I type the word "dragon"
    And I submit the word
    And the server signals turn changed to "player2" with HP 100 and 94
    Then the word history contains "dragon"
    And the word history entry "dragon" belongs to player 1
    And the word history shows damage 6 for "dragon"

  Scenario: Timer displays and times out
    Then I see turn indicator "Player 1"
    When the timer ticks 30 seconds
    And the server signals turn changed to "player2" with HP 100 and 100
    Then I see turn indicator "Player 2"

  Scenario: Player HP is updated after word submission
    Given the game input is enabled
    When I type the word "dragon"
    And I submit the word
    And the server signals turn changed to "player2" with HP 100 and 94
    Then player 1 has 100 HP
    And player 2 has 94 HP

  Scenario: Overlay appears after Player 1 submits and disappears after Player 2 submits
    Given the game input is enabled
    When I type the word "dragon"
    And I submit the word
    And the server signals turn changed to "player2" with HP 100 and 94
    Then I see the game overlay
    # Simulate Player 2's turn and submission
    When the server signals turn changed to "player1" with HP 94 and 94
    Then I do not see the overlay

  Scenario: Player 1 submits a word and triggers turn switch
    Given the game input is enabled
    When I type the word "dragon"
    And I submit the word
    And the server signals turn changed to "player2" with HP 100 and 94
    Then I see "94 HP"
    And I see turn indicator "Player 2"
    And I see the game overlay

  Scenario: Timer timeout switches turn
    Given the game input is enabled
    When the timer ticks 30 seconds
    And the server signals turn changed to "player2" with HP 100 and 100
    Then I see turn indicator "Player 2"
    And I see the game overlay