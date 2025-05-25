document.addEventListener('DOMContentLoaded', () => {
    const validFlags = {
        "0770f531647587f5d17c20db614ba65e3335efeec7b530372b7ab710cb311bcf": "flag1", // AdministratorAccount
        "64c73861b40aea219763ef930607a3295c16fd3a99b4f1f0ec537c09ec732afb": "flag2",  // MySuperSecretPassword
        "00712df400d55646d05fa28b4f5192573f2910c365137e5b9eaa56c3a5ee40fa": "flag3", // SuperSensitiveDoc
        "37f87ebe72b14f20af27433e50712f7e1823dcb3b03a17e45506df23b2ec1199": "flag4", // IDidAXSS
        "49744a97b924ce45a1aeb3e75e616aec9309088657cee95d7f1bee2372a5c7c1":"flag5" // HiddenProduct
    };

    const submittedFlags = new Set();
    const flagInput = document.getElementById('flagInput');
    const submitFlagButton = document.getElementById('submitFlag');
    const flagStatus = document.getElementById('flagStatus');

    // Progress bar container
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
            flagStatus.textContent = `? Valid Flag: ${validFlags[hashedFlag]}`;
            updateProgress();
        } else if (submittedFlags.has(hashedFlag)) {
            flagStatus.textContent = '?? This flag has already been submitted.';
        } else {
            flagStatus.textContent = '? Invalid Flag';
        }

        flagInput.value = '';
    });

    async function hashInput(input) {
        const encoder = new TextEncoder();
        const data = encoder.encode(input.trim());
        const buffer = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    function updateProgress() {
        flagProgress.value = submittedFlags.size;
        progressStatus.textContent = `${submittedFlags.size}/${Object.keys(validFlags).length} Flags Submitted`;

        if (submittedFlags.size === Object.keys(validFlags).length) {
            flagStatus.textContent = '?? All flags successfully submitted!';
        }
    }
});
