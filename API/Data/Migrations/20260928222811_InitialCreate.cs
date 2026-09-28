using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FrequencyTypes",
                columns: table => new
                {
                    FrequencyTypeID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FrequencyName = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Frequenc__829BB4DCA6980AEF", x => x.FrequencyTypeID);
                });

            migrationBuilder.CreateTable(
                name: "Status",
                columns: table => new
                {
                    StatusID = table.Column<int>(type: "int", nullable: false),
                    StatusName = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: false),
                    ImpactScore = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Status__C8EE2043A5F1AC3E", x => x.StatusID);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Users__1788CCAC9237AFDB", x => x.UserID);
                });

            migrationBuilder.CreateTable(
                name: "Habits",
                columns: table => new
                {
                    HabitID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    HabitName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(350)", maxLength: 350, nullable: true),
                    FrequencyTypeID = table.Column<int>(type: "int", nullable: false),
                    IsArchived = table.Column<bool>(type: "bit", nullable: true, defaultValue: false)
                        .Annotation("Relational:DefaultConstraintName", "DF__Habits__IsArchiv__4316F928"),
                    ArchivedAt = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Habits__C587AF03B94969EF", x => x.HabitID);
                    table.ForeignKey(
                        name: "fk_Habits_User",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID");
                    table.ForeignKey(
                        name: "fk_frequencyType",
                        column: x => x.FrequencyTypeID,
                        principalTable: "FrequencyTypes",
                        principalColumn: "FrequencyTypeID");
                });

            migrationBuilder.CreateTable(
                name: "HabitCompletions",
                columns: table => new
                {
                    CompletionID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HabitID = table.Column<int>(type: "int", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(350)", maxLength: 350, nullable: true),
                    CompletionDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    StatusID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__HabitCom__77FA70AFF5B2F7EF", x => x.CompletionID);
                    table.ForeignKey(
                        name: "fk_HabitCompletions_Habit",
                        column: x => x.HabitID,
                        principalTable: "Habits",
                        principalColumn: "HabitID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_status",
                        column: x => x.StatusID,
                        principalTable: "Status",
                        principalColumn: "StatusID");
                });

            migrationBuilder.CreateTable(
                name: "Reminders",
                columns: table => new
                {
                    ReminderID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HabitID = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: true, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Reminder__01A830A79BBE095C", x => x.ReminderID);
                    table.ForeignKey(
                        name: "fk_Reminders_Habit",
                        column: x => x.HabitID,
                        principalTable: "Habits",
                        principalColumn: "HabitID");
                });

            migrationBuilder.CreateIndex(
                name: "idx_HabitCompletions_HabitID",
                table: "HabitCompletions",
                column: "HabitID");

            migrationBuilder.CreateIndex(
                name: "IX_HabitCompletions_StatusID",
                table: "HabitCompletions",
                column: "StatusID");

            migrationBuilder.CreateIndex(
                name: "uq_Habit_CompletionDate",
                table: "HabitCompletions",
                columns: new[] { "HabitID", "CompletionDate" },
                unique: true,
                filter: "[CompletionDate] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "idx_Habits_UserID",
                table: "Habits",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_Habits_FrequencyTypeID",
                table: "Habits",
                column: "FrequencyTypeID");

            migrationBuilder.CreateIndex(
                name: "IX_Reminders_HabitID",
                table: "Reminders",
                column: "HabitID");

            migrationBuilder.CreateIndex(
                name: "uq_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HabitCompletions");

            migrationBuilder.DropTable(
                name: "Reminders");

            migrationBuilder.DropTable(
                name: "Status");

            migrationBuilder.DropTable(
                name: "Habits");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "FrequencyTypes");
        }
    }
}
