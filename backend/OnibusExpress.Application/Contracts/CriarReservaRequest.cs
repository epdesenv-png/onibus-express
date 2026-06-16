namespace OnibusExpress.Application.Contracts;

public record CriarReservaRequest(
    int ViagemId,
    int NumeroAssento,
    string Nome,
    string Cpf,
    string Email,
    DateOnly DataNascimento
);
