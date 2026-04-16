Feature: PlayGame Page

Scenario: User sees the PlayGame Page
    Given I intercept game session response
    And I go to "/game/test-session-id"
    Then I see "Word Slayer"
    And I see "PlayerOne"
    And I see "PlayerTwo"
    And I see "VS"
    And I see input "Type your word..."
