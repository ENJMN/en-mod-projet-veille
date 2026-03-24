"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CATEGORIES = ["IA & Digital", "Stratégie", "BTP", "Formation"];
const LEVELS = ["Débutant", "Intermédiaire", "Avancé"];

export default function NouvelleFormationPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "IA & Digital",
    level: "Débutant",
    price_xof: 0,
    duration_hours: 0,
    instructor_name: "ENJ",
    objectives: [""],
    requirements: [""],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const adminKey = typeof window !== "undefined"
    ? sessionStorage.getItem("ways_admin_key") ?? ""
    : "";

  function updateObjective(i: number, value: string) {
    const arr = [...form.objectives];
    arr[i] = value;
    setForm({ ...form, objectives: arr });
  }

  function updateRequirement(i: number, value: string) {
    const arr = [...form.requirements];
    arr[i] = value;
    setForm({ ...form, requirements: arr });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      ...form,
      objectives: form.objectives.filter(Boolean),
      requirements: form.requirements.filter(Boolean),
    };

    const res = await fetch("/api/gervis/formations", {
      method: "POST",
      headers: {
        "x-admin-key": adminKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Erreur lors de la création");
      setLoading(false);
      return;
    }

    router.push("/gervis/formations");
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="bg-[#0A2342] text-white py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4">
          <Link href="/gervis/formations" className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <div>
            <p className="text-gray-400 text-sm">Admin WAYS</p>
            <h1 className="text-2xl font-black">Nouvelle formation</h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Titre */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <h2 className="font-black text-[#0A2342]">Informations générales</h2>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Titre *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20 focus:border-[#0A2342]"
                placeholder="Ex: Maîtriser ChatGPT pour votre entreprise"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description courte</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20 focus:border-[#0A2342] resize-none"
                placeholder="Description affichée dans le catalogue (150 caractères)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Catégorie *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20"
                >
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Niveau</label>
                <select
                  value={form.level}
                  onChange={(e) => setForm({ ...form, level: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20"
                >
                  {LEVELS.map((l) => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Prix (FCFA)</label>
                <input
                  type="number"
                  min={0}
                  value={form.price_xof}
                  onChange={(e) => setForm({ ...form, price_xof: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20"
                  placeholder="0 = Gratuit"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Durée (heures)</label>
                <input
                  type="number"
                  min={0}
                  value={form.duration_hours}
                  onChange={(e) => setForm({ ...form, duration_hours: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Instructeur</label>
              <input
                type="text"
                value={form.instructor_name}
                onChange={(e) => setForm({ ...form, instructor_name: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20"
              />
            </div>
          </div>

          {/* Objectifs */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
            <h2 className="font-black text-[#0A2342]">Objectifs pédagogiques</h2>
            {form.objectives.map((obj, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={obj}
                  onChange={(e) => updateObjective(i, e.target.value)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20"
                  placeholder={`Objectif ${i + 1}`}
                />
                {form.objectives.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, objectives: form.objectives.filter((_, j) => j !== i) })}
                    className="p-2 text-red-400 hover:text-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setForm({ ...form, objectives: [...form.objectives, ""] })}
              className="text-sm text-[#E8861A] font-semibold hover:underline"
            >
              + Ajouter un objectif
            </button>
          </div>

          {/* Prérequis */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
            <h2 className="font-black text-[#0A2342]">Prérequis</h2>
            {form.requirements.map((req, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={req}
                  onChange={(e) => updateRequirement(i, e.target.value)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20"
                  placeholder={`Prérequis ${i + 1}`}
                />
                {form.requirements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, requirements: form.requirements.filter((_, j) => j !== i) })}
                    className="p-2 text-red-400 hover:text-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setForm({ ...form, requirements: [...form.requirements, ""] })}
              className="text-sm text-[#E8861A] font-semibold hover:underline"
            >
              + Ajouter un prérequis
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Link
              href="/gervis/formations"
              className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:border-gray-300 transition-colors"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#0A2342] text-white text-sm font-semibold rounded-xl hover:bg-[#0A2342]/90 transition-colors disabled:opacity-60"
            >
              {loading ? "Création..." : "Créer la formation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
