using System.Net;
using Api.Database;
using Api.DTO;
using Api.Enums;
using Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Api.Services;

public class DefectService : IDefectService
{
    private readonly DatabaseContext _context;
    private readonly UserManager<User> _userManager;


    public DefectService(DatabaseContext context, UserManager<User> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    public async Task<ServiceResponse<DefectDto>> AddDefect(AddDefectRequestDto newDefect, string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user is null)
        {
            return new ServiceResponse<DefectDto>
            {
                Success = false,
                Message = "User does not exist",
                StatusCode = HttpStatusCode.NotFound,
                Data = null
            };
        }

        var defect = new Defect()
        {
            DateReported = DateTime.UtcNow,
            IsFixed = false,
            ImageUrl = newDefect.ImageUrl,
            Description = newDefect.Description,
            Location = newDefect.Location,
            User = user,
            Id = Guid.NewGuid(),
            Category = DefectCategory.None // Category should be assigned by the AI Model
        };

        try
        {
            user.Defects.Add(defect);
            _context.Defects.Add(defect);
            await _context.SaveChangesAsync();
            DefectDto justCreatedDefect = new DefectDto()
            {
                DateReported = defect.DateReported,
                IsFixed = defect.IsFixed,
                ImageUrl = defect.ImageUrl,
                Location = defect.Location,
                DefectCategory = defect.Category,
                Description = defect.Description,
                Id = defect.Id.ToString(),
            };
            return new ServiceResponse<DefectDto>
            {
                Success = true,
                Message = "Successfully added!",
                StatusCode = HttpStatusCode.Created,
                Data = justCreatedDefect, 
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse<DefectDto>
            {
                Success = false,
                Message = ex.Message,
                StatusCode = HttpStatusCode.InternalServerError,
                Data = null,
            };
        }
    }

    public async Task<ServiceResponse<DefectDto[]>> GetMyDefects(string userId)
    {
        throw new NotImplementedException();
    }

    public async Task<ServiceResponse<DefectDto[]>> GetAllDefects()
    {
        List<Defect> defects = await _context.Defects.ToListAsync();
        if (defects.Count == 0)
        {
            return new ServiceResponse<DefectDto[]>
            {
                Message = "There is no defects in database",
                StatusCode = HttpStatusCode.NotFound,
                Success = false,
                Data = null
            };
        }
        List<DefectDto> defectDtos = new List<DefectDto>();
        foreach (var defect in defects)
        {
            defectDtos.Add(new DefectDto()
                {
                    ImageUrl = defect.ImageUrl,
                    Description = defect.Description,
                    IsFixed = defect.IsFixed,
                    Location = defect.Location,
                    DefectCategory = defect.Category,
                    DateReported = defect.DateReported,
                    Id = defect.Id.ToString()
                }
            );
        }
        return new ServiceResponse<DefectDto[]>
        {
            Success = true,
            Message = "Success",
            StatusCode = HttpStatusCode.OK,
            Data = defectDtos.ToArray(),
        };
        
    }
}