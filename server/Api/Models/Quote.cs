namespace Api.Models;

public class Quote
{
    public int Id { get; set; }
    public string Text { get; set; } = null!;
    public string Author { get; set; } = null!;

    public int UserId { get; set; }
    public AppUser User { get; set; } = null!;
}
