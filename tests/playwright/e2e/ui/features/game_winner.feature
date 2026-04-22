
Feature: Game winner

  Background:
    Given I am logged in as "Player 1"
    And the timer is mocked
    And I intercept game session response
    And I intercept playword response
    And I am on the PlayGame page

  Scenario: Player 1 wins the game
  Given the game input is enabled
  When opponent reaches 0 HP
  Then I see the game overlay
  And I should see winner message "YOU WIN"

  Scenario: Player 2 wins the game
  Given the game input is enabled
  When my HP reaches 0 
  Then I see the game overlay
  And I should see winner message "YOU LOSE"
    
