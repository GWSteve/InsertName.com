document.addEventListener('DOMContentLoaded', function () {
    const loginBtn = document.querySelector('.login-btn');
    const errorMsg = document.getElementById('errorMsg');

    if (loginBtn) {
        loginBtn.addEventListener('click', async function (e) {
            e.preventDefault(); // prevent form submission if inside a <form>

            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            if (!username || !password) {
                showError('Username and password are required.');
                return;
            }

            try {
                const hashedPassword = await hashPassword(password);

                if (validateLogin(username, hashedPassword)) {
                    // Store session data
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('username', username);

                    // Redirect after short delay
                    showSuccess('Login successful! Redirecting...');
                    setTimeout(() => {
                        window.location.href = 'Profile.html'; // Make sure the path is correct
                    }, 800);
                } else {
                    showError('Invalid username or password.');
                }
            } catch {
                showError('Unexpected error. Please try again.');
            }
        });
    }

    function showError(message) {
        if (errorMsg) {
            errorMsg.textContent = message;
            errorMsg.style.color = 'red';
        }
    }

    function showSuccess(message) {
        if (errorMsg) {
            errorMsg.textContent = message;
            errorMsg.style.color = 'green';
        }
    }

    function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        return crypto.subtle.digest('SHA-256', data).then(hashBuffer => {
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        });
    }

    function validateLogin(username, hashedPassword) {
        const validUsername = "Guest";
        const validPasswordHash = "074499c939a318d7a822cc1b3ce714bee112c8b2a958fe35e935acb25948d6a3"; // "GuestUser"
        return username === validUsername && hashedPassword === validPasswordHash;
    }
});
