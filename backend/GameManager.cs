namespace backend;

using System;
using System.Collections.Generic;
using System.Linq;

public class GameManager
{
    // HÄR ÄR DIN DICTIONARY!
    // Key: Guid (SessionId) | Value: GameSession (Spelare, hp, gissningar)
    private readonly Dictionary<Guid, GameSession> _activeGames = new Dictionary<Guid, GameSession>();

    // Exempel 1: Skapa en ny session och lägg till 1 startspelare
    public GameSession CreateGame(string player1Name)
    {
        GameSession newGame = new GameSession();
        newGame.Players.Add(new Player(player1Name));

        _activeGames.Add(newGame.SessionId, newGame);

        return newGame;
    }


    // ny funktion joingame för att att hantera join new player
}