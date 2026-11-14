const input = document.getElementById('command');
const response = document.getElementById('response');

function speak(message) {
  response.textContent = message;

  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();

    const voice = new SpeechSynthesisUtterance(message);
    voice.lang = 'en-IN';
    voice.pitch = 1.05;
    voice.rate = 0.88;

    speechSynthesis.speak(voice);
  }
}

function runCommand(command) {
  const text = command.toLowerCase().trim();
  if (!text) return;

  let answer = '';

  if (text.includes('hello') || text.includes('hi')) {
    answer = 'Hello. DARK is online. Ready to assist you.';
  } else if (text.includes('time')) {
    answer = 'The time is ' + new Date().toLocaleTimeString();
  } else if (text.includes('date')) {
    answer = 'Today is ' + new Date().toDateString();
  } else if (text.includes('yourself') || text.includes('your name')) {
    answer = 'I am DARK, your personal AI assistant.';
  } else if (text.includes('study')) {
    answer = 'Study mode selected.';
  } else if (text.includes('fitness')) {
    answer = 'Fitness mode selected.';
  } else if (text.includes('notes')) {
    answer = 'Notes module selected. Coming soon.';
  } else if (text.includes('tasks')) {
    answer = 'Tasks module selected. Coming soon.';
  } else {
    answer = 'Command received. My advanced AI brain is coming soon.';
  }

  speak(answer);
}

document.getElementById('send').addEventListener('click', () => {
  runCommand(input.value);
  input.value = '';
});

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    runCommand(input.value);
    input.value = '';
  }
});

document.querySelectorAll('[data-command]').forEach((button) => {
  button.addEventListener('click', () => {
    runCommand(button.dataset.command);
  });
});

document.getElementById('mic').addEventListener('click', () => {
  const Recognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!Recognition) {
    speak('Voice recognition is not supported in this browser.');
    return;
  }

  const recognition = new Recognition();
  recognition.lang = 'en-IN';

  recognition.onresult = (event) => {
    const spoken = event.results[0][0].transcript;
    input.value = spoken;
    runCommand(spoken);
  };

  recognition.onerror = () => {
    response.textContent = 'Voice recognition error. Try again.';
  };

  recognition.start();
});
