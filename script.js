const input = document.getElementById("command");
const response = document.getElementById("response");

function speak(message) {
response.textContent = message;

if ("speechSynthesis" in window) {
speechSynthesis.cancel();

const voice = new SpeechSynthesisUtterance(message);  
voice.lang = "en-IN";  
voice.pitch = 0.85;  
voice.rate = 1;  

speechSynthesis.speak(voice);

}
}


async function runCommand(command) {
  const text = command.trim().toLowerCase();
  if (!text) return;

  let answer = "";

  if (text.includes("time")) {
    answer = "The time is " + new Date().toLocaleTimeString();
  }
  else if (text.includes("date")) {
    answer = "Today is " + new Date().toDateString();
  }
  else if (text.includes("yourself") || text.includes("your name")) {
    answer = "I am DARK, your personal AI assistant.";
  }
  else if (text.includes("study")) {
    answer = "Study mode selected.";
  }
  else if (text.includes("fitness")) {
    answer = "Fitness mode selected.";
  }
  else if (text.includes("notes")) {
    answer = "Notes module selected. Coming soon.";
  }
  else if (text.includes("tasks")) {
    answer = "Tasks module selected. Coming soon.";
  }
  else {
    try {
      speak("DARK is thinking...");

      const result = await fetch(
        "https://dark-ai-backend.sdinesha747.workers.dev/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: command
          })
        }
      );

      const data = await result.json();

      if (!result.ok) {
        throw new Error(data.error || "AI connection failed");
      }

      answer = data.reply || "I couldn't generate an answer.";
    } catch (error) {
      answer = "I'm having trouble connecting to my AI brain. Please try again.";
      console.error(error);
    }
  }

  speak(answer);
}


document.getElementById("send").addEventListener("click", () => {
runCommand(input.value);
input.value = "";
});

input.addEventListener("keydown", event => {
if (event.key === "Enter") {
runCommand(input.value);
input.value = "";
}
});

document.querySelectorAll("[data-command]").forEach(button => {
button.addEventListener("click", () => {
runCommand(button.dataset.command);
});
});

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

recognition.onresult = event => {
const spoken = event.results[0][0].transcript;
input.value = spoken;
runCommand(spoken);
};

recognition.onerror = () => {
response.textContent = "Voice recognition error. Try again.";
};

recognition.start();
});
