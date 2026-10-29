using API.DTOs.Dashboard;
using API.Repositories.Interfaces;

namespace API.Services;

public class DashboardService(IDashboardRepository dashboardRepository)
    : IDashboardService
{
    public async Task<DashboardDto> GetDashboardAsync(int userId)
    {
        var today = DateOnly.FromDateTime(DateTime.Today);
        var firstDay = today.AddDays(-6);

        var habits = await dashboardRepository.GetActiveHabitsAsync(userId);
        var completions = await dashboardRepository.GetCompletionsAsync(
            userId, firstDay, today);

        return new DashboardDto
        {
            Today = today,
            Habits = habits,
            Completions = completions
        };
    }
}
