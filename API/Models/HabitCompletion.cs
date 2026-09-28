using System;
using System.Collections.Generic;

namespace API.Data.Models;

public partial class HabitCompletion
{
    public int CompletionId { get; set; }

    public int HabitId { get; set; }

    public string? Notes { get; set; }

    public DateTime? CompletionDate { get; set; }

    public int StatusId { get; set; }

    public virtual Habit Habit { get; set; } = null!;

    public virtual Status Status { get; set; } = null!;
}
