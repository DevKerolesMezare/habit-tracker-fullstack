using System.ComponentModel.DataAnnotations;


namespace API.DTOs.Auth;

public class RegisterDto
{

    [Required]
    public string UserName { get; set; } = null!;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!;

    [MinLength(4)]
    public string Password { get; set; } = null!;

}
