using System;
using System.Collections.Generic;

namespace API.Data.Models;

public partial class Reminder
{
    public int ReminderId { get; set; }

    public int HabitId { get; set; }

    public bool? IsActive { get; set; }

    public virtual Habit Habit { get; set; } = null!;
}
