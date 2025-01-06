namespace Api.Services;

public interface ICategorizationService
{
    Task<string> AssignCategory(string imageUrl, string description);
}