// Create Taproot client
const client = new Taproot("ws://127.0.0.1:32189");

// Get page elements
const voiceSelect = document.querySelector("select#voice");
const textInput = document.querySelector("textarea#text");
const submitButton = document.querySelector("#submit");
const audioContainer = document.querySelector("#audio");
const latency = document.querySelector("#latency");

// Only keep one audio object so we don't overload memory
let audioObject = null;
// We use a global flag to help with enabling/disabling the submit button
let generating = false;

// Bind text input event listener to enable/disable submit
// button when text input is empty/non-empty and not generating
textInput.addEventListener("input", (event) => {
    if (generating) { return; }
    if (textInput.value.length > 0) {
        submitButton.disabled = false;
    } else {
        submitButton.disabled = true;
    }
});

// Bind text keydown event listener to submit on Ctrl+Enter
textInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && event.ctrlKey && !generating) {
        submitButton.click();
        event.preventDefault();
        event.stopPropagation();
    }
});

// Bind submit button event listener to generate audio
submitButton.addEventListener("click", async () => {
    // Disable submit button
    generating = true;
    submitButton.disabled = true;

    // Keep track of start time for latency calculation
    const startTime = Date.now();

    // Generate audio
    const audio = await client.invoke({
        task: "speech-synthesis",
        model: "kokoro",
        parameters: {
            text: textInput.value,
            voice: voiceSelect.value,
            enhance: true, // Upsample 24kHz to 48kHz with DeepFilterNet
            output_format: "wav"
        }
    });

    // Calculate real-time factor and update latency display
    const executionMilliseconds = Date.now() - startTime;
    const audioMilliseconds = audio.duration * 1000;
    const realTimeFactor = audioMilliseconds / executionMilliseconds;
    latency.innerText = `Generated ${audio.duration.toFixed(1)}s audio in ${executionMilliseconds}ms (${realTimeFactor.toFixed(1)}x real-time)`;

    // Enable audio controls and play audio
    audio.controls = true;
    audio.play();

    // Add audio to page
    audioContainer.innerHTML = "";
    audioContainer.appendChild(audio);

    // Revoke previous audio object URL to free memory
    if (audioObject !== null) {
        URL.revokeObjectURL(audioObject.src);
    }

    // Keep track of current audio object
    audioObject = audio;

    // Re-enable submit button
    generating = false;
    if (textInput.value.length > 0) {
        submitButton.disabled = false;
    }
});
