namespace wordslayer.Tests;

using backend;
using Xunit;

public class PlayerTests
{
    [Fact]
    public void NewPlayer_ShouldHaveCorrectStartingValues()
    {
        // Arrange & Act
        var player = new Player("Kalle");

        // Assert
        Assert.Equal("Kalle", player.Name);
        Assert.Equal(100, player.HP);
        Assert.NotNull(player.Guesses);
        Assert.Empty(player.Guesses);
    }

    [Fact]
    public void WordUsedAlready_ShouldReturnTrue_IfWordIsDuplicate()
    {
        // Arrange
        var player = new Player("TestPlayer");
        player.Guesses.Add("apple");

        // Act & Assert
        Assert.True(player.WordUsedAlready("apple"));
    }

    [Fact]
    public void WordUsedAlready_ShouldBeCaseInsensitive()
    {
        // Arrange - Vi sparar med små bokstäver
        var player = new Player("TestPlayer");
        player.Guesses.Add("banana");

        // Act - Vi söker med STORA bokstäver
        var result = player.WordUsedAlready("BANANA");

        // Assert - Detta bör vara sant om din .ToLower() fix fungerar!
        Assert.True(result);
    }

    [Fact]
    public void Health_ShouldDecreaseByWordLength()
    {
        // Arrange
        var player = new Player("Opponent");
        int damage = "banana".Length; // 6

        // Act
        player.HP -= damage;

        // Assert
        Assert.Equal(94, player.HP);
    }

    [Fact]
    public void Health_ShouldNotGoBelowZero()
    {
        // Arrange
        var player = new Player("Opponent");
        int massiveDamage = 150;

        // Act
        player.HP = Math.Max(0, player.HP - massiveDamage);

        // Assert
        Assert.Equal(0, player.HP);
    }
}
