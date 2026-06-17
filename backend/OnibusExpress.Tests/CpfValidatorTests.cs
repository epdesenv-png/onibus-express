using OnibusExpress.Domain.Services;

namespace OnibusExpress.Tests;

public class CpfValidatorTests
{
    [Theory]
    [InlineData("529.982.247-25")]
    [InlineData("52998224725")]
    [InlineData("11144477735")]
    public void DeveValidarCpfCorreto(string cpf)
    {
        var result = CpfValidator.IsValid(cpf);
        Assert.True(result);
    }

    [Theory]
    [InlineData("11111111111")]
    [InlineData("12345678900")]
    [InlineData("52998224724")]
    [InlineData("")]
    public void DeveInvalidarCpfIncorreto(string cpf)
    {
        var result = CpfValidator.IsValid(cpf);
        Assert.False(result);
    }
}
