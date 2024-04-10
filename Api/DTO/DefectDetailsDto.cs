using System.ComponentModel.DataAnnotations;
using Api.Enums;

namespace Api.DTO;

public class DefectDetailsDto
{
    [Required]
    public string Id { get; set; }
    [Required]
    public string Description { get; set; }
    [Required]
    public string Location { get; set; }
    [Required]
    public string LocationName { get; set; }
    [Required]
    public DateTime DateReported { get; set; }
    [Required]
    public bool IsFixed { get; set; }
    [Required]
    public DefectCategory DefectCategory { get; set; }
    [Required]
    public string ImageUrl { get; set; }
}