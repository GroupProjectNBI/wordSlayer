Feature: PlayGame Page

  Background:
    Given I am logged in as "Player 1"
    And the timer is mocked
    And I intercept game session response
    And I intercept playword response
    And I am on the PlayGame page

  #
  # ─────────────────────────────────────────────
  #   COLLEAGUE SCENARIOS (ADAPTED)
  # ─────────────────────────────────────────────
  #

  Scenario: Player 1 submits a word and triggers turn switch
    And the game input is enabled
    When I type the word "dragon"
    And I submit the word
    And the server signals turn changed to "player2" with HP 100 and 94
    Then player 2 has 94 HP
    And it is player 2 turn
    And I see the game overlay

  Scenario: Timer timeout switches turn
    And the game input is enabled
    When the timer ticks 30 seconds
    And the server signals turn changed to "player2" with HP 100 and 100
    Then it is player 2 turn
    And I see the game overlay

  #
  # ─────────────────────────────────────────────
  #   BASIC PAGE LOAD
  # ─────────────────────────────────────────────
  #

  Scenario: User sees the PlayGame page
    And the game input is enabled
    Then I see "Word Slayer"
    And I see the player 1 username
    And I see the player 2 username
    And I see "VS"
    And the timer should show 30

  #
  # ─────────────────────────────────────────────
  #   TIMER + INPUT
  # ─────────────────────────────────────────────
  #

  Scenario: Player 1 starts typing and timer begins
    And the game input is enabled
    When I type the word "dragon"
    Then the timer should show 30

  #
  # ─────────────────────────────────────────────
  #   DAMAGE + TURN SWITCH
  # ─────────────────────────────────────────────
  #

  Scenario: Player 1 submits a word and deals damage
    And the game input is enabled
    When I type the word "dragon"
    And I submit the word
    Then player 2 has 94 HP
    And the word history contains "dragon"
    And I see a damage popup with 6
    And it is player 2 turn
    And the timer should show 30

  Scenario: Timer runs out and turn switches
    And the game input is enabled
    Then the timer should show 30
    When the timer ticks 30 seconds
    Then it is player 2 turn
    And the timer should show 30

  #
  # ─────────────────────────────────────────────
  #   HP BAR
  # ─────────────────────────────────────────────
  #

  Scenario: Player 1 HP bar shows correct initial value
    Then player 1 has 100 HP
    And player 1 HP bar is at 100 percent

  Scenario: Player 2 HP bar decreases after taking damage
    And the game input is enabled
    When I type the word "dragon"
    And I submit the word
    Then player 2 has 94 HP
    And player 2 HP bar is at 94 percent

  Scenario: Player 1 HP bar decreases after taking damage
    And the game input is enabled
    When I type the word "dragon"
    And I submit the word
    And I type the word "hello"
    And I submit the word
    Then player 1 has 95 HP
    And player 1 HP bar is at 95 percent

  #
  # ─────────────────────────────────────────────
  #   OVERLAY
  # ─────────────────────────────────────────────
  #

  Scenario: Overlay is visible when only one player is present and disappears when two players are present
    Given I intercept game session response with only one player
    And I am on the PlayGame page
    Then I see the game overlay
    When I simulate a second player joining
    Then I do not see the game overlay

  Scenario: Overlay is not visible when two players are present from the beginning
    Given I intercept game session response
    And I am on the PlayGame page
    Then I do not see the game overlay

  #
  # ─────────────────────────────────────────────
  #   WORD HISTORY
  # ─────────────────────────────────────────────
  #

  Scenario: Word history starts empty
    Then the word history should be empty

  Scenario: Word history shows a submitted word
    And the game input is enabled
    When I type the word "dragon"
    And I submit the word
    Then the word history contains "dragon"

  Scenario: Word history shows multiple words in order
    And the game input is enabled
    When I type the word "dragon"
    And I submit the word
    And I type the word "hello"
    And I submit the word
    Then the word history should show:
      | dragon |
      | hello  |

  Scenario: Word history shows which player submitted each word
    And the game input is enabled
    When I type the word "dragon"
    And I submit the word
    And I type the word "hello"
    And I submit the word
    Then the word history entry "dragon" belongs to player 1
    And the word history entry "hello" belongs to player 2

  Scenario: Word history shows correct damage values
    And the game input is enabled
    When I type the word "dragon"
    And I submit the word
    Then the word history shows damage 6 for "dragon"

  #
  # ─────────────────────────────────────────────
  #   GAME MUSIC MUTE BUTTON
  # ─────────────────────────────────────────────
  #

  Scenario: Game music mute button toggles correctly
    Then the music mute button shows "Mute Music"
    When I toggle the music mute button
    Then the music mute button shows "Unmute Music"

  Scenario: Music button visible in test mode but audio disabled
    Then I see button "Mute Music"

  #
  # ─────────────────────────────────────────────
  #   HIGHLIGHT (TURN INDICATOR)
  # ─────────────────────────────────────────────
  #

  Scenario: Active player highlight switches with turn
    Then player 1 is highlighted
    When the timer ticks 30 seconds
    Then player 2 is highlighted
