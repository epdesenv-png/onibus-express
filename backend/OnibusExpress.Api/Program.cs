using Microsoft.EntityFrameworkCore;
using OnibusExpress.Api.Middlewares;
using OnibusExpress.Application.Abstractions;
using OnibusExpress.Application.Services;
using OnibusExpress.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

var allowedOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>()
    ?? ["http://localhost:5173", "http://localhost:3000"];

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod());
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetConnectionString("Postgres");
if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException(
        "Connection string 'Postgres' nao configurada. Defina ConnectionStrings__Postgres via ambiente/User Secrets."
    );
}

builder.Services.AddDbContext<OnibusExpressDbContext>(options => options.UseNpgsql(connectionString));
builder.Services.AddScoped<IOnibusRepository, OnibusRepository>();
builder.Services.AddScoped<ConsultaService>();
builder.Services.AddScoped<ReservaService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

if (!app.Environment.IsEnvironment("Testing"))
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<OnibusExpressDbContext>();
    await db.Database.MigrateAsync();
    await DbSeeder.SeedAsync(db);
}

app.Run();

public partial class Program;
