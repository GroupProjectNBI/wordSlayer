namespace backend;

using System;
using System.Collections.Generic;

public class GameSession
{
    public Guid SessionId { get; set; }
    public List<Player> Players { get; set; } = new List<Player>();

    public GameSession()
    {
        // Detta fungerar nu felfritt!
        SessionId = new GameId().getGuid();
    }
}