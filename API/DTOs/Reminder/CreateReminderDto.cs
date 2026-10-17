using System.ComponentModel.DataAnnotations;

namespace API.DTOs.Reminder;

public class CreateReminderDto
{
    [Required]
    public TimeOnly? ReminderTime { get; set; }
}