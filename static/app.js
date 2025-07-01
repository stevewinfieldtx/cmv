document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM Content Loaded - Initializing selectors...');
    
    let currentStep = 1;
    const totalSteps = 5;

    function setupSelectionGroup(selector, debugName) {
        console.log(`🔧 Setting up selection group: ${debugName} (${selector})`);
        
        // Use multiple attempts to find elements
        let elements = document.querySelectorAll(selector);
        let attempts = 0;
        const maxAttempts = 5;
        
        const setupAttempt = () => {
            elements = document.querySelectorAll(selector);
            attempts++;
            
            console.log(`📊 Attempt ${attempts}: Found ${elements.length} elements for ${debugName}`);
            
            if (elements.length === 0 && attempts < maxAttempts) {
                console.log(`⏳ No elements found for ${debugName}, retrying in 200ms...`);
                setTimeout(setupAttempt, 200);
                return;
            }
            
            if (elements.length === 0) {
                console.error(`❌ No elements found for ${debugName} after ${maxAttempts} attempts`);
                return;
            }
            
            // Add event listeners to each element
            elements.forEach((element, index) => {
                console.log(`🎯 Adding click listener to ${debugName} element ${index + 1}:`, element);
                
                // Remove any existing listeners by cloning the element
                const newElement = element.cloneNode(true);
                element.parentNode.replaceChild(newElement, element);
                
                // Add the click event listener
                newElement.addEventListener('click', (e) => {
                    console.log(`🖱️ ${debugName} clicked:`, newElement);
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Remove active class from all elements in this group
                    const currentElements = document.querySelectorAll(selector);
                    currentElements.forEach(el => {
                        el.classList.remove('active');
                        console.log(`🔄 Removed active from ${debugName}:`, el);
                    });
                    
                    // Add active class to clicked element
                    newElement.classList.add('active');
                    console.log(`✅ Added active to ${debugName}:`, newElement);
                    
                    // Force a style recalculation
                    newElement.offsetHeight;
                });
                
                // Also add hover effects for better UX
                newElement.addEventListener('mouseenter', () => {
                    console.log(`🖱️ Mouse entered ${debugName}:`, newElement);
                });
            });
            
            console.log(`✅ Successfully setup ${elements.length} ${debugName} selectors`);
        };
        
        setupAttempt();
    }

    function goToStep(stepNumber) {
        console.log(`📍 Going to step: ${stepNumber}`);
        if (stepNumber < 1 || stepNumber > totalSteps) {
            console.warn(`⚠️ Invalid step number: ${stepNumber}`);
            return;
        }
        
        currentStep = stepNumber;
        
        // Hide all step content
        document.querySelectorAll('.step-content').forEach(c => {
            c.classList.add('hidden');
        });
        
        // Show current step
        const currentStepElement = document.getElementById(`step${currentStep}`);
        if (currentStepElement) {
            currentStepElement.classList.remove('hidden');
            console.log(`👁️ Showing step ${currentStep}`);
        } else {
            console.error(`❌ Step element not found: step${currentStep}`);
        }
        
        // Update progress bar
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.width = `${((currentStep - 1) / (totalSteps - 1)) * 100}%`;
        }
        
        // Update step navigation buttons
        document.querySelectorAll('.step-nav-button').forEach(b => {
            const stepNum = parseInt(b.dataset.step);
            b.classList.toggle('active', stepNum === currentStep);
        });
    }

    // Wait for everything to be rendered, then setup selectors
    setTimeout(() => {
        console.log('🎬 Starting selector setup after DOM rendering...');
        
        // Setup all selection groups with descriptive names
        setupSelectionGroup('.age-option', 'Age Options');
        setupSelectionGroup('.tab-button[data-length]', 'Video Length Buttons');
        setupSelectionGroup('.mood-card', 'Mood Cards');
        setupSelectionGroup('.step-card[data-option]', 'Step Cards');
        setupSelectionGroup('.vision-card', 'Vision Cards');
        setupSelectionGroup('.lyric-idea-tag', 'Lyric Idea Tags');
        setupSelectionGroup('[data-plan]', 'Plan Options');

        // Handle custom lyrics input
        setTimeout(() => {
            const lyricTags = document.querySelectorAll('.lyric-idea-tag');
            console.log(`📝 Setting up ${lyricTags.length} lyric tags for custom input`);
            
            lyricTags.forEach(tag => {
                tag.addEventListener('click', () => {
                    const isCustom = tag.textContent.toLowerCase().trim() === 'custom';
                    const customInput = document.getElementById('customLyricsInput');
                    if (customInput) {
                        customInput.classList.toggle('hidden', !isCustom);
                        console.log(`📝 Custom lyrics input ${isCustom ? 'shown' : 'hidden'}`);
                    }
                });
            });
        }, 300);

        // Handle branding checkbox
        setTimeout(() => {
            const brandingCheckbox = document.getElementById('addBranding');
            if (brandingCheckbox) {
                brandingCheckbox.addEventListener('change', (e) => {
                    const brandingOptions = document.getElementById('brandingOptions');
                    if (brandingOptions) {
                        brandingOptions.classList.toggle('hidden', !e.target.checked);
                        console.log(`🏷️ Branding options ${e.target.checked ? 'shown' : 'hidden'}`);
                    }
                });
                console.log('🏷️ Branding checkbox setup complete');
            }
        }, 400);

    }, 500); // Increased delay to ensure all DOM elements are ready

    // Handle navigation buttons with delegation (setup immediately)
    document.body.addEventListener('click', e => {
        const button = e.target.closest('button');
        if (!button) return;
        
        console.log('🔘 Button clicked:', button.id);
        
        if (button.id.startsWith('nextToStep')) {
            e.preventDefault();
            goToStep(currentStep + 1);
        }
        
        if (button.id.startsWith('backToStep')) {
            e.preventDefault();
            goToStep(currentStep - 1);
        }
        
        const stepNav = e.target.closest('.step-nav-button');
        if (stepNav) {
            e.preventDefault();
            const stepNum = parseInt(stepNav.dataset.step);
            if (!isNaN(stepNum)) {
                goToStep(stepNum);
            }
        }
    });

    // Initialize the first step
    goToStep(1);
    
    console.log('🎉 Initial setup complete!');
});

// Add a backup method using MutationObserver to catch dynamically added elements
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            console.log('🔄 DOM mutation detected, checking for new selector elements...');
            
            // Re-setup selectors for any new elements
            const newAgeOptions = document.querySelectorAll('.age-option:not([data-listener])');
            const newMoodCards = document.querySelectorAll('.mood-card:not([data-listener])');
            
            if (newAgeOptions.length > 0 || newMoodCards.length > 0) {
                console.log(`🔄 Found ${newAgeOptions.length} new age options and ${newMoodCards.length} new mood cards`);
                setTimeout(() => {
                    if (newAgeOptions.length > 0) setupSelectionGroup('.age-option', 'Age Options (Mutation)');
                    if (newMoodCards.length > 0) setupSelectionGroup('.mood-card', 'Mood Cards (Mutation)');
                }, 100);
            }
        }
    });
});

// Start observing
observer.observe(document.body, {
    childList: true,
    subtree: true
});
