Feature: JoinGame

Scenario: User navigates to Join Game page
    Given I am on the homepage
    When I press button "Join Game"
    Then I am on "/join"

Scenario: Player 2 joins an existing game
    Given I am on the join page
    And I intercept join response
    When I enter game code "test-session-id"
    And I press button "Join"
    Then I am on "/game/test-session-id"