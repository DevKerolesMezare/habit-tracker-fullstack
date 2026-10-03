namespace API.DTOs.Auth;

public class AuthResponseDTO
{
    public int UserId { get; set; }
    public required string UserName { get; set; }
    public required string Email { get; set; }
    public required string Token { get; set; }
}
