Feature: HomePage

    Scenario: User sees homepage
        Given I am on the homepage
        And I see button "New game"
        And I see button "Join Game"
        And I see button "Rules"

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

    Scenario: User changes language on homepage
        Given I am on the homepage
        When I click the Swedish flag
        Then I see button "Nytt spel"
        And I see button "Gå med i spel"
        And I see button "Regler"

        Scenario: User changes language to English on homepage
            Given I am on the homepage
            When I click the Swedish flag
            And I click the English flag
            Then I see button "New Game"
            And I see button "Join Game"
            And I see button "Rules"

