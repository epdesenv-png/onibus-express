namespace OnibusExpress.Domain.Entities;

public class Passageiro
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Cpf { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateOnly DataNascimento { get; set; }

    public List<Reserva> Reservas { get; set; } = [];
}
