import { useEffect, useRef, useState } from "react";

interface Msg {
  role: "user" | "assistant" | "system";
  content: string;
}

const SUGGESTIONS = [
  "What has Rishabh built?",
  "How did he get his open-source PRs merged?",
  "What is SafeLife?",
  "How can I work with Rishabh?",
];

export default function ChatModal({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "system",
      content:
        "Hi, I'm Rishabh's AI. Ask me anything about his work, projects, or open source — I answer from verified facts only.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function send(text: string) {
    const content = text.trim().slice(0, 500);
    if (!content || loading) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.filter((m) => m.role !== "system"),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data.error || `Request failed (${res.status})`
        );
      }
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let reply = "";
      setMessages([...next, { role: "assistant", content: "" }]);
      if (reader) {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          for (const line of chunk.split("\n")) {
            if (!line.startsWith("data: ")) continue;
            const payload = line.slice(6).trim();
            if (payload === "[DONE]") break;
            try {
              const parsed = JSON.parse(payload);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                reply += delta;
                setMessages([...next, { role: "assistant", content: reply }]);
              }
            } catch {
              // ignore malformed SSE lines
            }
          }
        }
      }
      if (!reply) {
        setMessages([
          ...next,
          {
            role: "assistant",
            content:
              "I couldn't get an answer just now. Try again, or email Rishabh directly at rishabhsharma14426@gmail.com.",
          },
        ]);
      }
    } catch (err) {
      setMessages([
        ...next,
        {
          role: "assistant",
          content:
            err instanceof Error
              ? `Something went wrong: ${err.message}. Email Rishabh at rishabhsharma14426@gmail.com instead.`
              : "Something went wrong. Email Rishabh at rishabhsharma14426@gmail.com instead.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat-overlay" role="dialog" aria-modal="true" aria-label="Talk to Rishabh's AI">
      <div className="chat-panel">
        <div className="chat-header">
          <div>
            <h2>Talk to my AI</h2>
            <p>Answers about Rishabh, from verified facts only.</p>
          </div>
          <button className="chat-close" onClick={onClose} aria-label="Close chat">
            ×
          </button>
        </div>
        <div className="chat-log" ref={logRef}>
          {messages.map((m, i) => (
            <div key={i} className={`chat-msg ${m.role}`}>
              {m.content}
            </div>
          ))}
          {messages.length === 1 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  style={{
                    border: "1px solid var(--color-line)",
                    borderRadius: 999,
                    padding: "8px 14px",
                    fontSize: 13,
                    background: "var(--color-paper)",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          {loading && <div className="chat-msg assistant">Thinking…</div>}
        </div>
        <form
          className="chat-form"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Rishabh…"
            maxLength={500}
            aria-label="Your message"
            autoFocus
          />
          <button type="submit" disabled={loading || !input.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
