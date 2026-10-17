using API.Data.Models;
using API.DTOs.Lookup;
using API.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class LookupsController(
    IGenericRepository<FrequencyType> frequencyRepository,
    IGenericRepository<Status> statusRepository
) : BaseApiController
{
    [HttpGet("frequency-types")]
    public async Task<ActionResult<IReadOnlyList<FrequencyTypeDto>>>
        GetFrequencyTypes()
    {
        var frequencyTypes = await frequencyRepository.GetAllAsync();

        var result = frequencyTypes
            .OrderBy(f => f.FrequencyTypeId)
            .Select(f => new FrequencyTypeDto
            {
                FrequencyTypeId = f.FrequencyTypeId,
                FrequencyName = f.FrequencyName
            })
            .ToList();

        return Ok(result);
    }


    [HttpGet("statuses")]
    public async Task<ActionResult<IReadOnlyList<StatusDto>>>
        GetStatuses()
    {
        var statuses = await statusRepository.GetAllAsync();

        var result = statuses
            .OrderBy(s => s.StatusId)
            .Select(s => new StatusDto
            {
                StatusId = s.StatusId,
                StatusName = s.StatusName,
                ImpactScore = s.ImpactScore
            })
            .ToList();

        return Ok(result);
    }
}