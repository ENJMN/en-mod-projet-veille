"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const WHATSAPP_URL = "https://wa.me/2250705133131?text=Bonjour%2C%20je%20souhaite%20parler%20à%20un%20conseiller%20WAYS.";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Bonjour et bienvenue chez WAYS Digital Solutions ! Je suis Axel, votre assistant. Comment puis-je vous aider ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [open, messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: Message = { role: "user", content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages([...newMessages, { role: "assistant", content: data.reply }]);
      } else {
        setError(data.error ?? "Erreur. Réessayez ou contactez-nous via WhatsApp.");
      }
    } catch {
      setError("Connexion impossible. Contactez-nous via WhatsApp.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Chat window */}
      {open && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
          style={{ height: "min(520px, calc(100vh - 120px))" }}>

          {/* Header */}
          <div className="bg-[#0A2342] px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#E8861A] flex items-center justify-center text-white font-black text-sm">
                A
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-none">Axel</p>
                <p className="text-gray-400 text-xs mt-0.5">Assistant WAYS · En ligne</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white transition-colors p-1">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#F8F9FA]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-[#E8861A] flex items-center justify-center text-white font-black text-xs mr-2 shrink-0 mt-0.5">
                    A
                  </div>
                )}
                <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#0A2342] text-white rounded-tr-sm"
                    : "bg-white text-gray-800 rounded-tl-sm shadow-sm border border-gray-100"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full bg-[#E8861A] flex items-center justify-center text-white font-black text-xs mr-2 shrink-0">
                  A
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            {error && (
              <div className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                {error}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* WhatsApp escalation */}
          <div className="shrink-0 px-4 py-2 bg-white border-t border-gray-100">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2 text-xs font-semibold text-[#059669] hover:bg-[#059669]/5 rounded-xl transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Parler à un conseiller humain
            </a>
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="shrink-0 px-3 pb-3 bg-white flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Écrivez votre message..."
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-sm bg-[#F8F9FA] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-10 h-10 bg-[#0A2342] text-white rounded-xl flex items-center justify-center hover:bg-[#E8861A] transition-colors disabled:opacity-40 shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-4 right-4 sm:right-6 z-50 w-14 h-14 bg-[#0A2342] text-white rounded-full shadow-lg hover:bg-[#E8861A] transition-all duration-200 flex items-center justify-center group"
        aria-label={open ? "Fermer le chat" : "Ouvrir le chat Axel"}
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E8861A] rounded-full border-2 border-white" />
        )}
      </button>
    </>
  );
}
