using Api.DTO;
using Api.Models;

namespace Api.Services;

public interface IDefectService
{
    Task<ServiceResponse<DefectDetailsDto>> AddDefect(AddDefectRequestDto newDefect, string userId);
    Task<ServiceResponse<DefectDto[]>> GetMyDefects(string userId);
    Task<ServiceResponse<DefectDto[]>> GetAllDefects();
    Task<ServiceResponse<DefectDetailsDto>> GetDefect(string defectId);
}