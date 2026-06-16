using System.Text.RegularExpressions;

namespace OnibusExpress.Domain.Services;

public static class CpfValidator
{
    private static readonly Regex CpfRegex = new("^\\d{11}$", RegexOptions.Compiled);

    public static bool IsValid(string? cpf)
    {
        if (string.IsNullOrWhiteSpace(cpf))
        {
            return false;
        }

        var digits = Regex.Replace(cpf, "[^0-9]", string.Empty);
        if (!CpfRegex.IsMatch(digits))
        {
            return false;
        }

        if (digits.Distinct().Count() == 1)
        {
            return false;
        }

        var firstDigit = CalculateVerifier(digits, 9);
        var secondDigit = CalculateVerifier(digits, 10);

        return digits[9] - '0' == firstDigit && digits[10] - '0' == secondDigit;
    }

    private static int CalculateVerifier(string digits, int length)
    {
        var sum = 0;
        for (var i = 0; i < length; i++)
        {
            sum += (digits[i] - '0') * ((length + 1) - i);
        }

        var result = (sum * 10) % 11;
        return result == 10 ? 0 : result;
    }
}
