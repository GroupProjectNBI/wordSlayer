Feature: RulesPage

Scenario: User sees rulespage
    Given I am on the rulespage
    Then I see "Game Rules"
    And I see button "Home"

Scenario: User goes from rulespage to homepage
    Given I am on the rulespage
    Then I see "Game Rules"
    And I see button "Home"
    When I press button "Home"
    Then I am on "/"
    And I see "Word Slayer"
