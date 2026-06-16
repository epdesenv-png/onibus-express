namespace OnibusExpress.Application.Contracts;

public record ViagemDetalheDto(
    int Id,
    string Origem,
    string Destino,
    DateTime DataHoraPartidaUtc,
    decimal Preco,
    int TotalAssentos,
    IReadOnlyCollection<int> AssentosOcupados
);
