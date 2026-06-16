namespace OnibusExpress.Domain.Entities;

public class Rota
{
    public int Id { get; set; }
    public string Origem { get; set; } = string.Empty;
    public string Destino { get; set; } = string.Empty;
    public int DuracaoMinutos { get; set; }

    public List<Viagem> Viagens { get; set; } = [];
}
