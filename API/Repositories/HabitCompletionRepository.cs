using API.Data.Models;
using API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories;

public class HabitCompletionRepository(DataContext context)
    : IHabitCompletionRepository
{
    public async Task<IReadOnlyList<HabitCompletion>>
        GetByHabitAndUserAsync(int habitId, int userId)
    {
        return await context.HabitCompletions
            .AsNoTracking()
            .Include(c => c.Status)
            .Where(c =>
                c.HabitId == habitId &&
                c.Habit.UserId == userId)
            .OrderByDescending(c => c.CompletionDate)
            .ToListAsync();
    }

    public async Task<bool> ExistsForDateAsync(
        int habitId,
        DateOnly date,
        int? excludeCompletionId = null)
    {
        return await context.HabitCompletions.AnyAsync(c =>
            c.HabitId == habitId &&
            c.CompletionDate == date &&
            (!excludeCompletionId.HasValue ||
             c.CompletionId != excludeCompletionId.Value));
    }

    public async Task<HabitCompletion?> GetByIdAndOwnerAsync(
    int completionId, int habitId, int userId)
    {
        return await context.HabitCompletions
            .AsNoTracking()
            .Include(c => c.Status)
            .FirstOrDefaultAsync(c =>
                c.CompletionId == completionId &&
                c.HabitId == habitId &&
                c.Habit.UserId == userId);
    }
    
}