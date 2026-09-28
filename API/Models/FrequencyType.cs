using System;
using System.Collections.Generic;

namespace API.Data.Models;

public partial class FrequencyType
{
    public int FrequencyTypeId { get; set; }

    public string FrequencyName { get; set; } = null!;

    public virtual ICollection<Habit> Habits { get; set; } = new List<Habit>();
}
