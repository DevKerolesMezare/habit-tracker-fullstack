namespace API.DTOs.Reminder;

public class ReminderDto
{
    public int ReminderId { get; set; }

    public int HabitId { get; set; }

    public TimeOnly ReminderTime { get; set; }

    public bool IsActive { get; set; }
}