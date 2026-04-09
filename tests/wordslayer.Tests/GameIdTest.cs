namespace wordslayer.Tests;

using backend;
using System;
using Xunit;

public class GameIDTest
{
    [Fact]
    public void TestID_ShouldNotBeEmpty()
    {
        // Setup 
        GameId newGameId = new GameId();

        // Assert - Vi kollar att den inte fick standardvärdet (massa nollor)
        // Du kan testa fältet direkt...
        Assert.NotEqual(Guid.Empty, newGameId.GameID);

        // ...eller använda din metod! Båda ger samma resultat här.
        Assert.NotEqual(Guid.Empty, newGameId.getGuid());
    }

    [Fact]
    public void TestID_ShouldGenerateUniqueIds()
    {
        // Setup - Vi skapar två separata spel
        GameId game1 = new GameId();
        GameId game2 = new GameId();

        // Assert - Vi kollar att deras ID:n faktiskt är olika
        Assert.NotEqual(game1.GameID, game2.GameID);
    }
}