Feature: NewGame

Scenario: User sees NewGame page
    Given I am on the newgame page
    Then I see "Start new game"
    And I see input value "here should be a pin code later"
    And I see button "Start Game"