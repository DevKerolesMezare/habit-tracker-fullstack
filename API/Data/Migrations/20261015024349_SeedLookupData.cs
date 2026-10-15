using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class SeedLookupData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "FrequencyTypes",
                columns: new[] { "FrequencyTypeID", "FrequencyName" },
                values: new object[,]
                {
                    { 1, "Daily" },
                    { 2, "Weekly" },
                    { 3, "Monthly" }
                });

            migrationBuilder.InsertData(
                table: "Status",
                columns: new[] { "StatusID", "ImpactScore", "StatusName" },
                values: new object[,]
                {
                    { 1, 1, "Completed" },
                    { 2, 0, "Partially Completed" },
                    { 3, -1, "Missed" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "FrequencyTypes",
                keyColumn: "FrequencyTypeID",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "FrequencyTypes",
                keyColumn: "FrequencyTypeID",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "FrequencyTypes",
                keyColumn: "FrequencyTypeID",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Status",
                keyColumn: "StatusID",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Status",
                keyColumn: "StatusID",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Status",
                keyColumn: "StatusID",
                keyValue: 3);
        }
    }
}
