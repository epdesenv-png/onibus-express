using Microsoft.AspNetCore.Mvc;
using OnibusExpress.Application.Services;

namespace OnibusExpress.Api.Controllers;

[ApiController]
[Route("rotas")]
public class RotasController(ConsultaService consultaService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {
        var rotas = await consultaService.ListarRotasAsync(cancellationToken);
        return Ok(rotas);
    }
}
