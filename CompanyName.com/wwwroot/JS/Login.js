document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const loginButton = document.getElementById("loginButton");
    const errorMsg = document.getElementById("error-message");
    const loader = document.getElementById("loader");

    if (!form || !loginButton) {
        console.error("Form or button not found!");
        return;
    }

    loginButton.addEventListener("click", async (event) => {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;

        if (!username || !password) {
            showError("Please enter both fields.");
            return;
        }

        showLoader(true);
        hideError();

        const hardcodedHashes = {
            "Hacker": "bda73679ff0137edc8e4ec93be4c9f59344a920e10958cf172d96643f9822f0a", // Hacker
            "Guest": "9f132b053488478489310e498069a7c6dd58e285fd1f7b18ddab98a5129643b9", // SuperUser
            "Administrator": "64c73861b40aea219763ef930607a3295c16fd3a99b4f1f0ec537c09ec732afb" // MySuperSecretPassword
        };

        const passwordHash = await sha256(password);
        console.log(`Hash for entered password: ${passwordHash}`);

        if (hardcodedHashes[username] && hardcodedHashes[username] === passwordHash) {
            localStorage.setItem("username", username); // Store username in localStorage
            setTimeout(() => {
                window.location.href = "../HTML/Profile.html";
            }, 2500); // 2.5-second delay
        } else {
            showLoader(false);
            showError("Invalid credentials.");
        }
    });

    function showError(message) {
        errorMsg.textContent = message;
        errorMsg.style.display = "block";
    }

    function hideError() {
        errorMsg.textContent = "";
        errorMsg.style.display = "none";
    }

    function showLoader(visible) {
        loader.style.display = visible ? "flex" : "none";
    }
});

// SHA-256 hashing using Web Crypto API
async function sha256(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
