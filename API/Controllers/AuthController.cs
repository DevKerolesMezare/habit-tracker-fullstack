using System.Security.Claims;
using API.Data.Models;
using API.DTOs.Auth;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AuthController(
    DataContext context,
    ITokenService tokenService
) : BaseApiController
{
    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDTO>> Register(
        [FromBody] RegisterDto registerDto)
    {
        var email = registerDto.Email.Trim().ToLowerInvariant();

        if (await EmailExists(email))
            return BadRequest("Email already registered.");

        var user = new User
        {
            UserName = registerDto.UserName.Trim(),
            Email = email,
            PasswordHash = [],
            PasswordSalt = [],
        };
        PasswordHasher.SetPassword(user, registerDto.Password);

        context.Users.Add(user);
        await context.SaveChangesAsync();

        return Ok(user.ToDto(tokenService));
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDTO>> Login(
        [FromBody] LoginDto login)
    {
        var email = login.Email.Trim().ToLowerInvariant();

        var user = await context.Users.SingleOrDefaultAsync(
            x => x.Email.ToLower() == email);

        if (user is null)
            return Unauthorized("Invalid email or password.");

        if (!PasswordHasher.VerifyPassword(user, login.Password))
        {
            return Unauthorized("Invalid email or password.");
        }

        return Ok(user.ToDto(tokenService));
    }

    [Authorize]
    [HttpGet("user-info")]
    public async Task<ActionResult<AuthResponseDTO>> GetUserInfo()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userId, out var currentUserId))
            return Unauthorized();

        var user = await context.Users.FindAsync(currentUserId);

        if (user is null)
            return NotFound();

        return Ok(new
        {
            user.UserId,
            user.UserName,
            user.Email
        });
    }

    private Task<bool> EmailExists(string email)
    {
        return context.Users.AnyAsync(
            x => x.Email.ToLower() == email);
    }
}