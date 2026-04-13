using backend; // Viktigt! Detta gör så att filen hittar din GameManager

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

// Servera klienten från wwwroot på /
app.UseDefaultFiles();
app.UseStaticFiles();

//API-routes ovanför denna
app.MapFallbackToFile("index.html");




app.Run();