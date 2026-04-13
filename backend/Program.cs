

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

if (string.IsNullOrWhiteSpace(builder.Configuration["urls"]))
{
    builder.WebHost.UseUrls("http://*:80", "https://*:443");
}


app.MapPost("/api/game/{sessionId}/playword", (Guid sessionId, HandeWordRequest request) =>
{

    if (string.IsNullOrWhiteSpace(request?.wordGuess))
    {
        return Results.BadRequest(new { message = "Där är inget ord som har spelats!" });
    }



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