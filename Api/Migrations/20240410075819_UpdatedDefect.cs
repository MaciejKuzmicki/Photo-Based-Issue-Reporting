using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedDefect : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LocationName",
                table: "Defects",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "ce6dd99b-2eed-4949-aa86-8b91e1cf5011",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "170ee5d6-f5ed-457b-a621-4a0192e6673d", "AQAAAAIAAYagAAAAEB1wEbqg5CSvj+bO9OGG2stEtsjQnpBQSKdudJMXeH318wrLlZXxBoGbC92j1r7hGw==", "fc8cc10f-85db-448f-af6f-be20a510315f" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LocationName",
                table: "Defects");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "ce6dd99b-2eed-4949-aa86-8b91e1cf5011",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "1ada84cf-b6a4-474b-82bc-36880cda49f0", "AQAAAAIAAYagAAAAEGPzYVX4yy8PGeXOzV0IYeRFX2OZt8rMMYroXsLRRgjfSc5Xb5qYEBcmMd7UiSCumA==", "26b21ab4-9376-4b0c-8202-39ab97fe6428" });
        }
    }
}
