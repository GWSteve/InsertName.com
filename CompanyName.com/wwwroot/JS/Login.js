document.addEventListener('DOMContentLoaded', function () {
    const loginBtn = document.querySelector('.btn-login');
    const errorMsg = document.getElementById('errorMsg');
    const loader = document.getElementById('loader');

    if (loginBtn) {
        loginBtn.addEventListener('click', async function (e) {
            e.preventDefault(); // Prevent default form submission

            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');

            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            if (!username || !password) {
                showError('Username and password are required.');
                return;
            }

            try {
                showSuccess(); // Show only dots when logging in

                const hashedPassword = await hashPassword(password);

                // Send request to server for validation
                const isValid = await validateLogin(username, hashedPassword);

                if (isValid) {
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('username', username);

                    setTimeout(() => {
                        window.location.href = '/HTML/Profile.html';
                    }, 2000);
                } else {
                    showError('Invalid username or password.');
                }
            } catch (err) {
                showError('Unexpected error. Please try again.');
                console.error('Login error:', err);
            }
        });
    }

    function showError(message) {
        if (errorMsg) {
            errorMsg.textContent = message;
            errorMsg.style.color = 'red';
        }
        if (loader) {
            loader.classList.add('hidden');
        }
    }

    function showSuccess() {
        if (errorMsg) {
            errorMsg.innerHTML = `
                <span class="dot-anim">.</span><span class="dot-anim">.</span><span class="dot-anim">.</span>
            `;
            errorMsg.style.color = 'transparent'; // Make text color transparent (we only want the dots)
        }
        if (loader) {
            loader.classList.remove('hidden');
        }
    }

    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashedBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashedBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toLowerCase(); // Ensure lowercase
    }

    async function validateLogin(username, hashedPassword) {
        try {
            const response = await fetch('', { // Adjust this URL to your backend API endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    passwordHash: hashedPassword
                })
            });

            if (response.ok) {
                const result = await response.json();
                return result.isValid;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Validation error:', error);
            return false;
        }
    }
});
