namespace Api.Models;

public class Book
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string Author { get; set; } = null!;
    public DateOnly PublishedDate { get; set; }
    public string Description { get; set; } = "";

    public int UserId { get; set; }
    public AppUser User { get; set; } = null!;
}
