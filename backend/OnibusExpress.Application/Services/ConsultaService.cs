using OnibusExpress.Application.Abstractions;
using OnibusExpress.Application.Contracts;
using OnibusExpress.Domain.Enums;

namespace OnibusExpress.Application.Services;

public class ConsultaService(IOnibusRepository repository)
{
    public async Task<IReadOnlyList<RotaDto>> ListarRotasAsync(CancellationToken cancellationToken = default)
    {
        var rotas = await repository.ListarRotasAsync(cancellationToken);
        return rotas
            .Select(r => new RotaDto(r.Id, r.Origem, r.Destino, r.DuracaoMinutos))
            .ToList();
    }

    public async Task<IReadOnlyList<ViagemDto>> BuscarViagensAsync(string origem, string destino, DateOnly data, CancellationToken cancellationToken = default)
    {
        var viagens = await repository.BuscarViagensAsync(origem, destino, data, cancellationToken);

        return viagens.Select(v =>
        {
            var assentosOcupados = v.Reservas.Count(r => r.Status == ReservaStatus.Ativa);
            return new ViagemDto(
                v.Id,
                v.Rota?.Origem ?? string.Empty,
                v.Rota?.Destino ?? string.Empty,
                v.DataHoraPartidaUtc,
                v.Preco,
                v.TotalAssentos,
                v.TotalAssentos - assentosOcupados
            );
        }).ToList();
    }

    public async Task<ViagemDetalheDto?> ObterViagemAsync(int id, CancellationToken cancellationToken = default)
    {
        var viagem = await repository.ObterViagemPorIdAsync(id, cancellationToken);
        if (viagem is null)
        {
            return null;
        }

        return new ViagemDetalheDto(
            viagem.Id,
            viagem.Rota?.Origem ?? string.Empty,
            viagem.Rota?.Destino ?? string.Empty,
            viagem.DataHoraPartidaUtc,
            viagem.Preco,
            viagem.TotalAssentos,
            viagem.Reservas.Where(r => r.Status == ReservaStatus.Ativa).Select(r => r.NumeroAssento).ToArray()
        );
    }
}
