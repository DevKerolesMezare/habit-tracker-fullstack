using System;
using System.Collections.Generic;

namespace API.Data.Models;

public partial class Status
{
    public int StatusId { get; set; }

    public string StatusName { get; set; } = null!;

    public int ImpactScore { get; set; }

    public virtual ICollection<HabitCompletion> HabitCompletions { get; set; } = new List<HabitCompletion>();
}
