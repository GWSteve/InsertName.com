document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username') || 'Guest';

    const profileName = document.querySelector('.profile-name');
    const profileEmail = document.querySelector('.profile-email');
    const profileImage = document.querySelector('.profile-image img');
    const profileDetails = document.querySelector('.profile-details');
    const profileContainer = document.querySelector('.profile-container');

    const flagSection = document.querySelector('.flag-submission');
    const adminSection = document.querySelector('.admin-download');

    // Remove any previous user classes
    profileContainer.classList.remove('hacker', 'admin');

    // Update profile based on username
    if (username === 'AdministratorAccount') {
        profileContainer.classList.add('admin'); // Add admin class to show admin sections
        profileName.textContent = 'Administrator';
        profileEmail.textContent = 'admin@company.lol';
        profileImage.src = '../Assets/Admin.png'; // Make sure image exists
        addSecretFolder();
        // Show admin section
        adminSection.style.display = 'block';
    } else if (username === 'Hacker') {
        profileContainer.classList.add('hacker'); // Add hacker class to show hacker sections
        profileName.textContent = '1337_H4x0r';
        profileEmail.textContent = 'hacker@darknet.lol';
        profileImage.src = '../Assets/Hacker.png'; // Make sure image exists
        addFlagSubmission();
        // Show hacker section
        flagSection.style.display = 'block';
    } else {
        profileName.textContent = 'Guest User';
        profileEmail.textContent = 'gtrhpkndxLzq8amcvd@company.lol';
        profileImage.src = '../Assets/Guest.png'; // Make sure image exists
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
        profileContainer.appendChild(secretBtn);
    }

    function addFlagSubmission() {
        const flagForm = document.createElement('div');
        flagForm.classList.add('flag-submission');
        flagForm.innerHTML = `
            <h3>Submit a Flag</h3>
            <input type="text" id="flagInput" placeholder="Enter flag here">
            <button id="submitFlag">Submit</button>
            <p id="flagStatus"></p>
        `;
        profileContainer.appendChild(flagForm);

        const submitBtn = flagForm.querySelector('#submitFlag');
        submitBtn.addEventListener('click', async () => {
            const flag = document.getElementById('flagInput').value.trim();
            if (!flag) return

            const hashed = await hashInput(flag);
            document.getElementById('flagStatus').textContent = `Hashed Flag: ${hashed}`;
        });
    }

    async function hashInput(input) {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const buffer = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
});
