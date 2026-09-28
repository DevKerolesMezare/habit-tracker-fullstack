using API.Data.Models;
using API.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController(DataContext context) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<UserDto>>> GetUsers()
    {
        var users = await context.Users
            .Include(x => x.Habits)
            .ToListAsync();

        var usersDto = users.Select(x => new UserDto
        {
            UserId = x.UserId,
            UserName = x.UserName,
            Email = x.Email,
            CreatedAt = x.CreatedAt,
            IsActive = x.IsActive,

            Habits = x.Habits.Select(h => new HabitDto
            {
                HabitId = h.HabitId,
                HabitName = h.HabitName,
                Description = h.Description,
                FrequencyTypeId = h.FrequencyTypeId,
                IsArchived = h.IsArchived,
                ArchivedAt = h.ArchivedAt
            }).ToList()
        }).ToList();

        return usersDto;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetUsers(int id)
    {
        var user = await context.Users.FindAsync(id);

        if (user == null) return NotFound();

        var userDto = new UserDto
        {
            UserId = user.UserId,
            UserName = user.UserName,
            Email = user.Email,
            CreatedAt = user.CreatedAt,
            IsActive = user.IsActive
        };

        return userDto;
    }

}
