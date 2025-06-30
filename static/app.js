document.addEventListener('DOMContentLoaded', () => {
    console.log("SUCCESS: The page is fully loaded and the script is now setting up events.");

    function setupSelectionGroup(selector) {
        const elements = document.querySelectorAll(selector);
        if (!elements.length) return;
        
        elements.forEach(element => {
            element.addEventListener('click', (event) => {
                event.preventDefault(); 
                elements.forEach(el => el.classList.remove('active'));
                element.classList.add('active');
            });
        });
    }

    setupSelectionGroup('.age-option');
    setupSelectionGroup('.tab-button[data-length]');
    setupSelectionGroup('.mood-card');
    setupSelectionGroup('.step-card[data-option]');
    setupSelectionGroup('.vision-card');
    setupSelectionGroup('.lyric-idea-tag');
    setupSelectionGroup('[data-plan]');

    document.querySelectorAll('.lyric-idea-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const customLyricsInput = document.getElementById('customLyricsInput');
            if (customLyricsInput) {
                const isCustom = tag.dataset.lyric === 'custom';
                customLyricsInput.classList.toggle('hidden', !isCustom);
            }
        });
    });

    const addBrandingCheckbox = document.getElementById('addBranding');
    const brandingOptionsDiv = document.getElementById('brandingOptions');
    if (addBrandingCheckbox) {
        addBrandingCheckbox.addEventListener('change', () => {
            if (brandingOptionsDiv) {
                brandingOptionsDiv.classList.toggle('hidden', !addBrandingCheckbox.checked);
            }
        });
    }

    let currentStep = 1;
    const totalSteps = 5;
    const stepContents = document.querySelectorAll('.step-content');
    const stepNavButtons = document.querySelectorAll('.step-nav-button');
    const progressBar = document.getElementById('progressBar');

    function goToStep(stepNumber) {
        if (stepNumber < 1 || stepNumber > totalSteps) return;
        currentStep = stepNumber;

        stepContents.forEach(content => content.classList.add('hidden'));
        document.getElementById(`step${currentStep}`).classList.remove('hidden');

        const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
        progressBar.style.width = `${progressPercentage}%`;

        stepNavButtons.forEach(button => {
            const buttonStep = parseInt(button.dataset.step);
            button.classList.toggle('active', buttonStep === currentStep);
        });
    }

    document.body.addEventListener('click', e => {
        const button = e.target.closest('button');
        if (!button) return;

        if (button.id.startsWith('nextToStep')) goToStep(currentStep + 1);
        if (button.id.startsWith('backToStep')) goToStep(currentStep - 1);

        const stepNav = e.target.closest('.step-nav-button');
        if (stepNav) goToStep(parseInt(stepNav.dataset.step));
    });

    goToStep(1);
});