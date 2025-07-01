document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('videoForm');
    const resultDiv = document.getElementById('result');
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Gather form values
        const data = {
            mood: form.mood.value,
            age: form.age.value,
            pricing: form.pricing.value,
            length: form.length.value,
            artist: form.artist.value,
            vision: form.vision.value
        };

        // Show processing state
        resultDiv.innerHTML = `<p style="color:#ffa;">Processing, please wait...</p>`;

        try {
            const response = await fetch('/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            resultDiv.innerHTML = `
                <div style="color:#5ff;background:#232;padding:18px;border-radius:8px;">
                    <h2>✅ Video created!</h2>
                    <pre style="white-space:pre-wrap;">${JSON.stringify(result, null, 2)}</pre>
                    <button id="makeAnother">Create Another Video</button>
                </div>
            `;
        } catch (err) {
            resultDiv.innerHTML = `
                <div style="color:#faa;background:#311;padding:18px;border-radius:8px;">
                    <h2>❌ Error creating video</h2>
                    <pre>${err.message}</pre>
                    <button id="makeAnother">Try Again</button>
                </div>
            `;
        }
        // Add handler to reset form if user wants another
        setTimeout(() => {
            const makeAnother = document.getElementById('makeAnother');
            if (makeAnother) {
                makeAnother.addEventListener('click', () => {
                    form.reset();
                    resultDiv.innerHTML = "";
                });
            }
        }, 200);
    });
});




