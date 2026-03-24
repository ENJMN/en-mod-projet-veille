"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import TerrainForm from "../TerrainForm";

const ADMIN_KEY_STORAGE = "ways_admin_key";

export default function NouveauTerrainPage() {
  const [adminKey, setAdminKey] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(ADMIN_KEY_STORAGE);
    if (stored) {
      setAdminKey(stored);
      setAuthenticated(true);
    }
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    sessionStorage.setItem(ADMIN_KEY_STORAGE, keyInput);
    setAdminKey(keyInput);
    setAuthenticated(true);
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

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="bg-[#0A2342] text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/admin/terrains" className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-4 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Retour aux offres
          </Link>
          <h1 className="text-2xl font-black">Nouvelle offre de terrain</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TerrainForm mode="create" adminKey={adminKey} />
      </div>
    </div>
  );
}
