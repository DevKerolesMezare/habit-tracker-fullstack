using API.Data.Models;
using API.DTOs.Reminder;

namespace API.Extensions;

public static class ReminderExtensions
{
    public static ReminderDto ToDto(this Reminder reminder)
    {
        return new ReminderDto
        {
            ReminderId = reminder.ReminderId,
            HabitId = reminder.HabitId,
            ReminderTime = reminder.ReminderTime,
            IsActive = reminder.IsActive ?? false
        };
    }
}