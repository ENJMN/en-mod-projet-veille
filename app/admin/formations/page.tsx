"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Formation {
  id: string;
  slug: string;
  title: string;
  category: string;
  level: string;
  price_xof: number;
  is_published: boolean;
  is_featured: boolean;
  lessons_count: number;
  duration_hours: number;
  created_at: string;
}

const ADMIN_KEY_STORAGE = "ways_admin_key";

export default function AdminFormationsPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingFormation, setEditingFormation] = useState<Formation | null>(null);

  const adminKey = typeof window !== "undefined"
    ? sessionStorage.getItem(ADMIN_KEY_STORAGE) ?? ""
    : "";

  const fetchFormations = useCallback(async (key: string) => {
    setLoading(true);
    const res = await fetch("/api/admin/formations", {
      headers: { "x-admin-key": key },
    });
    if (res.ok) {
      const data = await res.json();
      setFormations(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const stored = sessionStorage.getItem(ADMIN_KEY_STORAGE);
    if (stored) {
      setAuthenticated(true);
      fetchFormations(stored);
    }
  }, [fetchFormations]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    sessionStorage.setItem(ADMIN_KEY_STORAGE, keyInput);
    setAuthenticated(true);
    fetchFormations(keyInput);
  }

  async function togglePublish(id: string, current: boolean) {
    const key = sessionStorage.getItem(ADMIN_KEY_STORAGE) ?? "";
    await fetch("/api/admin/formations", {
      method: "PATCH",
      headers: { "x-admin-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_published: !current }),
    });
    fetchFormations(key);
  }

  async function deleteFormation(id: string) {
    if (!confirm("Supprimer cette formation ?")) return;
    const key = sessionStorage.getItem(ADMIN_KEY_STORAGE) ?? "";
    await fetch("/api/admin/formations", {
      method: "DELETE",
      headers: { "x-admin-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchFormations(key);
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <span className="text-2xl font-black text-[#0A2342]">WAYS</span>
            <span className="text-2xl font-black text-[#E8861A]"> Admin</span>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h1 className="text-xl font-black text-[#0A2342] mb-6">Formations</h1>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="Clé admin"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20"
              />
              <button className="w-full py-3 bg-[#0A2342] text-white font-semibold rounded-xl hover:bg-[#0A2342]/90 transition-colors">
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
      <div className="bg-[#0A2342] text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1">Admin WAYS</p>
            <h1 className="text-2xl font-black">Gestion des formations</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/formations/nouvelle" className="px-4 py-2 bg-[#E8861A] text-white text-sm font-semibold rounded-xl hover:bg-[#E8861A]/90 transition-colors">
              + Nouvelle formation
            </Link>
            <Link href="/admin/commentaires" className="px-4 py-2 border border-white/20 text-white text-sm font-semibold rounded-xl hover:border-white/40 transition-colors">
              Commentaires
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-20 text-gray-400">Chargement...</div>
        ) : formations.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <p className="text-gray-400 mb-4">Aucune formation créée</p>
            <Link
              href="/admin/formations/nouvelle"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E8861A] text-white text-sm font-semibold rounded-xl hover:bg-[#E8861A]/90 transition-colors"
            >
              Créer la première formation
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Formation</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-600">Catégorie</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-600">Prix</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-600">Leçons</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-600">Statut</th>
                  <th className="px-4 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {formations.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#0A2342] line-clamp-1">{f.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{f.level}</p>
                    </td>
                    <td className="px-4 py-4 text-gray-600">{f.category}</td>
                    <td className="px-4 py-4 text-gray-600">
                      {f.price_xof === 0 ? "Gratuit" : `${f.price_xof.toLocaleString("fr-FR")} FCFA`}
                    </td>
                    <td className="px-4 py-4 text-gray-600">{f.lessons_count}</td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => togglePublish(f.id, f.is_published)}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                          f.is_published
                            ? "bg-[#059669]/10 text-[#059669] hover:bg-red-50 hover:text-red-600"
                            : "bg-gray-100 text-gray-500 hover:bg-[#059669]/10 hover:text-[#059669]"
                        }`}
                      >
                        {f.is_published ? "Publié" : "Brouillon"}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <Link
                          href={`/admin/formations/${f.id}`}
                          className="px-3 py-1.5 text-xs font-semibold text-[#0A2342] border border-gray-200 rounded-lg hover:border-[#0A2342]/30 transition-colors"
                        >
                          Modifier
                        </Link>
                        <button
                          onClick={() => deleteFormation(f.id)}
                          className="px-3 py-1.5 text-xs font-semibold text-red-500 border border-red-100 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
