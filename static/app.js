// This alert will appear immediately when the browser loads this file.
// If you see this, it means the new project structure is working perfectly.
alert('SUCCESS: The app.js file is now running!');

document.addEventListener('DOMContentLoaded', () => {
    // This message will appear in the developer console (F12).
    console.log("SUCCESS: The page is fully loaded and the script is setting up events.");

    /**
     * A helper function to handle making one item in a group 'active'.
     * @param {string} groupSelector - A CSS selector for all items in the group.
     */
    function setupSelectionGroup(groupSelector) {
        const elements = document.querySelectorAll(groupSelector);
        if (!elements.length) {
            console.warn(`Warning: No elements found for selector "${groupSelector}"`);
            return;
        }
        
        elements.forEach(element => {
            element.addEventListener('click', (event) => {
                event.preventDefault(); // Stop any default browser action
                elements.forEach(el => el.classList.remove('active'));
                element.classList.add('active');
            });
        });
    }

    // Initialize all the interactive selection groups on the page
    setupSelectionGroup('.age-option');
    setupSelectionGroup('.tab-button[data-length]');
    setupSelectionGroup('.mood-card');
    setupSelectionGroup('.step-card[data-option]');
    setupSelectionGroup('.vision-card');
    setupSelectionGroup('.lyric-idea-tag');
    setupSelectionGroup('[data-plan]');

    // --- Special handling for specific elements ---

    // Show/hide custom lyrics input based on selection
    document.querySelectorAll('.lyric-idea-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const customLyricsInput = document.getElementById('customLyricsInput');
            if (customLyricsInput) {
                const isCustom = tag.dataset.lyric === 'custom';
                customLyricsInput.classList.toggle('hidden', !isCustom);
            }
        });
    });

    // Show/hide branding options based on checkbox
    const addBrandingCheckbox = document.getElementById('addBranding');
    const brandingOptionsDiv = document.getElementById('brandingOptions');
    if (addBrandingCheckbox) {
        addBrandingCheckbox.addEventListener('change', () => {
            if (brandingOptionsDiv) {
                brandingOptionsDiv.classList.toggle('hidden', !addBrandingCheckbox.checked);
            }
        });
    }

    // --- Step Navigation Logic ---
    let currentStep = 1;
    const totalSteps = 5;
    const stepContents = document.querySelectorAll('.step-content');
    const stepNavButtons = document.querySelectorAll('.step-nav-button');
    const progressBar = document.getElementById('progressBar');

    function goToStep(stepNumber) {
        if (stepNumber < 1 || stepNumber > totalSteps) return;
        currentStep = stepNumber;

        stepContents.forEach(content => content.classList.add('hidden'));
        const activeStepContent = document.getElementById(`step${currentStep}`);
        if (activeStepContent) activeStepContent.classList.remove('hidden');

        const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
        if (progressBar) progressBar.style.width = `${progressPercentage}%`;

        stepNavButtons.forEach(button => {
            const buttonStep = parseInt(button.dataset.step);
            button.classList.toggle('active', buttonStep === currentStep);
        });
    }

    // Attach listeners to all navigation buttons (Continue, Back, and top icons)
    document.body.addEventListener('click', e => {
        const button = e.target.closest('button');
        if (!button) return;

        if (button.id.startsWith('nextToStep')) goToStep(currentStep + 1);
        if (button.id.startsWith('backToStep')) goToStep(currentStep - 1);

        const stepNav = e.target.closest('.step-nav-button');
        if (stepNav) goToStep(parseInt(stepNav.dataset.step));
    });

    // Initialize the form to the first step when the page loads
    goToStep(1);
});