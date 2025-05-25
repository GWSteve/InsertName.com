document.addEventListener("DOMContentLoaded", function () {
    const username = localStorage.getItem('username') || 'guest';
    const usernameLower = username.toLowerCase();

    // Set profile data
    document.querySelector('.profile-name').textContent = username;
    document.querySelector('.profile-email').textContent = `${username}@example.com`;
    document.querySelector('.profile-image img').src = `../Assets/${usernameLower}.png`;

    document.getElementById('usernameDetails').textContent = username;
    document.getElementById('emailDetails').textContent = `${username}@example.com`;

    // Role-based visibility
    const terminalSection = document.getElementById('terminalSection');
    const adminDownload = document.getElementById('secretFileSection');
    const flagSubmission = document.getElementById('flagSubmission');

    // Debugging logs to verify role-based logic
    console.log("User Role:", usernameLower);

    // Ensure sections are hidden initially (using style instead of hidden property for better control)
    terminalSection.style.display = 'none';
    flagSubmission.style.display = 'none';
    adminDownload.style.display = 'none';

    // Show sections based on the user role
    if (usernameLower === 'hacker') {
        console.log("Hacker role detected: Showing terminal and flag submission.");
        terminalSection.style.display = 'block';
        flagSubmission.style.display = 'block';
    } else if (usernameLower === 'admin') {
        console.log("Admin role detected: Showing secret file section.");
        adminDownload.style.display = 'block';
    }

    // Terminal logic
    const terminalOutput = document.getElementById('terminalOutput');
    const commandInput = document.getElementById('commandInput');
    const commandForm = document.getElementById('terminalForm');

    function appendToTerminal(text, isCommand = false) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = isCommand
            ? `<span class="prompt">${username}@kali:~$</span> ${text}`
            : text;
        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    // Handle the commands and simulate brute force
    function handleCommand(command) {
        const cmd = command.toLowerCase();
        switch (cmd) {
            case 'help':
                appendToTerminal("Available commands:<br>- help<br>- whoami<br>- clear<br>- date<br>- logout<br>- hydra");
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
            case 'hydra':
                appendToTerminal("Usage: hydra -w usrname.txt -p passwd.txt -t login.html");
                break;
            case 'hydra -w usrname.txt -p passwd.txt -t login.html':
                simulateBruteForce();
                break;
            default:
                appendToTerminal(`Command not found: ${command}`);
        }
    }

    // Ensure terminal form event is correctly handled
    if (commandForm) {
        commandForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const command = commandInput.value.trim();
            if (command !== '') {
                appendToTerminal(command, true);
                handleCommand(command);
                commandInput.value = '';
            }
        });
    }

    // Simulate brute force (hydra command) and show progress
    function simulateBruteForce() {
        const progressBar = document.querySelector('#progress-bar');
        const progressText = document.querySelector('#progress-text');

        // Check if the progress bar and text elements exist
        if (!progressBar || !progressText) {
            console.error("Progress bar or progress text element not found.");
            return;
        }

        // Hide them initially
        progressBar.style.display = 'none';
        progressText.style.display = 'none';

        // Show them dynamically when brute force starts
        progressBar.style.display = 'block';
        progressText.style.display = 'block';

        let attempts = 0;
        let totalCombos = 250;
        let progress = 0;

        // Output each [*] line quickly in sequence
        setTimeout(() => appendToTerminal("[*] Loaded 50 entries from passwords.txt"), 100);
        setTimeout(() => appendToTerminal("[*] Loaded 5 entries from users.txt"), 200);
        setTimeout(() => appendToTerminal("[*] Total combos to try: 250"), 300);
        setTimeout(() => appendToTerminal("[*] Starting brute force with 250 combos left..."), 400);

        // Start the brute force simulation
        const interval = setInterval(() => {
            attempts++;
            progress = Math.min((attempts / totalCombos) * 100, 100); // Max 100%

            // Update progress bar on the same line in terminal
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${Math.floor(progress)}%|${'█'.repeat(Math.floor(progress / 2))}${' '.repeat(50 - Math.floor(progress / 2))}| ${attempts}/${totalCombos} [00:00<00:00, ${Math.floor(progress * 0.1)} try/s]`;

            // If progress reaches 100%, display success
            if (progress === 100) {
                appendToTerminal("[+] SUCCESS Admin:MySuperSecretPassword");
                appendToTerminal("Found valid credentials: Admin:MySuperSecretPassword in 18s after 250 attempts.");
                clearInterval(interval);  // Stop brute force simulation
                progressBar.style.width = '100%';
                progressText.textContent = 'Brute force complete!';
            }
        }, 100); // Adjust the interval for slower/faster progress
    }




    // Flag submission logic
    const submitFlagButton = document.querySelector('#submitFlag');
    const flagInput = document.querySelector('#flagInput');
    const flagStatus = document.querySelector('#flagStatus');
    const progressBarFlag = document.querySelector('#flagProgress');

    if (submitFlagButton) {
        submitFlagButton.addEventListener('click', () => {
            const flag = flagInput.value.trim();
            if (flag) {
                progressBarFlag.style.width = '100%';
                flagStatus.textContent = `Flag "${flag}" submitted successfully!`;
                flagStatus.style.color = '#2ecc71';
            } else {
                flagStatus.textContent = 'Please enter a valid flag.';
                flagStatus.style.color = '#e74c3c';
            }
        });
    }
});
