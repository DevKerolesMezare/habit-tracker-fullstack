using System.Security.Claims;
using API.Data.Models;
using API.DTOs;
using API.DTOs.User;
using API.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class UsersController(IGenericRepository<User> repository) : BaseApiController
{
    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<UserDto>>> GetUsers()
    {
        var users = await repository.GetAllAsync();

        var usersDto = users.Select(MapToDto).ToList();

        return Ok(usersDto);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetUser(int id)
    {
        var user = await repository.GetAsync(x => x.UserId == id);

        if (user == null)
            return NotFound();

        return Ok(MapToDto(user));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateUser(
        int id,
        UpdateUserDto updateUserDto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userId, out var currentUserId) || currentUserId != id)
            return Forbid();

        var user = await repository.GetAsync(x => x.UserId == id);

        if (user == null)
            return NotFound();

        user.UserName = updateUserDto.UserName;
        user.Email = updateUserDto.Email;

        repository.Update(user);

        if (!await repository.SaveChangesAsync())
            return BadRequest("Failed to update user.");

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteUser(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userId, out var currentUserId) || currentUserId != id)
            return Forbid();

        var user = await repository.GetAsync(x => x.UserId == id);

        if (user == null)
            return NotFound();

        repository.Delete(user);

        if (!await repository.SaveChangesAsync())
            return BadRequest("Failed to delete user.");

        return NoContent();
    }

    private static UserDto MapToDto(User user)
    {
        return new UserDto
        {
            UserId = user.UserId,
            UserName = user.UserName,
            Email = user.Email,
            CreatedAt = user.CreatedAt,
            IsActive = user.IsActive
        };
    }
}