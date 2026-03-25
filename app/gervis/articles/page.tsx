"use client";

import { useState, useEffect } from "react";

interface Article {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  wordCount: number;
  cover_image?: string | null;
}

const CATEGORIES = ["IA & Digital", "Stratégie", "BTP", "Formation"];

const categoryStyles: Record<string, string> = {
  "IA & Digital": "bg-[#0A2342]/10 text-[#0A2342]",
  "Stratégie": "bg-[#E8861A]/10 text-[#E8861A]",
  "BTP": "bg-[#059669]/10 text-[#059669]",
  "Formation": "bg-[#7c3aed]/10 text-[#7c3aed]",
};

export default function AdminArticlesPage() {
  const [drafts, setDrafts] = useState<Article[]>([]);
  const [published, setPublished] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [actionSlug, setActionSlug] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showManual, setShowManual] = useState(false);
  const [manualTopic, setManualTopic] = useState("");
  const [manualCategory, setManualCategory] = useState("IA & Digital");
  const [manualKeywords, setManualKeywords] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptText, setPromptText] = useState("");
  const [savingPrompt, setSavingPrompt] = useState(false);
  const [tab, setTab] = useState<"drafts" | "published">("drafts");

  const adminKey = typeof window !== "undefined" ? sessionStorage.getItem("ways_admin_key") ?? "" : "";

  function showMsg(type: "success" | "error", text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  }

  async function loadAll() {
    setLoading(true);
    try {
      const res = await fetch("/api/gervis/articles", { headers: { "x-admin-key": adminKey } });
      if (res.ok) {
        const data = await res.json();
        setDrafts(data.drafts ?? []);
        setPublished(data.published ?? []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAll(); loadPrompt(); }, []);

  async function loadPrompt() {
    const res = await fetch("/api/gervis/article-prompt", { headers: { "x-admin-key": adminKey } });
    if (res.ok) { const data = await res.json(); setPromptText(data.prompt ?? ""); }
  }

  async function savePrompt() {
    setSavingPrompt(true);
    const res = await fetch("/api/gervis/article-prompt", {
      method: "PUT",
      headers: { "x-admin-key": adminKey, "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: promptText }),
    });
    setSavingPrompt(false);
    if (res.ok) showMsg("success", "Prompt sauvegardé.");
    else showMsg("error", "Erreur lors de la sauvegarde.");
  }

  async function handleGenerate(custom?: { topic: string; category: string; keywords: string[] }) {
    setGenerating(true);
    try {
      const res = await fetch("/api/gervis/generate-post", {
        method: "POST",
        headers: { "x-admin-key": adminKey, "Content-Type": "application/json" },
        body: custom ? JSON.stringify(custom) : "{}",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showMsg("success", `Article généré : "${data.title}" (~${data.wordCount} mots)`);
        setShowManual(false);
        setManualTopic("");
        setManualKeywords("");
        setTab("drafts");
        loadAll();
      } else {
        showMsg("error", data.message ?? data.error ?? "Aucun sujet en attente.");
      }
    } finally {
      setGenerating(false);
    }
  }

  async function handlePatch(slug: string, action: "publish" | "unpublish", article?: Article) {
    setActionSlug(slug);
    try {
      const res = await fetch("/api/gervis/articles", {
        method: "PATCH",
        headers: { "x-admin-key": adminKey, "Content-Type": "application/json" },
        body: JSON.stringify({ slug, action }),
      });
      if (res.ok) {
        if (action === "publish" && article) {
          fetch("/api/newsletter/send", {
            method: "POST",
            headers: { "x-admin-key": adminKey, "Content-Type": "application/json" },
            body: JSON.stringify({ slug, title: article.title, excerpt: article.excerpt, category: article.category }),
          });
          showMsg("success", "Article publié et newsletter envoyée aux abonnés !");
        } else {
          showMsg("success", action === "unpublish" ? "Article repassé en brouillon." : "Article publié.");
        }
        loadAll();
      } else {
        const data = await res.json().catch(() => ({}));
        showMsg("error", data.error ?? `Erreur ${res.status}.`);
      }
    } catch {
      showMsg("error", "Erreur réseau.");
    } finally {
      setActionSlug(null);
    }
  }

  async function handleDelete(slug: string) {
    if (!confirm("Supprimer définitivement cet article ?")) return;
    setActionSlug(slug);
    try {
      const res = await fetch("/api/gervis/articles", {
        method: "DELETE",
        headers: { "x-admin-key": adminKey, "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      if (res.ok) {
        showMsg("success", "Article supprimé.");
        loadAll();
      } else {
        const data = await res.json().catch(() => ({}));
        showMsg("error", data.error ?? `Erreur ${res.status}.`);
      }
    } catch {
      showMsg("error", "Erreur réseau.");
    } finally {
      setActionSlug(null);
    }
  }

  function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!manualTopic.trim()) return;
    handleGenerate({
      topic: manualTopic.trim(),
      category: manualCategory,
      keywords: manualKeywords.split(",").map(k => k.trim()).filter(Boolean),
    });
  }

  const ArticleCard = ({ article, isDraft }: { article: Article; isDraft: boolean }) => (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col sm:flex-row sm:items-start gap-4">
      {article.cover_image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={article.cover_image} alt="" className="w-20 h-16 object-cover rounded-lg shrink-0 border border-gray-100" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${categoryStyles[article.category] ?? "bg-gray-100 text-gray-600"}`}>
            {article.category}
          </span>
          <span className="text-xs text-gray-400">{article.date}</span>
          <span className="text-xs text-gray-400">~{article.wordCount} mots</span>
          {isDraft && <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full font-medium">Brouillon</span>}
          {!isDraft && <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">Publié</span>}
          {!article.cover_image && <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">Sans image</span>}
        </div>
        <h2 className="font-black text-[#0A2342] text-base mb-1">{article.title}</h2>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{article.excerpt}</p>
        <p className="text-gray-400 text-xs mt-2 font-mono">content/blog/{article.slug}.mdx</p>
      </div>
      <div className="flex sm:flex-col gap-2 shrink-0">
        <a href={`/gervis/articles/preview/${article.slug}`} target="_blank"
          className="px-4 py-2 bg-[#0A2342]/10 text-[#0A2342] text-xs font-semibold rounded-lg hover:bg-[#0A2342]/20 transition-colors text-center">
          Lire
        </a>
        {isDraft ? (
          <button onClick={() => handlePatch(article.slug, "publish", article)} disabled={actionSlug === article.slug}
            className="px-4 py-2 bg-[#059669] text-white text-xs font-semibold rounded-lg hover:bg-[#047857] transition-colors disabled:opacity-60">
            {actionSlug === article.slug ? "…" : "Publier"}
          </button>
        ) : (
          <button onClick={() => handlePatch(article.slug, "unpublish")} disabled={actionSlug === article.slug}
            className="px-4 py-2 bg-amber-500 text-white text-xs font-semibold rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-60">
            {actionSlug === article.slug ? "…" : "Dépublier"}
          </button>
        )}
        <button onClick={() => handleDelete(article.slug)} disabled={actionSlug === article.slug}
          className="px-4 py-2 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors border border-red-100 disabled:opacity-60">
          Supprimer
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0A2342]">Articles</h1>
          <p className="text-gray-500 text-sm mt-1">Gérez vos brouillons et articles publiés.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowPrompt(v => !v)}
            className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
            Prompt système
          </button>
          <button onClick={() => setShowManual(v => !v)}
            className="px-4 py-2.5 border border-[#0A2342] text-[#0A2342] text-sm font-semibold rounded-xl hover:bg-[#0A2342]/5 transition-colors">
            Sujet libre
          </button>
          <button onClick={() => handleGenerate()} disabled={generating}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#E8861A] text-white text-sm font-semibold rounded-xl hover:bg-[#d4781a] transition-colors disabled:opacity-60">
            {generating ? (
              <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>Génération...</>
            ) : (
              <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>Prochain article</>
            )}
          </button>
        </div>
      </div>

      {/* Prompt système */}
      {showPrompt && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-[#0A2342] text-sm">Prompt système de génération</h2>
            <p className="text-xs text-gray-400">Variables : <code className="bg-gray-100 px-1 rounded">{"{{TOPIC}}"}</code> <code className="bg-gray-100 px-1 rounded">{"{{CATEGORY}}"}</code> <code className="bg-gray-100 px-1 rounded">{"{{KEYWORDS}}"}</code> <code className="bg-gray-100 px-1 rounded">{"{{DATE}}"}</code></p>
          </div>
          <textarea value={promptText} onChange={e => setPromptText(e.target.value)} rows={16}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20 resize-y" />
          <div className="flex gap-2 mt-3">
            <button onClick={savePrompt} disabled={savingPrompt}
              className="px-5 py-2.5 bg-[#0A2342] text-white text-sm font-bold rounded-xl hover:bg-[#E8861A] transition-colors disabled:opacity-50">
              {savingPrompt ? "Sauvegarde..." : "Sauvegarder"}
            </button>
            <button onClick={() => setShowPrompt(false)} className="px-4 py-2.5 border border-gray-200 text-sm rounded-xl hover:bg-gray-50">
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Sujet libre */}
      {showManual && (
        <div className="bg-white rounded-2xl border border-[#E8861A]/30 p-5 mb-6 shadow-sm">
          <h2 className="font-bold text-[#0A2342] mb-4 text-sm">Générer avec un sujet libre</h2>
          <form onSubmit={handleManualSubmit} className="space-y-3">
            <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20"
              placeholder="Sujet de l'article *" value={manualTopic} onChange={e => setManualTopic(e.target.value)} required />
            <div className="grid grid-cols-2 gap-3">
              <select className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20"
                value={manualCategory} onChange={e => setManualCategory(e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <input className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20"
                placeholder="Mots-clés (séparés par virgule)" value={manualKeywords} onChange={e => setManualKeywords(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={generating || !manualTopic.trim()}
                className="px-5 py-2.5 bg-[#0A2342] text-white text-sm font-bold rounded-xl hover:bg-[#E8861A] transition-colors disabled:opacity-50">
                {generating ? "Génération en cours..." : "Générer cet article"}
              </button>
              <button type="button" onClick={() => setShowManual(false)} className="px-4 py-2.5 border border-gray-200 text-sm rounded-xl hover:bg-gray-50">
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Toast */}
      {message && (
        <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {message.text}
        </div>
      )}

      {/* Onglets */}
      <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-xl w-fit">
        <button onClick={() => setTab("drafts")}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${tab === "drafts" ? "bg-white text-[#0A2342] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
          Brouillons <span className="ml-1 px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">{drafts.length}</span>
        </button>
        <button onClick={() => setTab("published")}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${tab === "published" ? "bg-white text-[#0A2342] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
          Publiés <span className="ml-1 px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">{published.length}</span>
        </button>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm">Chargement...</div>
      ) : tab === "drafts" ? (
        drafts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500 text-sm">Aucun brouillon en attente.</p>
            <p className="text-gray-400 text-xs mt-1">Cliquez sur "Prochain article" ou "Sujet libre" pour en créer un.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {drafts.map(a => <ArticleCard key={a.slug} article={a} isDraft={true} />)}
          </div>
        )
      ) : (
        published.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500 text-sm">Aucun article publié.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {published.map(a => <ArticleCard key={a.slug} article={a} isDraft={false} />)}
          </div>
        )
      )}
    </div>
  );
}
