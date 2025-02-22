"use client"; // ✅ Ensures this runs in the browser

import { useEffect, useState } from "react";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    setChatHistory([]);
  }, []);

  const medicalResponses = {
    fever:
      "Fever is often due to infection. Stay hydrated and rest. If it lasts over 3 days, see a doctor.",
    headache:
      "Headaches may be due to stress, dehydration, or lack of sleep. Try drinking water and resting.",
    cough:
      "Coughs can be from colds, flu, or allergies. Drink warm fluids and rest.",
    "chest pain":
      "🚨 Chest pain can be serious! If severe or with shortness of breath, seek emergency help.",
    covid:
      "COVID-19 symptoms include fever, cough, and difficulty breathing. Get tested and isolate if needed.",
    diabetes:
      "Diabetes is managed with diet, exercise, and medication. Monitor your blood sugar regularly.",
    hypertension:
      "High blood pressure can lead to heart disease. Reduce salt, exercise, and monitor regularly.",
    stroke:
      "🚨 Stroke symptoms include sudden numbness, confusion, and trouble speaking. Seek emergency help!",
  };

  const sendMessage = () => {
    const userInput = document.getElementById("userInput");
    if (!userInput || userInput.value.trim() === "") return;

    const userMessage = userInput.value.trim();
    let botResponse =
      "I'm here to assist with medical inquiries. How can I help?";

    Object.keys(medicalResponses).forEach((key) => {
      if (userMessage.toLowerCase().includes(key)) {
        botResponse = medicalResponses[key];
      }
    });

    if (
      userMessage.toLowerCase().includes("heart attack") ||
      userMessage.toLowerCase().includes("stroke") ||
      userMessage.toLowerCase().includes("chest pain")
    ) {
      botResponse =
        "🚨 This could be a serious condition! Seek emergency medical help immediately.";
    }

    const updatedHistory = [
      ...chatHistory,
      `User: ${userMessage}`,
      `Bot: ${botResponse}`,
    ];
    setChatHistory(updatedHistory);

    userInput.value = "";
  };

  const startSpeechRecognition = () => {
    const userInput = document.getElementById("userInput");

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(
        "Your browser does not support Speech Recognition. Please use Google Chrome."
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      userInput.value = transcript;
    };

    recognition.start();
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="chat-container">
      <button className="menu-btn" onClick={toggleSidebar}>
        ☰ Open Chat History
      </button>

      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>Chat History</h2>
          <button className="close-sidebar" onClick={toggleSidebar}>
            ❌
          </button>
        </div>
        <ul>
          {chatHistory.length > 0 ? (
            chatHistory.map((msg, index) => <li key={index}>{msg}</li>)
          ) : (
            <li>No chat history yet.</li>
          )}
        </ul>
      </div>

      <div className="chat-content">
        <div className="chat-header">Medical Chatbot</div>
        <div className="chat-box" id="chatBox">
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={
                msg.startsWith("User")
                  ? "message user-message"
                  : "message bot-message"
              }
            >
              {msg}
            </div>
          ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            id="userInput"
            placeholder="Ask a medical question..."
          />
          <button className="mic-btn" onClick={startSpeechRecognition}>
            🎤
          </button>
          <button className="send-btn" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
