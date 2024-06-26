using System.ComponentModel.DataAnnotations;

namespace Api.DTO;

public class DefectDto
{
    [Required]
    public string Id { get; set; }
    [Required]
    public string Description { get; set; }
    [Required]
    public string LocationName { get; set; }
    [Required]
    public DateTime DateReported { get; set; }
    [Required]
    public string ImageUrl { get; set; }
}