using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class UseDateOnlyForHabitCompletion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "uq_Habit_CompletionDate",
                table: "HabitCompletions");

            migrationBuilder.AlterColumn<DateOnly>(
                name: "CompletionDate",
                table: "HabitCompletions",
                type: "date",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "uq_Habit_CompletionDate",
                table: "HabitCompletions",
                columns: new[] { "HabitID", "CompletionDate" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "uq_Habit_CompletionDate",
                table: "HabitCompletions");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CompletionDate",
                table: "HabitCompletions",
                type: "datetime",
                nullable: true,
                oldClrType: typeof(DateOnly),
                oldType: "date");

            migrationBuilder.CreateIndex(
                name: "uq_Habit_CompletionDate",
                table: "HabitCompletions",
                columns: new[] { "HabitID", "CompletionDate" },
                unique: true,
                filter: "[CompletionDate] IS NOT NULL");
        }
    }
}
