"use client";

import { useState, useEffect } from "react";

interface Abonne {
  id: string;
  email: string;
  nom: string | null;
  confirmed: boolean;
  subscribed_at: string;
  unsubscribed_at: string | null;
}

export default function AbonnesPage() {
  const [abonnes, setAbonnes] = useState<Abonne[]>([]);
  const [loading, setLoading] = useState(true);

  const adminKey = typeof window !== "undefined" ? sessionStorage.getItem("ways_admin_key") ?? "" : "";

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/gervis/abonnes", { headers: { "x-admin-key": adminKey } });
    if (res.ok) { const data = await res.json(); setAbonnes(data.abonnes ?? []); }
    setLoading(false);
  }

  const actifs = abonnes.filter(a => a.confirmed && !a.unsubscribed_at);
  const enAttente = abonnes.filter(a => !a.confirmed && !a.unsubscribed_at);
  const desabonnes = abonnes.filter(a => a.unsubscribed_at);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#0A2342]">Abonnés newsletter</h1>
        <p className="text-gray-500 text-sm mt-1">Gérez votre liste d'abonnés.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Abonnés actifs", count: actifs.length, color: "text-green-600 bg-green-50 border-green-100" },
          { label: "En attente confirmation", count: enAttente.length, color: "text-amber-600 bg-amber-50 border-amber-100" },
          { label: "Désabonnés", count: desabonnes.length, color: "text-gray-500 bg-gray-50 border-gray-100" },
        ].map(({ label, count, color }) => (
          <div key={label} className={`rounded-2xl border p-4 ${color}`}>
            <p className="text-3xl font-black">{count}</p>
            <p className="text-xs font-semibold mt-1">{label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm">Chargement...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Nom</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Statut</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {abonnes.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-12 text-center text-gray-400">Aucun abonné pour l'instant.</td></tr>
              ) : abonnes.map(a => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-[#0A2342]">{a.email}</td>
                  <td className="px-4 py-3 text-gray-500">{a.nom ?? "—"}</td>
                  <td className="px-4 py-3">
                    {a.unsubscribed_at ? (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">Désabonné</span>
                    ) : a.confirmed ? (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">Actif</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">En attente</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{new Date(a.subscribed_at).toLocaleDateString("fr-FR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
