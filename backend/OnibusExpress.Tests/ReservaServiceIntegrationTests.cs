using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using OnibusExpress.Application.Contracts;
using OnibusExpress.Application.Services;
using OnibusExpress.Domain.Entities;
using OnibusExpress.Infrastructure.Persistence;

namespace OnibusExpress.Tests;

public class ReservaServiceIntegrationTests
{
    [Fact]
    public async Task DeveReservarAssentoQuandoDisponivel()
    {
        await using var dbContext = await CriarContextoAsync();
        var repository = new OnibusRepository(dbContext);
        var service = new ReservaService(repository);

        var request = new CriarReservaRequest(
            ViagemId: 1,
            NumeroAssento: 5,
            Nome: "Maria Souza",
            Cpf: "52998224725",
            Email: "maria@email.com",
            DataNascimento: new DateOnly(1994, 3, 10)
        );

        var reserva = await service.CriarReservaAsync(request);

        Assert.NotNull(reserva);
        Assert.Equal("Ativa", reserva.Status);
        Assert.Equal(5, reserva.NumeroAssento);
    }

    [Fact]
    public async Task DeveCancelarQuandoDentroDoPrazo()
    {
        await using var dbContext = await CriarContextoAsync();
        var repository = new OnibusRepository(dbContext);
        var service = new ReservaService(repository);

        var criada = await service.CriarReservaAsync(new CriarReservaRequest(
            ViagemId: 1,
            NumeroAssento: 7,
            Nome: "Joao Lima",
            Cpf: "11144477735",
            Email: "joao@email.com",
            DataNascimento: new DateOnly(1988, 7, 2)
        ));

        var cancelada = await service.CancelarReservaAsync(criada.Codigo);

        Assert.Equal("Cancelada", cancelada.Status);
    }

    private static async Task<OnibusExpressDbContext> CriarContextoAsync()
    {
        var connection = new SqliteConnection("Filename=:memory:");
        await connection.OpenAsync();

        var options = new DbContextOptionsBuilder<OnibusExpressDbContext>()
            .UseSqlite(connection)
            .Options;

        var dbContext = new OnibusExpressDbContext(options);
        await dbContext.Database.EnsureCreatedAsync();

        await SeedDadosTeste(dbContext);
        return dbContext;
    }

    private static async Task SeedDadosTeste(OnibusExpressDbContext context)
    {
        var rota = new Rota
        {
            Origem = "Sao Paulo",
            Destino = "Rio de Janeiro",
            DuracaoMinutos = 360
        };

        context.Rotas.Add(rota);
        await context.SaveChangesAsync();

        context.Viagens.Add(new Viagem
        {
            RotaId = rota.Id,
            DataHoraPartidaUtc = DateTime.UtcNow.AddHours(6),
            Preco = 155.9m,
            TotalAssentos = 40
        });

        await context.SaveChangesAsync();
    }
}
