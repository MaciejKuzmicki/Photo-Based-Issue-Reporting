using Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Api.Database;

public class DatabaseContext : IdentityDbContext
{
    public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
    {
        
    }
    
    public DbSet<Defect> Defects { get; set; }


    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        var adminRoleId = "963599ac-31d4-4412-a47d-93382612cb65";
        var userRoleId = "4278f2be-401f-4bf7-b4a3-75f1fa9088cd";

        var roles = new List<IdentityRole>
        {
            new IdentityRole()
            {
                Id = adminRoleId,
                Name = "Admin",
                NormalizedName = "Admin".ToUpper(),
                ConcurrencyStamp = adminRoleId
            },
            new IdentityRole()
            {
                Id = userRoleId,
                Name = "User",
                NormalizedName = "User".ToUpper(),
                ConcurrencyStamp = userRoleId
            }
        };

        builder.Entity<IdentityRole>().HasData(roles);

        var adminId = "ce6dd99b-2eed-4949-aa86-8b91e1cf5011";

        var admin = new User()
        {
            Id = adminId,
            UserName = "Admin",
            Name = "Jan",
            LastName = "Kowalski",
            Email = "example@gmail.com",
            NormalizedEmail = "example@gmail.com".ToUpper(),
            NormalizedUserName = "Admin".ToUpper(),
            
        };

        admin.PasswordHash = new PasswordHasher<User>().HashPassword(admin, "12345678");

        builder.Entity<User>().HasData(admin);

        var adminRole = new IdentityUserRole<string>()
        {
            UserId = adminId,
            RoleId = adminRoleId
        };

        builder.Entity<IdentityUserRole<string>>().HasData(adminRole);

    }
}