"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface Comment {
  id: string;
  slug: string;
  name: string;
  content: string;
  date: string;
  approved: boolean;
}

export default function AdminCommentairesPage() {
  const [adminKey, setAdminKey] = useState("");
  const [inputKey, setInputKey] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("pending");

  const fetchComments = useCallback(async (key: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/comments", {
        headers: { "x-admin-key": key },
      });
      if (res.status === 401) {
        setAuthError("Clé incorrecte. Accès refusé.");
        setAdminKey("");
        return;
      }
      const data = await res.json();
      setComments(data);
    } catch {
      setAuthError("Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAdminKey(inputKey);
    fetchComments(inputKey);
  };

  const handleApprove = async (comment: Comment, approved: boolean) => {
    const res = await fetch("/api/admin/comments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify({ slug: comment.slug, id: comment.id, approved }),
    });
    if (res.ok) {
      setComments((prev) =>
        prev.map((c) => (c.id === comment.id ? { ...c, approved } : c))
      );
    }
  };

  const handleDelete = async (comment: Comment) => {
    if (!confirm(`Supprimer le commentaire de "${comment.name}" ?`)) return;
    const res = await fetch("/api/admin/comments", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify({ slug: comment.slug, id: comment.id }),
    });
    if (res.ok) {
      setComments((prev) => prev.filter((c) => c.id !== comment.id));
    }
  };

  const filtered = comments.filter((c) => {
    if (filter === "pending") return !c.approved;
    if (filter === "approved") return c.approved;
    return true;
  });

  const pendingCount = comments.filter((c) => !c.approved).length;

  // Login screen
  if (!adminKey) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="text-center mb-8">
              <Image src="/logo-icon.png" alt="WAYS" width={56} height={56} className="h-14 w-auto object-contain mx-auto mb-4" />
              <h1 className="text-2xl font-black text-[#0A2342]">Administration</h1>
              <p className="text-gray-500 text-sm mt-1">Modération des commentaires</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#0A2342] mb-1.5">
                  Clé d'administration
                </label>
                <input
                  type="password"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="••••••••••••••"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2342] focus:border-transparent"
                />
              </div>
              {authError && (
                <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  {authError}
                </p>
              )}
              <button
                type="submit"
                className="w-full py-3 bg-[#0A2342] text-white font-bold rounded-xl hover:bg-[#E8861A] transition-colors text-sm"
              >
                Accéder
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <header className="bg-[#0A2342] text-white px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image src="/logo-icon.png" alt="WAYS" width={40} height={40} className="h-9 w-auto object-contain" />
            <div>
              <p className="font-black text-sm">WAYS Admin</p>
              <p className="text-gray-400 text-xs">Modération des commentaires</p>
            </div>
          </div>
          {pendingCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E8861A] text-white text-xs font-bold rounded-full">
              {pendingCount} en attente
            </span>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(["pending", "approved", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                filter === f
                  ? "bg-[#0A2342] text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-[#0A2342] hover:text-[#0A2342]"
              }`}
            >
              {f === "pending" ? `En attente (${pendingCount})` : f === "approved" ? "Approuvés" : "Tous"}
            </button>
          ))}
          <button
            onClick={() => fetchComments(adminKey)}
            className="ml-auto px-4 py-2 rounded-xl text-sm font-semibold bg-white border border-gray-200 text-gray-600 hover:border-[#0A2342] hover:text-[#0A2342] transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualiser
          </button>
        </div>

        {/* Comments list */}
        {loading ? (
          <div className="text-center py-16 text-gray-500">Chargement…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500">
              {filter === "pending" ? "Aucun commentaire en attente." : "Aucun commentaire."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((comment) => (
              <div
                key={comment.id}
                className={`bg-white rounded-2xl border p-5 sm:p-6 ${
                  comment.approved ? "border-green-200" : "border-orange-200"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-bold text-[#0A2342] text-sm">{comment.name}</span>
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                        comment.approved
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}>
                        {comment.approved ? "Approuvé" : "En attente"}
                      </span>
                      <span className="text-gray-400 text-xs">
                        Article : <span className="font-medium">{comment.slug}</span>
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">{comment.content}</p>
                    <p className="text-gray-400 text-xs">
                      {new Date(comment.date).toLocaleDateString("fr-FR", {
                        day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!comment.approved ? (
                      <button
                        onClick={() => handleApprove(comment, true)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Approuver
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApprove(comment, false)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-300 transition-colors"
                      >
                        Retirer
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(comment)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-red-100 text-red-600 text-xs font-bold rounded-xl hover:bg-red-200 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
