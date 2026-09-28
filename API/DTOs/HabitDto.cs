namespace API.DTOs;

public class HabitDto
{
    public int HabitId { get; set; }
    public required string HabitName { get; set; }
    public string? Description { get; set; }
    public int FrequencyTypeId { get; set; }
    public bool? IsArchived { get; set; }
    public DateTime? ArchivedAt { get; set; }
}
