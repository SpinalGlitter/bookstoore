using System.Security.Claims;
using System.Text;
using Api.Contracts;
using Api.Data;
using Api.Models;
using Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Db
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlite(builder.Configuration.GetConnectionString("Default")));

// CORS
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("ClientCors", p =>
        p.WithOrigins(
            "http://localhost:4200",
            "https://min-domain"
        )
         .AllowAnyHeader()
         .AllowAnyMethod());
});

// JWT
var jwt = builder.Configuration.GetSection("Jwt");
var key = jwt["Key"]!;
var issuer = jwt["Issuer"]!;
var audience = jwt["Audience"]!;

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = issuer,
            ValidAudience = audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
        };
    });

builder.Services.AddAuthorization();

// Services
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<PasswordHasher<AppUser>>();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Api", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Skriv: Bearer {din_token}"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

app.UseCors("ClientCors");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

// Helper
static int GetUserId(ClaimsPrincipal user)
    => int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);

// AUTH
app.MapPost("/api/auth/register", async (RegisterRequest req, AppDbContext db, PasswordHasher<AppUser> hasher) =>
{
    var username = req.Username.Trim();
    if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(req.Password))
        return Results.BadRequest("Username and password are required.");

    var exists = await db.Users.AnyAsync(u => u.Username == username);
    if (exists) return Results.Conflict("Username already exists.");

    var user = new AppUser { Username = username };
    user.PasswordHash = hasher.HashPassword(user, req.Password);

    db.Users.Add(user);
    await db.SaveChangesAsync();
    return Results.Ok();
});

app.MapPost("/api/auth/login", async (LoginRequest req, AppDbContext db, PasswordHasher<AppUser> hasher, TokenService tokens) =>
{
    var username = req.Username.Trim();
    var user = await db.Users.SingleOrDefaultAsync(u => u.Username == username);
    if (user is null) return Results.Unauthorized();

    var result = hasher.VerifyHashedPassword(user, user.PasswordHash, req.Password);
    if (result == PasswordVerificationResult.Failed) return Results.Unauthorized();

    var token = tokens.CreateToken(user);
    return Results.Ok(new LoginResponse(token));
});

// BOOKS (JWT)
var books = app.MapGroup("/api/books").RequireAuthorization();

books.MapGet("/", async (ClaimsPrincipal user, AppDbContext db) =>
{
    var userId = GetUserId(user);
    var list = await db.Books.Where(b => b.UserId == userId).OrderByDescending(b => b.Id).ToListAsync();
    return Results.Ok(list);
});

books.MapPost("/", async (ClaimsPrincipal user, BookCreateUpdateDto dto, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(dto.Title)) return Results.BadRequest("Titel krävs.");
    if (string.IsNullOrWhiteSpace(dto.Author)) return Results.BadRequest("Författare krävs.");
    if (string.IsNullOrWhiteSpace(dto.Description)) return Results.BadRequest("Beskrivning krävs.");

    var userId = GetUserId(user);

    var book = new Book
    {
        Title = dto.Title.Trim(),
        Author = dto.Author.Trim(),
        PublishedDate = dto.PublishedDate,
        Description = dto.Description.Trim(),
        UserId = userId
    };

    db.Books.Add(book);
    await db.SaveChangesAsync();
    return Results.Ok(book);
});


books.MapPut("/{id:int}", async (ClaimsPrincipal user, int id, BookCreateUpdateDto dto, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(dto.Title)) return Results.BadRequest("Titel krävs.");
    if (string.IsNullOrWhiteSpace(dto.Author)) return Results.BadRequest("Författare krävs.");
    if (string.IsNullOrWhiteSpace(dto.Description)) return Results.BadRequest("Beskrivning krävs.");

    var userId = GetUserId(user);
    var book = await db.Books.SingleOrDefaultAsync(b => b.Id == id && b.UserId == userId);
    if (book is null) return Results.NotFound();

    book.Title = dto.Title.Trim();
    book.Author = dto.Author.Trim();
    book.PublishedDate = dto.PublishedDate;
    book.Description = dto.Description.Trim();

    await db.SaveChangesAsync();
    return Results.Ok(book);
});


books.MapDelete("/{id:int}", async (ClaimsPrincipal user, int id, AppDbContext db) =>
{
    var userId = GetUserId(user);
    var book = await db.Books.SingleOrDefaultAsync(b => b.Id == id && b.UserId == userId);
    if (book is null) return Results.NotFound();

    db.Books.Remove(book);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// QUOTES (JWT)
var quotes = app.MapGroup("/api/quotes").RequireAuthorization();

quotes.MapGet("/", async (ClaimsPrincipal user, AppDbContext db) =>
{
    var userId = GetUserId(user);
    var list = await db.Quotes.Where(q => q.UserId == userId).OrderByDescending(q => q.Id).ToListAsync();
    return Results.Ok(list);
});

quotes.MapPost("/", async (ClaimsPrincipal user, QuoteCreateUpdateDto dto, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(dto.Text))
        return Results.BadRequest("Text krävs.");

    var userId = GetUserId(user);

    var count = await db.Quotes.CountAsync(q => q.UserId == userId);
    if (count >= 5) return Results.BadRequest("Max 5 quotes är tillåtet.");

    var quote = new Quote
    {
        Text = dto.Text.Trim(),
        Author = (dto.Author ?? "").Trim(),
        UserId = userId
    };

    db.Quotes.Add(quote);
    await db.SaveChangesAsync();
    return Results.Ok(quote);
});


quotes.MapPut("/{id:int}", async (ClaimsPrincipal user, int id, QuoteCreateUpdateDto dto, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(dto.Text)) return Results.BadRequest("Text krävs.");

    var userId = GetUserId(user);
    var quote = await db.Quotes.SingleOrDefaultAsync(q => q.Id == id && q.UserId == userId);
    if (quote is null) return Results.NotFound();

    quote.Text = dto.Text.Trim();
    quote.Author = (dto.Author ?? "").Trim();
    await db.SaveChangesAsync();
    return Results.Ok(quote);
});

quotes.MapDelete("/{id:int}", async (ClaimsPrincipal user, int id, AppDbContext db) =>
{
    var userId = GetUserId(user);
    var quote = await db.Quotes.SingleOrDefaultAsync(q => q.Id == id && q.UserId == userId);
    if (quote is null) return Results.NotFound();

    db.Quotes.Remove(quote);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.Run();
