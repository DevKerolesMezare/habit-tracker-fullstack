using System.ComponentModel.DataAnnotations;

namespace API.DTOs.HabitCompletion;

public class UpdateHabitCompletionDto
{
    [Range(1, int.MaxValue)]
    public int StatusId { get; set; }

    [Required]
    public DateOnly? CompletionDate { get; set; }

    [MaxLength(350)]
    public string? Notes { get; set; }
}