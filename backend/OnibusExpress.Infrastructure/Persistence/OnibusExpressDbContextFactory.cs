using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace OnibusExpress.Infrastructure.Persistence;

public class OnibusExpressDbContextFactory : IDesignTimeDbContextFactory<OnibusExpressDbContext>
{
    public OnibusExpressDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<OnibusExpressDbContext>();
        var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__Postgres");
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException(
                "Defina ConnectionStrings__Postgres para executar migrations em design-time."
            );
        }

        optionsBuilder.UseNpgsql(connectionString);
        return new OnibusExpressDbContext(optionsBuilder.Options);
    }
}
