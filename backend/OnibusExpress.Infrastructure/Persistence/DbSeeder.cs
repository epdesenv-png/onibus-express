using Microsoft.EntityFrameworkCore;
using OnibusExpress.Domain.Entities;

namespace OnibusExpress.Infrastructure.Persistence;

public static class DbSeeder
{
    public static async Task SeedAsync(OnibusExpressDbContext dbContext)
    {
        if (!await dbContext.Rotas.AnyAsync())
        {
            var rotasIniciais = new List<Rota>
            {
                new() { Origem = "Sao Paulo", Destino = "Rio de Janeiro", DuracaoMinutos = 360 },
                new() { Origem = "Belo Horizonte", Destino = "Sao Paulo", DuracaoMinutos = 510 },
                new() { Origem = "Curitiba", Destino = "Florianopolis", DuracaoMinutos = 290 }
            };

            await dbContext.Rotas.AddRangeAsync(rotasIniciais);
            await dbContext.SaveChangesAsync();
        }

        var rotas = await dbContext.Rotas
            .AsNoTracking()
            .ToListAsync();

        var rotaSpRj = rotas.FirstOrDefault(x => x.Origem == "Sao Paulo" && x.Destino == "Rio de Janeiro");
        var rotaBhSp = rotas.FirstOrDefault(x => x.Origem == "Belo Horizonte" && x.Destino == "Sao Paulo");
        var rotaCwbFloripa = rotas.FirstOrDefault(x => x.Origem == "Curitiba" && x.Destino == "Florianopolis");

        if (rotaSpRj is null || rotaBhSp is null || rotaCwbFloripa is null)
        {
            return;
        }

        var diasParaPopular = new[]
        {
            DateTime.UtcNow.Date,
            DateTime.UtcNow.Date.AddDays(1)
        };

        var viagensPlanejadas = new List<Viagem>();
        foreach (var dia in diasParaPopular)
        {
            viagensPlanejadas.AddRange(
            [
                new() { RotaId = rotaSpRj.Id, DataHoraPartidaUtc = dia.AddHours(8), Preco = 149.90m, TotalAssentos = 40 },
                new() { RotaId = rotaSpRj.Id, DataHoraPartidaUtc = dia.AddHours(16), Preco = 179.90m, TotalAssentos = 40 },
                new() { RotaId = rotaBhSp.Id, DataHoraPartidaUtc = dia.AddHours(10), Preco = 189.90m, TotalAssentos = 44 },
                new() { RotaId = rotaCwbFloripa.Id, DataHoraPartidaUtc = dia.AddHours(7), Preco = 129.90m, TotalAssentos = 36 }
            ]);
        }

        var chavesExistentes = await dbContext.Viagens
            .AsNoTracking()
            .Select(x => new { x.RotaId, x.DataHoraPartidaUtc })
            .ToListAsync();

        var indiceExistentes = chavesExistentes
            .Select(x => $"{x.RotaId}|{x.DataHoraPartidaUtc:O}")
            .ToHashSet();

        var viagensNovas = viagensPlanejadas
            .Where(x => !indiceExistentes.Contains($"{x.RotaId}|{x.DataHoraPartidaUtc:O}"))
            .ToList();

        if (viagensNovas.Count == 0)
        {
            return;
        }

        await dbContext.Viagens.AddRangeAsync(viagensNovas);
        await dbContext.SaveChangesAsync();
    }
}
