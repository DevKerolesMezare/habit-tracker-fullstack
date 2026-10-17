
using System.Security.Claims;
using API.Data.Models;
using API.DTOs.Habit;
using API.Extensions;
using API.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class HabitsController(
    IGenericRepository<Habit> repository,
    IGenericRepository<FrequencyType> frequencyRepository
) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<HabitDto>>> GetHabits()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userId, out var currentUserId))
            return Unauthorized();

        var habits = await repository.GetAllAsync(
            h => h.UserId == currentUserId &&
                 h.IsArchived != true);

        var habitsDto = habits.Select(h => h.ToDto()).ToList();

        return Ok(habitsDto);
    }


    [HttpGet("{id:int}")]
    public async Task<ActionResult<HabitDto>> GetHabit(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userId, out var currentUserId))
            return Unauthorized();

        var habit = await repository.GetAsync(
            h => h.HabitId == id && h.UserId == currentUserId);

        if (habit is null)
            return NotFound();

        return Ok(habit.ToDto());
    }

    [HttpPost]
    public async Task<ActionResult<HabitDto>> CreateHabit(
     CreateHabitDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userId, out var currentUserId))
            return Unauthorized();

        var habitName = dto.HabitName.Trim();
        var normalizedHabitName = habitName.ToLower();

        // Prevent duplicate active habits for the same user.
        var existingHabit = await repository.GetAsync(
            h => h.UserId == currentUserId &&
                 h.HabitName.ToLower() == normalizedHabitName &&
                 h.IsArchived != true);

        if (existingHabit is not null)
            return Conflict("You already have a habit with this name.");

        var frequency = await frequencyRepository.GetAsync(
            f => f.FrequencyTypeId == dto.FrequencyTypeId);

        if (frequency is null)
            return BadRequest("Invalid FrequencyTypeId.");

        var habit = new Habit
        {
            UserId = currentUserId,
            HabitName = habitName,
            Description = dto.Description,
            FrequencyTypeId = dto.FrequencyTypeId,
            IsArchived = false
        };

        repository.Add(habit);
        await repository.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetHabit),
            new { id = habit.HabitId },
            habit.ToDto());
    }


    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateHabit(
        int id, UpdateHabitDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userId, out var currentUserId))
            return Unauthorized();

        var habit = await repository.GetAsync(
            h => h.HabitId == id &&
                 h.UserId == currentUserId &&
                 h.IsArchived != true);

        if (habit is null)
            return NotFound();

        var frequency = await frequencyRepository.GetAsync(
            f => f.FrequencyTypeId == dto.FrequencyTypeId);

        if (frequency is null)
            return BadRequest("Invalid FrequencyTypeId.");

        habit.HabitName = dto.HabitName;
        habit.Description = dto.Description;
        habit.FrequencyTypeId = dto.FrequencyTypeId;

        await repository.SaveChangesAsync();

        return NoContent();
    }
    

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> ArchiveHabit(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userId, out var currentUserId))
            return Unauthorized();

        var habit = await repository.GetAsync(
            h => h.HabitId == id
              && h.UserId == currentUserId
              && h.IsArchived != true);

        if (habit is null)
            return NotFound();

        habit.IsArchived = true;
        habit.ArchivedAt = DateTime.UtcNow;

        await repository.SaveChangesAsync();

        return NoContent();
    }


}
