using Api.DTO;
using Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    public AuthController(UserManager<User> userManager)
    {
        _userManager = userManager;
    }
    
    [HttpPost]
    [Route("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto newUser)
    {
        var checkIfEmailTaken = await _userManager.FindByEmailAsync(newUser.Email);
        if (checkIfEmailTaken is not null)
        {
            ModelState.AddModelError("", "Email is taken");
            return ValidationProblem(ModelState);
        } 
        var user = new User
        {
            Name = newUser.Name,
            LastName = newUser.LastName,
            Email = newUser.Email,
            UserName = newUser.Email,
        };
        var result = await _userManager.CreateAsync(user, newUser.Password);

        if (result.Succeeded)
        {
            result = await _userManager.AddToRoleAsync(user, "User");
            if (result.Succeeded)
            {
                return Ok();
            }
            else
            {
                if (result.Errors.Any())
                {
                    foreach(var error in result.Errors) ModelState.AddModelError("", error.Description);
                }
            }
        }
        else
        {
            if (result.Errors.Any())
            {
                foreach(var error in result.Errors) ModelState.AddModelError("", error.Description);
            }
        }
        
        return ValidationProblem(ModelState);
    }

    [HttpPost]
    [Route("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user is not null)
        {
            var checkPassword = await _userManager.CheckPasswordAsync(user, request.Password);
            if (checkPassword)
            {
                var response = new LoginResponseDto()
                {
                    Email = user.Email,
                    Name = user.Name,
                    LastName = user.LastName,
                    Token = "",
                };
                return Ok(response);
            }
        }
        else ModelState.AddModelError("", "Data are incorrect");
        return ValidationProblem(ModelState);
    }
}