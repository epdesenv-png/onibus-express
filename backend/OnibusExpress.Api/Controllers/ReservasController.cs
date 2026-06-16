using Microsoft.AspNetCore.Mvc;
using OnibusExpress.Application.Contracts;
using OnibusExpress.Application.Services;

namespace OnibusExpress.Api.Controllers;

[ApiController]
[Route("reservas")]
public class ReservasController(ReservaService reservaService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Criar([FromBody] CriarReservaRequest request, CancellationToken cancellationToken)
    {
        var reserva = await reservaService.CriarReservaAsync(request, cancellationToken);
        return CreatedAtAction(nameof(Consultar), new { codigo = reserva.Codigo }, reserva);
    }

    [HttpGet("{codigo}")]
    public async Task<IActionResult> Consultar(string codigo, CancellationToken cancellationToken)
    {
        var reserva = await reservaService.ObterReservaAsync(codigo, cancellationToken);
        if (reserva is null)
        {
            return NotFound();
        }

        return Ok(reserva);
    }

    [HttpDelete("{codigo}")]
    public async Task<IActionResult> Cancelar(string codigo, CancellationToken cancellationToken)
    {
        var reserva = await reservaService.CancelarReservaAsync(codigo, cancellationToken);
        return Ok(reserva);
    }
}
