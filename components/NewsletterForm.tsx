"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="max-w-md mx-auto p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">
        ✓ Un email de confirmation vous a été envoyé. Vérifiez votre boîte mail.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="votre@email.com"
        required
        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2342] focus:border-transparent"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-5 py-3 bg-[#0A2342] text-white text-sm font-semibold rounded-xl hover:bg-[#E8861A] transition-colors whitespace-nowrap disabled:opacity-60"
      >
        {status === "loading" ? "…" : "S'abonner"}
      </button>
      {status === "error" && (
        <p className="text-red-500 text-xs mt-1 absolute">Erreur, réessayez.</p>
      )}
    </form>
  );
}
