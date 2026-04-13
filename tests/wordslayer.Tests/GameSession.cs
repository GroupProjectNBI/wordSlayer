namespace backend.Tests;

using backend;
using System;
using Xunit;

public class GameSessionTests
{
    [Fact]
    public void NewSession_ShouldGenerateValidId()
    {
        // Act
        GameSession session = new GameSession();

        // Assert - Kollar att ID:t inte är nollor
        Assert.NotEqual(Guid.Empty, session.SessionId);
    }

    [Fact]
    public void NewSession_ShouldHaveEmptyPlayerList()
    {
        // Act
        GameSession session = new GameSession();

        // Assert
        Assert.NotNull(session.Players);
        Assert.Empty(session.Players);
    }
}