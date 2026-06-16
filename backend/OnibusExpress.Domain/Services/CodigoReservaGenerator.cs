namespace OnibusExpress.Domain.Services;

public static class CodigoReservaGenerator
{
    public static string Generate(Random? random = null)
    {
        var rng = random ?? Random.Shared;
        var letters = new string(Enumerable.Range(0, 3).Select(_ => (char)('A' + rng.Next(0, 26))).ToArray());
        var numbers = rng.Next(0, 100000).ToString("D5");

        return $"{letters}-{numbers}";
    }
}
