/** @module index */

// Create Taproot client
let overseerAddress;
if (window.location.port === "3000") {
    // Development (e.g. npm start)
    overseerAddress = "ws://localhost:32189";
} else {
    // Docker or production
    overseerAddress = "overseer";
}
const client = new Taproot(overseerAddress);

// Get page elements
const voiceSelect = document.querySelector("select#voice");
const textInput = document.querySelector("textarea#text");
const submitButton = document.querySelector("#submit");
const audioContainer = document.querySelector("#audio");
const latency = document.querySelector("#latency");

// Only keep one audio object so we don't overload memory
let audioObject = null,
    generating = false;

// Bind text input event listener
textInput.addEventListener("input", (event) => {
    if (generating) { return; }
    if (textInput.value.length > 0) {
        submitButton.disabled = false;
    } else {
        submitButton.disabled = true;
    }
});
textInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && event.ctrlKey) {
        submitButton.click();
        event.preventDefault();
        event.stopPropagation();
    }
});
// Bind submit event listener
submitButton.addEventListener("click", async () => {
    generating = true;
    submitButton.disabled = true;
    const startTime = Date.now();
    const audio = await client.invoke({
        task: "speech-synthesis",
        model: "kokoro",
        parameters: {
            text: textInput.value,
            voice: voiceSelect.value,
            enhance: true,
            output_format: "wav"
        }
    });
    const executionMilliseconds = Date.now() - startTime;
    const audioMilliseconds = audio.duration * 1000;
    const realTimeFactor = audioMilliseconds / executionMilliseconds;

    generating = false;
    if (textInput.value.length > 0) {
        submitButton.disabled = false;
    }

    if (audioObject !== null) {
        URL.revokeObjectURL(audioObject.src);
    }

    audioContainer.innerHTML = "";
    audioContainer.appendChild(audio);
    audio.controls = true;
    audio.play();
    latency.innerText = `Generated ${audio.duration.toFixed(1)}s audio in ${executionMilliseconds}ms (${realTimeFactor.toFixed(1)}x real-time)`;
    audioObject = audio;
});
