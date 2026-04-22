Feature: PlayGame Timer

  Scenario: Timer starts immediately when it becomes the player's turn
    Given I am logged in as "Player 1"
    And I intercept game session response
    And I intercept playword response
    And I am on the PlayGame page without test mode
    When I wait without typing
    Then the timer should count down

 