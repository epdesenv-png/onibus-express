using Microsoft.EntityFrameworkCore;
using OnibusExpress.Domain.Entities;

namespace OnibusExpress.Infrastructure.Persistence;

public class OnibusExpressDbContext(DbContextOptions<OnibusExpressDbContext> options) : DbContext(options)
{
    public DbSet<Rota> Rotas => Set<Rota>();
    public DbSet<Viagem> Viagens => Set<Viagem>();
    public DbSet<Passageiro> Passageiros => Set<Passageiro>();
    public DbSet<Reserva> Reservas => Set<Reserva>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Rota>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Origem).HasMaxLength(100).IsRequired();
            entity.Property(x => x.Destino).HasMaxLength(100).IsRequired();
            entity.Property(x => x.DuracaoMinutos).IsRequired();
        });

        modelBuilder.Entity<Viagem>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Preco).HasPrecision(10, 2);
            entity.Property(x => x.TotalAssentos).IsRequired();
            entity.Property(x => x.DataHoraPartidaUtc).IsRequired();

            entity.HasOne(x => x.Rota)
                .WithMany(x => x.Viagens)
                .HasForeignKey(x => x.RotaId);
        });

        modelBuilder.Entity<Passageiro>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Nome).HasMaxLength(120).IsRequired();
            entity.Property(x => x.Cpf).HasMaxLength(14).IsRequired();
            entity.Property(x => x.Email).HasMaxLength(120).IsRequired();
            entity.HasIndex(x => x.Cpf).IsUnique();
        });

        modelBuilder.Entity<Reserva>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.Property(x => x.CodigoReserva).HasMaxLength(9).IsRequired();
            entity.HasIndex(x => x.CodigoReserva).IsUnique();
            entity.Property(x => x.NumeroAssento).IsRequired();

            entity.HasOne(x => x.Viagem)
                .WithMany(x => x.Reservas)
                .HasForeignKey(x => x.ViagemId);

            entity.HasOne(x => x.Passageiro)
                .WithMany(x => x.Reservas)
                .HasForeignKey(x => x.PassageiroId);
        });
    }
}
