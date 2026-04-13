Feature: PlayGame Page

  Scenario: User sees the PlayGame Page
    Given I am on "/play"
    Then I see "Word Slayer"
    And I see "PlayerOne"
    And I see "PlyerTwo"
    And I see "VS"
    And I see "HP"
    And I see input "Type your word..."

   Scenario: User sees timer on PlayGame Page
   Given I am on "/play"
   Then I see "s"

   Scenario: User sees word history panel
   Given I am on "/play"
   Then I see "History" 
