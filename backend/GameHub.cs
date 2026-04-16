using Microsoft.AspNetCore.SignalR;

namespace backend
{
    public class GameHub : Hub
    {
        // Called when a player joins a game room
        public async Task PlayerJoined(string sessionId, string playerName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, sessionId);
            await Clients.Group(sessionId).SendAsync("PlayerJoined", playerName);
        }

        // Called when a player leaves a game room
        public async Task PlayerLeft(string sessionId, string playerName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, sessionId);
            await Clients.Group(sessionId).SendAsync("PlayerLeft", playerName);
        }
    }
}
