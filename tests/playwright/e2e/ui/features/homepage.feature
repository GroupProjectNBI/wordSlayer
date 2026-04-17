Feature: HomePage

Scenario: User sees homepage
    Given I am on the homepage
    Then I see "Word Slayer"
    And I see button "New game"
    And I see button "Join Game"
    And I see button "Rules"
    And I see button "Play Music"

Scenario: User starts a new game from homepage
    Given I am on the homepage
    When I intercept new game response
    And I press button "New game"
    Then I am on "/newgame/test-session-id"
    And I see "Start new game"
    And I see input value "test-session-id"
    And I see button "Start Game"

Scenario: User clicks rules button
    Given I am on the homepage
    When I press button "Rules"
    Then I am on "/rules"
    And I see "Rules"

Scenario: User clicks Play Music button
    Given I am on the homepage
    When I press button "Play Music"
    Then I see button "Play Music"

Scenario: User triggers autoplay by clicking anywhere
    Given I am on the homepage
    When I click the "Word Slayer" button
    Then I see "Word Slayer"
