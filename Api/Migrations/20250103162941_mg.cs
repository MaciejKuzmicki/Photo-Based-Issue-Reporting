using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class mg : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Category",
                table: "Defects",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "ce6dd99b-2eed-4949-aa86-8b91e1cf5011",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "438f8364-a9e1-48d4-bd93-9485152e5b31", "AQAAAAIAAYagAAAAEHGjg1d9bPZIRzNpAJvfzUhMQK79OGt0xP+rTfavZGykKD9q8IPgpRRs8ofaGCuFqg==", "c879cc59-3cc6-4995-877b-335004a18192" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "Category",
                table: "Defects",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "ce6dd99b-2eed-4949-aa86-8b91e1cf5011",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "8c4af654-b8c2-4f58-833a-8463a739610e", "AQAAAAIAAYagAAAAEF1CSOOTCRt7zFgtPiG3Sfzf0ERwYG0xFUrG31h1SFum33Sdy5zwrYZLCmY8KbX58w==", "9198fb66-308d-4300-b335-f617b76b9220" });
        }
    }
}
