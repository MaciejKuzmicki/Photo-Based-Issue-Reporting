using Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Database;

public class DatabaseContext : DbContext
{
    public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
    {
        
    }
    
    public DbSet<Defect> Defects { get; set; }
    
}