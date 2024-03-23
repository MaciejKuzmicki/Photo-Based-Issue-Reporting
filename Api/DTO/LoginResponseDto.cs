using System.ComponentModel.DataAnnotations;

namespace Api.DTO;

public class LoginResponseDto
{
    [Required]
    public string Id { get; set; }
    [Required] 
    public string Email { get; set; }
    [Required]
    public string Name { get; set; }
    [Required]
    public string LastName { get; set; }
    [Required]
    public string Token { get; set; }
}