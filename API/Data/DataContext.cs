using Microsoft.EntityFrameworkCore;

namespace API.Data.Models;

public partial class DataContext(DbContextOptions<DataContext> options) : DbContext(options)
{
    public virtual DbSet<FrequencyType> FrequencyTypes { get; set; }

    public virtual DbSet<Habit> Habits { get; set; }

    public virtual DbSet<HabitCompletion> HabitCompletions { get; set; }

    public virtual DbSet<Reminder> Reminders { get; set; }

    public virtual DbSet<Status> Statuses { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<FrequencyType>(entity =>
        {
            entity.HasKey(e => e.FrequencyTypeId).HasName("PK__Frequenc__829BB4DCA6980AEF");

            entity.Property(e => e.FrequencyTypeId).HasColumnName("FrequencyTypeID");
            entity.Property(e => e.FrequencyName).HasMaxLength(30);
        });

        modelBuilder.Entity<Habit>(entity =>
        {
            entity.HasKey(e => e.HabitId).HasName("PK__Habits__C587AF03B94969EF");

            entity.HasIndex(e => e.UserId, "idx_Habits_UserID");

            entity.Property(e => e.HabitId).HasColumnName("HabitID");
            entity.Property(e => e.ArchivedAt).HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(350);
            entity.Property(e => e.FrequencyTypeId).HasColumnName("FrequencyTypeID");
            entity.Property(e => e.HabitName).HasMaxLength(150);
            entity.Property(e => e.IsArchived).HasDefaultValue(false, "DF__Habits__IsArchiv__4316F928");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.FrequencyType).WithMany(p => p.Habits)
                .HasForeignKey(d => d.FrequencyTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_frequencyType");

            entity.HasOne(d => d.User).WithMany(p => p.Habits)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Habits_User");
        });

        modelBuilder.Entity<HabitCompletion>(entity =>
        {
            entity.HasKey(e => e.CompletionId).HasName("PK__HabitCom__77FA70AFF5B2F7EF");

            entity.HasIndex(e => e.HabitId, "idx_HabitCompletions_HabitID");

            entity.HasIndex(e => new { e.HabitId, e.CompletionDate }, "uq_Habit_CompletionDate").IsUnique();

            entity.Property(e => e.CompletionId).HasColumnName("CompletionID");
            entity.Property(e => e.CompletionDate).HasColumnType("datetime");
            entity.Property(e => e.HabitId).HasColumnName("HabitID");
            entity.Property(e => e.Notes).HasMaxLength(350);
            entity.Property(e => e.StatusId).HasColumnName("StatusID");

            entity.HasOne(d => d.Habit).WithMany(p => p.HabitCompletions)
                .HasForeignKey(d => d.HabitId)
                .HasConstraintName("fk_HabitCompletions_Habit");

            entity.HasOne(d => d.Status).WithMany(p => p.HabitCompletions)
                .HasForeignKey(d => d.StatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_status");
        });

        modelBuilder.Entity<Reminder>(entity =>
        {
            entity.HasKey(e => e.ReminderId).HasName("PK__Reminder__01A830A79BBE095C");

            entity.Property(e => e.ReminderId).HasColumnName("ReminderID");
            entity.Property(e => e.HabitId).HasColumnName("HabitID");
            entity.Property(e => e.IsActive).HasDefaultValue(true);

            entity.HasOne(d => d.Habit).WithMany(p => p.Reminders)
                .HasForeignKey(d => d.HabitId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Reminders_Habit");
        });

        modelBuilder.Entity<Status>(entity =>
        {
            entity.HasKey(e => e.StatusId).HasName("PK__Status__C8EE2043A5F1AC3E");

            entity.ToTable("Status");

            entity.Property(e => e.StatusId)
                .ValueGeneratedNever()
                .HasColumnName("StatusID");
            entity.Property(e => e.StatusName).HasMaxLength(25);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CCAC9237AFDB");

            entity.HasIndex(e => e.Email, "uq_Users_Email").IsUnique();

            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.PasswordHash).HasMaxLength(250);
            entity.Property(e => e.UserName).HasMaxLength(50);
        });

    }

}
