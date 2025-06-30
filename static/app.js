document.addEventListener('DOMContentLoaded', () => {
    let currentStep = 1;
    const totalSteps = 5;

    function setupSelectionGroup(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.addEventListener('click', () => {
                elements.forEach(el => el.classList.remove('active'));
                element.classList.add('active');
            });
        });
    }

    function goToStep(stepNumber) {
        if (stepNumber < 1 || stepNumber > totalSteps) return;
        currentStep = stepNumber;
        document.querySelectorAll('.step-content').forEach(c => c.classList.add('hidden'));
        document.getElementById(`step${currentStep}`).classList.remove('hidden');
        document.getElementById('progressBar').style.width = `${((currentStep - 1) / (totalSteps - 1)) * 100}%`;
        document.querySelectorAll('.step-nav-button').forEach(b => b.classList.toggle('active', parseInt(b.dataset.step) === currentStep));
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
            const isCustom = tag.textContent.toLowerCase() === 'custom';
            document.getElementById('customLyricsInput').classList.toggle('hidden', !isCustom);
        });
    });

    document.getElementById('addBranding').addEventListener('change', (e) => {
        document.getElementById('brandingOptions').classList.toggle('hidden', !e.target.checked);
    });

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