using System.ComponentModel.DataAnnotations;

namespace Api.Models;

public class User
{
    [Key]
    public Guid UserId { get; set; }

    [Required]
    public string Username { get; set; }

    [Required]
    public string Password { get; set; }

    [Required]
    public string FirstName { get; set; }

    [Required]
    public string LastName { get; set; }

    public ICollection<Defect> Defects { get; set; }
}