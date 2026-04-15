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

app.MapPost("/api/game/{sessionId}/playword", (Guid sessionId, HandeWordRequest? request, WordService wordService) =>
{
    if (string.IsNullOrWhiteSpace(request?.wordGuess))
    {
        return Results.BadRequest(new { message = "Där är inget ord som har spelats!" });
    }

    // Kolla om det är ett giltigt engelskt ord
    if (!wordService.IsValidWord(request.wordGuess))
    {
        return Results.BadRequest(new { message = "Ordet finns inte i den engelska ordlistan!" });
    }

    // TODO: Skicka ordet till GameManager för att hantera spelregler (poäng/HP)
    return Results.Ok(request.wordGuess);
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
}

public class JoinGameRequest
{
    public string PlayerName { get; set; } = string.Empty;
}