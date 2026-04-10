Feature: HomePage

Scenario: User sees homepage
    Given I am on the homepage
    Then I see "Word Slayer"
    And I see button "New Game"
    And I see button "Join Game"
    And I see button "Rules"

Scenario: User clicks rules button
    Given I am on the homepage
    When I press button "Rules"
    Then I am on "/rules"
    And I see "Rules"
    

