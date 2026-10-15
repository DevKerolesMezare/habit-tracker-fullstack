using API.Data.Models;

namespace API.Repositories.Interfaces;

public interface IHabitCompletionRepository
{
    Task<IReadOnlyList<HabitCompletion>> GetByHabitAndUserAsync(
        int habitId, int userId);

    Task<bool> ExistsForDateAsync(
        int habitId,
        DateOnly date,
        int? excludeCompletionId = null);

    Task<HabitCompletion?> GetByIdAndOwnerAsync(
        int completionId, int habitId, int userId);
}