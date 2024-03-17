using Api.Services;
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
}