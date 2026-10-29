using API.Data.Models;
using API.DTOs.Dashboard;
using API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories;

public class DashboardRepository(DataContext context) : IDashboardRepository
{
    public async Task<IReadOnlyList<DashboardHabitDto>> GetActiveHabitsAsync(
        int userId)
    {
        return await context.Habits
            .AsNoTracking()
            .Where(h => h.UserId == userId && h.IsArchived != true)
            .OrderBy(h => h.HabitName)
            .Select(h => new DashboardHabitDto
            {
                HabitId = h.HabitId,
                HabitName = h.HabitName,
                FrequencyName = h.FrequencyType.FrequencyName
            })
            .ToListAsync();
    }

    public async Task<IReadOnlyList<DashboardCompletionDto>> GetCompletionsAsync(
        int userId,
        DateOnly firstDay,
        DateOnly lastDay)
    {
        return await context.HabitCompletions
            .AsNoTracking()
            .Where(c =>
                c.Habit.UserId == userId &&
                c.Habit.IsArchived != true &&
                c.CompletionDate >= firstDay &&
                c.CompletionDate <= lastDay)
            .OrderBy(c => c.CompletionDate)
            .Select(c => new DashboardCompletionDto
            {
                CompletionId = c.CompletionId,
                HabitId = c.HabitId,
                CompletionDate = c.CompletionDate,
                StatusName = c.Status.StatusName
            })
            .ToListAsync();
    }
}
