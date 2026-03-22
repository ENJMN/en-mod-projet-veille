"use client";

import { useState } from "react";

interface CommentFormProps {
  slug: string;
}

export default function CommentForm({ slug }: CommentFormProps) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const res = await fetch(`/api/comments/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, content }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setName("");
      setContent("");
    } catch {
      setError("Impossible d'envoyer le commentaire. Réessayez.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="font-bold text-green-800 mb-1">Commentaire envoyé !</p>
        <p className="text-green-700 text-sm">Il sera visible après validation par notre équipe.</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm text-green-700 underline hover:text-green-900"
        >
          Laisser un autre commentaire
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-[#0A2342] mb-1.5">
          Votre nom <span className="text-[#E8861A]">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jean Kouassi"
          required
          minLength={2}
          maxLength={80}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2342] focus:border-transparent placeholder-gray-400"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#0A2342] mb-1.5">
          Votre commentaire <span className="text-[#E8861A]">*</span>
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Partagez votre avis, votre expérience ou posez une question…"
          required
          minLength={10}
          maxLength={2000}
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2342] focus:border-transparent placeholder-gray-400 resize-none"
        />
        <p className="text-xs text-gray-400 mt-1">{content.length}/2000 caractères</p>
      </div>

      {status === "error" && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-3 bg-[#0A2342] text-white font-bold rounded-xl hover:bg-[#E8861A] transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Envoi en cours…" : "Publier le commentaire"}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Les commentaires sont modérés avant publication.
      </p>
    </form>
  );
}
