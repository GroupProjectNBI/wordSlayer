Feature: JoinGame

  Scenario: User navigates to Join Game page
    Given I am on the homepage
    When I click the "Join Game" button
    Then I should be redirected to "/join"
