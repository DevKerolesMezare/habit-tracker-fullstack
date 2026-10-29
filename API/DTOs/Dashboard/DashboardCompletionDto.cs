namespace API.DTOs.Dashboard;

public class DashboardCompletionDto
{
    public int CompletionId { get; set; }
    public int HabitId { get; set; }
    public DateOnly CompletionDate { get; set; }
    public string StatusName { get; set; } = string.Empty;
}
