using System.ComponentModel.DataAnnotations;

namespace API.DTOs.User;

public class UpdateUserDto
{
    private string email = string.Empty;

    [Required]
    [StringLength(50)]
    public string UserName { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    [EmailAddress]
    public string Email
    {
        get => email;
        set => email = value?.Trim() ?? string.Empty;
    }
}
