using OnibusExpress.Domain.Services;

namespace OnibusExpress.Tests;

public class CodigoReservaGeneratorTests
{
    [Fact]
    public void DeveGerarCodigoNoFormatoEsperado()
    {
        var codigo = CodigoReservaGenerator.Generate(new Random(123));

        Assert.Matches("^[A-Z]{3}-[0-9]{5}$", codigo);
    }
}
