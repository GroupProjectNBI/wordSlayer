using backend;
using Microsoft.AspNetCore.SignalR;

var builder = WebApplication.CreateBuilder(args);

// 1. Konfiguration
if (string.IsNullOrWhiteSpace(builder.Configuration["urls"]))
{
    builder.WebHost.UseUrls("http://*:80", "https://*:443");
}

// 2. Registrera tjänster (Dependency Injection)
builder.Services.AddSingleton<WordService>();
builder.Services.AddSingleton<GameManager>();
builder.Services.AddSignalR();

var app = builder.Build();

// 3. Initiera tjänster (Tvingar WordService att ladda ordlistan direkt)
app.Services.GetRequiredService<WordService>();

// 4. Middleware (Statisk filservering)
app.UseDefaultFiles();

app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        // Om filen webbläsaren frågar efter råkar vara index.html...
        if (ctx.File.Name.Equals("index.html", StringComparison.OrdinalIgnoreCase))
        {
            // ...säg åt webbläsaren att ALDRIG cacha den!
            ctx.Context.Response.Headers.Append("Cache-Control", "no-cache, no-store, must-revalidate");
            ctx.Context.Response.Headers.Append("Pragma", "no-cache");
            ctx.Context.Response.Headers.Append("Expires", "0");
        }
    }
});

// 5. API-Endpoints
app.MapGet("/health", () => Results.Ok("ok"));

app.MapGet("/api/newGame", (GameManager manager) =>
{
    // Skapa spelet (Vi sätter in "Player 1" som start)
    GameSession createdGame = manager.CreateGame("Player 1");
    return Results.Ok(createdGame);
});

app.MapPost("/api/game/{sessionId}/join", async (Guid sessionId, JoinGameRequest? request, GameManager manager, Microsoft.AspNetCore.SignalR.IHubContext<backend.GameHub> hubContext) =>
{
    var game = manager.GetGameById(sessionId);
    if (game == null) return Results.NotFound(new { message = "Spelet hittades inte!" });

    string? playerName = null;

    // DÖRRVAKTEN: Validera spelarnamn om det skickas med.
    if (request != null && !string.IsNullOrWhiteSpace(request.PlayerName))
    {
        var user = game.Players.FirstOrDefault(p => p.Name == request.PlayerName);
        if (user != null) return Results.Conflict(new { message = "Spelare finns redan!" });

        GameSession? updatedGame = manager.JoinGame(sessionId, request.PlayerName);
        if (updatedGame == null)
        {
            return Results.NotFound(new { message = "Kunde inte hitta spelrummet. Kontrollera koden!" });
        }
        playerName = request.PlayerName;
        // Notify all clients in the session that a player joined
        await hubContext.Clients.Group(sessionId.ToString()).SendAsync("PlayerJoined", playerName);
        return Results.Ok(updatedGame);
    }

    // Om inget namn anges, använd säkrare auto-assign-flöde.
    GameSession? joinedGame = manager.JoinGame(sessionId);
    if (joinedGame == null)
    {
        return Results.NotFound(new { message = "Kunde inte hitta spelrummet. Kontrollera koden!" });
    }
    playerName = joinedGame.Players.LastOrDefault()?.Name;
    if (!string.IsNullOrEmpty(playerName))
    {
        await hubContext.Clients.Group(sessionId.ToString()).SendAsync("PlayerJoined", playerName);
    }
    return Results.Ok(joinedGame);
});

// Denna endpoint används för att hämta spelets nuvarande status (F5 eller nyladdning)
app.MapGet("/api/game/{sessionId}", (Guid sessionId, GameManager manager) =>
{
    var game = manager.GetGameById(sessionId);

    if (game == null)
    {
        return Results.NotFound(new { message = "Spelet hittades inte!" });
    }

    // Vi returnerar hela objektet. .NET kommer automatiskt göra om 
    // PascalCase (Health) till camelCase (health) för React.
    return Results.Ok(game);
});

