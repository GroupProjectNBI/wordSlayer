namespace backend.Tests;

using backend; // Se till att detta pekar på din riktiga kod
using Xunit;

public class PlayerTests
{
    [Fact]
    public void NewPlayer_ShouldHaveCorrectStartingValues()
    {
        // Arrange & Act
        Player player = new Player("Kalle");

        // Assert
        Assert.Equal("Kalle", player.Name);
        Assert.Equal(100, player.Health);

        // Kollar att listan finns men är tom
        Assert.NotNull(player.Guesses);
        Assert.Empty(player.Guesses);
    }
}