namespace API.DTOs;

public class UserDto
{
    public int UserId { get; set; }
    public required string UserName { get; set; }
    public required string Email { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsActive { get; set; }

    public List<HabitDto> Habits { get; set; } = new();
}