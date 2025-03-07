using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Mvc; // Add this for [FromBody]
using System;
using System.Linq;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

// Modify to be a POST endpoint and receive data (even if not used)
app.MapPost("/weatherforecast", ([FromBody] WeatherForecastRequest request) =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast") // Keep the same name, but it's now a POST
.WithOpenApi();

// Modify to be a POST endpoint and receive data (even if not used)
app.MapPost("/flashcardpack", ([FromBody] FlashcardPackRequest request) =>
{
    var flashcardPack = new FlashcardPack
    {
        GUID = "sample-flashcard-pack-guid-123",
        name = "Sample Flashcard Pack",
        flashcards = new[]
        {
            new Flashcard
            {
                GUID = "flashcard-guid-1",
                question = "What is the capital of France?",
                answer = "Paris"
            },
            new Flashcard
            {
                GUID = "flashcard-guid-2",
                question = "What is 2 + 2?",
                answer = "4"
            },
            new Flashcard
            {
                GUID = "flashcard-guid-3",
                question = "What is the chemical symbol for water?",
                answer = "H2O"
            }
        }
    };
    return flashcardPack;
})
.WithOpenApi();


app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}

// Define the C# classes to match the TypeScript interfaces
public class Flashcard
{
    public string GUID { get; set; }
    public string question { get; set; }
    public string answer { get; set; }
}

public class FlashcardPack
{
    public string GUID { get; set; }
    public string name { get; set; }
    public Flashcard[] flashcards { get; set; }
}

// Placeholder class to receive data for /weatherforecast POST endpoint
public class WeatherForecastRequest
{
    // You can add properties here if you expect to receive any data
    // For now, it's an empty class as per the request to just receive data.
}

// Placeholder class to receive data for /flashcardpack POST endpoint
public class FlashcardPackRequest
{
    // You can add properties here if you expect to receive any data
    // For now, it's an empty class as per the request to just receive data.
}