document.addEventListener('DOMContentLoaded', function () {
    const loginBtn = document.querySelector('.btn-login');
    const errorMsg = document.getElementById('errorMsg');
    const loader = document.getElementById('loader');

    if (loginBtn) {
        loginBtn.addEventListener('click', async function (e) {
            e.preventDefault();

            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();

            if (!username || !password) {
                showError('Username and password are required.');
                return;
            }

            try {
                showSuccess();

                // Now sending the plain password (no hashing on the frontend)
                const response = await fetch('/api/Auth/validateLogin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        Username: username,
                        Password: password  // Send plain password here
                    })
                });

                const data = await response.json();

                if (data.isValid) {
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('username', username);
                    setTimeout(() => window.location.href = '/HTML/Profile.html', 2000);
                } else {
                    showError('Invalid username or password.');
                }
            } catch (err) {
                console.error(err);
                showError('Login failed. Please try again.');
            }
        });
    }

    function showError(msg) {
        if (errorMsg) {
            errorMsg.textContent = msg;
            errorMsg.style.color = 'red';
        }
        loader?.classList.add('hidden');
    }

    function showSuccess() {
        if (errorMsg) {
            errorMsg.innerHTML = `<span class="dot-anim">.</span><span class="dot-anim">.</span><span class="dot-anim">.</span>`;
            errorMsg.style.color = 'green';
        }
        loader?.classList.remove('hidden');
    }
});
