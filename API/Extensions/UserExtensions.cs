using API.Data.Models;
using API.DTOs.Auth;
using API.Services;

namespace API.Extensions;

public static class UserExtensions
{
    public static AuthResponseDTO ToDto(this User user , ITokenService tokenService)
    {
        return new AuthResponseDTO
        {
            UserName = user.UserName,
            Email = user.Email,
            Token= tokenService.CreateToken(user)
        };
    }
}
