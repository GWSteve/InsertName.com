document.addEventListener("DOMContentLoaded", function () {
    const username = localStorage.getItem('username') || 'guest';
    const usernameLower = username.toLowerCase();

    // Set profile name, image, and email
    document.querySelector('.profile-name').textContent = username;
    document.querySelector('.profile-email').textContent = `${username}@example.com`;
    document.querySelector('.profile-image img').src = `../Assets/${usernameLower}.png`;

    document.getElementById('usernameDetails').textContent = username;
    document.getElementById('emailDetails').textContent = `${username}@example.com`;

    const terminalSection = document.getElementById('terminalSection');
    const adminDownload = document.getElementById('secretFileSection');
    const flagSubmission = document.getElementById('flagSubmission');

    terminalSection.hidden = true;
    flagSubmission.hidden = true;
    adminDownload.hidden = true;

    if (usernameLower === 'hacker') {
        terminalSection.hidden = false;
        flagSubmission.hidden = false;
    } else if (usernameLower === 'admin') {
        adminDownload.hidden = false;
    }

    const terminalOutput = document.getElementById('terminalOutput');
    const commandInput = document.getElementById('commandInput');
    const commandForm = document.getElementById('terminalForm');

    function appendToTerminal(text, isCommand = false) {
        const line = document.createElement('div');
        line.className = 'terminal-line';

        if (isCommand) {
            line.innerHTML = `<span class="prompt">${username}@kali:~$</span> ${text}`;
        } else {
            line.textContent = text;
        }

        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    function handleCommand(command) {
        const lowerCmd = command.toLowerCase();
        switch (lowerCmd) {
            case 'help':
                appendToTerminal("Available commands:\n- help\n- whoami\n- clear\n- date\n- logout");
                break;
            case 'whoami':
                appendToTerminal(`You are logged in as: ${username}`);
                break;
            case 'date':
                appendToTerminal(new Date().toString());
                break;
            case 'clear':
                terminalOutput.innerHTML = '';
                break;
            case 'logout':
                appendToTerminal("Logging out...");
                setTimeout(() => {
                    localStorage.removeItem('username');
                    window.location.href = 'login.html';
                }, 1000);
                break;
            default:
                appendToTerminal(`Command not found: ${command}`);
        }
    }

    if (commandForm) {
        commandForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const command = commandInput.value.trim();
            if (command !== '') {
                appendToTerminal(command, true);
                handleCommand(command);
                commandInput.value = '';
            }
        });
    }

    // Flag functionality
    const submitFlagButton = document.querySelector('#submitFlag');
    const flagResult = document.querySelector('#flagResult');
    const progressBar = document.querySelector('#progressBar');

    if (submitFlagButton) {
        submitFlagButton.addEventListener('click', () => {
            const flag = document.querySelector('#flagInput').value.trim();
            if (flag) {
                progressBar.style.width = '100%';
                flagResult.textContent = `Flag ${flag} submitted successfully!`;
                flagResult.style.color = '#2ecc71';
            } else {
                flagResult.textContent = 'Please enter a valid flag.';
                flagResult.style.color = '#e74c3c';
            }
        });
    }

    // Admin file download functionality
    const downloadBtn = document.querySelector('#downloadSecretFile');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            alert('Secret file downloaded!');
        });
    }

    // Logout button (top-right)
    const logoutBtn = document.querySelector('#logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('username');
            window.location.href = 'login.html';
        });
    }
});
