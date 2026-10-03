using System;
using System.Collections.Generic;

namespace API.Data.Models;

public partial class User
{
    public int UserId { get; set; }

    public string UserName { get; set; } = null!;

    public required byte[] PasswordHash { get; set; }
    public required byte[] PasswordSalt { get; set; }
    
    public string Email { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public bool IsActive { get; set; }

    public virtual ICollection<Habit> Habits { get; set; } = new List<Habit>();
}
