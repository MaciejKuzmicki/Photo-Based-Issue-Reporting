namespace Api.Services;

public class CategorizationService2 : IcategorizationService 
{
    private readonly HttpClient _httpClient;

    public CategorizationService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<string> AssignCategory(string imageUrl, string description)
    {
        const string fastApiUrl = "http://localhost:8000/predict";

        var requestData = new
        {
            url = imageUrl,
            model_type = "resnet50"
        };

        string jsonPayload = JsonSerializer.Serialize(requestData);
        using var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

        try
        {
            using var client = new HttpClient();
            var response = await client.PostAsync(fastApiUrl, content);

            if (response.IsSuccessStatusCode)
            {
                var responseString = await response.Content.ReadAsStringAsync();
                
                using var doc = JsonDocument.Parse(responseString);
                string category = doc.RootElement.GetProperty("category").GetString();

                return category;
            }
            else
            {
                return "Błąd: Serwer klasyfikacji zwrócił status " + response.StatusCode;
            }
        }
        catch (Exception ex)
        {
            return "Błąd połączenia z modułem AI: " + ex.Message;
        }
    }
}