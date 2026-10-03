using System.ComponentModel.DataAnnotations;

namespace API.DTOs.Auth;
    
public class LoginDto
{
    [EmailAddress]
    public string Email { get; set; } = "";

    public string Password { get; set; } = "";
}

