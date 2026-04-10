namespace backend;

using System;


public class GameId
{
  public Guid GameID;

  public GameId()
  {
    GameID = Guid.NewGuid();
  }

  public Guid getGuid()
  {
    return GameID;
  }

}