import React, { useEffect, useRef, useState } from "react";
import { Send, Loader2 } from "lucide-react";
import axios from "axios";

/*
AIChatWidget (Crowdbricks)
- Floating AI chat window for project, ROI & investment guidance.
- Smart fallback mode when backend AI is not configured.
- Responsive, dark-mode friendly, keyboard accessible, production-ready.
*/

export default function AIChatWidget({ onClose }) {
  const [messages, setMessages] = useState([
    {
      id: "sys-1",
      role: "assistant",
      text: "👋 Hi! I’m Crowdbricks Assistant. Ask me about projects, expected returns, or how to invest.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendLocalFallback = async (text) => {
    const q = text.toLowerCase();
    if (q.includes("how") && q.includes("invest"))
      return "To invest: 1️⃣ Sign up, 2️⃣ Choose a project, 3️⃣ Pledge at least ₵500, 4️⃣ Complete payment (MoMo or bank). We’ll confirm your investment once verified.";
    if (q.includes("returns") || q.includes("roi"))
      return "💰 Projected returns vary by project. Check each project’s detail card for ROI info. Average platform ROI is on the homepage.";
    if (q.includes("kyc") || q.includes("verification"))
      return "🪪 Creators must complete KYC to receive funds. Investors may also verify identity for larger pledges.";
    return "💡 Try asking: 'Summarize Project X', 'ROI on ₵1000', or 'How does Crowdbricks verify developers?'.";
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg = { id: `user-${Date.now()}`, role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const aiUrl = import.meta.env.VITE_AI_API_URL || "";
      let replyText = "";

      if (aiUrl) {
        // Get auth token from localStorage (matches api.js token key)
        const token = localStorage.getItem("token");
        
        const headers = {
          "Content-Type": "application/json",
        };
        
        // Add authorization header if token exists
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const resp = await axios.post(
          aiUrl,
          { messages: [...messages, userMsg] },
          { headers, withCredentials: true }
        );
        replyText = resp?.data?.reply || resp?.data?.message || "";
      } else {
        replyText = await sendLocalFallback(trimmed);
      }

      const assistantMsg = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        text: replyText,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: "assistant",
          text: "⚠️ Sorry — I couldn’t connect to the AI service. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) sendMessage();
  };

  return (
    <div className="w-[340px] md:w-[420px] mr-4 mb-3 rounded-2xl overflow-hidden shadow-2xl border border-blue-100 bg-white dark:bg-slate-900 animate-in fade-in slide-in-from-bottom-5">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-slate-900 font-bold shadow-md">
            A
          </div>
          <h3 className="text-sm font-semibold tracking-wide">Crowdbricks Assistant</h3>
        </div>
        <button
          aria-label="Close chat"
          onClick={onClose}
          className="p-1.5 rounded-md hover:bg-blue-500/30 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="p-3 h-72 overflow-y-auto space-y-3 bg-slate-50 dark:bg-slate-800">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`p-2.5 rounded-lg max-w-[80%] text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-bl-none border border-blue-50 dark:border-slate-600"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-blue-50 dark:border-slate-700 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask about ROI, projects, or investing..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            className="flex-1 px-3 py-2 rounded-lg border border-blue-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
            aria-label="Message to assistant"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-lg px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50"
            aria-label="Send message"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-2 text-center">
          Tip: Press <kbd className="px-1 bg-slate-200 rounded">Ctrl</kbd> + <kbd className="px-1 bg-slate-200 rounded">Enter</kbd> to send.
        </p>
      </div>
    </div>
  );
}
