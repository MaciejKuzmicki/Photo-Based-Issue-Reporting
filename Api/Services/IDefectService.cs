using Api.DTO;
using Api.Enums;
using Api.Models;

namespace Api.Services;

public interface IDefectService
{
    Task<ServiceResponse<DefectDetailsDto>> AddDefect(AddDefectRequestDto newDefect, string userId);
    Task<ServiceResponse<DefectDto[]>> GetMyDefects(string userId);
    Task<ServiceResponse<DefectDetailsDto[]>> GetAllDefects(IsFixedParameter isFixed, string category);
    Task<ServiceResponse<DefectDetailsDto>> GetDefect(string defectId);
    Task<ServiceResponse<DefectDetailsDto>> MarkAsFixed(string defectId);
}