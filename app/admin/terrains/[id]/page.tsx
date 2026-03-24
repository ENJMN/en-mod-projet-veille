"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import TerrainForm from "../TerrainForm";

const ADMIN_KEY_STORAGE = "ways_admin_key";

export default function EditTerrainPage({ params }: { params: { id: string } }) {
  const [adminKey, setAdminKey] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [terrain, setTerrain] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  async function loadTerrain(key: string) {
    setLoading(true);
    const res = await fetch("/api/admin/terrains", {
      headers: { "x-admin-key": key },
    });
    if (res.ok) {
      const all = await res.json();
      const found = all.find((t: { id: string }) => t.id === params.id);
      if (found) setTerrain(found);
      else setNotFound(true);
    }
    setLoading(false);
  }

  useEffect(() => {
    const stored = sessionStorage.getItem(ADMIN_KEY_STORAGE);
    if (stored) {
      setAdminKey(stored);
      setAuthenticated(true);
      loadTerrain(stored);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    sessionStorage.setItem(ADMIN_KEY_STORAGE, keyInput);
    setAdminKey(keyInput);
    setAuthenticated(true);
    loadTerrain(keyInput);
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm w-full max-w-sm">
          <h1 className="text-xl font-black text-[#0A2342] mb-6">Accès admin</h1>
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
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <p className="text-gray-400">Chargement…</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4 text-center">
        <div>
          <p className="text-gray-500 mb-4">Terrain introuvable.</p>
          <Link href="/admin/terrains" className="text-[#0A2342] font-semibold underline hover:text-[#E8861A]">
            Retour aux offres
          </Link>
        </div>
      </div>
    );
  }

  if (!terrain) return null;

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="bg-[#0A2342] text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/admin/terrains" className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-4 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Retour aux offres
          </Link>
          <h1 className="text-2xl font-black">Modifier l'offre</h1>
          <p className="text-gray-400 text-sm mt-1">{terrain.titre as string}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TerrainForm
          mode="edit"
          adminKey={adminKey}
          initialData={{
            id: terrain.id as string,
            titre: terrain.titre as string,
            zone: terrain.zone as string,
            commune: terrain.commune as string,
            localisation: terrain.localisation as string,
            surface: String(terrain.surface),
            prix: String(terrain.prix),
            prix_negociable: terrain.prix_negociable as boolean,
            description: terrain.description as string ?? "",
            notes_libres: terrain.notes_libres as string ?? "",
            titre_propriete: terrain.titre_propriete as string,
            type_zone: terrain.type_zone as string,
            viabilisation: (terrain.viabilisation as string[]) ?? [],
            caracteristiques: (terrain.caracteristiques as string[]) ?? [],
            images: (terrain.images as string[]) ?? [],
            gps: terrain.gps as string ?? "",
            statut: terrain.statut as string,
          }}
        />
      </div>
    </div>
  );
}
