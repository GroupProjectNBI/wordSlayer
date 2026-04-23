using Xunit;
using backend;
using System.Linq;

public class GameSurrenderTests
{
    [Fact]
    public void WhenPlayerSurrenders_OpponentShouldWinImmediately()
    {

        var game = new GameSession();
        game.Players.Add(new Player("Player 1") { Health = 100 });
        game.Players.Add(new Player("Player 2") { Health = 100 });
        game.Status = "InProgress";


        // Vi simulerar vad Surrender-endpointen gör:
        game.Players[0].Health = -1; // Player 1 ger upp
        game.UpdateStatus(); // Räknar ut att spelet är slut


        Assert.Equal("Finished", game.Status);
        Assert.Equal("Player 2", game.Winner);
    }
}