namespace API.DTOs.Lookup;

public class StatusDto
{
    public int StatusId { get; set; }

    public string StatusName { get; set; } = string.Empty;

    public int ImpactScore { get; set; }
}