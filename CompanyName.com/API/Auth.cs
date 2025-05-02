using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Data.SqlClient;

namespace CompanyName.com.API
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly string _connectionString = "YourConnectionStringHere";

        [HttpPost("validateLogin")]
        public async Task<IActionResult> ValidateLogin([FromBody] LoginRequest loginRequest)
        {
            // Hash the password sent from the client
            var hashedPassword = ComputeSha256Hash(loginRequest.PasswordHash);

            // Read the SQL files for validating username and password
            string usernameQuery = ReadSqlFile("/Database/Username.sql");
            string passwordQuery = ReadSqlFile("/Database/Password.sql");

            // Check the database for the user
            bool isValid = await ValidateUserAsync(loginRequest.Username, hashedPassword, usernameQuery, passwordQuery);

            return Ok(new { isValid });
        }

        private async Task<bool> ValidateUserAsync(string username, string hashedPassword, string usernameQuery, string passwordQuery)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                try
                {
                    await connection.OpenAsync();

                    // Validate username
                    using (SqlCommand cmd = new SqlCommand(usernameQuery, connection))
                    {
                        cmd.Parameters.AddWithValue("@Username", username);
                        var usernameResult = await cmd.ExecuteScalarAsync();
                        if (usernameResult == null || (int)usernameResult == 0)
                        {
                            return false; // Invalid username
                        }
                    }

                    // Validate password
                    using (SqlCommand cmd = new SqlCommand(passwordQuery, connection))
                    {
                        cmd.Parameters.AddWithValue("@Username", username);
                        cmd.Parameters.AddWithValue("@PasswordHash", hashedPassword);
                        var passwordResult = await cmd.ExecuteScalarAsync();
                        if (passwordResult == null || (int)passwordResult == 0)
                        {
                            return false; // Invalid password
                        }
                    }

                    return true; // Both username and password are valid
                }
                catch (SqlException ex)
                {
                    // Log the exception if necessary
                    Console.WriteLine(ex.Message);
                    return false;
                }
            }
        }

        private string ReadSqlFile(string filePath)
        {
            try
            {
                return System.IO.File.ReadAllText(filePath);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error reading SQL file: " + ex.Message);
                return string.Empty; // Return an empty query string in case of error
            }
        }

        private string ComputeSha256Hash(string rawData)
        {
            using (SHA256 sha256Hash = SHA256.Create())
            {
                // Compute hash from the raw data
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData));

                // Convert byte array to a string
                return string.Concat(bytes.Select(b => b.ToString("x2")));
            }
        }
    }

    public class LoginRequest
    {
        public string Username { get; set; }
        public string PasswordHash { get; set; }
    }
}
