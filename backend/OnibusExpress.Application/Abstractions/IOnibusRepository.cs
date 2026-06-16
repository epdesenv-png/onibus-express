using OnibusExpress.Domain.Entities;

namespace OnibusExpress.Application.Abstractions;

public interface IOnibusRepository
{
    Task<IReadOnlyList<Rota>> ListarRotasAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Viagem>> BuscarViagensAsync(string origem, string destino, DateOnly data, CancellationToken cancellationToken = default);
    Task<Viagem?> ObterViagemPorIdAsync(int id, CancellationToken cancellationToken = default);
    Task<Reserva?> ObterReservaPorCodigoAsync(string codigo, CancellationToken cancellationToken = default);
    Task<bool> AssentoOcupadoAsync(int viagemId, int assento, CancellationToken cancellationToken = default);
    Task<bool> CodigoReservaExisteAsync(string codigo, CancellationToken cancellationToken = default);
    Task<Passageiro> ObterOuCriarPassageiroAsync(string nome, string cpf, string email, DateOnly dataNascimento, CancellationToken cancellationToken = default);
    Task AdicionarReservaAsync(Reserva reserva, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
