namespace backend.Tests;

using backend;
using Xunit;

public class WordServiceTests
{
    [Fact]
    public void IsValidWord_ShouldReturnTrue_ForExistingWord()
    {
        // Arrange - Skapa en ordbok med tre låtsas-ord
        string[] mockDictionary = { "apple", "banana", "cat" };
        WordService wordService = new WordService(mockDictionary);

        // Act & Assert - Kolla att den hittar orden, oavsett stora/små bokstäver!
        Assert.True(wordService.IsValidWord("apple", "eng"));
        Assert.True(wordService.IsValidWord("APPLE", "eng")); // Testar case-insensitivity
        Assert.True(wordService.IsValidWord("  banana  ", "eng")); // (Frivilligt) Om vi vill tillåta mellanslag
        Assert.False(wordService.IsValidWord("  ojfaöojoöae  ", "eng")); // (Frivilligt) Om vi vill tillåta mellanslag
    }

    [Fact]
    public void IsValidWord_ShouldReturnFalse_ForMissingWord()
    {
        // Arrange
        string[] mockDictionary = { "apple", "banana" };
        WordService wordService = new WordService(mockDictionary);

        // Act & Assert
        Assert.False(wordService.IsValidWord("car", "eng"));
        Assert.False(wordService.IsValidWord("", "eng")); // Tomma strängar ska ge false
    }
}