using API.Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace API.Data.Configurations;

public class StatusConfiguration
    : IEntityTypeConfiguration<Status>
{
    public void Configure(EntityTypeBuilder<Status> builder)
    {
        builder.HasData(
            new Status
            {
                StatusId = 1,
                StatusName = "Completed",
                ImpactScore = 1
            },
            new Status
            {
                StatusId = 2,
                StatusName = "Partially Completed",
                ImpactScore = 0
            },
            new Status
            {
                StatusId = 3,
                StatusName = "Missed",
                ImpactScore = -1
            }
        );
    }
}