namespace backend;

using System.Collections.Generic;

public class Player
{
    public string Name { get; set; }

    // Sätts automatiskt till 100 när spelaren skapas
    public int Health { get; set; } = 100;

    // En lista som sparar alla ord just den här spelaren har gissat på
    public List<string> Guesses { get; set; } = new List<string>();

    public Player(string name)
    {
        Name = name;
    }
}