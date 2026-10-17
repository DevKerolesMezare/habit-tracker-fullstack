using System.ComponentModel.DataAnnotations;

namespace API.DTOs.Reminder;

public class UpdateReminderDto
{
    [Required]
    public TimeOnly? ReminderTime { get; set; }

    [Required]
    public bool? IsActive { get; set; }
}