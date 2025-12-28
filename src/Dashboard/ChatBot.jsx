import { useState, useEffect, useRef } from "react";
import { Send, BookOpen } from "lucide-react";
import { UserAuth } from "../Authcontex";
import { supabase } from "../SupabaseClient";

const ChatBot = () => {
  const { session } = UserAuth();
  const chatEndRef = useRef(null);

  // Chatbot States
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  // Load chat history from Supabase on mount
  useEffect(() => {
    if (!session?.user?.id || historyLoaded) return;

    const loadChatHistory = async () => {
      try {
        const { data, error } = await supabase
          .from("linguaflow_chat_histories")
          .select("*")
          .eq("session_id", session.user.id)
          .order("id", { ascending: true });

        if (error) {
          console.error("Error loading chat history:", error);
          setChatMessages([
            {
              id: Date.now(),
              type: "bot",
              message:
                "Hi! I'm your LinguaFlow AI assistant. Send me any English word and I'll help you learn it!",
              timestamp: new Date().toISOString(),
            },
          ]);
          setHistoryLoaded(true);
          return;
        }

        if (data && data.length > 0) {
          const loadedMessages = data.map((row) => {
            const msg =
              typeof row.message === "string"
                ? JSON.parse(row.message)
                : row.message;

            return {
              id: row.id,
              type: msg.type || "bot",
              message: extractStudentMessage(msg.message || msg.content || ""),
              timestamp: msg.timestamp || row.created_at,
            };
          });

          setChatMessages(loadedMessages);
        } else {
          const welcomeMessage = {
            id: Date.now(),
            type: "bot",
            message:
              "Hi! I'm your LinguaFlow AI assistant. Send me any English word and I'll help you learn it!",
            timestamp: new Date().toISOString(),
          };
          setChatMessages([welcomeMessage]);

          await saveMessageToSupabase(
            welcomeMessage.message,
            welcomeMessage.type,
            welcomeMessage.timestamp
          );
        }

        setHistoryLoaded(true);
      } catch (err) {
        console.error("Unexpected error loading chat:", err);
        setChatMessages([
          {
            id: Date.now(),
            type: "bot",
            message:
              "Hi! I'm your LinguaFlow AI assistant. Send me any English word and I'll help you learn it!",
            timestamp: new Date().toISOString(),
          },
        ]);
        setHistoryLoaded(true);
      }
    };

    loadChatHistory();
  }, [session?.user?.id, historyLoaded]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const saveMessageToSupabase = async (message, type, timestamp) => {
    try {
      const { data, error } = await supabase
        .from("linguaflow_chat_histories")
        .insert([
          {
            session_id: session.user.id,
            message: {
              type: type,
              message: message,
              timestamp: timestamp,
            },
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error saving message to Supabase:", error);
        return null;
      }

      return data;
    } catch (err) {
      console.error("Unexpected error saving message:", err);
      return null;
    }
  };

  // Format bot messages for better readability
  const formatBotMessage = (message) => {
    // Split message into sections
    const lines = message.split("\n").filter((line) => line.trim());

    return (
      <div className="space-y-3">
        {lines.map((line, index) => {
          // Headers (lines with emojis at start or ALL CAPS)
          if (line.match(/^[🎯📘✨🧠💪🎉👋🌟📚⚡🔥]/)) {
            return (
              <p key={index} className="font-bold text-sky-300 text-base">
                {line}
              </p>
            );
          }

          // Word entries (lines starting with numbers or bullets)
          if (line.match(/^\d+\.|^-|^\*\*/)) {
            return (
              <div
                key={index}
                className="bg-white/5 rounded-lg p-3 border-l-2 border-sky-500"
              >
                <p className="text-sm leading-relaxed">{line}</p>
              </div>
            );
          }

          // Examples (lines with quotes or "Example:")
          if (line.includes("Example:") || line.includes('"')) {
            return (
              <p
                key={index}
                className="text-sm text-gray-300 italic pl-4 border-l-2 border-gray-600"
              >
                {line}
              </p>
            );
          }

          // Separators
          if (line === "---") {
            return <hr key={index} className="border-white/10 my-2" />;
          }

          // Regular text
          return (
            <p key={index} className="text-sm leading-relaxed">
              {line}
            </p>
          );
        })}
      </div>
    );
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    const userTimestamp = new Date().toISOString();

    const tempUserMessage = {
      id: `temp-${Date.now()}`,
      type: "human",
      message: userMessage,
      timestamp: userTimestamp,
    };

    setChatMessages((prev) => [...prev, tempUserMessage]);
    setChatInput("");
    setIsLoading(true);

    try {
      const savedUserMessage = await saveMessageToSupabase(
        userMessage,
        "human",
        userTimestamp
      );

      if (savedUserMessage) {
        setChatMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempUserMessage.id
              ? { ...msg, id: savedUserMessage.id }
              : msg
          )
        );
      }

      const response = await fetch(
        "https://n8n.linguaflo.me/webhook-test/linguaflow",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: session.user.id,
            message: userMessage,
            timestamp: userTimestamp,
          }),
        }
      );

      const data = await response.json();
      const botMessage = data.output || "Message received successfully.";
      const botTimestamp = new Date().toISOString();

      const tempBotMessage = {
        id: `temp-${Date.now() + 1}`,
        type: "bot",
        message: botMessage,
        timestamp: botTimestamp,
      };

      setChatMessages((prev) => [...prev, tempBotMessage]);

      const savedBotMessage = await saveMessageToSupabase(
        botMessage,
        "bot",
        botTimestamp
      );

      if (savedBotMessage) {
        setChatMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempBotMessage.id
              ? { ...msg, id: savedBotMessage.id }
              : msg
          )
        );
      }
    } catch (error) {
      console.error("Webhook error:", error);

      const errorMessage =
        "Error communicating with AI service. Please try again.";
      const errorTimestamp = new Date().toISOString();

      const tempErrorMessage = {
        id: `temp-${Date.now() + 1}`,
        type: "bot",
        message: errorMessage,
        timestamp: errorTimestamp,
      };

      setChatMessages((prev) => [...prev, tempErrorMessage]);

      const savedErrorMessage = await saveMessageToSupabase(
        errorMessage,
        "bot",
        errorTimestamp
      );

      if (savedErrorMessage) {
        setChatMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempErrorMessage.id
              ? { ...msg, id: savedErrorMessage.id }
              : msg
          )
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const extractStudentMessage = (text) => {
    if (!text) return "";

    let result = text;

    if (result.includes("Student message:")) {
      result = result.split("Student message:")[1];
    }

    if (result.includes("Student learned words from database:")) {
      result = result.split("Student learned words from database:")[0];
    }

    return result.trim();
  };

  return (
    <div className="max-w-4xl mx-auto h-screen flex flex-col gap-4">
      {/* Chat Messages Container */}
      <div className="flex-1 bg-gradient-to-b from-[#1A1D24]/60 to-[#111318]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 overflow-y-auto">
        <div className="space-y-6">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.type === "human" ? "justify-end" : "justify-start"
              }`}
            >
              {/* Bot Avatar (Left) */}
              {msg.type === "ai" && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`max-w-full sm:max-w-[90%] lg:max-w-[80%] px-6 py-3 rounded-2xl ${
                  msg.type === "human"
                    ? "bg-sky-600 text-white rounded-tr-sm shadow-lg"
                    : "bg-[#1A1D24] text-gray-200 border border-white/10 rounded-tl-sm shadow-lg"
                }`}
              >
                {msg.type === "human" ? (
                  <p className="text-sm leading-relaxed">{msg.message}</p>
                ) : (
                  formatBotMessage(msg.message)
                )}
              </div>

              {/* User Avatar (Right) */}
              {msg.type === "human" && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center ml-3 flex-shrink-0 mt-1">
                  <span className="text-white text-xs font-bold">
                    {session?.user?.email?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
              )}
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center mr-3 flex-shrink-0">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <div className="bg-[#1A1D24] text-gray-200 border border-white/10 px-5 py-4 rounded-2xl rounded-tl-sm">
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

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Chat Input Container */}
      <div className="bg-gradient-to-b from-[#1A1D24]/60 to-[#111318]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex gap-3">
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
            className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;
