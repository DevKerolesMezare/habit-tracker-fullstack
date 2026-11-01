using System.Security.Claims;
using API.Data.Models;
using API.DTOs;
using API.DTOs.User;
using API.Repositories.Interfaces;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class UsersController(IGenericRepository<User> repository) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<UserDto>>> GetUsers()
    {
        if (!TryGetCurrentUserId(out var currentUserId))
            return Unauthorized();

        var users = await repository.GetAllAsync(
            user => user.UserId == currentUserId);

        return Ok(users.Select(MapToDto).ToList());
    }

    [HttpGet("me")]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        if (!TryGetCurrentUserId(out var currentUserId))
            return Unauthorized();

        var user = await repository.GetAsync(
            x => x.UserId == currentUserId);

        if (user == null)
            return NotFound();

        return Ok(MapToDto(user));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetUser(int id)
    {
        if (!IsCurrentUser(id))
            return Forbid();

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
        if (!IsCurrentUser(id))
            return Forbid();

        var user = await repository.GetAsync(x => x.UserId == id);

        if (user == null)
            return NotFound();

        var userName = updateUserDto.UserName.Trim();
        var email = updateUserDto.Email.Trim().ToLowerInvariant();

        var emailInUse = await repository.GetAsync(
            x => x.UserId != id && x.Email.ToLower() == email);

        if (emailInUse != null)
            return Conflict("Email already registered.");

        if (user.UserName == userName && user.Email == email)
            return Ok(MapToDto(user));

        user.UserName = userName;
        user.Email = email;

        repository.Update(user);

        if (!await repository.SaveChangesAsync())
            return BadRequest("Failed to update user.");

        return Ok(MapToDto(user));
    }

    [HttpPut("me/password")]
    public async Task<ActionResult> ChangePassword(
        ChangePasswordDto changePasswordDto)
    {
        if (!TryGetCurrentUserId(out var currentUserId))
            return Unauthorized();

        var user = await repository.GetAsync(
            x => x.UserId == currentUserId);

        if (user == null)
            return NotFound();

        if (!PasswordHasher.VerifyPassword(user, changePasswordDto.CurrentPassword))
            return BadRequest("Current password is incorrect.");

        if (changePasswordDto.CurrentPassword == changePasswordDto.NewPassword)
            return BadRequest("New password must be different from the current password.");

        PasswordHasher.SetPassword(user, changePasswordDto.NewPassword);
        repository.Update(user);

        if (!await repository.SaveChangesAsync())
            return BadRequest("Failed to change password.");

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteUser(int id)
    {
        if (!IsCurrentUser(id))
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

    private bool IsCurrentUser(int userId)
    {
        return TryGetCurrentUserId(out var currentUserId) &&
               currentUserId == userId;
    }

    private bool TryGetCurrentUserId(out int userId)
    {
        return int.TryParse(
            User.FindFirstValue(ClaimTypes.NameIdentifier),
            out userId);
    }
}