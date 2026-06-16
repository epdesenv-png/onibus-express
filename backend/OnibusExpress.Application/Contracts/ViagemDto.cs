namespace OnibusExpress.Application.Contracts;

public record ViagemDto(
    int Id,
    string Origem,
    string Destino,
    DateTime DataHoraPartidaUtc,
    decimal Preco,
    int TotalAssentos,
    int AssentosDisponiveis
);
