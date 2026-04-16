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

app.MapPost("/api/game/{sessionId}/join", (Guid sessionId, JoinGameRequest? request, GameManager manager) =>
{
    var game = manager.GetGameById(sessionId);
    if (game == null) return Results.NotFound(new { message = "Spelet hittades inte!" });

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

        return Results.Ok(updatedGame);
    }

    // Om inget namn anges, använd säkrare auto-assign-flöde.
    GameSession? joinedGame = manager.JoinGame(sessionId);
    if (joinedGame == null)
    {
        return Results.NotFound(new { message = "Kunde inte hitta spelrummet. Kontrollera koden!" });
    }

    return Results.Ok(joinedGame);
});

app.MapPost("/api/game/{sessionId}/playword", (Guid sessionId, HandeWordRequest request, WordService wordService, GameManager gameManager) =>
{
    // 1. Hämta spelet
    var game = gameManager.GetGameById(sessionId);
    if (game == null) return Results.NotFound(new { message = "Spelet hittades inte!" });

    // 2. Hitta vem som attackerar (den som skickade anropet)
    var attacker = game.Players.FirstOrDefault(p => p.Name == request.PlayerId);
    if (attacker == null) return Results.BadRequest(new { message = "Spelaren hittades inte!" });
    // Fixa ordet direkt så vi jobbar med samma version hela tiden
    string normalizedWord = request.wordGuess.Trim().ToLower();
    // 3. Hitta motståndaren (den som INTE är attackeraren)
    var opponent = game.Players.FirstOrDefault(p => p.Name != request.PlayerId);
    if (opponent == null) return Results.BadRequest(new { message = "Väntar på att motståndaren ska ansluta..." });

    // 4. KONTROLL: Är ordet korrekt och inte använt tidigare?
    // Kolla dubblett med det normaliserade ordet
    if (attacker.WordUsedAlready(normalizedWord))
    {
        return Results.BadRequest(new { message = "Du har redan använt detta ordet!" });
    }

    if (!wordService.IsValidWord(request.wordGuess))
    {
        return Results.BadRequest(new { message = "Ordet finns inte i ordlistan!" });
    }

    // 5. BERÄKNA SKADA: Hur långt är ordet?
    int damage = request.wordGuess.Trim().Length;

    // 6. REDUCERA HÄLSA: Dra av skadan från motståndaren
    // Math.Max(0, ...) gör att hälsan aldrig blir minus (t.ex. -5 HP)
    opponent.Health = Math.Max(0, opponent.Health - damage);

    // 7. SPARA: Lägg till ordet i historiken
    attacker.Guesses.Add(request.wordGuess.Trim().ToLower());

    // Skicka tillbaka det uppdaterade spelet
    return Results.Ok(game);
});

// 6. Fallback & Start (Fallback sköter React-routing)
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
}

