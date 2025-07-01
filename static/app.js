document.addEventListener('DOMContentLoaded', function () {
    // --- Stepper Navigation ---
    let currentStep = 1;
    const totalSteps = 5;

    function showStep(step) {
        for (let i = 1; i <= totalSteps; i++) {
            const el = document.getElementById('step' + i);
            if (el) el.style.display = (i === step) ? 'block' : 'none';
        }
    }
    showStep(currentStep);

    // Next/Back
    document.querySelectorAll('.next-step').forEach(btn =>
        btn.addEventListener('click', function(e){
            e.preventDefault();
            if (currentStep < totalSteps) {
                currentStep++;
                showStep(currentStep);
            }
        })
    );
    document.querySelectorAll('.prev-step').forEach(btn =>
        btn.addEventListener('click', function(e){
            e.preventDefault();
            if (currentStep > 1) {
                currentStep--;
                showStep(currentStep);
            }
        })
    );

    // Get Started button (Step 1 > 2)
    const getStartedBtn = document.getElementById('getStartedBtn');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', function(e){
            e.preventDefault();
            currentStep = 2;
            showStep(currentStep);
        });
    }

    // --- Selector Groups ---
    function makeGroupSelectable(className) {
        document.querySelectorAll(`.${className}`).forEach(el => {
            el.addEventListener('click', function () {
                document.querySelectorAll(`.${className}`).forEach(o => o.classList.remove('active'));
                el.classList.add('active');
            });
        });
    }
    // Matches your selectors in index.html
    makeGroupSelectable('mood-card');
    makeGroupSelectable('age-option');
    makeGroupSelectable('pricing-card');
    makeGroupSelectable('length-card');
    makeGroupSelectable('vision-card');
    makeGroupSelectable('style-option');

    // --- Gather Data from UI ---
    function getSelectedOption(className) {
        const el = document.querySelector(`.${className}.active`);
        return el ? (el.dataset.value || el.textContent.trim()) : null;
    }
    function getAllSelections() {
        return {
            mood: getSelectedOption('mood-card'),
            age: getSelectedOption('age-option'),
            style: getSelectedOption('style-option'),
            vision: getSelectedOption('vision-card'),
            videoLength: getSelectedOption('length-card'),
            pricing: getSelectedOption('pricing-card'),
            artist: document.getElementById('artistInput') ? document.getElementById('artistInput').value : null,
            // Add any other text/number fields here
        };
    }

    // --- Complete Order Logic ---
    const completeOrderBtn = document.getElementById('completeOrder');
    if (completeOrderBtn) {
        completeOrderBtn.addEventListener('click', async function (e) {
            e.preventDefault();
            const data = getAllSelections();

            // Show loading state
            completeOrderBtn.disabled = true;
            completeOrderBtn.textContent = "Processing...";
            document.getElementById('step5').innerHTML = `
                <div class="flex flex-col items-center">
                    <svg class="animate-spin h-8 w-8 text-pink-400 mb-3" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <p class="text-lg text-pink-300 font-semibold">Creating your video...<br>This can take up to 2 minutes.</p>
                </div>
            `;

            try {
                const response = await fetch('/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (!response.ok) throw new Error("Server error: " + response.status);
                const result = await response.json();
                document.getElementById('step5').innerHTML = `
                    <div class="flex flex-col items-center">
                        <p class="text-green-400 text-xl font-bold mb-4">✅ Video created!</p>
                        <pre class="bg-gray-900 rounded p-4 text-white">${JSON.stringify(result, null, 2)}</pre>
                        <button class="mt-4 px-6 py-2 rounded-full bg-pink-500 text-white font-bold" id="startNewOrder">Create Another Video</button>
                    </div>
                `;
            } catch (err) {
                document.getElementById('step5').innerHTML = `
                    <div class="flex flex-col items-center">
                        <p class="text-red-400 text-xl font-bold mb-4">❌ Error creating video</p>
                        <pre class="bg-gray-900 rounded p-4 text-white">${err.message}</pre>
                        <button class="mt-4 px-6 py-2 rounded-full bg-pink-500 text-white font-bold" id="startNewOrder">Try Again</button>
                    </div>
                `;
                console.error("Error posting order:", err);
            } finally {
                completeOrderBtn.disabled = false;
                completeOrderBtn.textContent = "Complete Order";
            }
        });
    }

    // "Create Another Video" handler
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'startNewOrder') {
            currentStep = 1;
            showStep(currentStep);
        }
    });

});
