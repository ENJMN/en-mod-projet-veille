"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { MapPin, Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

interface TerrainRow {
  id: string;
  titre: string;
  commune: string;
  zone: string;
  surface: number;
  prix: number;
  titre_propriete: string;
  type_zone: string;
  statut: string;
  disponible: boolean;
  created_at: string;
}

const STATUT_COLORS: Record<string, string> = {
  disponible: "bg-[#059669]/10 text-[#059669]",
  réservé: "bg-amber-50 text-amber-700",
  préfinancement: "bg-[#E8861A]/10 text-[#E8861A]",
  vendu: "bg-gray-100 text-gray-500",
};

const ADMIN_KEY_STORAGE = "ways_admin_key";

export default function AdminTerrainsPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [terrains, setTerrains] = useState<TerrainRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function showToast(type: "success" | "error", text: string) {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  }

  const fetchTerrains = useCallback(async (key: string) => {
    setLoading(true);
    const res = await fetch("/api/admin/terrains", {
      headers: { "x-admin-key": key },
    });
    if (res.ok) {
      setTerrains(await res.json());
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const stored = sessionStorage.getItem(ADMIN_KEY_STORAGE);
    if (stored) {
      setAuthenticated(true);
      fetchTerrains(stored);
    }
  }, [fetchTerrains]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    sessionStorage.setItem(ADMIN_KEY_STORAGE, keyInput);
    setAuthenticated(true);
    fetchTerrains(keyInput);
  }

  function adminKey() {
    return sessionStorage.getItem(ADMIN_KEY_STORAGE) ?? "";
  }

  async function toggleStatut(id: string, current: string) {
    const next = current === "disponible" ? "réservé" : current === "réservé" ? "disponible" : current;
    await fetch("/api/admin/terrains", {
      method: "PATCH",
      headers: { "x-admin-key": adminKey(), "Content-Type": "application/json" },
      body: JSON.stringify({ id, statut: next }),
    });
    fetchTerrains(adminKey());
  }

  async function handleDelete(id: string, titre: string) {
    if (!confirm(`Retirer "${titre}" des offres ?\n(Le terrain sera masqué mais pas supprimé de la base.)`)) return;
    const res = await fetch("/api/admin/terrains", {
      method: "DELETE",
      headers: { "x-admin-key": adminKey(), "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      showToast("success", "Terrain retiré des offres.");
      fetchTerrains(adminKey());
    } else {
      showToast("error", "Erreur lors de la suppression.");
    }
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
            <h1 className="text-xl font-black text-[#0A2342] mb-6">Gestion des terrains</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="Clé admin"
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20"
              />
              <button className="w-full py-3 bg-[#0A2342] text-white font-semibold rounded-xl hover:bg-[#059669] transition-colors">
                Accéder
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const actifs = terrains.filter((t) => t.disponible);
  const retires = terrains.filter((t) => !t.disponible);

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <div className="bg-[#0A2342] text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-gray-400 text-sm mb-1">Admin WAYS Build</p>
            <h1 className="text-2xl font-black">Offres de terrains</h1>
            <p className="text-gray-400 text-sm mt-1">
              {actifs.length} offre{actifs.length > 1 ? "s" : ""} active{actifs.length > 1 ? "s" : ""}
              {retires.length > 0 && ` · ${retires.length} retirée${retires.length > 1 ? "s" : ""}`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/terrains"
              target="_blank"
              className="px-4 py-2 border border-white/20 text-white text-sm font-semibold rounded-xl hover:border-white/40 transition-colors"
            >
              Voir la page publique ↗
            </Link>
            <Link
              href="/admin/terrains/nouveau"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#059669] text-white text-sm font-semibold rounded-xl hover:bg-[#047857] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nouvelle offre
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toast */}
        {toast && (
          <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium ${
            toast.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {toast.text}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-gray-400">Chargement…</div>
        ) : terrains.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <p className="text-gray-400 mb-4">Aucune offre créée</p>
            <Link
              href="/admin/terrains/nouveau"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#059669] text-white text-sm font-semibold rounded-xl hover:bg-[#047857] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Créer la première offre
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm min-w-[700px]">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Terrain</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-600">Localisation</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-600">Surface</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-600">Prix</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-600">Titre</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-600">Statut</th>
                  <th className="px-4 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {terrains.map((t) => (
                  <tr key={t.id} className={`hover:bg-gray-50/50 ${!t.disponible ? "opacity-50" : ""}`}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#0A2342] line-clamp-1">{t.titre}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {t.type_zone === "balnéaire" ? "🌊" : "🏙️"} {t.type_zone}
                        {!t.disponible && <span className="ml-2 text-red-400 font-medium">· retiré</span>}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-gray-700 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        {t.commune}
                      </p>
                      <p className="text-xs text-gray-400">{t.zone}</p>
                    </td>
                    <td className="px-4 py-4 text-gray-700">{t.surface.toLocaleString("fr-FR")} m²</td>
                    <td className="px-4 py-4 font-semibold text-[#0A2342] whitespace-nowrap">
                      {(t.prix / 1_000_000).toFixed(1).replace(/\.0$/, "")} M
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs font-bold text-gray-600 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                        {t.titre_propriete}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleStatut(t.id, t.statut)}
                        disabled={t.statut === "vendu" || t.statut === "préfinancement"}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                          STATUT_COLORS[t.statut] ?? "bg-gray-100 text-gray-500"
                        } ${t.statut === "vendu" || t.statut === "préfinancement" ? "cursor-default" : "hover:opacity-80 cursor-pointer"}`}
                        title={t.statut === "disponible" ? "Cliquer pour passer à Réservé" : t.statut === "réservé" ? "Cliquer pour remettre Disponible" : ""}
                      >
                        {t.statut === "disponible" ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                        {t.statut.charAt(0).toUpperCase() + t.statut.slice(1)}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <Link
                          href={`/admin/terrains/${t.id}`}
                          className="p-1.5 text-gray-500 hover:text-[#0A2342] transition-colors"
                          title="Modifier"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(t.id, t.titre)}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                          title="Retirer"
                        >
                          <Trash2 className="w-4 h-4" />
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
