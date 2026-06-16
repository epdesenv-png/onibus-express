using OnibusExpress.Application.Abstractions;
using OnibusExpress.Application.Common;
using OnibusExpress.Application.Constants;
using OnibusExpress.Application.Contracts;
using OnibusExpress.Domain.Entities;
using OnibusExpress.Domain.Services;

namespace OnibusExpress.Application.Services;

/// <summary>
/// Serviço de aplicação para gerenciar reservas de passagens
/// Encapsula a lógica de negócio para criação, cancelamento e consultagem de reservas
/// 
/// Responsabilidades:
/// - Validar dados de entrada (CPF, assento, viagem)
/// - Verificar regras de negócio (assento disponível, viagem não realizada, etc.)
/// - Orquestrar operações no repositório
/// - Mapear entidades para DTOs
/// </summary>
public class ReservaService(IOnibusRepository repository)
{
    /// <summary>
    /// Cria uma nova reserva com os dados fornecidos
    /// 
    /// Validações realizadas:
    /// - CPF válido (formato + dígitos verificadores)
    /// - Viagem existe e não foi realizada
    /// - Assento está dentro do intervalo válido e não está ocupado
    /// - Passageiro é criado ou recuperado do banco
    /// 
    /// Processo:
    /// 1. Validação de CPF
    /// 2. Busca da viagem e validação
    /// 3. Validação de assento
    /// 4. Criação/recuperação de passageiro
    /// 5. Geração de código de reserva único
    /// 6. Persistência e retorno
    /// </summary>
    public async Task<ReservaDto> CriarReservaAsync(CriarReservaRequest request, CancellationToken cancellationToken = default)
    {
        // Validação de CPF usando validador de domínio
        if (!CpfValidator.IsValid(request.Cpf))
        {
            throw new BusinessException("CPF inválido.");
        }

        // Busca viagem e valida existência
        var viagem = await repository.ObterViagemPorIdAsync(request.ViagemId, cancellationToken)
                     ?? throw new BusinessException("Viagem não encontrada.");

        var agora = DateTime.UtcNow;
        
        // Validação de regra de negócio: viagem não pode ter já partido
        if (viagem.JaPartiu(agora))
        {
            throw new BusinessException("Não é possível reservar uma viagem já realizada.");
        }

        // Validação de assento: deve estar no intervalo [1, TotalAssentos]
        if (request.NumeroAssento < 1 || request.NumeroAssento > viagem.TotalAssentos)
        {
            throw new BusinessException("Assento inválido para esta viagem.");
        }

        // Validação de disponibilidade: assento não pode estar ocupado
        if (await repository.AssentoOcupadoAsync(request.ViagemId, request.NumeroAssento, cancellationToken))
        {
            throw new BusinessException("Assento já está ocupado.");
        }

        // Obter ou criar passageiro com os dados fornecidos
        var passageiro = await repository.ObterOuCriarPassageiroAsync(
            request.Nome,
            request.Cpf,
            request.Email,
            request.DataNascimento,
            cancellationToken
        );

        // Gerar código de reserva único (pode falhar se 20 tentativas esgotarem)
        var codigo = await GerarCodigoUnicoAsync(cancellationToken);
        
        // Criar entidade de reserva
        var reserva = new Reserva
        {
            ViagemId = viagem.Id,
            PassageiroId = passageiro.Id,
            NumeroAssento = request.NumeroAssento,
            CodigoReserva = codigo,
            CriadaEmUtc = agora
        };

        // Persistir no banco de dados
        await repository.AdicionarReservaAsync(reserva, cancellationToken);
        await repository.SaveChangesAsync(cancellationToken);

        // Recuperar reserva completa para retorno (inclui relacionamentos)
        var reservaCompleta = await repository.ObterReservaPorCodigoAsync(codigo, cancellationToken)
                             ?? throw new BusinessException("Reserva criada, mas não encontrada para retorno.");

        return MapearReserva(reservaCompleta);
    }

    /// <summary>
    /// Obtém uma reserva pelo código
    /// </summary>
    public async Task<ReservaDto?> ObterReservaAsync(string codigo, CancellationToken cancellationToken = default)
    {
        var reserva = await repository.ObterReservaPorCodigoAsync(codigo, cancellationToken);
        return reserva is null ? null : MapearReserva(reserva);
    }

    /// <summary>
    /// Cancela uma reserva existente
    /// 
    /// Validações:
    /// - Reserva deve existir
    /// - Cancelamento deve estar permitido (até 2 horas antes da partida)
    /// - Reserva deve estar ativa
    /// </summary>
    public async Task<ReservaDto> CancelarReservaAsync(string codigo, CancellationToken cancellationToken = default)
    {
        var reserva = await repository.ObterReservaPorCodigoAsync(codigo, cancellationToken)
                     ?? throw new BusinessException("Reserva não encontrada.");

        var agora = DateTime.UtcNow;
        if (!reserva.Cancelar(agora))
        {
            throw new BusinessException("Cancelamento permitido apenas até 2 horas antes da partida.");
        }

        await repository.SaveChangesAsync(cancellationToken);
        return MapearReserva(reserva);
    }

    /// <summary>
    /// Mapeia entidade Reserva para DTO de transferência
    /// Garante separação entre camada de persistência e API
    /// </summary>
    private static ReservaDto MapearReserva(Reserva reserva)
    {
        return new ReservaDto(
            reserva.CodigoReserva,
            reserva.ViagemId,
            reserva.NumeroAssento,
            reserva.Status.ToString(),
            reserva.Passageiro?.Nome ?? string.Empty,
            reserva.Passageiro?.Cpf ?? string.Empty,
            reserva.Passageiro?.Email ?? string.Empty,
            reserva.CriadaEmUtc
        );
    }

    /// <summary>
    /// Gera um código de reserva único (ABC-12345)
    /// 
    /// Algoritmo:
    /// 1. Gera código aleatório usando CodigoReservaGenerator
    /// 2. Valida se já existe no banco
    /// 3. Retorna se único, ou tenta novamente (até MaxRetornosCodigo)
    /// 4. Falha após esgotar tentativas
    /// 
    /// Nota: Usa limite de tentativas para evitar loops infinitos em caso de 
    /// geração ruim ou banco com muitos registros
    /// </summary>
    private async Task<string> GerarCodigoUnicoAsync(CancellationToken cancellationToken)
    {
        for (var i = 0; i < CodigoReservaConstants.MaxRetornosCodigo; i++)
        {
            var codigo = CodigoReservaGenerator.Generate();
            if (!await repository.CodigoReservaExisteAsync(codigo, cancellationToken))
            {
                return codigo;
            }
        }

        throw new BusinessException("Não foi possível gerar um código de reserva único.");
    }
}
