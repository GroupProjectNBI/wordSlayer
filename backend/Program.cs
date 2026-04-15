using backend;

var builder = WebApplication.CreateBuilder(args);

// 1. Konfiguration
if (string.IsNullOrWhiteSpace(builder.Configuration["urls"]))
{
    builder.WebHost.UseUrls("http://*:80", "https://*:443");
}

// 2. Registrera tjänster (Dependency Injection)
builder.Services.AddSingleton<WordService>();
builder.Services.AddSingleton<GameManager>();

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
app.MapGet("/api/newGame", (GameManager manager) =>
{
    // Skapa spelet (Vi sätter in "Player 1" som start)
    GameSession createdGame = manager.CreateGame("Player 1");
    return Results.Ok(createdGame);
});

app.MapPost("/api/game/{sessionId}/join", (Guid sessionId, JoinGameRequest request, GameManager manager) =>
{
    // DÖRRVAKTEN: Kontrollera spelarnamn
    if (string.IsNullOrWhiteSpace(request?.PlayerName))
    {
        return Results.BadRequest(new { message = "Spelarnamn får inte vara tomt!" });
    }

    GameSession? updatedGame = manager.JoinGame(sessionId, request.PlayerName);

    if (updatedGame == null)
    {
        return Results.NotFound(new { message = "Kunde inte hitta spelrummet. Kontrollera koden!" });
    }

    return Results.Ok(updatedGame);
});

app.MapPost("/api/game/{sessionId}/playword", (Guid sessionId, HandeWordRequest request, WordService wordService, GameManager gameManager) =>
{
    // 1. Hämta spelet
    var game = gameManager.GetGameById(sessionId);
    if (game == null) return Results.NotFound(new { message = "Spelet hittades inte!" });

    // 2. Hitta spelaren som skickade ordet
    var player = game.Players.FirstOrDefault(p => p.Name == request.PlayerId);
    if (player == null) return Results.BadRequest(new { message = "Spelaren hittades inte i detta spel!" });

    // 3. Kontrollera om ordet redan har använts av DENNA spelare
    // (Vi använder din metod från Player-klassen!)
    if (player.WordUsedAlready(request.wordGuess))
    {
        return Results.BadRequest(new { message = "Du har redan använt detta ordet!" });
    }

    // 4. Validera ordet mot ordlistan (WordService)
    if (!wordService.IsValidWord(request.wordGuess))
    {
        return Results.BadRequest(new { message = "Ordet finns inte i ordlistan!" });
    }

    // 5. Allt är OK! Spara ordet i spelarens egen lista
    player.Guesses.Add(request.wordGuess.Trim().ToLower());

    // Vi skickar tillbaka hela 'game' så React får den uppdaterade listan automatiskt
    return Results.Ok(game);
});

// 6. Fallback & Start (Fallback sköter React-routing)
app.MapFallbackToFile("index.html");

app.Run();


// ==========================================
// DATA-KLASSER (DTOs)
// ==========================================

public class HandeWordRequest
{
    public string wordGuess { get; set; } = string.Empty;
    // NYTT: Vem är det som skickar ordet?
    public string PlayerId { get; set; } = string.Empty;
}

public class JoinGameRequest
{
    public string PlayerName { get; set; } = string.Empty;
}