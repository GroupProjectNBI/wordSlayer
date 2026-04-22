Feature: JoinGame

    Scenario: User navigates to Join Game page
        Given I am on the homepage
        When I press button "Join Game"
        Then I am on "/join"

    Scenario: Player 2 joins an existing game
        Given I am on the join page
        And I intercept join response
        When I enter game code "00000000-0000-0000-0000-000000000000"
        And I press button "Join"
        Then I am on "/game/00000000-0000-0000-0000-000000000000"


    Scenario: User enters game code and sees Swedish dictionary info
        Given I am on the join page
        And I intercept game info response with language "swe"
        When I enter game code "00000000-0000-0000-0000-000000000000"
        Then I see "Dictionary set to:"
        And I see "Svenska"
        And I see the "Svenska" flag image

    Scenario: User enters game code and sees English dictionary info
        Given I am on the join page
        And I intercept game info response with language "eng"
        When I enter game code "00000000-0000-0000-0000-000000000000"
        Then I see "Dictionary set to:"
        And I see "English"
        And I see the "English" flag image