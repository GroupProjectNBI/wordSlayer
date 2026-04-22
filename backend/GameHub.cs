using Microsoft.AspNetCore.SignalR;

namespace backend
{
  public class GameHub : Hub
  {
    public async Task PlayerJoined(string sessionId, string playerName)
    {
      // 1. Lägg till i gruppen FÖRST
      await Groups.AddToGroupAsync(Context.ConnectionId, sessionId);

      // 2. Meddela de andra i rummet
      await Clients.OthersInGroup(sessionId).SendAsync("PlayerJoined", playerName);

      // System.Console.WriteLine($"SignalR: {playerName} anslöt till rum {sessionId}");
    }

    public async Task PlayerLeft(string sessionId, string playerName)
    {
      await Groups.RemoveFromGroupAsync(Context.ConnectionId, sessionId);
      await Clients.Group(sessionId).SendAsync("PlayerLeft", playerName);
    }
  }
}