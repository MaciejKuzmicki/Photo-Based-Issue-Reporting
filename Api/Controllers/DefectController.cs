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

    [HttpGet("my-defects")]
    [Authorize(Roles = "User")]
    public async Task<IActionResult> GetMyDefects([FromHeader] string userId)
    {
        var response = await _defectService.GetMyDefects(userId);
        if (response.Success) return Ok(response.Data);
        if (response.StatusCode == HttpStatusCode.NotFound) return NotFound(response.Message);
        return NoContent();
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllDefects() //Add Some Sort Options Later
    {
        var response = await _defectService.GetAllDefects();
        if (response.Success) return Ok(response.Data);
        if (response.StatusCode == HttpStatusCode.NotFound) return NotFound(response.Message);
        return NoContent();
    }

    [HttpPut("{defectId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> MarkAsFixed([FromRoute] string defectId)
    {
        var response = await _defectService.MarkAsFixed(defectId);
        if (response.Success) return Ok(response.Data);
        if (response.StatusCode == HttpStatusCode.NotFound) return NotFound(response.Message);
        if (response.StatusCode == HttpStatusCode.Conflict) return Conflict(response.Message);
        return NoContent();
    }

    [HttpGet("{defectId}")]
    [Authorize]
    public async Task<IActionResult> GetDefect([FromRoute] string defectId)
    {
        var response = await _defectService.GetDefect(defectId);
        if (response.Success) return Ok(response.Data);
        if (response.StatusCode == HttpStatusCode.NotFound) return NotFound(response.Message);
        return NoContent();
    }
}