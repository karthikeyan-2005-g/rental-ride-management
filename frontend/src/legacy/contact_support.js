// Contact form
document
  .getElementById("contactForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    document.getElementById("contactResult").textContent =
      "Thank you! Your message has been received.";

    document.getElementById("contactResult").className =
      "mt-4 text-center text-green-600 font-semibold";

    this.reset();
  });

// AI Chatbot
const chatInput = document.getElementById("chatInput");
const sendChat = document.getElementById("sendChat");
const chatBox = document.getElementById("chatBox");

async function sendMessage() {
  const message = chatInput.value.trim();

  if (!message) {
    return;
  }

  // User message
  const userMessage = document.createElement("div");

  userMessage.className = "bg-green-100 rounded-lg p-3 mb-3 text-right";

  userMessage.textContent = message;

  chatBox.appendChild(userMessage);

  chatInput.value = "";

  chatBox.scrollTop = chatBox.scrollHeight;

  // Loading message
  const loadingMessage = document.createElement("div");

  loadingMessage.className = "bg-gray-200 rounded-lg p-3 mb-3";

  loadingMessage.textContent = "AI is thinking...";

  chatBox.appendChild(loadingMessage);

  try {
    const response = await fetch("http://127.0.0.1:8000/api/chatbot/", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        message: message,
      }),
    });

    const result = await response.json().catch(function () {
      return {};
    });

    loadingMessage.remove();

    const aiMessage = document.createElement("div");

    aiMessage.className = response.ok
      ? "bg-gray-200 rounded-lg p-3 mb-3"
      : "bg-red-100 text-red-800 rounded-lg p-3 mb-3";

    aiMessage.textContent = response.ok
      ? result.reply || "Sorry, I could not answer that."
      : result.error || "AI support is currently unavailable.";

    chatBox.appendChild(aiMessage);
  } catch (error) {
    loadingMessage.textContent =
      "Unable to connect to the Django API. Make sure the backend is running at http://127.0.0.1:8000.";

    console.error(error);
  }

  chatBox.scrollTop = chatBox.scrollHeight;
}

sendChat.addEventListener("click", sendMessage);

chatInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});
