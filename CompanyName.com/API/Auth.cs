using Microsoft.AspNetCore.Mvc;

namespace CompanyName.com.API
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        [HttpPost("validateLogin")]
        public IActionResult ValidateLogin([FromBody] LoginRequest loginRequest)
        {
            // Dictionary of usernames and pre-hashed SHA-256 passwords (client hashes before sending)
            var validCredentials = new Dictionary<string, string>
            {
                // Guest: "E9f6t8oeE0JG2U31o1d6"
                { "Guest", "85e8d66d3be882590eb738284e54c90ed9972cd7a80f173f9fe72af518ec1b94" },
     
                // Administrator: "U7S732UWX2EQy7zINIGX"
                { "Administrator", "db0e72748375f39de3efca577461265dd3ab4c41e94867759ca063be2e10b8c4" },
     
                // Hacker: "Hacker"
                { "Hacker", "bda73679ff0137edc8e4ec93be4c9f59344a920e10958cf172d96643f9822f0a" }

            };

            bool isValid = validCredentials.TryGetValue(loginRequest.Username, out var expectedHash) &&
                           expectedHash.Equals(loginRequest.PasswordHash, StringComparison.OrdinalIgnoreCase);

            return Ok(new { isValid });
        }
    }

    public class LoginRequest
    {
        public string Username { get; set; }
        public string PasswordHash { get; set; }
    }
}
