
const input = document.getElementById("command");
const response = document.getElementById("response");

const BACKEND_URL = "https://dark-ai-backend.sdinesha747.workers.dev/";

// ===============================
// DARK VOICE PERSONALITY
// ===============================

let availableVoices = [];

function loadVoices() {
  if ("speechSynthesis" in window) {
    availableVoices = speechSynthesis.getVoices();
  }
}

if ("speechSynthesis" in window) {
  loadVoices();
  speechSynthesis.onvoiceschanged = loadVoices;
}

function speak(message) {
  response.textContent = message;

  if (!("speechSynthesis" in window)) return;

  speechSynthesis.cancel();

  const voice = new SpeechSynthesisUtterance(message);

  voice.lang = "en-IN";
  voice.pitch = 1.0;
  voice.rate = 0.92;
  voice.volume = 1;

  const indianFemale = availableVoices.find(v =>
    /en-IN/i.test(v.lang) &&
    /female|heera|priya/i.test(v.name)
  );

  const englishFemale = availableVoices.find(v =>
    /en-IN|en-GB|en-US/i.test(v.lang) &&
    /female|woman/i.test(v.name)
  );

  if (indianFemale || englishFemale) {
    voice.voice = indianFemale || englishFemale;
  }

  speechSynthesis.speak(voice);
}

// ===============================
// DARK AI COMMAND SYSTEM
// ===============================

async function runCommand(command) {
  const text = command.trim().toLowerCase();

  if (!text) return;

  // Quick commands

  if (text.includes("time")) {
    speak("The time is " + new Date().toLocaleTimeString());
    return;
  }

  if (text.includes("date")) {
    speak("Today is " + new Date().toDateString());
    return;
  }

  if (
    text.includes("yourself") ||
    text.includes("your name")
  ) {
    speak("I am DARK, your personal AI assistant.");
    return;
  }

  if (text.includes("study")) {
    speak("Study mode selected.");
    return;
  }

  if (text.includes("fitness")) {
    speak("Fitness mode selected.");
    return;
  }

  if (text.includes("notes")) {
    speak("Notes module selected. Coming soon.");
    return;
  }

  if (text.includes("tasks")) {
    speak("Tasks module selected. Coming soon.");
    return;
  }

  // Gemini AI connection

  response.textContent = "DARK is thinking...";

  try {
    const result = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: command
      })
    });

    const data = await result.json();

    if (!result.ok) {
      throw new Error(data.error || "AI connection failed");
    }

    speak(data.reply || "I couldn't generate a response.");

  } catch (error) {
    console.error("DARK Error:", error);

    speak("I'm having trouble connecting. Please try again.");
  }
}

// ===============================
// SEND BUTTON
// ===============================

document.getElementById("send").addEventListener("click", () => {
  const command = input.value;
  input.value = "";
  runCommand(command);
});

// ENTER KEY
input.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    const command = input.value;
    input.value = "";
    runCommand(command);
  }
});

// QUICK ACTION BUTTONS
document.querySelectorAll("[data-command]").forEach(button => {
  button.addEventListener("click", () => {
    runCommand(button.dataset.command);
  });
});

// ===============================
// MICROPHONE
// ===============================

document.getElementById("mic").addEventListener("click", () => {
  const Recognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!Recognition) {
    speak("Voice recognition is not supported in this browser.");
    return;
  }

  const recognition = new Recognition();

  recognition.lang = "en-IN";
  recognition.interimResults = false;

  recognition.onstart = () => {
    response.textContent = "DARK is listening...";
  };

  recognition.onresult = event => {
    const spoken = event.results[0][0].transcript;

    input.value = spoken;
    runCommand(spoken);
  };

  recognition.onerror = () => {
    response.textContent = "Voice recognition error. Please try again.";
  };

  recognition.start();
});
