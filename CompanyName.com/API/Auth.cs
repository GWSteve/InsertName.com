using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;

namespace CompanyName.com.API
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        // POST: api/auth/validateLogin
        [HttpPost("validateLogin")]
        public IActionResult ValidateLogin([FromBody] LoginRequest loginRequest)
        {
            if (loginRequest == null || string.IsNullOrEmpty(loginRequest.Username) || string.IsNullOrEmpty(loginRequest.PasswordHash))
            {
                return BadRequest(new { isValid = false, error = "Missing username or password hash." });
            }

            // Pre-hashed passwords using SHA-256 (hashed ONCE on frontend)
            var validCredentials = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
            {
                { "Guest", "85e8d66d3be882590eb738284e54c90ed9972cd7a80f173f9fe72af518ec1b94" },
                { "Administrator", "db0e72748375f39de3efca577461265dd3ab4c41e94867759ca063be2e10b8c4" },
                { "Hacker", "bda73679ff0137edc8e4ec93be4c9f59344a920e10958cf172d96643f9822f0a" }
            };

            bool isValid = validCredentials.TryGetValue(loginRequest.Username, out string storedHash) &&
                           storedHash.Equals(loginRequest.PasswordHash, StringComparison.OrdinalIgnoreCase);

            return Ok(new { isValid });
        }
    }

    public class LoginRequest
    {
        public string Username { get; set; }
        public string PasswordHash { get; set; }
    }
}
