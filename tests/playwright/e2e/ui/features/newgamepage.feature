Feature: NewGame

Scenario: User sees NewGame page
    Given I am on the newgame page
    Then I see "Start new game"
    And I see input value "test-session-id"
    And I see button "Start Game"

Scenario: User starts the game from NewGame page
    Given I am on the newgame page
    When I press button "Start Game"
    Then I am on "/game/test-session-id"