import { useState, useRef, useEffect } from "react";
import { API_BASE, authHeaders } from "../config";

const SUGGESTED_PROMPTS = [
  "💊 What is Calpol?",
  "🩺 Cold & Fever tips",
  "🧪 Explain Blood Test",
  "👨‍⚕️ Find a specialist",
];

export default function ChatBot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I'm your Healthcare Assistant AI. Ask me to explain a medical term, medication like Calpol, symptoms, or health guidance.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  async function sendMessage(textToSend) {
    const userText = (textToSend || input).trim();
    if (!userText || loading) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessages = [...messages, { role: "user", text: userText, time: timeStr }];
    setMessages(newMessages);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ message: userText }),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      const replyText = data && data.reply ? data.reply : "No response received from assistant.";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, I couldn't reach the server. Please check that Spring Boot and Python backends are running.",
          isError: true,
          lastUserMessage: userText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleCopy(text, idx) {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  function clearChat() {
    setMessages([
      {
        role: "assistant",
        text: "Chat history cleared. How can I help you today?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }

  function renderFormattedText(text) {
    if (!text) return null;
    const lines = text.split("\n");
    return lines.map((line, lIdx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedLine = parts.map((part, pIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (line.trim().startsWith("* ") || line.trim().startsWith("- ")) {
        return (
          <li key={lIdx} style={{ marginLeft: 16, marginBottom: 4 }}>
            {formattedLine}
          </li>
        );
      }
      return (
        <p key={lIdx} style={{ margin: "4px 0" }}>
          {formattedLine}
        </p>
      );
    });
  }

  return (
    <div className="card card-full chat-card">
      <div className="chat-header">
        <div>
          <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
            <span>🩺 Health Assistant Chat</span>
            <span className="status-dot online" title="AI Service Online"></span>
          </h3>
          <span className="muted">Instant medical explanations & health guidance</span>
        </div>
        <button onClick={clearChat} className="secondary btn-sm" style={{ padding: "4px 10px", fontSize: 12 }}>
          🗑️ Clear Chat
        </button>
      </div>

      <div className="chat-window">
        {messages.map((m, i) => (
          <div key={i} className={`chat-bubble-container ${m.role}`}>
            <div className={`chat-bubble ${m.role} ${m.isError ? "error-bubble" : ""}`}>
              <div className="chat-bubble-content">{renderFormattedText(m.text)}</div>
              <div className="chat-bubble-footer">
                <span className="chat-time">{m.time}</span>
                {m.role === "assistant" && !m.isError && (
                  <button
                    onClick={() => handleCopy(m.text, i)}
                    className="copy-btn"
                    title="Copy message"
                  >
                    {copiedIndex === i ? "✓ Copied" : "📋 Copy"}
                  </button>
                )}
              </div>
              {m.isError && (
                <button
                  onClick={() => sendMessage(m.lastUserMessage)}
                  className="retry-btn"
                >
                  🔄 Retry
                </button>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="chat-bubble-container assistant">
            <div className="chat-bubble assistant typing-bubble">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="prompt-chips">
        <span className="chips-label">Quick Ask:</span>
        {SUGGESTED_PROMPTS.map((chip, idx) => (
          <button
            key={idx}
            className="chip-btn"
            onClick={() => sendMessage(chip.replace(/^[^\s]+\s/, ""))}
            disabled={loading}
          >
            {chip}
          </button>
        ))}
      </div>

      <div className="chat-input-bar">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about a medical term (e.g. Calpol), symptoms, or health tips..."
          disabled={loading}
        />
        <button onClick={() => sendMessage()} disabled={loading || !input.trim()}>
          {loading ? "Sending..." : "Send 🚀"}
        </button>
      </div>
    </div>
  );
}
