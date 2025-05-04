document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");

    if (!form) {
        console.error("Form not found!");
        return;
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;

        if (!username || !password) {
            alert("Please enter both fields.");
            return;
        }

        const passwordHash = sha256(password);

        try {
            const response = await fetch("https://localhost:7237/API/Auth/validateLogin", {  // Ensure this is correct URL
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, passwordHash })
            });

            const result = await response.json();

            if (response.ok && result.isValid) {
                alert("Login successful!");
                localStorage.setItem("username", username);
                window.location.href = "../HTML/Profile.html";
            } else {
                alert("Login failed: " + (result.error || "Invalid credentials."));
            }
        } catch (err) {
            console.error("Login error:", err);
            alert("Error contacting server.");
        }
    });
});
