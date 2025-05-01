document.addEventListener('DOMContentLoaded', () => {
    const validFlags = {
        "ef92b779d2f1e3df47e3b93a312650f68e0d32d92ebbbf80f882ee3a1c7b8199": "flag1", // Plaintext: AdministratorAccount
        "6c8f4b84c26c8dbb5f5fe9b679ba66bb9d82bfe5b90f5b8bceec7d27a0bb0e72": "flag2", // Plaintext: gtrhpkndxLzq8amcvWty
        "b2b9e5436ab6988cc83bbab99d0d935307f9c4083d7745a9462aefb2450d8d16": "flag3", // Plaintext: HiddenProduct
        "6d3c8ff0223796d78bb23c287d4669941d9296ea041f2f0b3f21d97f10f093e4": "flag4"  // Plaintext: MySuperSecretPassword
    };

    let submittedFlags = 0;

    // Elements
    const flagInput = document.getElementById('flagInput');
    const submitFlagButton = document.getElementById('submitFlag');
    const flagStatus = document.getElementById('flagStatus');
    const flagProgress = document.getElementById('flagProgress');
    const progressStatus = document.getElementById('progressStatus');

    submitFlagButton.addEventListener('click', async () => {
        const flag = flagInput.value.trim();
        if (!flag) {
            flagStatus.textContent = 'Please enter a flag.';
            return;
        }

        // Hash the flag input and check if it's valid
        const hashedFlag = await hashInput(flag);
        if (validFlags[hashedFlag]) {
            submittedFlags += 1;
            flagStatus.textContent = `Valid Flag: ${validFlags[hashedFlag]}`;
            updateProgress();
        } else {
            flagStatus.textContent = 'Invalid Flag';
        }

        // Clear the input field
        flagInput.value = '';
    });

    // Hashing the flag input
    async function hashInput(input) {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const buffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(buffer));
        const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    // Update progress bar and text
    function updateProgress() {
        flagProgress.value = submittedFlags;
        progressStatus.textContent = `${submittedFlags}/4 Flags Submitted`;

        if (submittedFlags === 4) {
            flagStatus.textContent = 'All flags successfully submitted!';
        }
    }
});
