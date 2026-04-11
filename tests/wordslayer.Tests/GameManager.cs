namespace backend.Tests;

using backend;
using System;
using Xunit;

public class GameManagerTests
{
    [Fact]
    public void CreateGame_ShouldStoreSessionAndReturnSession()
    {
        // Arrange
        GameManager manager = new GameManager();

        // Act - CreateGame tar bara ETT namn, och returnerar hela spelet
        GameSession newSession = manager.CreateGame("Alice");

        // Assert - Kollar att ID:t inte är tomt och att Alice lades till
        Assert.NotNull(newSession);
        Assert.NotEqual(Guid.Empty, newSession.SessionId);
        Assert.Equal("Alice", newSession.Players[0].Name);
    }

    [Fact]
    public void GetGame_ShouldReturnCorrectSession_WhenIdIsValid()
    {
        // Arrange
        GameManager manager = new GameManager();

        // Skapa spelet med Alice
        GameSession originalSession = manager.CreateGame("Alice");

        // Lägg till Bob via vår Join-funktion
        manager.JoinGame(originalSession.SessionId, "Bob");

        Guid storedId = originalSession.SessionId;

        // Act - Vi försöker hämta spelet vi nyss skapade och fyllde på
        GameSession? retrievedSession = manager.GetGameById(storedId);

        // Assert
        Assert.NotNull(retrievedSession);
        Assert.Equal(storedId, retrievedSession.SessionId);

        // Bonus: Kolla att våra två spelare är med!
        Assert.Equal(2, retrievedSession.Players.Count);
        Assert.Equal("Alice", retrievedSession.Players[0].Name);
        Assert.Equal("Bob", retrievedSession.Players[1].Name);
    }

    [Fact]
    public void GetGame_ShouldReturnNull_WhenIdIsInvalid()
    {
        // Arrange
        GameManager manager = new GameManager();
        Guid fakeId = Guid.NewGuid(); // Ett slumpmässigt ID som inte finns

        // Act
        GameSession? retrievedSession = manager.GetGameById(fakeId);

        // Assert
        Assert.Null(retrievedSession);
    }


    [Fact]
    public void JoinGame_ShouldAddPlayer_WhenSessionExists()
    {
        // Arrange - Sätt upp ett spel med spelare 1
        GameManager manager = new GameManager();
        GameSession session = manager.CreateGame("Player 1");

        // Act - Låt Spelare 2 joina via spelets unika ID
        GameSession? updatedSession = manager.JoinGame(session.SessionId, "Player 2");

        // Assert - Kontrollera att det gick bra
        Assert.NotNull(updatedSession); // Rummet ska finnas
        Assert.Equal(2, updatedSession.Players.Count); // Nu ska det vara 2 spelare!
        Assert.Equal("Player 2", updatedSession.Players[1].Name); // Spelare 2 ska ligga sist i listan
    }

    [Fact]
    public void JoinGame_ShouldReturnNull_WhenSessionDoesNotExist()
    {
        // Arrange - Skapa en GameManager men INGET spel
        GameManager manager = new GameManager();
        Guid fakeId = Guid.NewGuid(); // Hitta på ett ID som inte finns

        // Act - Försök joina ett spök-rum
        GameSession? result = manager.JoinGame(fakeId, "Ghost");

        // Assert - Vi förväntar oss att få ett blankt nej (null)
        Assert.Null(result);
    }
}