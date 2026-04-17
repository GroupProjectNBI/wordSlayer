Feature: Game Winner

  Scenario: Player 1 wins the game
    Given a game is in progress
    When Player 2's HP reaches 0
    Then I should see a message "Player 1 Wins!"
    