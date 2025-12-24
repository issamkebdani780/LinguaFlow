import { useState } from "react";
import { Send } from "lucide-react";
const ChatBot = () => {
  // Chatbot
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: "bot",
      message:
        "Hi! I'm your LinguaFlow AI assistant. Send me any English word and I'll help you learn it!",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Send Message to Webhook
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput;

    // Show user message instantly
    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "user",
        message: userMessage,
      },
    ]);

    setChatInput("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://n8n.linguaflo.me/webhook/linguaflow",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: session.user.id,
            message: userMessage,
            timestamp: new Date().toISOString(),
          }),
        }
      );
      console.log("Webhook response :", response);

      const data = await response.json();
      console.log("Webhook data :", data.output);

      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: "bot",
          message: data.output || "Message received successfully.",
        },
      ]);
    } catch (error) {
      console.error("Webhook error:", error);

      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: "bot",
          message: "Error communicating with AI service. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-200px)] flex flex-col gap-4">
      {/* Chat Messages Container  */}
      <div className="flex-1 bg-gradient-to-b from-[#1A1D24]/60 to-[#111318]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 overflow-y-auto">
        <div className="space-y-4">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                  msg.type === "user"
                    ? "bg-sky-600 text-white rounded-tr-sm"
                    : "bg-[#1A1D24] text-gray-200 border border-white/10 rounded-tl-sm"
                }`}
              >
                <p className="text-sm">{msg.message}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#1A1D24] text-gray-200 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Input Container */}
      <div className="bg-gradient-to-b from-[#1A1D24]/60 to-[#111318]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Type a word or message..."
            className="flex-1 bg-[#0B0C10]/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;
