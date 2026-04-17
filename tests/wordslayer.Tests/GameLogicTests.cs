using Xunit;
using backend;

namespace WordSlayer.Tests
{
  public class GameLogicTests
  {
    [Fact]
    public void WhenPlayerTakesFatalDamage_GameShouldHaveWinner()
    {
      // 1. Arrange
      var game = new GameSession();

      // Vi lägger till två spelare för att simulera en match
      game.Players.Add(new Player("Player One"));
      game.Players.Add(new Player("Player Two"));

      // TDD-TÄNK: Vi låtsas att dessa variabler finns (vi skapar dem i nästa steg)
      game.Players[0].HP = 100;
      game.Players[1].HP = 10;
      game.Status = "InProgress";

      // 2. Act
      // Vi simulerar att Player 2 tar 10 skada
      game.ApplyDamage(playerIndex: 1, amount: 10);

      // 3. Assert
      Assert.Equal(0, game.Players[1].HP);
      Assert.Equal("Finished", game.Status);
      Assert.Equal("Player One", game.Winner);
    }
  }
}

