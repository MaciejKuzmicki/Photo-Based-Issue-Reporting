using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Api.Models;

public class User : IdentityUser
{
    public string Name { get; set; }
    public string LastName { get; set; }
    public ICollection<Defect> Defects { get; set; }
}