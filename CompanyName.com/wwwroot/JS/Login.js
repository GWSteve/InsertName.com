document.addEventListener('DOMContentLoaded', function () {
    const loginBtn = document.querySelector('.btn-login');
    const errorMsg = document.getElementById('errorMsg');
    const loader = document.getElementById('loader');

    if (loginBtn) {
        loginBtn.addEventListener('click', async function (e) {
            e.preventDefault(); // Prevent default form submission

            const usernameInput = document.getElementById('username');  // Correctly target the username input by its ID
            const passwordInput = document.getElementById('password');

            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            if (!username || !password) {
                showError('Username and password are required.');
                return;
            }

            try {
                const hashedPassword = await hashPassword(password);

                if (validateLogin(username, password, hashedPassword)) {
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('username', username);

                    if (loader) {
                        loader.classList.remove('hidden');
                    }

                    // Redirect to profile page after successful login
                    setTimeout(() => {
                        window.location.href = '/HTML/Profile.html'; // Change this to the correct redirect path if necessary
                    }, 2500); // Wait for the success message before redirecting
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

    function showSuccess(message) {
        if (errorMsg) {
            errorMsg.innerHTML = `
                <span class="success-text">${message}</span>
                <span class="dot-anim">.</span><span class="dot-anim">.</span><span class="dot-anim">.</span>
            `;
            errorMsg.style.color = 'green';
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
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    function validateLogin(username, plainPassword, hashedInputPassword) {
        const users = [
            {
                username: "Guest",
                passwordHash: "561055b66acf8293979f657bb4f1b5803814a03073e03c7435e94278bf411375"  // gtrhpkndxLzq8amcvWty
            },
            {
                username: "AdministratorAccount",
                passwordHash: "521c20d7bc809dd3bdc04255fc5fe6413508e3d9cf3d257d6c991f55f8cae6f6"  // gtrhpkndxLzq8amcv
            },
            {
                username: "Hacker",
                passwordHash: "bda73679ff0137edc8e4ec93be4c9f59344a920e10958cf172d96643f9822f0a"  // Hacker
            }
        ];

        const matchingUser = users.find(user => user.username === username);
        if (!matchingUser) {
            return false;
        }

        return hashedInputPassword === matchingUser.passwordHash;
    }
});
