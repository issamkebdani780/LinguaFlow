import { useState } from "react";
import axios from "axios";
import { Send } from "lucide-react";

const Chatbot = ({ userId }) => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! Ask me anything about English learning." }
  ]);
  const [input, setInput] = useState("");

  const WEBHOOK_URL = "https://n8n.linguaflo.me/webhook-test/linguaflow";

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user's message locally
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Send message + user_id to n8n webhook
      const { data } = await axios.post(WEBHOOK_URL, {
        user_id: userId,
        message: input
      });

      // Add bot reply
      const botMessage = { sender: "bot", text: data.response || "No reply from bot." };
      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      console.error(error);
      const botMessage = { sender: "bot", text: "Error contacting chatbot." };
      setMessages((prev) => [...prev, botMessage]);
    }

    setInput("");
  };

  return (
    <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl shadow-xl border border-white/10 mt-10 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Chatbot 🤖</h2>

      <div className="h-80 overflow-y-auto p-4 bg-[#111318] rounded-xl mb-4 flex flex-col gap-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`px-4 py-2 rounded-xl max-w-[80%] ${
              msg.sender === "user"
                ? "self-end bg-blue-600 text-white"
                : "self-start bg-gray-800 text-gray-200"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          className="flex-1 px-4 py-3 rounded-xl bg-[#111318] border border-white/10 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl transition"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
