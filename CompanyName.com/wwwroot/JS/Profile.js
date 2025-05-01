document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username') || 'Guest';
    console.log('Fetched username from localStorage:', username);

    const profileName = document.querySelector('.profile-name');
    const profileEmail = document.querySelector('.profile-email');
    const profileImage = document.querySelector('.profile-image img');
    const profileContainer = document.querySelector('.profile-container');

    const flagSection = document.querySelector('.flag-submission');
    const adminSection = document.querySelector('.admin-download');

    // Reset previous classes
    profileContainer.classList.remove('hacker', 'admin');
    console.log('Profile container classes after removal:', profileContainer.classList);

    // Update profile based on username
    if (username === 'AdministratorAccount') {
        profileContainer.classList.add('admin');
        profileName.textContent = 'Administrator';
        profileEmail.textContent = 'admin@company.lol';
        profileImage.src = '../Assets/Admin.png';
        addSecretFolder();
        adminSection.style.display = 'block';
        console.log('Admin section visible');
    } else if (username === 'Hacker') {
        profileContainer.classList.add('hacker');  // Adding the hacker class
        profileName.textContent = '1337_H4x0r';
        profileEmail.textContent = 'hacker@darknet.lol';
        profileImage.src = '../Assets/Hacker.png';
        addFlagSubmission();  // Add the flag form dynamically
        flagSection.style.display = 'block';  // Show flag section
        console.log('Flag submission section visible');
    } else {
        profileName.textContent = 'Guest User';
        profileEmail.textContent = 'guest@company.lol';
        profileImage.src = '../Assets/Guest.png';
    }

    function addFlagSubmission() {
        console.log('Adding flag submission form');
        const flagForm = document.createElement('div');
        flagForm.classList.add('flag-submission');
        flagForm.innerHTML = `
            <h3>Submit a Flag</h3>
            <input type="text" id="flagInput" placeholder="Enter flag here">
            <button id="submitFlag">Submit</button>
            <p id="flagStatus"></p>
        `;
        console.log('Flag form created:', flagForm);
        flagSection.appendChild(flagForm);

        const submitBtn = flagForm.querySelector('#submitFlag');
        submitBtn.addEventListener('click', async () => {
            const flag = document.getElementById('flagInput').value.trim();
            if (!flag) return;

            const hashedFlag = await hashInput(flag);
            console.log('Hashed flag:', hashedFlag);

            // Call the FlagAuth.js module for flag validation
            const result = validateFlag(hashedFlag);

            // Display the result
            if (result.success) {
                document.getElementById('flagStatus').textContent = `Correct flag: ${result.flagName}!`;
            } else {
                document.getElementById('flagStatus').textContent = "Incorrect flag!";
            }
        });
    }

    async function hashInput(input) {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const buffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(buffer));
        const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    function addSecretFolder() {
        const secretBtn = document.createElement('button');
        secretBtn.textContent = '📁 Download Secret File';
        secretBtn.classList.add('secret-btn');
        secretBtn.onclick = () => {
            const link = document.createElement('a');
            link.href = '../assets/secret.txt'; // Make sure this file exists
            link.download = 'secret.txt';
            link.click();
        };
        adminSection.appendChild(secretBtn);
    }
});
