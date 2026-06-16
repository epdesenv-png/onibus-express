using OnibusExpress.Domain.Enums;

namespace OnibusExpress.Domain.Entities;

public class Reserva
{
    public int Id { get; set; }
    public int ViagemId { get; set; }
    public Viagem? Viagem { get; set; }
    public int PassageiroId { get; set; }
    public Passageiro? Passageiro { get; set; }
    public int NumeroAssento { get; set; }
    public ReservaStatus Status { get; set; } = ReservaStatus.Ativa;
    public string CodigoReserva { get; set; } = string.Empty;
    public DateTime CriadaEmUtc { get; set; }
    public DateTime? CanceladaEmUtc { get; set; }

    public bool PodeCancelar(DateTime utcAgora)
    {
        if (Status != ReservaStatus.Ativa || Viagem is null)
        {
            return false;
        }

        return utcAgora <= Viagem.DataHoraPartidaUtc.AddHours(-2);
    }

    public bool Cancelar(DateTime utcAgora)
    {
        if (!PodeCancelar(utcAgora))
        {
            return false;
        }

        Status = ReservaStatus.Cancelada;
        CanceladaEmUtc = utcAgora;
        return true;
    }
}
