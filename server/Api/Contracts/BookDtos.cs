namespace Api.Contracts;

public record BookCreateUpdateDto(string Title, string Author, DateOnly PublishedDate, string Description);
