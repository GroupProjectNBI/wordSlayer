namespace backend.Tests;

using backend;
using System;
using Xunit;

public class GameManagerTests
{
    [Fact]
    public void CreateGame_ShouldStoreSessionAndReturnId()
    {
        // Arrange
        GameManager manager = new GameManager();

        // Act - Vi ber managern skapa ett spel
        Guid newSessionId = manager.CreateGame("Alice", "Bob");

        // Assert - ID:t får inte vara tomt
        Assert.NotEqual(Guid.Empty, newSessionId);
    }

    [Fact]
    public void GetGame_ShouldReturnCorrectSession_WhenIdIsValid()
    {
        // Arrange
        GameManager manager = new GameManager();
        Guid storedId = manager.CreateGame("Alice", "Bob");

        // Act - Vi försöker hämta spelet vi nyss skapade
        // Antar att du döpt din hämt-metod till GetGameById i GameManager
        GameSession retrievedSession = manager.GetGameById(storedId);

        // Assert
        Assert.NotNull(retrievedSession);
        Assert.Equal(storedId, retrievedSession.SessionId);

        // Bonus: Kolla att våra två spelare är med!
        Assert.Equal(2, retrievedSession.Players.Count);
        Assert.Equal("Alice", retrievedSession.Players[0].Name);
    }

    [Fact]
    public void GetGame_ShouldReturnNull_WhenIdIsInvalid()
    {
        // Arrange
        GameManager manager = new GameManager();
        Guid fakeId = Guid.NewGuid(); // Ett ID som inte finns i vår Dictionary

        // Act
        GameSession retrievedSession = manager.GetGameById(fakeId);

        // Assert
        Assert.Null(retrievedSession);
    }
}