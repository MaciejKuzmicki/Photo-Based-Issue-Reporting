using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace Api.Services;

public class CategorizationService : ICategorizationService
{
    private readonly HttpClient _httpClient;

    public CategorizationService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }
    
    public async Task<string> AssignCategory(string imageUrl, string description)
    {
        var prompt = $"Na podstawie zdjęcia {imageUrl} oraz opisu {description} napisz do której kategorii najbardziej pasuje dane zgłoszenie. Możesz odpowiedzieć na to zapytanie wylacznie jedną z wymienionych kategorii poniżej, a jeżeli nie jesteś pewny użyj kategorii Inne:\n" +
                     "\"Infrastruktura drogowa\",\n" +
                     "\"Oświetlenie publiczne\",\n" +
                     "\"Zieleń miejska i środowisko\",\n" +
                     "\"Gospodarka odpadami\",\n" +
                     "\"Transport publiczny\",\n" +
                     "\"Bezpieczeństwo publiczne\",\n" +
                     "\"Inne\"";
        var apiKey = "";

        var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={apiKey}";
        
        var requestData = new
        {
            contents = new[]
            {
                new 
                {
                    parts = new[]
                    {
                        new { text = prompt }
                    }
                }
            }
        };
        
        var jsonContent = JsonSerializer.Serialize(requestData);
        var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");
        var category = "";
        try
        {
            var response = await _httpClient.PostAsync(url, content);
            if (response.IsSuccessStatusCode)
            {
                category = await response.Content.ReadAsStringAsync();
                category = JsonDocument.Parse(category)
                    .RootElement
                    .GetProperty("candidates")[0]
                    .GetProperty("content")
                    .GetProperty("parts")[0]
                    .GetProperty("text").GetString().Trim();
            }
            else
            {
                return "Inne";
            }
        }
        catch (Exception ex)
        {
            return "Inne";
        }

        
        // var category = responseJson.choices[0].message.content.ToString();

        // Sprawdzenie, czy kategoria jest poprawna
        var validCategories = new[]
        {
            "Infrastruktura drogowa",
            "Oświetlenie publiczne",
            "Zieleń miejska i środowisko",
            "Gospodarka odpadami",
            "Transport publiczny",
            "Bezpieczeństwo publiczne"
        };
        return validCategories.Any(c => c == category) ? category : "Inne"; 
    }
    
}