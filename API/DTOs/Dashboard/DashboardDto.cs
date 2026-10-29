namespace API.DTOs.Dashboard;

public class DashboardDto
{
    public DateOnly Today { get; set; }
    public IReadOnlyList<DashboardHabitDto> Habits { get; set; } = [];
    public IReadOnlyList<DashboardCompletionDto> Completions { get; set; } = [];
}
