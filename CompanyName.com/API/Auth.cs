using System;
using Microsoft.Data.SqlClient;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace CompanyName.Com
{
    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
    }

    public interface IAuthService
    {
        Task<bool> ValidateLoginAsync(LoginRequest request);
    }

    public class AuthService : IAuthService
    {
        private readonly string _connectionString;

        public AuthService(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<bool> ValidateLoginAsync(LoginRequest request) // Keep async as this method is doing async DB calls
        {
            if (request == null || string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.PasswordHash))
            {
                Console.WriteLine("Invalid request: Username or PasswordHash is null or empty.");
                return false;
            }

            try
            {
                Console.WriteLine($"Attempting to validate login for username: {request.Username}");

                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    Console.WriteLine("Database connection opened successfully.");

                    var query = "SELECT PasswordHash FROM Users WHERE Username = @Username";
                    using (var command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@Username", request.Username);
                        var result = await command.ExecuteScalarAsync();

                        if (result != null)
                        {
                            var storedHash = result.ToString();
                            Console.WriteLine($"Stored password hash retrieved for username: {request.Username}");

                            if (storedHash == null)
                            {
                                Console.WriteLine($"Stored password hash is null for username: {request.Username}");
                                return false; // Or handle the case where the hash is null
                            }

                            Console.WriteLine("Comparing the input password hash with the stored password hash...");
                            return VerifyPasswordHash(request.PasswordHash, storedHash);
                        }

                        Console.WriteLine($"Username not found: {request.Username}");
                        return false;  // Username not found
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error validating login: {ex.Message}");
                return false;
            }
        }

        private static bool VerifyPasswordHash(string inputPasswordHash, string storedPasswordHash)
        {
            Console.WriteLine("Verifying password hash...");

            // Use constant-time comparison to prevent timing attacks
            bool isMatch = CryptographicOperations.FixedTimeEquals(
                Encoding.UTF8.GetBytes(inputPasswordHash), Encoding.UTF8.GetBytes(storedPasswordHash));

            Console.WriteLine(isMatch ? "Password hashes match." : "Password hashes do not match.");
            return isMatch;
        }

        public static string GeneratePasswordHash(string password)
        {
            Console.WriteLine("Generating password hash...");

            byte[] hashBytes = SHA256.HashData(Encoding.UTF8.GetBytes(password));
            string hash = BitConverter.ToString(hashBytes).Replace("-", "").ToLower();

            Console.WriteLine($"Generated password hash: {hash}");
            return hash;
        }
    }
}
