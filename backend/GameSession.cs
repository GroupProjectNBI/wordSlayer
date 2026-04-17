namespace backend;

using System;
using System.Collections.Generic;

/// <summary>
/// GameSession representerar ett enskilt "Spelrum" eller "Spelbräde".
/// Den håller koll på allt som händer i just DENNA match, helt isolerat från andra spel.
/// </summary>
public class GameSession
{
    /// <summary>
    /// Den unika nyckeln till detta spelrum. 
    /// Det är denna React (Frontend) måste skicka med för att bevisa vilket spel de tillhör.
    /// </summary>
    public Guid SessionId { get; set; }

    /// <summary>
    /// En lista med de spelare som befinner sig i just detta rum.
    /// Om det är ett 1v1-spel kommer denna lista max ha två objekt i sig.
    /// </summary>
    public List<Player> Players { get; set; } = new List<Player>();
    
    // --- Logik för vinst och status ---
    public string Status { get; set; } = "InProgress"; // Håller koll på om spelet pågår eller är slut
    public string? Winner { get; set; } // Sparar namnet på vinnaren

    public GameSession()
    {
        // Vi skapar ett unikt ID för spelet när rummet byggs.
        // (Detta fungerar nu felfritt tack vare din .getGuid() lösning!)
        SessionId = new GameId().getGuid();
    }
    // --- NY FUNKTION: HÄR LÄGGER DU LOGIKEN ---
    public void ApplyDamage(int playerIndex, int amount)
    {
        // 1. Kontrollera att spelaren finns
        if (playerIndex < 0 || playerIndex >= Players.Count) return;

        // 2. Minska HP
        Players[playerIndex].HP -= amount;

        // 3. Kontrollera om någon förlorade (HP nådde 0)
        if (Players[playerIndex].HP <= 0)
        {
            Players[playerIndex].HP = 0;
            Status = "Finished";
            
            // Om playerIndex 1 dog, vann playerIndex 0 (och tvärtom)
            int winnerIndex = (playerIndex == 0) ? 1 : 0;
            Winner = Players[winnerIndex].Name;
        }
    }
}