namespace backend;

using System.Collections.Generic;

/// <summary>
/// Player representerar en enskild deltagare i ett spel.
/// Klassen är ganska "dum" - den vet inte vilket rum den är i eller vad reglerna är.
/// Den håller bara koll på sin egen status (sitt namn, sitt liv, och vad den har gissat).
/// </summary>
public class Player
{
    /// <summary>
    /// Spelarens visningsnamn (t.ex. "Kalle" eller "Player 1").
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// Spelarens livsmätare. 
    /// Sätts automatiskt till 100 när spelaren skapas och dras ner vid felaktiga gissningar.
    /// </summary>
    public int Health { get; set; } = 100;

    /// <summary>
    /// En historik över exakt vilka ord just den här spelaren har gissat på.
    /// Jättebra för React att kunna rita upp en lista, och bra för backend för att 
    /// hindra spelaren från att gissa på samma felaktiga ord två gånger!
    /// </summary>
    public List<string> Guesses { get; set; } = new List<string>();

    /// <summary>
    /// Konstruktor: När vi skapar en spelare MÅSTE vi ge den ett namn direkt.
    /// </summary>
    public Player(string name)
    {
        Name = name;
    }
}