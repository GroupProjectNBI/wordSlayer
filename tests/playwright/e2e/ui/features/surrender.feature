Feature: Game Surrender

    Background:
        Given I am logged in as "Player 1"
        And I intercept game session response
        And I intercept surrender response
        And I am on the PlayGame page

    Scenario: Surrendering as Player 1 redirects to lobby
        Given the game input is enabled
        When I click the surrender button
        Then I should be redirected to "/"

    Scenario: Winning by opponent surrender
        Given the game input is enabled
        When the server signals turn changed to "gameover" with HP 100 and -1
        Then I see the game overlay
        And the overlay contains "YOU WIN (OPPONENT LEFT)"
        And the game input is disabled