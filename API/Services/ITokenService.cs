using API.Data.Models;

namespace API.Services;

public interface ITokenService
{
    string CreateToken(User user);
}
