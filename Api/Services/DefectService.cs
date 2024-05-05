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

    public async Task<ServiceResponse<DefectDetailsDto>> AddDefect(AddDefectRequestDto newDefect, string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user is null)
        {
            return new ServiceResponse<DefectDetailsDto>
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
            LocationName = newDefect.LocationName,
            Category = DefectCategory.None // Category should be assigned by the AI Model
        };

        try
        {
            if (user.Defects == null) {
                user.Defects = new List<Defect>();
            }
            user.Defects.Add(defect);
            _context.Defects.Add(defect);
            await _context.SaveChangesAsync();
            DefectDetailsDto justCreatedDefectDetails = new DefectDetailsDto()
            {
                DateReported = defect.DateReported,
                IsFixed = defect.IsFixed,
                ImageUrl = defect.ImageUrl,
                Location = defect.Location,
                DefectCategory = defect.Category,
                Description = defect.Description,
                LocationName = defect.LocationName,
                Id = defect.Id.ToString(),
            };
            return new ServiceResponse<DefectDetailsDto>
            {
                Success = true,
                Message = "Successfully added!",
                StatusCode = HttpStatusCode.Created,
                Data = justCreatedDefectDetails, 
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse<DefectDetailsDto>
            {
                Success = false,
                Message = ex.Message,
                StatusCode = HttpStatusCode.InternalServerError,
                Data = null,
            };
        }
    }

    public async Task<ServiceResponse<DefectDetailsDto>> MarkAsFixed(string defectId)
    {
        var defect = _context.Defects.FirstOrDefault(x => x.DefectId.ToString() == defectId);
        if (defect is not null)
        {
            if (defect.IsFixed)
            {
                return new ServiceResponse<DefectDetailsDto>()
                {
                    Success = false,
                    Message = "Defect is already fixed",
                    Data = null,
                    StatusCode = HttpStatusCode.Conflict,
                };
            }
            defect.IsFixed = true;
            DefectDetailsDto defectDetailsDto = new DefectDetailsDto()
            {
                Id = defect.Id.ToString(),
                Description = defect.Description,
                Location = defect.Location,
                LocationName = defect.LocationName,
                DateReported = defect.DateReported,
                IsFixed = defect.IsFixed,
                DefectCategory = defect.Category,
                ImageUrl = defect.ImageUrl,
            };
            _context.Entry(defect).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return new ServiceResponse<DefectDetailsDto>
            {
                Success = true,
                Message = "Success",
                StatusCode = HttpStatusCode.OK,
                Data = defectDetailsDto,
            };
        }
        return new ServiceResponse<DefectDetailsDto>
        {
            Success = false,
            Message = "Defect not found",
            StatusCode = HttpStatusCode.NotFound,
            Data = null
        };
    }
    
    public async Task<ServiceResponse<DefectDetailsDto>> GetDefect(string defectId)
    {
        var defect = _context.Defects.FirstOrDefault(x => x.DefectId.ToString() == defectId);

        if (defect is not null)
        {
            DefectDetailsDto defectDetailsDto = new DefectDetailsDto()
            {
                Id = defect.Id.ToString(),
                Description = defect.Description,
                Location = defect.Location,
                LocationName = defect.LocationName,
                DateReported = defect.DateReported,
                IsFixed = defect.IsFixed,
                DefectCategory = defect.Category,
                ImageUrl = defect.ImageUrl,
            };
            return new ServiceResponse<DefectDetailsDto>
            {
                Success = true,
                Message = "Success",
                StatusCode = HttpStatusCode.OK,
                Data = defectDetailsDto,
            };
        }

        return new ServiceResponse<DefectDetailsDto>
        {
            Success = false,
            Message = "Defect not found",
            StatusCode = HttpStatusCode.NotFound,
            Data = null
        };
    }

    public async Task<ServiceResponse<DefectDto[]>> GetMyDefects(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user is null)
        {
            return new ServiceResponse<DefectDto[]>
            {
                Success = false,
                Message = "User does not exist",
                StatusCode = HttpStatusCode.NotFound,
                Data = null
            };
        }
        List<Defect> defects = await _context.Defects.Where(x => x.User.Id == userId).ToListAsync();
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
                    DateReported = defect.DateReported,
                    Id = defect.DefectId.ToString(),
                    LocationName = defect.LocationName,
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

    public async Task<ServiceResponse<DefectDetailsDto[]>> GetAllDefects(IsFixedParameter isFixed, DefectCategory category)
    {
        IQueryable<Defect> query = _context.Defects;

        if (isFixed != IsFixedParameter.All)
        {
            bool isFixedValue = isFixed == IsFixedParameter.True;
            query = query.Where(d => d.IsFixed == isFixedValue);
        }

        if (category != DefectCategory.All)
        {
            query = query.Where(d => d.Category == category);
        }

        List<Defect> defects = await query.ToListAsync();

        if (defects.Count == 0)
        {
            return new ServiceResponse<DefectDetailsDto[]>
            {
                Message = "There is no defects in database",
                StatusCode = HttpStatusCode.NotFound,
                Success = false,
                Data = null
            };
        }
        List<DefectDetailsDto> defectDtos = new List<DefectDetailsDto>();
        foreach (var defect in defects)
        {
            defectDtos.Add(new DefectDetailsDto()
                {
                    ImageUrl = defect.ImageUrl,
                    Description = defect.Description,
                    DateReported = defect.DateReported,
                    Id = defect.DefectId.ToString(),
                    LocationName = defect.LocationName,
                    IsFixed = defect.IsFixed,
                    DefectCategory = defect.Category,
                    Location = defect.Location
                }
            );
        }
        return new ServiceResponse<DefectDetailsDto[]>
        {
            Success = true,
            Message = "Success",
            StatusCode = HttpStatusCode.OK,
            Data = defectDtos.ToArray(),
        };
        
    }
    

}