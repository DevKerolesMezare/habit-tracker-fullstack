using API.DTOs.Dashboard;

namespace API.Services;

public interface IDashboardService
{
    Task<DashboardDto> GetDashboardAsync(int userId);
}
