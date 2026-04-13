

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

if (string.IsNullOrWhiteSpace(builder.Configuration["urls"]))
{
    builder.WebHost.UseUrls("http://*:80", "https://*:443");
}


// 1) Servera klienten från wwwroot på /
app.UseDefaultFiles();
app.UseStaticFiles();

//API-routes ovanför denna
app.MapFallbackToFile("index.html");

app.Run();
