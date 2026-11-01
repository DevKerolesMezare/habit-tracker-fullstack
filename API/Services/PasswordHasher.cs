using System.Security.Cryptography;
using System.Text;
using API.Data.Models;

namespace API.Services;

public static class PasswordHasher
{
    public static void SetPassword(User user, string password)
    {
        using var hmac = new HMACSHA512();
        user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        user.PasswordSalt = hmac.Key;
    }

    public static bool VerifyPassword(User user, string password)
    {
        using var hmac = new HMACSHA512(user.PasswordSalt);
        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));

        return CryptographicOperations.FixedTimeEquals(
            computedHash,
            user.PasswordHash);
    }
}
