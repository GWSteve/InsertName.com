document.addEventListener("DOMContentLoaded", function () {
    // Fetch username from localStorage
    const username = localStorage.getItem('username');
    console.log("Fetched username from localStorage:", username);

    // Update profile name and email dynamically
    document.querySelector('.profile-name').textContent = username;
    document.querySelector('.profile-email').textContent = `${username}@example.com`;  // Example email, you can adjust this logic
    document.querySelector('.profile-image img').src = `../images/${username.toLowerCase()}.png`; // Dynamic profile image

    // Terminal appearance
    const terminal = document.querySelector('#terminal');
    terminal.textContent = `Welcome, ${username}. Type a command to begin.\n> `;

    // Handle command input and submit button
    const commandInput = document.querySelector('#commandInput');
    const commandSubmit = document.querySelector('#commandSubmit');

    commandSubmit.addEventListener('click', () => {
        const command = commandInput.value.trim();
        if (command) {
            terminal.textContent += `\n> ${command}\n`;
            commandInput.value = '';  // Clear input after command is submitted
            terminal.scrollTop = terminal.scrollHeight;  // Scroll to the bottom
        }
    });

    // Handle flag submission (only for hackers)
    const flagSubmission = document.querySelector('.flag-submission');
    const submitFlagButton = document.querySelector('#submitFlag');
    const flagResult = document.querySelector('#flagResult');
    const progressBar = document.querySelector('#progressBar');

    submitFlagButton.addEventListener('click', () => {
        const flag = document.querySelector('#flagInput').value;
        if (flag) {
            // Simulate flag submission with a progress bar
            progressBar.style.width = '100%';
            flagResult.textContent = `Flag ${flag} submitted successfully!`;
            flagResult.style.color = '#2ecc71';  // Green text for success
        } else {
            flagResult.textContent = 'Please enter a valid flag.';
            flagResult.style.color = '#e74c3c';  // Red text for error
        }
    });

    // Handle admin download button (only for admins)
    const adminDownload = document.querySelector('.admin-download');
    if (username.toLowerCase() === 'admin') {
        adminDownload.style.display = 'block';  // Show download button for admins
        document.querySelector('#downloadSecretFile').addEventListener('click', () => {
            alert('Secret file downloaded!');
        });
    }

    // Logout functionality
    const logoutBtn = document.querySelector('#logoutBtn');
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('username');
        window.location.href = 'login.html';  // Redirect to login page
    });
});
