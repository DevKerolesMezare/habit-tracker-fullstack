using API.Data.Models;
using API.DTOs.Habit;

namespace API.Extensions;


public static class HabitExtensions
{
    public static HabitDto ToDto(this Habit habit)
    {
        return new HabitDto
        {
            HabitId = habit.HabitId,
            HabitName = habit.HabitName,
            Description = habit.Description,
            FrequencyTypeId = habit.FrequencyTypeId,
            IsArchived = habit.IsArchived,
            ArchivedAt = habit.ArchivedAt
        };
    }
}