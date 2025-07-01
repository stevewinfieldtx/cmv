document.addEventListener('DOMContentLoaded', function () {
    // ========== Your existing setup ==========
    let currentStep = 1;
    const totalSteps = 5;
    showStep(currentStep);

    function showStep(step) {
        for (let i = 1; i <= totalSteps; i++) {
            document.getElementById('step' + i).style.display = (i === step) ? 'block' : 'none';
        }
    }

    function nextStep() {
        if (currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
        }
    }

    function prevStep() {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
        }
    }

    // Navigation buttons
    document.querySelectorAll('.next-step').forEach(btn => btn.addEventListener('click', nextStep));
    document.querySelectorAll('.prev-step').forEach(btn => btn.addEventListener('click', prevStep));

    // ========== Selector Gathering ==========
    function getSelectedOption(groupClass) {
        const active = document.querySelector(`.${groupClass}.active`);
        return active ? active.dataset.value || active.textContent.trim() : null;
    }

    function getAllSelections() {
        // Adjust selectors to match your HTML!
        return {
            mood: getSelectedOption('mood-card'),
            age: getSelectedOption('age-option'),
            style: getSelectedOption('style-option'),
            artist: document.getElementById('artistInput') ? document.getElementById('artistInput').value : null,
            vision: document.getElementById('visionInput') ? document.getElementById('visionInput').value : null,
            videoLength: getSelectedOption('length-option'),
            // Add more as your UI grows!
        };
    }

    // ========== COMPLETE ORDER BUTTON HANDLING ==========
    const completeOrderBtn = document.getElementById('completeOrder');
    if (completeOrderBtn) {
        completeOrderBtn.addEventListener('click', async function () {
            // 1. Gather all user choices
            const data = getAllSelections();

            // 2. Show UI feedback
            completeOrderBtn.disabled = true;
            completeOrderBtn.textContent = "Processing...";

            // Optional: Show a spinner or overlay here
            document.getElementById('step5').innerHTML = `
                <div class="flex flex-col items-center">
                    <svg class="animate-spin h-8 w-8 text-pink-400 mb-3" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <p class="text-lg text-pink-300 font-semibold">Creating your video...<br>This can take up to 2 minutes.</p>
                </div>
            `;

            // 3. POST to backend
            try {
                const response = await fetch('/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (!response.ok) throw new Error("Server error: " + response.status);
                const result = await response.json();
                // 4. Show success/result
                document.getElementById('step5').innerHTML = `
                    <div class="flex flex-col items-center">
                        <p class="text-green-400 text-xl font-bold mb-4">✅ Video created!</p>
                        <pre class="bg-gray-900 rounded p-4 text-white">${JSON.stringify(result, null, 2)}</pre>
                        <!-- You could show a video link, embed, etc. here -->
                    </div>
                `;
            } catch (err) {
                document.getElementById('step5').innerHTML = `
                    <div class="flex flex-col items-center">
                        <p class="text-red-400 text-xl font-bold mb-4">❌ Error creating video</p>
                        <pre class="bg-gray-900 rounded p-4 text-white">${err.message}</pre>
                    </div>
                `;
                console.error("Error posting order:", err);
            } finally {
                completeOrderBtn.disabled = false;
                completeOrderBtn.textContent = "Complete Order";
            }
        });
    } else {
        console.error("ERROR: Complete Order button not found in HTML!");
    }

    // ========== Extra: Activate selectors visually (if you use 'active' classes) ==========
    // Example for mood, age, style selectors:
    document.querySelectorAll('.mood-card').forEach(card => {
        card.addEventListener('click', function () {
            document.querySelectorAll('.mood-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
    });
    document.querySelectorAll('.age-option').forEach(opt => {
        opt.addEventListener('click', function () {
            document.querySelectorAll('.age-option').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
        });
    });
    // Repeat for other selector groups as needed

});
