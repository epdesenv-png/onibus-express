using Microsoft.EntityFrameworkCore;
using OnibusExpress.Application.Abstractions;
using OnibusExpress.Domain.Entities;
using OnibusExpress.Domain.Enums;

namespace OnibusExpress.Infrastructure.Persistence;

public class OnibusRepository(OnibusExpressDbContext dbContext) : IOnibusRepository
{
    public async Task<IReadOnlyList<Rota>> ListarRotasAsync(CancellationToken cancellationToken = default)
    {
        return await dbContext.Rotas
            .AsNoTracking()
            .OrderBy(x => x.Origem)
            .ThenBy(x => x.Destino)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Viagem>> BuscarViagensAsync(string origem, string destino, DateOnly data, CancellationToken cancellationToken = default)
    {
        var inicio = data.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
        var fim = inicio.AddDays(1);

        return await dbContext.Viagens
            .AsNoTracking()
            .Include(x => x.Rota)
            .Include(x => x.Reservas)
            .Where(x => x.Rota != null
                        && x.Rota.Origem.ToLower() == origem.ToLower()
                        && x.Rota.Destino.ToLower() == destino.ToLower()
                        && x.DataHoraPartidaUtc >= inicio
                        && x.DataHoraPartidaUtc < fim)
            .OrderBy(x => x.DataHoraPartidaUtc)
            .ToListAsync(cancellationToken);
    }

    public async Task<Viagem?> ObterViagemPorIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await dbContext.Viagens
            .Include(x => x.Rota)
            .Include(x => x.Reservas)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<Reserva?> ObterReservaPorCodigoAsync(string codigo, CancellationToken cancellationToken = default)
    {
        return await dbContext.Reservas
            .Include(x => x.Passageiro)
            .Include(x => x.Viagem)
            .FirstOrDefaultAsync(x => x.CodigoReserva == codigo, cancellationToken);
    }

    public async Task<bool> AssentoOcupadoAsync(int viagemId, int assento, CancellationToken cancellationToken = default)
    {
        return await dbContext.Reservas.AnyAsync(
            x => x.ViagemId == viagemId && x.NumeroAssento == assento && x.Status == ReservaStatus.Ativa,
            cancellationToken
        );
    }

    public async Task<bool> CodigoReservaExisteAsync(string codigo, CancellationToken cancellationToken = default)
    {
        return await dbContext.Reservas.AnyAsync(x => x.CodigoReserva == codigo, cancellationToken);
    }

    public async Task<Passageiro> ObterOuCriarPassageiroAsync(
        string nome,
        string cpf,
        string email,
        DateOnly dataNascimento,
        CancellationToken cancellationToken = default)
    {
        var normalizedCpf = cpf.Trim();
        var existente = await dbContext.Passageiros.FirstOrDefaultAsync(x => x.Cpf == normalizedCpf, cancellationToken);
        if (existente is not null)
        {
            existente.Nome = nome.Trim();
            existente.Email = email.Trim();
            existente.DataNascimento = dataNascimento;
            return existente;
        }

        var passageiro = new Passageiro
        {
            Nome = nome.Trim(),
            Cpf = normalizedCpf,
            Email = email.Trim(),
            DataNascimento = dataNascimento
        };

        await dbContext.Passageiros.AddAsync(passageiro, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
        return passageiro;
    }

    public async Task AdicionarReservaAsync(Reserva reserva, CancellationToken cancellationToken = default)
    {
        await dbContext.Reservas.AddAsync(reserva, cancellationToken);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
