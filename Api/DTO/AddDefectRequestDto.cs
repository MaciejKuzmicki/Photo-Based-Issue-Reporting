using System.ComponentModel.DataAnnotations;

namespace Api.DTO;

public class AddDefectRequestDto
{
    [Required]
    public string Description { get; set; }
    [Required]
    public string Location { get; set; }
    [Required]
    public string ImageUrl { get; set; }
}