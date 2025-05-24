document.addEventListener('DOMContentLoaded', () => {
    const validFlags = {
        "0770f531647587f5d17c20db614ba65e3335efeec7b530372b7ab710cb311bcf": "flag1", // AdministratorAccount
        "6c8f4b84c26c8dbb5f5fe9b679ba66bb9d82bfe5b90f5b8bceec7d27a0bb0e72": "flag2", // gtrhpkndxLzq8amcvWty
        "b2b9e5436ab6988cc83bbab99d0d935307f9c4083d7745a9462aefb2450d8d16": "flag3", // HiddenProduct
        "6d3c8ff0223796d78bb23c287d4669941d9296ea041f2f0b3f21d97f10f093e4": "flag4"  // MySuperSecretPassword
    };

    let submittedFlags = new Set(); // Use a Set to prevent duplicate flag submissions

    const flagInput = document.getElementById('flagInput');
    const submitFlagButton = document.getElementById('submitFlag');
    const flagStatus = document.getElementById('flagStatus');

    // Create progress elements dynamically
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    progressContainer.innerHTML = `
        <progress id="flagProgress" value="0" max="${Object.keys(validFlags).length}"></progress>
        <p id="progressStatus">0/${Object.keys(validFlags).length} Flags Submitted</p>
    `;
    flagStatus.parentNode.appendChild(progressContainer);

    const flagProgress = progressContainer.querySelector('#flagProgress');
    const progressStatus = progressContainer.querySelector('#progressStatus');

    submitFlagButton.addEventListener('click', async () => {
        const flag = flagInput.value.trim();
        if (!flag) {
            flagStatus.textContent = 'Please enter a flag.';
            return;
        }

        const hashedFlag = await hashInput(flag);
        if (validFlags[hashedFlag] && !submittedFlags.has(hashedFlag)) {
            submittedFlags.add(hashedFlag);
            flagStatus.textContent = `Valid Flag: ${validFlags[hashedFlag]}`;
            updateProgress();
        } else if (submittedFlags.has(hashedFlag)) {
            flagStatus.textContent = 'This flag has already been submitted.';
        } else {
            flagStatus.textContent = 'Invalid Flag';
        }

        flagInput.value = '';
    });

    async function hashInput(input) {
        const encoder = new TextEncoder();
        const data = encoder.encode(input.trim());
        const buffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(buffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex.toLowerCase();
    }

    function updateProgress() {
        flagProgress.value = submittedFlags.size;
        progressStatus.textContent = `${submittedFlags.size}/${Object.keys(validFlags).length} Flags Submitted`;

        if (submittedFlags.size === Object.keys(validFlags).length) {
            flagStatus.textContent = '? All flags successfully submitted!';
        }
    }
});
