using API.Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace API.Data.Configurations;

public class FrequencyTypeConfiguration
    : IEntityTypeConfiguration<FrequencyType>
{
    public void Configure(EntityTypeBuilder<FrequencyType> builder)
    {
        builder.HasData(
            new FrequencyType
            {
                FrequencyTypeId = 1,
                FrequencyName = "Daily"
            },
            new FrequencyType
            {
                FrequencyTypeId = 2,
                FrequencyName = "Weekly"
            },
            new FrequencyType
            {
                FrequencyTypeId = 3,
                FrequencyName = "Monthly"
            }
        );
    }
}