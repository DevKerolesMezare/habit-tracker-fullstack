using System.Security.Claims;
using API.Data.Models;
using API.DTOs.HabitCompletion;
using API.Extensions;
using API.Repositories.Interfaces;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class HabitCompletionsController(
    IHabitCompletionRepository completionRepository,
    IGenericRepository<Habit> habitRepository,
    IGenericRepository<HabitCompletion> habitCompletionRepository,
    IGenericRepository<Status> statusRepository
) : BaseApiController
{
    private const string CompletionsRoute =
        "/api/habits/{habitId:int}/completions";

    private const string CompletionRoute =
        "/api/habits/{habitId:int}/completions/{id:int}";

    [HttpGet(CompletionsRoute)]
    public async Task<ActionResult<IReadOnlyList<HabitCompletionDto>>>
        GetCompletions(int habitId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userId, out var currentUserId))
            return Unauthorized();

        // Verify that the habit belongs to the current user.
        var habit = await habitRepository.GetAsync(
            h => h.HabitId == habitId &&
                 h.UserId == currentUserId);

        if (habit is null)
            return NotFound();

        var completions =
            await completionRepository.GetByHabitAndUserAsync(
                habitId, currentUserId);

        return Ok(completions.Select(c => c.ToDto()).ToList());
    }

    [HttpPost(CompletionsRoute)]
    public async Task<ActionResult<HabitCompletionDto>> CreateCompletion(
        int habitId,
        CreateHabitCompletionDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userId, out var currentUserId))
            return Unauthorized();

        var habit = await habitRepository.GetAsync(
            h => h.HabitId == habitId &&
                 h.UserId == currentUserId &&
                 h.IsArchived != true);

        if (habit is null)
            return NotFound();

        var status = await statusRepository.GetAsync(
            s => s.StatusId == dto.StatusId);

        if (status is null)
            return BadRequest("Invalid StatusId.");

        if (dto.CompletionDate is null)
            return BadRequest("CompletionDate is required.");

        var completionDate = dto.CompletionDate.Value;

        if (completionDate > DateOnly.FromDateTime(DateTime.Today))
            return BadRequest("CompletionDate cannot be in the future.");

        // Prevent duplicate completions for the same habit and date.
        var exists = await completionRepository.ExistsForDateAsync(
            habitId, completionDate);

        if (exists)
            return Conflict("Completion already exists for this date.");

        var completion = new HabitCompletion
        {
            HabitId = habitId,
            StatusId = status.StatusId,
            Status = status,
            CompletionDate = completionDate,
            Notes = NormalizeNotes(dto.Notes)
        };

        habitCompletionRepository.Add(completion);
        try
        {
            await habitCompletionRepository.SaveChangesAsync();
        }
        catch (DbUpdateException exception)
            when (IsDuplicateCompletionDate(exception))
        {
            return Conflict("Completion already exists for this date.");
        }

        return CreatedAtAction(
            nameof(GetCompletion),
            new { habitId, id = completion.CompletionId },
            completion.ToDto());
    }

    [HttpPut(CompletionRoute)]
    public async Task<IActionResult> UpdateCompletion(
        int habitId,
        int id,
        UpdateHabitCompletionDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userId, out var currentUserId))
            return Unauthorized();

        var completion = await habitCompletionRepository.GetAsync(
            c => c.CompletionId == id &&
                 c.HabitId == habitId &&
                 c.Habit.UserId == currentUserId);

        if (completion is null)
            return NotFound();

        if (dto.CompletionDate is null)
            return BadRequest("CompletionDate is required.");

        var completionDate = dto.CompletionDate.Value;

        if (completionDate > DateOnly.FromDateTime(DateTime.Today))
            return BadRequest("CompletionDate cannot be in the future.");

        var status = await statusRepository.GetAsync(
            s => s.StatusId == dto.StatusId);

        if (status is null)
            return BadRequest("Invalid StatusId.");

        // Exclude the current record when checking for duplicates.
        var exists = await completionRepository.ExistsForDateAsync(
            habitId, completionDate, id);

        if (exists)
            return Conflict("Completion already exists for this date.");

        completion.StatusId = dto.StatusId;
        completion.CompletionDate = completionDate;
        completion.Notes = NormalizeNotes(dto.Notes);

        try
        {
            await habitCompletionRepository.SaveChangesAsync();
        }
        catch (DbUpdateException exception)
            when (IsDuplicateCompletionDate(exception))
        {
            return Conflict("Completion already exists for this date.");
        }

        return NoContent();
    }

    [HttpDelete(CompletionRoute)]
    public async Task<IActionResult> DeleteCompletion(
        int habitId,
        int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userId, out var currentUserId))
            return Unauthorized();

        var completion = await habitCompletionRepository.GetAsync(
            c => c.CompletionId == id &&
                 c.HabitId == habitId &&
                 c.Habit.UserId == currentUserId);

        if (completion is null)
            return NotFound();

        habitCompletionRepository.Delete(completion);
        await habitCompletionRepository.SaveChangesAsync();

        return NoContent();
    }


    [HttpGet(CompletionRoute)]
    public async Task<ActionResult<HabitCompletionDto>> GetCompletion(
    int habitId, int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userId, out var currentUserId))
            return Unauthorized();

        var completion = await completionRepository.GetByIdAndOwnerAsync(
            id, habitId, currentUserId);

        if (completion is null)
            return NotFound();

        return Ok(completion.ToDto());
    }

    private static string? NormalizeNotes(string? notes)
    {
        var normalizedNotes = notes?.Trim();
        return string.IsNullOrEmpty(normalizedNotes) ? null : normalizedNotes;
    }

    private static bool IsDuplicateCompletionDate(
        DbUpdateException exception)
    {
        return exception.GetBaseException() is SqlException
        {
            Number: 2601 or 2627
        } sqlException &&
        sqlException.Message.Contains(
            "uq_Habit_CompletionDate",
            StringComparison.OrdinalIgnoreCase);
    }
}