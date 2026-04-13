using backend;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<WordService>();


var app = builder.Build();

app.Services.GetRequiredService<WordService>();
if (string.IsNullOrWhiteSpace(builder.Configuration["urls"]))
{
    builder.WebHost.UseUrls("http://*:80", "https://*:443");
}


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

// 1) Servera klienten från wwwroot på /
app.UseDefaultFiles();
app.UseStaticFiles();

//API-routes ovanför denna
app.MapFallbackToFile("index.html");

app.Run();

public class HandeWordRequest
{
    public string wordGuess { get; set; } = string.Empty;
}