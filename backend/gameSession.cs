namespace backend;

using System;
using System.Collections.Generic;

public class GameSession
{
    public Guid SessionId { get; }

    // Här sparar vi alla spelare som är med i just denna session
    public List<Player> Players { get; set; } = new List<Player>();

    public GameSession()
    {
        SessionId = Guid.NewGuid();
    }
}