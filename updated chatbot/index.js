document.addEventListener("DOMContentLoaded", () => {
    const messagesContainer = document.getElementById('messages');
    const sendButton = document.getElementById('send-button');
    let csvData = [];
  
    // Load CSV data
    fetch('data.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            console.log("CSV Data Loaded: ", data); // Debug log
            const rows = data.trim().split('\n').slice(1); // Skip header row
            for (const row of rows) {
                const columns = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g).map(column => column.replace(/^"|"$/g, '').trim());
                if (columns.length === 2) {
                    csvData.push({ question: columns[0], answer: columns[1].replace(/\\n/g,'\n')});
                }
            }
        })
        .catch(error => console.error('Fetch operation problem:', error));
  
    function sendMessage() {
        console.log("Send Message Function Called"); // Debug log
        const inputField = document.getElementById('input');
        const input = inputField.value.trim();
        inputField.value = '';
  
        if (input === '') return;
  
        // Create user message div
        let userDiv = document.createElement("div");
        userDiv.id = "user";
        userDiv.className = "user response";
        userDiv.innerHTML = `<img src="user.png" class="avatar"><span>${input}</span>`;
        messagesContainer.appendChild(userDiv);
  
        // Create bot typing message div
        let botDiv = document.createElement("div");
        let botText = document.createElement("span");
        let botIcon = document.createElement("img");
        botIcon.src = "chatbot.png"; // Bot icon image source
        botIcon.className = "bot-icon"; // CSS class for bot icon styling
        botDiv.id = "bot";
        botDiv.className = "bot response";
        botText.innerText = "Typing...";
        botDiv.appendChild(botIcon);
        botDiv.appendChild(botText);
        messagesContainer.appendChild(botDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
        // Simulate bot response after a delay
        setTimeout(() => {
            let response = getResponse(input);
            botText.innerText = response;
            textToSpeech(response);
        }, 2000);
    }
  
    function getResponse(input) {
        for (let row of csvData) {
            if (input.toLowerCase() === row.question.toLowerCase()) {
                return row.answer;
            }
        }
        return "Sorry, I did not understand that. Can you please type the question correctly?";
    }
  
    function textToSpeech(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = speechSynthesis.getVoices().find(voice => voice.name === 'Google UK English Male') || speechSynthesis.getVoices()[0];
        speechSynthesis.speak(utterance);
    }
  
    // Handle Enter key press
    document.getElementById('input').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    });
  
    // Handle Send button click
    sendButton.addEventListener('click', sendMessage);
});
