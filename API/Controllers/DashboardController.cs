using System.Security.Claims;
using API.DTOs.Dashboard;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class DashboardController(IDashboardService dashboardService) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<DashboardDto>> GetDashboard()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userId, out var currentUserId))
            return Unauthorized();

        var dashboard = await dashboardService.GetDashboardAsync(currentUserId);
        return Ok(dashboard);
    }
}
