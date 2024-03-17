using System.Net;
using Api.DTO;
using Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DefectController : ControllerBase
{
    private readonly IDefectService _defectService;

    public DefectController(IDefectService defectService)
    {
        _defectService = defectService;
    }

    [HttpPost]
    [Authorize(Roles = "User")]
    public async Task<IActionResult> AddDefect([FromBody] AddDefectRequestDto newDefect, [FromHeader] string userId)
    {
        var response = await _defectService.AddDefect(newDefect, userId);
        if (response.Success) return Ok(response.Data); //or return Created() think if there is a need to return newly created defect
        return response.StatusCode switch
        {
            HttpStatusCode.NotFound => NotFound(response.Message),
            HttpStatusCode.InternalServerError => StatusCode((int)HttpStatusCode.InternalServerError, response.Message),
            _ => NoContent()
        };
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllDefects() //Add Some Sort Options Later
    {
        var response = await _defectService.GetAllDefects();
        if (response.Success) return Ok(response.Data);
        else if (response.StatusCode == HttpStatusCode.NotFound) return NotFound(response.Message);
        return NoContent();
    }
}