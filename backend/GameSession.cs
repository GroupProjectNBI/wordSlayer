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

    public string Language { get; set; } = "eng";

    public GameSession()
    {
        // Vi skapar ett unikt ID för spelet när rummet byggs.
        // (Detta fungerar nu felfritt tack vare din .getGuid() lösning!)
        SessionId = new GameId().getGuid();
    }
}