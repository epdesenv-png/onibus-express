namespace OnibusExpress.Domain.Entities;

public class Viagem
{
    public int Id { get; set; }
    public int RotaId { get; set; }
    public Rota? Rota { get; set; }
    public DateTime DataHoraPartidaUtc { get; set; }
    public decimal Preco { get; set; }
    public int TotalAssentos { get; set; }

    public List<Reserva> Reservas { get; set; } = [];

    public bool JaPartiu(DateTime utcAgora) => DataHoraPartidaUtc <= utcAgora;
}
