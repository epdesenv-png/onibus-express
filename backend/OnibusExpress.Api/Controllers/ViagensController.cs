using Microsoft.AspNetCore.Mvc;
using OnibusExpress.Application.Common;
using OnibusExpress.Application.Services;

namespace OnibusExpress.Api.Controllers;

[ApiController]
[Route("viagens")]
public class ViagensController(ConsultaService consultaService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Buscar(
        [FromQuery] string origem,
        [FromQuery] string destino,
        [FromQuery] DateOnly data,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(origem) || string.IsNullOrWhiteSpace(destino))
        {
            throw new BusinessException("Os campos origem e destino são obrigatórios.");
        }

        var viagens = await consultaService.BuscarViagensAsync(origem, destino, data, cancellationToken);
        return Ok(viagens);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Detalhe(int id, CancellationToken cancellationToken)
    {
        var viagem = await consultaService.ObterViagemAsync(id, cancellationToken);
        if (viagem is null)
        {
            return NotFound();
        }

        return Ok(viagem);
    }
}
