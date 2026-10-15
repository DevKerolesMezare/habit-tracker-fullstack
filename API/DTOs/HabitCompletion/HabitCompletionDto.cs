namespace API.DTOs.HabitCompletion;

public class HabitCompletionDto
{
    public int CompletionId { get; set; }

    public int HabitId { get; set; }

    public DateOnly CompletionDate { get; set; }

    public int StatusId { get; set; }

    public string StatusName { get; set; } = string.Empty;

    public int ImpactScore { get; set; }

    public string? Notes { get; set; }
}