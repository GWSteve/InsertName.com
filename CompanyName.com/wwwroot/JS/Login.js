document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.querySelector(".btn-login");

    loginButton.addEventListener("click", async function (e) {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const rawPassword = document.getElementById("password").value;

        if (!username || !rawPassword) {
            alert("Please enter both username and password.");
            return;
        }

        // SHA-256 hash
        async function sha256(message) {
            const msgBuffer = new TextEncoder().encode(message);
            const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
        }

        const hashedPassword = await sha256(rawPassword);

        try {
            const response = await fetch("../API/Auth.cs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    passwordHash: hashedPassword
                })
            });

            if (!response.ok) {
                throw new Error("Server error or endpoint not found.");
            }

            const result = await response.json();

            if (result.isValid) {
                localStorage.setItem("username", username);
                window.location.href = "Profile.html";
            } else {
                alert("Invalid login credentials.");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("An error occurred during login.");
        }
    });
});
