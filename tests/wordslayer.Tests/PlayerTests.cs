using backend;
using Xunit;

public class PlayerTests
{
    [Fact]
    public void WordUsedAlready_ShouldReturnTrue_WhenWordIsDuplicate()
    {
        // Arrange (Förberedelser)
        var player = new Player("Player1");
        player.Guesses.Add("banana");

        // Act (Utför handlingen)
        var result = player.WordUsedAlready("banana");

        // Assert (Kontrollera resultatet)
        Assert.True(result);
    }

    [Fact]
    public void WordUsedAlready_ShouldReturnFalse_WhenWordIsNew()
    {
        // Arrange
        var player = new Player("Player1");
        player.Guesses.Add("apple");

        // Act
        var result = player.WordUsedAlready("banana");

        // Assert
        Assert.False(result);
    }
}