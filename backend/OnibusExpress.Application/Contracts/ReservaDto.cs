namespace OnibusExpress.Application.Contracts;

public record ReservaDto(
    string Codigo,
    int ViagemId,
    int NumeroAssento,
    string Status,
    string NomePassageiro,
    string Cpf,
    string Email,
    DateTime CriadaEmUtc
);
