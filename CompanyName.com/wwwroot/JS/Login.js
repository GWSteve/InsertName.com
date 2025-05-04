document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");

    if (!form) {
        alert("❌ loginForm not found!");
        return;
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // prevent page reload

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;

        if (!username || !password) {
            alert("❌ Please enter both username and password.");
            return;
        }

        try {
            const response = await fetch("/API/Auth/validateLogin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }) // raw password, no hashing here
            });

            const result = await response.json();

            if (response.ok && result.isValid) {
                alert("✅ Login successful!");
                localStorage.setItem("username", username);
                window.location.href = "../HTML/Profile.html";
            } else {
                alert("❌ Login failed: " + (result.error || "Invalid credentials."));
            }

        } catch (err) {
            alert("❌ Could not contact backend.");
            console.error("Fetch error:", err);
        }
    });
});
