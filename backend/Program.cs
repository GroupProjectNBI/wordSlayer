using backend;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<WordService>();


// --- LÄGG TILL DETTA INNAN BUILD ---
// Detta gör att din lista med spel överlever och inte nollställs varje gång!
builder.Services.AddSingleton<GameManager>();

var app = builder.Build();

app.Services.GetRequiredService<WordService>();
if (string.IsNullOrWhiteSpace(builder.Configuration["urls"]))
{
    builder.WebHost.UseUrls("http://*:80", "https://*:443");
}

// --- LÄGG TILL DIN ENDPOINT HÄR (Mellan StaticFiles och Run) ---
app.MapGet("/api/newGame", (GameManager manager) =>
{
    // 1. Skapa spelet (Vi sätter in "Player 1" som start)
    GameSession createdGame = manager.CreateGame("Player 1");

    // 1) Servera klienten från wwwroot på /

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


app.MapPost("/api/game/{sessionId}/playword", (Guid sessionId, HandeWordRequest? request, WordService wordService) =>
{
    if (string.IsNullOrWhiteSpace(request?.wordGuess))
    {
        return Results.BadRequest(new { message = "Där är inget ord som har spelats!" });
    }

    // Kolla om det ens är ett riktigt engelskt ord!
    if (!wordService.IsValidWord(request.wordGuess))
    {
        return Results.BadRequest(new { message = "Ordet finns inte i den engelska ordlistan!" });
    }

    // --- Nästa steg: Skicka ordet till GameManager för att hantera ord räkning  (om det är rätt ord) ---

    return Results.Ok(request.wordGuess);
});

// Servera klienten från wwwroot på /

app.UseDefaultFiles();
app.UseStaticFiles();

//API-routes ovanför denna
app.MapFallbackToFile("index.html");



// ==========================================
// ALLA EGNA KLASSER MÅSTE LIGGA HÄR NERE 
// (Eller i en helt egen fil)
// ==========================================

public class HandeWordRequest
{
    public string wordGuess { get; set; } = string.Empty;

}

// 1. En liten "brevlåda" för att ta emot namnet från React (JSON-body)
public class JoinGameRequest
{
    public string PlayerName { get; set; } = string.Empty;

}