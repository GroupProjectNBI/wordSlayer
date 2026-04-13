using backend;

var builder = WebApplication.CreateBuilder(args);

// --- LÄGG TILL DETTA INNAN BUILD ---
// Detta gör att din lista med spel överlever och inte nollställs varje gång!
builder.Services.AddSingleton<GameManager>();

var app = builder.Build();

if (string.IsNullOrWhiteSpace(builder.Configuration["urls"]))
{
    builder.WebHost.UseUrls("http://*:80", "https://*:443");
}

// --- LÄGG TILL DIN ENDPOINT HÄR (Mellan StaticFiles och Run) ---
app.MapGet("/api/newGame", (GameManager manager) =>
{
    // 1. Skapa spelet (Vi sätter in "Player 1" som start)
    GameSession createdGame = manager.CreateGame("Player 1");

    // 2. Returnera hela GameSession-objektet som JSON
    return Results.Ok(createdGame);
});

// 2. Endpointen! Märk att {sessionId} ligger direkt i URL:en
app.MapPost("/api/game/{sessionId}/join", (Guid sessionId, JoinGameRequest request, GameManager manager) =>
{
    // DÖRRVAKTEN: Om någon skickar in tomt namn, svara med 400 Bad Request direkt!
    // (request? gör att programmet inte kraschar om hela body:n saknas)
    if (string.IsNullOrWhiteSpace(request?.PlayerName))
    {
        return Results.BadRequest(new { message = "Spelarnamn får inte vara tomt!" });
    }

    // Nu vet vi att vi har ett namn! Vi försöker joina...
    GameSession? updatedGame = manager.JoinGame(sessionId, request.PlayerName);

    if (updatedGame == null)
    {
        return Results.NotFound(new { message = "Kunde inte hitta spelrummet. Kontrollera koden!" });
    }

    return Results.Ok(updatedGame);
});

// Servera klienten från wwwroot på /
app.UseDefaultFiles();
app.UseStaticFiles();

//API-routes ovanför denna
app.MapFallbackToFile("index.html");







// MÅSTE LIGGA SIST AV ALL KÖRANDE KOD!
app.Run();


// ==========================================
// ALLA EGNA KLASSER MÅSTE LIGGA HÄR NERE 
// (Eller i en helt egen fil)
// ==========================================

// 1. En liten "brevlåda" för att ta emot namnet från React (JSON-body)
public class JoinGameRequest
{
    public string PlayerName { get; set; } = string.Empty;
}