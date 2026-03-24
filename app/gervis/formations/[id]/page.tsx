"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ADMIN_KEY_STORAGE = "ways_admin_key";
const CATEGORIES = ["IA & Digital", "Stratégie", "BTP", "Formation"];
const LEVELS = ["Débutant", "Intermédiaire", "Avancé"];

interface Formation {
  id: string;
  title: string;
  description: string | null;
  category: string;
  level: string;
  price_xof: number;
  duration_hours: number;
  instructor_name: string;
  objectives: string[] | null;
  requirements: string[] | null;
  is_published: boolean;
}

export default function EditFormationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [formation, setFormation] = useState<Formation | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "IA & Digital",
    level: "Débutant",
    price_xof: 0,
    duration_hours: 0,
    instructor_name: "N'Guessan Jacques EBAKA",
    objectives: [""],
    requirements: [""],
    is_published: false,
  });

  useEffect(() => {
    const key = sessionStorage.getItem(ADMIN_KEY_STORAGE) ?? "";
    if (!key) { setLoading(false); return; }

    fetch("/api/gervis/formations", { headers: { "x-admin-key": key } })
      .then((r) => r.json())
      .then((data: Formation[]) => {
        const f = data.find((x) => x.id === params.id);
        if (!f) { setNotFound(true); setLoading(false); return; }
        setFormation(f);
        setForm({
          title: f.title,
          description: f.description ?? "",
          category: f.category,
          level: f.level,
          price_xof: f.price_xof,
          duration_hours: f.duration_hours,
          instructor_name: f.instructor_name,
          objectives: f.objectives?.length ? f.objectives : [""],
          requirements: f.requirements?.length ? f.requirements : [""],
          is_published: f.is_published,
        });
        setLoading(false);
      });
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const key = sessionStorage.getItem(ADMIN_KEY_STORAGE) ?? "";
    const res = await fetch("/api/gervis/formations", {
      method: "PATCH",
      headers: { "x-admin-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({
        id: params.id,
        ...form,
        objectives: form.objectives.filter(Boolean),
        requirements: form.requirements.filter(Boolean),
      }),
    });

    if (res.ok) {
      router.push("/gervis/formations");
    } else {
      const data = await res.json();
      setError(data.error ?? "Erreur lors de la sauvegarde.");
      setSaving(false);
    }
  }

  function updateArr(key: "objectives" | "requirements", i: number, value: string) {
    const arr = [...form[key]];
    arr[i] = value;
    setForm({ ...form, [key]: arr });
  }

  function removeArr(key: "objectives" | "requirements", i: number) {
    setForm({ ...form, [key]: form[key].filter((_, j) => j !== i) });
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
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center text-center px-4">
        <div>
          <p className="text-gray-500 mb-4">Formation introuvable.</p>
          <Link href="/gervis/formations" className="text-[#0A2342] font-semibold underline hover:text-[#E8861A]">
            Retour aux formations
          </Link>
        </div>
      </div>
    );
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
            <h1 className="text-2xl font-black">Modifier la formation</h1>
            <p className="text-gray-400 text-sm mt-0.5 line-clamp-1">{formation?.title}</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations générales */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <h2 className="font-black text-[#0A2342]">Informations générales</h2>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Titre *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description courte</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Catégorie *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20 bg-white"
                >
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Niveau</label>
                <select
                  value={form.level}
                  onChange={(e) => setForm({ ...form, level: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20 bg-white"
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

            <div className="flex items-center gap-3 pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                  className="w-4 h-4 rounded accent-[#059669]"
                />
                <span className="text-sm font-semibold text-gray-700">Formation publiée</span>
              </label>
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
                  onChange={(e) => updateArr("objectives", i, e.target.value)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20"
                  placeholder={`Objectif ${i + 1}`}
                />
                {form.objectives.length > 1 && (
                  <button type="button" onClick={() => removeArr("objectives", i)} className="p-2 text-red-400 hover:text-red-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => setForm({ ...form, objectives: [...form.objectives, ""] })} className="text-sm text-[#E8861A] font-semibold hover:underline">
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
                  onChange={(e) => updateArr("requirements", i, e.target.value)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20"
                  placeholder={`Prérequis ${i + 1}`}
                />
                {form.requirements.length > 1 && (
                  <button type="button" onClick={() => removeArr("requirements", i)} className="p-2 text-red-400 hover:text-red-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => setForm({ ...form, requirements: [...form.requirements, ""] })} className="text-sm text-[#E8861A] font-semibold hover:underline">
              + Ajouter un prérequis
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pb-8">
            <Link href="/gervis/formations" className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:border-gray-300 transition-colors">
              Annuler
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-[#059669] text-white text-sm font-semibold rounded-xl hover:bg-[#047857] transition-colors disabled:opacity-60"
            >
              {saving ? "Sauvegarde…" : "Enregistrer les modifications"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
