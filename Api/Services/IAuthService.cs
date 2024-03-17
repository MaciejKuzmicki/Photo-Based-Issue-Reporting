using Api.Models;

namespace Api.Services;

public interface IAuthService
{
    string CreateJwtToken(User user, List<string> roles);
}