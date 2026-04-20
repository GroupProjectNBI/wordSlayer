Feature: PlayGame Page

    Background:
        Given I am logged in as "Player 1"
        And the timer is mocked
        And I intercept game session response
        And I intercept playword response
        And I am on the PlayGame page
        And I go to "/game/00000000-0000-0000-0000-000000000000?test"

    Scenario: Player 1 submits a word and waits for server sync
        When I type the word "dragon"
        And I submit the word
        # Här simulerar vi att servern bearbetat ordet och skickar tillbaka SignalR-infot
        And the server signals turn changed to "player2" with HP 100 and 94
        Then player 2 has 94 HP
        And it is player 2 turn
        And I see the overlay
        And I see a damage popup with 6

    Scenario: Timer timeout triggers turn switch via server
        Given the input is enabled
        When the timer ticks 30 seconds
        # I verkligheten skulle frontend anropa /timeout, vi simulerar svaret här
        And the server signals turn changed to "player2" with HP 100 and 100
        Then it is player 2 turn
        And the timer should show 30


    Scenario: Copy game code to clipboard and see feedback
        Given I am on the newgame page
        Then I see the button "Copy Game Code"
        When I press the button "Copy Game Code"
        Then I see "Copied Game Code!"
        And the button should have a green styling