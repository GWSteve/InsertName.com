using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;

namespace CompanyName.com.API
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ILogger<AuthController> _logger;

        // Constructor for injecting logger
        public AuthController(ILogger<AuthController> logger)
        {
            _logger = logger;
        }

        // POST: api/auth/validateLogin
        [HttpPost("validateLogin")]
        public IActionResult ValidateLogin([FromBody] LoginRequest loginRequest)
        {
            // Check if the request body is null or missing required fields
            if (loginRequest == null)
            {
                _logger.LogWarning("Received null login request.");
                return BadRequest(new { isValid = false, error = "Request body is null." });
            }

            if (string.IsNullOrEmpty(loginRequest.Username) || string.IsNullOrEmpty(loginRequest.PasswordHash))
            {
                _logger.LogWarning("Missing username or password hash.");
                return BadRequest(new { isValid = false, error = "Missing username or password hash." });
            }

            // Log the attempt
            _logger.LogInformation("Login attempt for username: {Username}", loginRequest.Username);

            // Pre-hashed passwords using SHA-256 (hashed ONCE on frontend)
            var validCredentials = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
            {
                // Guest: "E9f6t8oeE0JG2U31o1d6"
                { "Guest", "85e8d66d3be882590eb738284e54c90ed9972cd7a80f173f9fe72af518ec1b94" },

                // Administrator: "U7S732UWX2EQy7zINIGX"
                { "Administrator", "db0e72748375f39de3efca577461265dd3ab4c41e94867759ca063be2e10b8c4" },

                // Hacker: "Hacker"
                { "Hacker", "bda73679ff0137edc8e4ec93be4c9f59344a920e10958cf172d96643f9822f0a" }
            };

            // Check if credentials are valid
            bool isValid = validCredentials.TryGetValue(loginRequest.Username, out string storedHash) &&
                           storedHash.Equals(loginRequest.PasswordHash, StringComparison.OrdinalIgnoreCase);

            if (isValid)
            {
                _logger.LogInformation("Login successful for username: {Username}", loginRequest.Username);
                return Ok(new { isValid = true });
            }
            else
            {
                _logger.LogWarning("Invalid login attempt for username: {Username}", loginRequest.Username);
                return Unauthorized(new { isValid = false, error = "Invalid credentials." });
            }
        }
    }

    // Model to handle login request
    public class LoginRequest
    {
        public string Username { get; set; }
        public string PasswordHash { get; set; }
    }
}
