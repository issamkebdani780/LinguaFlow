// src/components/ChatBot.jsx
import { useEffect, useState, useRef } from "react";
import { UserAuth } from "../Authcontex";
import { supabase } from "../SupabaseClient";
import {
  Send,
  Bot,
  User,
  Loader2,
  BookOpen,
  Trash2,
  Sparkles,
} from "lucide-react";

const ChatBot = () => {
  const { session } = UserAuth();
  const [words, setWords] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [wordsLoaded, setWordsLoaded] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize session and load data
  useEffect(() => {
    if (!session?.user) return;

    const initializeChat = async () => {
      // Generate or get session ID
      const newSessionId = `${session.user.id}_${Date.now()}`;
      setSessionId(newSessionId);

      // Fetch words
      const { data: wordsData, error: wordsError } = await supabase
        .from("words")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (wordsError) {
        console.error("Error fetching words:", wordsError.message);
        return;
      }

      setWords(wordsData || []);
      setWordsLoaded(true);

      // Load chat history
      const { data: historyData, error: historyError } = await supabase
        .from("linguaflow_chat_histories")
        .select("id, message, session_id")
        .eq("user_id", session.user.id)
        .order("id", { ascending: true });

      if (historyError) {
        console.error("Error loading chat history:", historyError.message);
      }

      // Parse history messages
      if (historyData && historyData.length > 0) {
        const parsedMessages = historyData
          .map((item) => {
            try {
              return JSON.parse(item.message);
            } catch {
              return null;
            }
          })
          .filter(Boolean);

        setMessages(parsedMessages);
      } else {
        // Add welcome message if no history
        if (wordsData && wordsData.length > 0) {
          setMessages([
            {
              role: "assistant",
              content: `Hello! 👋 I'm your AI vocabulary assistant. I've loaded ${wordsData.length} words from your collection. I can help you:
                        • Practice and review your vocabulary
                        • Quiz you on word meanings
                        • Create example sentences
                        • Explain word usage and context
                        • Test your knowledge with translations

                        How would you like to start learning today?`,
            },
          ]);
        } else {
          setMessages([
            {
              role: "assistant",
              content: `Hello! 👋 I'm your AI vocabulary assistant. It looks like you haven't added any words yet. Add some words to your collection first, and then I can help you practice and review them!`,
            },
          ]);
        }
      }
    };

    initializeChat();
  }, [session]);

  // Save message to database
  const saveMessageToDb = async (message) => {
    if (!sessionId) return;

    const { error } = await supabase.from("linguaflow_chat_histories").insert([
      {
        user_id: session.user.id,
        session_id: sessionId,
        message: JSON.stringify(message),
      },
    ]);

    if (error) {
      console.error("Error saving message:", error.message);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input.trim() };
    setInput("");
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Save user message
    await saveMessageToDb(userMessage);

    try {
      const vocabularyContext = words
        .map((word) => `${word.english}: ${word.arabic}`)
        .join("\n");

      const systemPrompt = `You are a multilingual AI language teacher helping a student practice their vocabulary.

                            CRITICAL RULES:
                            1. Automatically detect the user's language.
                            2. ALWAYS respond in the SAME language as the user.
                            3. NEVER switch languages unless the user explicitly asks.
                            4. Use ONLY the words provided in the user's vocabulary list.
                            5. Do NOT introduce new vocabulary outside the list.
                            6. Keep explanations simple and adapted to the learner's level.
                            7. Be encouraging, friendly, and educational.

                            CONTEXT:
                            - Vocabulary count: ${words.length}
                            - User Vocabulary List (with translations):
                            ${vocabularyContext}

                            YOUR ROLE:
                            - Help the student practice and memorize THESE specific words
                            - Quiz them on meanings, usage, and translations
                            - Create simple and clear example sentences using ONLY their words
                            - Explain usage, context, and nuances in a beginner-friendly way
                            - Correct mistakes gently and clearly
                            - Keep responses concise and focused

                            IMPORTANT:
                            - Always reference and rely on the words from the vocabulary list
                            - If the user asks something that requires a word not in the list,
                              explain the idea using simpler known words or ask a clarification question.
                            `;
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            "HTTP-Referer": window.location.origin,
            "X-Title": "LinguaFlow - AI English Learning",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "openai/gpt-4o-mini",
            messages: [
              { role: "system", content: systemPrompt },
              ...messages.map((msg) => ({
                role: msg.role,
                content: msg.content,
              })),
              { role: "user", content: userMessage.content },
            ],
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage = {
        role: "assistant",
        content: data.choices[0].message.content,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      await saveMessageToDb(assistantMessage);
    } catch (error) {
      console.error("Error calling AI:", error);
      const errorMessage = {
        role: "assistant",
        content:
          "Sorry, I encountered an error. Please make sure your API key is configured correctly in your .env file (VITE_OPENROUTER_API_KEY).",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!confirm("Are you sure you want to clear all chat history?")) return;

    const { error } = await supabase
      .from("linguaflow_chat_histories")
      .delete()
      .eq("user_id", session.user.id);

    if (error) {
      console.error("Error clearing history:", error);
      alert("Failed to clear history");
      return;
    }

    setMessages([]);
    window.location.reload();
  };

  const quickActions = [
    { label: "Quiz me", prompt: "Quiz me on 5 random words from my list" },
    {
      label: "Example sentences",
      prompt: "Give me example sentences using 3 of my words",
    },
    {
      label: "Test translation",
      prompt: "Test me on Arabic to English translations",
    },
    {
      label: "Word of the day",
      prompt: "Pick one word from my list and teach me about it in detail",
    },
  ];

  const handleQuickAction = (prompt) => {
    setInput(prompt);
  };

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col space-y-6">
      {/* Modern Header */}
      <div className="pb-1 bg-[#050505]/80 backdrop-blur-md">
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-cyan-500/20 backdrop-blur-xl border border-white/10 rounded-3xl p-6 lg:p-8">
          {/* Decorative Glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  {/* Icon Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl blur-xl opacity-50" />
                  <div className="relative w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
                    <Bot className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl lg:text-3xl font-bold text-white mb-1">
                    AI Assistant
                  </h1>
                  <p className="text-xs lg:text-sm text-gray-400">
                    {wordsLoaded
                      ? `${words.length} words loaded • Ready to help`
                      : "Loading your vocabulary..."}
                  </p>
                </div>
              </div>

              {/* Clear History Button */}
              {messages.length > 1 && (
                <button
                  onClick={handleClearHistory}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear History</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      {words.length === 0 && wordsLoaded && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-emerald-400 font-medium">
                No words yet
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Add some words to your collection first, then come back here to
                practice with me!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 bg-gradient-to-br from-[#1A1D24]/80 to-[#0B0C10]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 overflow-y-auto min-h-[500px]">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-gray-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading your vocabulary...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-emerald-600 to-teal-600 text-white"
                      : "bg-[#0B0C10]/60 border border-white/10 text-gray-200"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-[#0B0C10]/60 border border-white/10 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <div
                      className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {messages.length > 0 && words.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleQuickAction(action.prompt)}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm hover:bg-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="relative pb-7">
        <div className="bg-gradient-to-br from-[#1A1D24]/80 to-[#0B0C10]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              words.length === 0
                ? "Add words to your collection first..."
                : "Ask me anything about your vocabulary..."
            }
            disabled={isLoading || words.length === 0}
            className="w-full bg-transparent border-0 px-6 py-4 text-white placeholder-gray-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading || words.length === 0}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBot;
