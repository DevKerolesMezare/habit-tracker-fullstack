using System.Security.Claims;
using API.Data.Models;
using API.DTOs.Reminder;
using API.Extensions;
using API.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class RemindersController(
    IGenericRepository<Habit> habitRepository,
    IGenericRepository<Reminder> reminderRepository
) : BaseApiController
{
    private const string RemindersRoute =
        "/api/habits/{habitId:int}/reminders";

    private const string ReminderRoute =
        "/api/habits/{habitId:int}/reminders/{id:int}";

    [HttpGet(RemindersRoute)]
    public async Task<ActionResult<IReadOnlyList<ReminderDto>>>
        GetReminders(int habitId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userId, out var currentUserId))
            return Unauthorized();

        // Verify habit ownership.
        var habit = await habitRepository.GetAsync(
            h => h.HabitId == habitId &&
                 h.UserId == currentUserId);

        if (habit is null)
            return NotFound();

        var reminders = await reminderRepository.GetAllAsync(
            r => r.HabitId == habitId &&
                 r.Habit.UserId == currentUserId);

        return Ok(reminders.Select(r => r.ToDto()).ToList());
    }


    [HttpGet(ReminderRoute)]
    public async Task<ActionResult<ReminderDto>> GetReminder(
        int habitId,
        int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userId, out var currentUserId))
            return Unauthorized();

        var reminder = await reminderRepository.GetAsync(
            r => r.ReminderId == id &&
                 r.HabitId == habitId &&
                 r.Habit.UserId == currentUserId);

        if (reminder is null)
            return NotFound();

        return Ok(reminder.ToDto());
    }


    [HttpPost(RemindersRoute)]
    public async Task<ActionResult<ReminderDto>> CreateReminder(
        int habitId,
        CreateReminderDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userId, out var currentUserId))
            return Unauthorized();

        // Only active habits can receive new reminders.
        var habit = await habitRepository.GetAsync(
            h => h.HabitId == habitId &&
                 h.UserId == currentUserId &&
                 h.IsArchived != true);

        if (habit is null)
            return NotFound();

        if (dto.ReminderTime is null)
            return BadRequest("ReminderTime is required.");

        var reminder = new Reminder
        {
            HabitId = habitId,
            ReminderTime = dto.ReminderTime.Value,
            IsActive = true
        };

        reminderRepository.Add(reminder);
        await reminderRepository.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetReminder),
            new { habitId, id = reminder.ReminderId },
            reminder.ToDto());
    }


    [HttpPut(ReminderRoute)]
    public async Task<IActionResult> UpdateReminder(
        int habitId,
        int id,
        UpdateReminderDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userId, out var currentUserId))
            return Unauthorized();

        var reminder = await reminderRepository.GetAsync(
            r => r.ReminderId == id &&
                 r.HabitId == habitId &&
                 r.Habit.UserId == currentUserId &&
                 r.Habit.IsArchived != true);

        if (reminder is null)
            return NotFound();

        if (dto.ReminderTime is null || dto.IsActive is null)
            return BadRequest("ReminderTime and IsActive are required.");

        reminder.ReminderTime = dto.ReminderTime.Value;
        reminder.IsActive = dto.IsActive.Value;

        await reminderRepository.SaveChangesAsync();

        return NoContent();
    }


    [HttpDelete(ReminderRoute)]
    public async Task<IActionResult> DeleteReminder(
        int habitId,
        int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userId, out var currentUserId))
            return Unauthorized();

        // Verify ownership before deleting.
        var reminder = await reminderRepository.GetAsync(
            r => r.ReminderId == id &&
                 r.HabitId == habitId &&
                 r.Habit.UserId == currentUserId);

        if (reminder is null)
            return NotFound();

        reminderRepository.Delete(reminder);
        await reminderRepository.SaveChangesAsync();

        return NoContent();
    }
}