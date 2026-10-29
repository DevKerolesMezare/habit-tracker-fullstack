using API.DTOs.Dashboard;

namespace API.Repositories.Interfaces;

public interface IDashboardRepository
{
    Task<IReadOnlyList<DashboardHabitDto>> GetActiveHabitsAsync(int userId);

    Task<IReadOnlyList<DashboardCompletionDto>> GetCompletionsAsync(
        int userId,
        DateOnly firstDay,
        DateOnly lastDay);
}
