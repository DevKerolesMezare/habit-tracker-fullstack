using System.ComponentModel.DataAnnotations;

namespace API.DTOs.Habit;

public class UpdateHabitDto
{
    [Required]
    [MaxLength(150)]
    public required string HabitName { get; set; }

    [MaxLength(350)]
    public string? Description { get; set; }

    [Range(1, int.MaxValue)]
    public int FrequencyTypeId { get; set; }
}