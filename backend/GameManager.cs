namespace backend;

using System;
using System.Collections.Generic;
using System.Linq;

/// <summary>
/// GameManager agerar "Receptionist" eller "Databas" för hela servern.
/// Denna klass lever under hela tiden servern är igång och håller koll på ALLA pågående spel.
/// </summary>
public class GameManager
{
    // HÄR ÄR VÅRT "MINNE" (Databasen)
    // Key: Ett unikt ID för rummet (Guid) 
    // Value: Själva rummet/spelbrädet som innehåller spelarna (GameSession)
    private readonly Dictionary<Guid, GameSession> _activeGames = new Dictionary<Guid, GameSession>();

    /// <summary>
    /// Skapar ett helt nytt spel och lägger till den första spelaren.
    /// Används när någon klickar på "Starta nytt spel" i React.
    /// </summary>

    // Exempel 1: Skapa en ny session och lägg till 1 startspelare
    public GameSession CreateGame(string player1Name)
    {
        // 1. Skapa ett nytt, tomt spelrum
        GameSession newGame = new GameSession();

        // 2. Skapa den första spelaren och ställ in dem i rummet
        newGame.Players.Add(new Player(player1Name));

        // 3. Spara rummet i vår Dictionary så vi hittar det senare
        _activeGames.Add(newGame.SessionId, newGame);

        // 4. Returnera det färdiga rummet så React kan rita upp det
        return newGame;
    }
    // ny funktion joingame för att att hantera join new player
    /// Låter en ny spelare ansluta till ett REDAN EXISTERANDE spel.
    /// Spelaren som ansluter får automatiskt namnet Player 2.
    /// </summary>
    public GameSession? JoinGame(Guid sessionId)
    {
        return JoinGame(sessionId, "Player 2");
    }

    /// <summary>
    /// Låter en ny spelare ansluta till ett REDAN EXISTERANDE spel.
    /// Spelaren som ansluter får automatiskt namnet Player 2 om inget namn anges.
    /// </summary>
    public GameSession? JoinGame(Guid sessionId, string playerName)
    {
        // 1. Leta i vår Dictionary: Finns det ett rum med detta ID?
        if (_activeGames.TryGetValue(sessionId, out GameSession? gameToJoin))
        {
            // If the room already has two players, do not allow more joins.
            if (gameToJoin.Players.Count >= 2)
            {
                return null;
            }

            // 2. Lägg till spelaren med angivet namn.
            gameToJoin.Players.Add(new Player(playerName));

            // 3. Returnera det uppdaterade spelet (som nu har två spelare)
            return gameToJoin;
        }

        // 4. Om rummet inte fanns (fel ID), returnera null
        return null;
    }

    /// <summary>
    /// Hämtar all data om ett specifikt spel baserat på ID.
    /// Används tex. för att hämta spelet om användaren uppdaterar (F5) webbläsaren.
    /// </summary>
    public GameSession? GetGameById(Guid sessionId)
    {
        // LÖSNING: Använd "out var game" istället!
        if (_activeGames.TryGetValue(sessionId, out var game))
        {
            return game;
        }

        return null;
    }

}