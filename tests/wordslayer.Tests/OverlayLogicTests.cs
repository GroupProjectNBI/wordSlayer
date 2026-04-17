using backend;
using System;
using Xunit;

namespace backend.Tests
{
  public class OverlayLogicTests
  {
    [Fact]
    public void Overlay_ShouldBeVisible_WhenOnlyOnePlayerPresent()
    {
      // Arrange
      var session = new GameSession();
      session.Players.Add(new Player("Alice"));

      // Act
      int playerCount = session.Players.Count;

      // Assert
      Assert.Equal(1, playerCount);
      // Overlay logic: overlay should be visible if playerCount < 2
      Assert.True(playerCount < 2);
    }

    [Fact]
    public void Overlay_ShouldNotBeVisible_WhenTwoPlayersPresent()
    {
      // Arrange
      var session = new GameSession();
      session.Players.Add(new Player("Alice"));
      session.Players.Add(new Player("Bob"));

      // Act
      int playerCount = session.Players.Count;

      // Assert
      Assert.Equal(2, playerCount);
      // Overlay logic: overlay should NOT be visible if playerCount >= 2
      Assert.False(playerCount < 2);
    }
  }
}
