using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class Initial2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "ce6dd99b-2eed-4949-aa86-8b91e1cf5011",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "8c4af654-b8c2-4f58-833a-8463a739610e", "AQAAAAIAAYagAAAAEF1CSOOTCRt7zFgtPiG3Sfzf0ERwYG0xFUrG31h1SFum33Sdy5zwrYZLCmY8KbX58w==", "9198fb66-308d-4300-b335-f617b76b9220" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "ce6dd99b-2eed-4949-aa86-8b91e1cf5011",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "170ee5d6-f5ed-457b-a621-4a0192e6673d", "AQAAAAIAAYagAAAAEB1wEbqg5CSvj+bO9OGG2stEtsjQnpBQSKdudJMXeH318wrLlZXxBoGbC92j1r7hGw==", "fc8cc10f-85db-448f-af6f-be20a510315f" });
        }
    }
}
