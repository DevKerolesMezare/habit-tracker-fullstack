using API.Data.Models;
using API.DTOs.HabitCompletion;

namespace API.Extensions;

public static class HabitCompletionExtensions
{
    public static HabitCompletionDto ToDto(
        this HabitCompletion completion)
    {
        return new HabitCompletionDto
        {
            CompletionId = completion.CompletionId,
            HabitId = completion.HabitId,
            CompletionDate = completion.CompletionDate,
            StatusId = completion.StatusId,
            StatusName = completion.Status.StatusName,
            ImpactScore = completion.Status.ImpactScore,
            Notes = completion.Notes
        };
    }
}