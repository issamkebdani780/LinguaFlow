import { useEffect, useState, useRef } from "react";
import { UserAuth } from "../Authcontex";
import { supabase } from "../SupabaseClient";
import { Send, Bot, User, Loader2, AlertCircle, Volume2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

const ChatBot = () => {
  const { session } = UserAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingHistory, setIsFetchingHistory] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  
  // Ref to prevent double-fetching in React Strict Mode
  const hasFetched = useRef(false);
  const USER_ID = session?.user?.id;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Fetch Chat History with Duplicate Prevention
  useEffect(() => {
    if (!USER_ID || hasFetched.current) return;

    const fetchChatHistory = async () => {
      try {
        setIsFetchingHistory(true);
        const { data, error: dbError } = await supabase
          .from("linguaflow_chat_histories")
          .select("*")
          .eq("session_id", USER_ID)
          .order("id", { ascending: true });

        if (dbError) throw dbError;

        if (data && data.length > 0) {
          const parsedMessages = data.map((item) => {
            try {
              let messageData = item.message;
              if (typeof messageData === 'string') {
                messageData = JSON.parse(messageData);
              }
              
              const isHuman = messageData.type === 'human' || messageData.role === 'user';
              
              return {
                id: item.id,
                role: isHuman ? 'user' : 'assistant',
                content: messageData.content || '',
                timestamp: item.created_at || new Date().toISOString()
              };
            } catch (e) {
              return {
                id: item.id,
                role: 'user',
                content: typeof item.message === 'string' ? item.message : JSON.stringify(item.message),
                timestamp: new Date().toISOString()
              };
            }
          });
          setMessages(parsedMessages);
          hasFetched.current = true; // Mark as fetched
        }
      } catch (err) {
        console.error("Error loading history:", err);
        setError("Failed to load chat history");
      } finally {
        setIsFetchingHistory(false);
      }
    };

    fetchChatHistory();
  }, [USER_ID]);

  const saveMessageToDatabase = async (role, content) => {
    if (!USER_ID) return null;
    try {
      const messageData = {
        type: role === 'user' ? 'human' : 'ai',
        content: content,
        additional_kwargs: {},
        response_metadata: {}
      };

      const { data, error } = await supabase.from("linguaflow_chat_histories").insert([
        { session_id: USER_ID, message: messageData }
      ]).select();
      
      return data?.[0]?.id; 
    } catch (err) {
      console.error("Failed to save message:", err);
      return null;
    }
  };

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userContent = inputMessage.trim();
    setInputMessage("");
    setError(null);
    setIsLoading(true);

    // 1. Add user message to local UI first (Optimistic)
    const tempId = Date.now();
    const userMsg = {
      id: tempId,
      role: "user",
      content: userContent,
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      // 2. Save User Message to DB
      await saveMessageToDatabase("user", userContent);

      // 3. Get AI Response
      const response = await fetch("https://n8n.linguaflo.me/webhook-test/linguaflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userContent,
          session_id: USER_ID,
          user_id: USER_ID,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) throw new Error("Connection lost.");

      const data = await response.json();
      
      // Handle the raw string output seen in your screenshot
      let botContent = "";
      if (typeof data === 'string') botContent = data;
      else botContent = data.output || data.response || data.message || JSON.stringify(data);

      // 4. Save Bot Message to DB
      const dbId = await saveMessageToDatabase("assistant", botContent);

      // 5. Add Bot Message to UI
      const botMsg = {
        id: dbId || Date.now() + 1,
        role: "assistant",
        content: botContent,
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, botMsg]);

    } catch (err) {
      setError("Trouble connecting to AI.");
      setMessages((prev) => [...prev, {
        id: "error-" + Date.now(),
        role: "assistant",
        content: "I'm having trouble connecting right now. Please try again.",
        timestamp: new Date().toISOString(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] max-w-4xl mx-auto">
      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300">×</button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#1A1D24]/60 to-[#111318]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 mb-4">
        {isFetchingHistory ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-sky-400 animate-spin mx-auto mb-2" />
              <p className="text-gray-400">Loading chat history...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <Bot className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">Start a conversation</h3>
              <p className="text-gray-500">Ask me anything about learning English!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                
                <div className={`group relative max-w-[70%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-sky-600 text-white"
                    : message.isError
                    ? "bg-red-500/20 text-red-300 border border-red-500/30"
                    : "bg-white/5 text-gray-200 border border-white/10"
                }`}>
                  <div className="text-sm prose prose-invert max-w-none break-words">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1 gap-2">
                    <p className="text-[10px] opacity-40">
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {message.role === "assistant" && (
                      <button 
                        onClick={() => speak(message.content)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        type="button"
                      >
                        <Volume2 className="w-3 h-3 text-sky-400 hover:text-sky-300" />
                      </button>
                    )}
                  </div>
                </div>

                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask me anything about English learning..."
          disabled={isLoading}
          className="flex-1 bg-[#1A1D24]/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none transition-all disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !inputMessage.trim()}
          className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </button>
      </form>
    </div>
  );
};

export default ChatBot;