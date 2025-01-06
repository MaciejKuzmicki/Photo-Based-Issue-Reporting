using System.ComponentModel.DataAnnotations;
using Api.Enums;

namespace Api.DTO;

public class GetDefectsQuery
{
    [Required]
    public IsFixedParameter IsFixed { get; set; }
    [Required]
    public string Category { get; set; }
}