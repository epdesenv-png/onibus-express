/**
 * Constantes da camada de aplicação
 * Centraliza valores mágicos para facilitar manutenção e configuração
 */

namespace OnibusExpress.Application.Constants;

/// <summary>
/// Constantes de negócio relacionadas a cancelamento de reservas
/// </summary>
public static class ReservationConstants
{
    /// <summary>
    /// Número de horas antes da partida em que é permitido cancelar a reserva
    /// </summary>
    public const int HorasAntesParaCancelar = 2;
}

/// <summary>
/// Constantes de geração de código de reserva
/// </summary>
public static class CodigoReservaConstants
{
    /// <summary>
    /// Número máximo de tentativas para gerar um código único
    /// Evita loops infinitos em caso de colisões
    /// </summary>
    public const int MaxRetornosCodigo = 20;

    /// <summary>
    /// Comprimento do código gerado (ABC-12345 = 8 caracteres)
    /// </summary>
    public const int ComprimentoCodigo = 8;

    /// <summary>
    /// Número de letras no código (ABC)
    /// </summary>
    public const int NumeroLetras = 3;

    /// <summary>
    /// Número de dígitos no código (12345)
    /// </summary>
    public const int NumeroDigitos = 5;
}

/// <summary>
/// Constantes de validação
/// </summary>
public static class ValidationConstants
{
    /// <summary>
    /// Comprimento esperado de um CPF (11 dígitos)
    /// </summary>
    public const int CpfLength = 11;

    /// <summary>
    /// Tamanho máximo permitido para campo de nome
    /// </summary>
    public const int MaxNomeLength = 255;

    /// <summary>
    /// Tamanho máximo permitido para campo de email
    /// </summary>
    public const int MaxEmailLength = 255;
}
