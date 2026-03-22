"use client";

import { useState, useEffect } from "react";

interface Draft {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  wordCount: number;
}

const categoryStyles: Record<string, string> = {
  "IA & Digital": "bg-[#0A2342]/10 text-[#0A2342]",
  "Stratégie": "bg-[#E8861A]/10 text-[#E8861A]",
  "BTP": "bg-[#059669]/10 text-[#059669]",
  "Formation": "bg-[#7c3aed]/10 text-[#7c3aed]",
};

export default function AdminArticlesPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [publishingSlug, setPublishingSlug] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function showMessage(type: "success" | "error", text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  }

  async function loadDrafts(key: string) {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/articles", {
        headers: { "x-admin-key": key },
      });
      if (res.ok) {
        const data = await res.json();
        setDrafts(data.drafts ?? []);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthenticated(true);
    loadDrafts(password);
  }

  async function handlePublish(slug: string) {
    setPublishingSlug(slug);
    try {
      const res = await fetch("/api/admin/articles", {
        method: "PATCH",
        headers: { "x-admin-key": password, "Content-Type": "application/json" },
        body: JSON.stringify({ slug, action: "publish" }),
      });
      if (res.ok) {
        showMessage("success", "Article publié avec succès !");
        setDrafts((prev) => prev.filter((d) => d.slug !== slug));
      } else {
        showMessage("error", "Erreur lors de la publication.");
      }
    } finally {
      setPublishingSlug(null);
    }
  }

  async function handleDelete(slug: string) {
    if (!confirm("Supprimer définitivement ce brouillon ?")) return;
    const res = await fetch("/api/admin/articles", {
      method: "DELETE",
      headers: { "x-admin-key": password, "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    if (res.ok) {
      showMessage("success", "Brouillon supprimé.");
      setDrafts((prev) => prev.filter((d) => d.slug !== slug));
    } else {
      showMessage("error", "Erreur lors de la suppression.");
    }
  }

  async function handleGenerate() {
    setGenerating(true);
    try {
      const res = await fetch("/api/admin/generate-post", {
        method: "POST",
        headers: { "x-admin-key": password },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showMessage("success", `Article généré : "${data.title}" (~${data.wordCount} mots)`);
        loadDrafts(password);
      } else {
        showMessage("error", data.message ?? data.error ?? "Aucun sujet en attente.");
      }
    } finally {
      setGenerating(false);
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-sm">
          <div className="w-12 h-12 bg-[#0A2342] rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-xl font-black text-[#0A2342] text-center mb-6">Gestion des articles</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Clé d'administration"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2342]"
              required
            />
            <button
              type="submit"
              className="w-full py-3 bg-[#0A2342] text-white text-sm font-semibold rounded-xl hover:bg-[#E8861A] transition-colors"
            >
              Accéder
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-[#0A2342]">Brouillons d'articles</h1>
            <p className="text-gray-500 text-sm mt-1">Relisez et publiez les articles générés.</p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#E8861A] text-white text-sm font-semibold rounded-xl hover:bg-[#d4781a] transition-colors disabled:opacity-60"
          >
            {generating ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Génération...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Générer le prochain article
              </>
            )}
          </button>
        </div>

        {/* Toast */}
        {message && (
          <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {message.text}
          </div>
        )}

        {/* Drafts list */}
        {loading ? (
          <div className="text-center py-16 text-gray-400 text-sm">Chargement...</div>
        ) : drafts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500 text-sm">Aucun brouillon en attente.</p>
            <p className="text-gray-400 text-xs mt-1">Cliquez sur "Générer le prochain article" pour en créer un.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {drafts.map((draft) => (
              <div
                key={draft.slug}
                className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col sm:flex-row sm:items-start gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${categoryStyles[draft.category] ?? "bg-gray-100 text-gray-600"}`}>
                      {draft.category}
                    </span>
                    <span className="text-xs text-gray-400">{draft.date}</span>
                    <span className="text-xs text-gray-400">~{draft.wordCount} mots</span>
                    <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full font-medium">Brouillon</span>
                  </div>
                  <h2 className="font-black text-[#0A2342] text-base mb-1">{draft.title}</h2>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{draft.excerpt}</p>
                  <p className="text-gray-400 text-xs mt-2 font-mono">content/blog/{draft.slug}.mdx</p>
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0">
                  <button
                    onClick={() => handlePublish(draft.slug)}
                    disabled={publishingSlug === draft.slug}
                    className="px-4 py-2 bg-[#059669] text-white text-xs font-semibold rounded-lg hover:bg-[#047857] transition-colors disabled:opacity-60"
                  >
                    {publishingSlug === draft.slug ? "Publication..." : "Publier"}
                  </button>
                  <button
                    onClick={() => handleDelete(draft.slug)}
                    className="px-4 py-2 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors border border-red-100"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
