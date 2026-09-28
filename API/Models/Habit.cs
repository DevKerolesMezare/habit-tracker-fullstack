using System;
using System.Collections.Generic;

namespace API.Data.Models;

public partial class Habit
{
    public int HabitId { get; set; }

    public int UserId { get; set; }

    public string HabitName { get; set; } = null!;

    public string? Description { get; set; }

    public int FrequencyTypeId { get; set; }

    public bool? IsArchived { get; set; }

    public DateTime? ArchivedAt { get; set; }

    public virtual FrequencyType FrequencyType { get; set; } = null!;

    public virtual ICollection<HabitCompletion> HabitCompletions { get; set; } = new List<HabitCompletion>();

    public virtual ICollection<Reminder> Reminders { get; set; } = new List<Reminder>();

    public virtual User User { get; set; } = null!;
}
