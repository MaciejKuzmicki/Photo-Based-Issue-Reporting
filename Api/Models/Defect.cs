using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Api.Enums;

namespace Api.Models;

public class Defect
{
    [Key]
    public Guid DefectId { get; set; }

    [Required]
    public string Description { get; set; }

    [Required]
    public string Location { get; set; }

    [Required]
    public DateTime DateReported { get; set; } = DateTime.Now;

    public bool IsFixed { get; set; } = false;

    [Required]
    public DefectCategory Category { get; set; }

    [Required]
    public string ImageUrl { get; set; }
    
    [ForeignKey("Id")]
    public Guid Id { get; set; }
    public User User { get; set; }
}