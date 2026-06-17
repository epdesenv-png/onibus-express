using System.Net;
using System.Net.Http.Json;
using OnibusExpress.Application.Contracts;

namespace OnibusExpress.Tests;

public class ApiEndpointsIntegrationTests : IClassFixture<ApiWebApplicationFactory>
{
    private readonly HttpClient _client;

    public ApiEndpointsIntegrationTests(ApiWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task DeveListarRotas()
    {
        var response = await _client.GetAsync("/rotas");
        response.EnsureSuccessStatusCode();

        var data = await response.Content.ReadFromJsonAsync<List<RotaResponse>>();
        Assert.NotNull(data);
        Assert.NotEmpty(data!);
    }

    [Fact]
    public async Task DeveCriarConsultarECancelarReserva()
    {
        var viagens = await _client.GetFromJsonAsync<List<ViagemResponse>>("/viagens?origem=Sao%20Paulo&destino=Rio%20de%20Janeiro&data=2099-12-31");
        if (viagens is null || viagens.Count == 0)
        {
            viagens = await _client.GetFromJsonAsync<List<ViagemResponse>>($"/viagens?origem=Sao%20Paulo&destino=Rio%20de%20Janeiro&data={DateTime.UtcNow.AddDays(1):yyyy-MM-dd}");
        }

        Assert.NotNull(viagens);
        Assert.NotEmpty(viagens!);

        var request = new CriarReservaRequest(
            viagens![0].Id,
            9,
            "Teste API",
            "52998224725",
            "teste.api@email.com",
            new DateOnly(1993, 1, 20)
        );

        var created = await _client.PostAsJsonAsync("/reservas", request);
        created.EnsureSuccessStatusCode();

        var reserva = await created.Content.ReadFromJsonAsync<ReservaResponse>();
        Assert.NotNull(reserva);
        Assert.Equal("Ativa", reserva!.Status);

        var consulta = await _client.GetAsync($"/reservas/{reserva.Codigo}");
        consulta.EnsureSuccessStatusCode();

        var cancelamento = await _client.DeleteAsync($"/reservas/{reserva.Codigo}");
        cancelamento.EnsureSuccessStatusCode();

        var cancelada = await cancelamento.Content.ReadFromJsonAsync<ReservaResponse>();
        Assert.NotNull(cancelada);
        Assert.Equal("Cancelada", cancelada!.Status);
    }

    [Fact]
    public async Task NaoDevePermitirReservaComCpfInvalido()
    {
        var viagens = await _client.GetFromJsonAsync<List<ViagemResponse>>($"/viagens?origem=Sao%20Paulo&destino=Rio%20de%20Janeiro&data={DateTime.UtcNow.AddDays(1):yyyy-MM-dd}");
        Assert.NotNull(viagens);
        Assert.NotEmpty(viagens!);

        var request = new CriarReservaRequest(
            viagens![0].Id,
            10,
            "CPF Invalido",
            "12345678900",
            "invalido@email.com",
            new DateOnly(1990, 5, 1)
        );

        var response = await _client.PostAsJsonAsync("/reservas", request);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    private record RotaResponse(int Id, string Origem, string Destino, int DuracaoMinutos);

    private record ViagemResponse(
        int Id,
        string Origem,
        string Destino,
        DateTime DataHoraPartidaUtc,
        decimal Preco,
        int TotalAssentos,
        int AssentosDisponiveis
    );

    private record ReservaResponse(
        string Codigo,
        int ViagemId,
        int NumeroAssento,
        string Status,
        string NomePassageiro,
        string Cpf,
        string Email,
        DateTime CriadaEmUtc
    );
}
