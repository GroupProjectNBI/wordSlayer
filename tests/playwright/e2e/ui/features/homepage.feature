Feature: HomePage

    Scenario: User sees homepage
        Given I am on the homepage
        Then I see "Word Slayer"
        And I see button "New game"
        And I see button "Join Game"
        And I see button "Rules"
        And I see button "Welcome message"

    Scenario: User starts a new game from homepage
        Given I am on the homepage
        When I intercept new game response
        And I press button "New game"
        Then I am on "/newgame/00000000-0000-0000-0000-000000000000"
        And I see "Start new game"
        And I see input value "00000000-0000-0000-0000-000000000000"
        And I see button "Start Game"

    Scenario: User clicks rules button
        Given I am on the homepage
        When I press button "Rules"
        Then I am on "/rules"
        And I see "Rules"

Scenario: User clicks Welcome message button
    Given I am on the homepage
    When I press button "Welcome message"
    Then I see button "Welcome message"