app.MapPut("/api/game/{sessionId}/language", (Guid sessionId, LanguageRequest request, GameManager manager) =>
{
    // 1. Tvätta datan från React (som vi pratade om tidigare)
    string safeLangCode = request.Language?.ToLower() == "swe" ? "swe" : "eng";

    // 2. Försök uppdatera språket i RUMMET via din GameManager
    bool success = manager.UpdateGameLanguage(sessionId, safeLangCode);

    // 3. Om rummet inte fanns (fel ID)
    if (!success)
    {
        return Results.NotFound(new { message = "Spelet hittades inte!" });
    }

    // 4. Returnera OK!
    return Results.Ok(new { message = "Språk uppdaterat!", language = safeLangCode });
});
app.MapPost("/api/game/{sessionId}/playword", async (
    Guid sessionId,
    HandeWordRequest request,
    WordService wordService,
    GameManager gameManager,
    IHubContext<backend.GameHub> hubContext) =>
{
    var game = gameManager.GetGameById(sessionId);
    var languageSwitch = request.Language?.ToLower() == "swe" ? "swe" : "eng";

    if (game == null) return Results.NotFound(new { message = "Spelet hittades inte!" });

    var attacker = game.Players.FirstOrDefault(p => p.Name == request.PlayerId);
    if (attacker == null) return Results.BadRequest(new { message = "Spelaren hittades inte!" });

    var opponent = game.Players.FirstOrDefault(p => p.Name != request.PlayerId);
    if (opponent == null) return Results.BadRequest(new { message = "Väntar på motståndare..." });

    string normalizedWord = request.wordGuess.Trim().ToLower();

    // VALIDERDADE REGLER
    if (attacker.WordUsedAlready(normalizedWord))
        return Results.BadRequest(new { message = "Du har redan använt detta ordet!" });

    if (!wordService.IsValidWord(request.wordGuess, languageSwitch))
        return Results.BadRequest(new { message = "Ordet finns inte i ordlistan!" });

    // --- STEG 1: APPLICERA SKADA PÅ OBJEKTET ---
    int damage = request.wordGuess.Trim().Length;
    opponent.Health = Math.Max(0, opponent.Health - damage);
    attacker.Guesses.Add(normalizedWord);

    // --- STEG 2: BERÄKNA NÄSTA TUR ---
    string nextTurn = request.PlayerId == "Player 1" ? "player2" : "player1";

    // --- STEG 3: HÄMTA DE UPPDATERADE VÄRDENA (Säkrare matchning) ---
    // Vi letar upp spelarna specifikt för att veta vem som är vem på skärmen
    var p1 = game.Players.FirstOrDefault(p => p.Name == "Player 1");
    var p2 = game.Players.FirstOrDefault(p => p.Name == "Player 2");

    int p1Hp = p1?.Health ?? 100;
    int p2Hp = p2?.Health ?? 100;

    // --- STEG 4: SKICKA SIGNALEN TILL ALLA ---
    // Nu innehåller p1Hp och p2Hp de nya värdena efter skadan
    await hubContext.Clients.Group(sessionId.ToString()).SendAsync("TurnChanged", nextTurn, p1Hp, p2Hp);

    return Results.Ok(game);
});
app.MapPost("/api/game/{sessionId}/timeout", async (
    Guid sessionId,
    string playerId,
    GameManager gameManager,
    IHubContext<backend.GameHub> hubContext) =>
{
    var game = gameManager.GetGameById(sessionId);
    if (game == null) return Results.NotFound();

    // Beräkna nästa tur (om Player 1 fick timeout, blir det player2)
    string nextTurn = playerId == "Player 1" ? "player2" : "player1";

    // Hämta nuvarande HP (ingen skada sker vid timeout)
    var p1 = game.Players.FirstOrDefault(p => p.Name == "Player 1");
    var p2 = game.Players.FirstOrDefault(p => p.Name == "Player 2");

    // Meddela alla via SignalR
    await hubContext.Clients.Group(sessionId.ToString())
        .SendAsync("TurnChanged", nextTurn, p1?.Health ?? 100, p2?.Health ?? 100);

    return Results.Ok();
});

app.UseWebSockets();
// 6. SignalR endpoint
app.MapHub<backend.GameHub>("/gamehub");

// 7. Fallback & Start (Fallback sköter React-routing)
app.MapFallbackToFile("index.html");

app.Run();

// ==========================================
// DATA-KLASSER (DTOs)
// ==========================================

public class JoinGameRequest
{
    public string PlayerName { get; set; } = string.Empty;
}

public class HandeWordRequest
{
    public string wordGuess { get; set; } = string.Empty;
    // NYTT: Vem är det som skickar ordet?
    public string PlayerId { get; set; } = string.Empty;
    public string Language { get; set; } = string.Empty;
}

public record LanguageRequest(string Language);
