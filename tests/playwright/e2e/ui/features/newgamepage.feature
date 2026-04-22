Feature: NewGamePage

  Scenario: Copy game code to clipboard and see feedback
    Given I am on the newgame page
    Then I see the button "Copy Game Code"
    When I press the button "Copy Game Code"
    Then I see "Copied Game Code!"
    And the button should have a green styling
    And the clipboard should contain the game code