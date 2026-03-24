"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { TITRES_PROPRIETE, TITRE_LABELS } from "@/lib/terrains";
import ImageUpload from "@/components/ImageUpload";

const VIAB_OPTIONS = ["eau", "électricité", "voirie", "assainissement", "clôture"];

interface TerrainFormData {
  titre: string;
  zone: string;
  commune: string;
  localisation: string;
  surface: string;
  prix: string;
  prix_negociable: boolean;
  description: string;
  notes_libres: string;
  titre_propriete: string;
  type_zone: string;
  viabilisation: string[];
  caracteristiques: string[];
  images: string[];
  gps: string;
  statut: string;
}

const EMPTY_FORM: TerrainFormData = {
  titre: "",
  zone: "",
  commune: "",
  localisation: "",
  surface: "",
  prix: "",
  prix_negociable: false,
  description: "",
  notes_libres: "",
  titre_propriete: "CF",
  type_zone: "intérieur",
  viabilisation: [],
  caracteristiques: [],
  images: [],
  gps: "",
  statut: "disponible",
};

interface Props {
  mode: "create" | "edit";
  initialData?: Partial<TerrainFormData> & { id?: string };
  adminKey: string;
}

export default function TerrainForm({ mode, initialData, adminKey }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<TerrainFormData>({
    ...EMPTY_FORM,
    ...initialData,
    surface: initialData?.surface?.toString() ?? "",
    prix: initialData?.prix?.toString() ?? "",
    viabilisation: initialData?.viabilisation ?? [],
    caracteristiques: initialData?.caracteristiques ?? [],
    images: initialData?.images ?? [],
  });
  const [caraInput, setCaraInput] = useState("");
  const [imageInput, setImageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof TerrainFormData>(key: K, value: TerrainFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleViab(v: string) {
    set("viabilisation", form.viabilisation.includes(v) ? form.viabilisation.filter((x) => x !== v) : [...form.viabilisation, v]);
  }

  function addCara() {
    const v = caraInput.trim();
    if (v && !form.caracteristiques.includes(v)) {
      set("caracteristiques", [...form.caracteristiques, v]);
    }
    setCaraInput("");
  }

  function addImage() {
    const v = imageInput.trim();
    if (v && !form.images.includes(v)) {
      set("images", [...form.images, v]);
    }
    setImageInput("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      ...form,
      surface: Number(form.surface),
      prix: Number(form.prix),
      ...(mode === "edit" && initialData?.id ? { id: initialData.id } : {}),
    };

    const res = await fetch("/api/gervis/terrains", {
      method: mode === "create" ? "POST" : "PATCH",
      headers: { "x-admin-key": adminKey, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/gervis/terrains");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Une erreur est survenue.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Section 1 — Identification */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-base font-black text-[#0A2342] mb-5">Identification</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-500 mb-1.5">Titre de l'annonce *</label>
            <input
              required
              type="text"
              value={form.titre}
              onChange={(e) => set("titre", e.target.value)}
              placeholder="ex: Terrain résidentiel — Cocody Riviera 3"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">Zone géographique *</label>
            <input
              required
              type="text"
              value={form.zone}
              onChange={(e) => set("zone", e.target.value)}
              placeholder="ex: Abidjan, Grand-Bassam, Assinie"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">Commune *</label>
            <input
              required
              type="text"
              value={form.commune}
              onChange={(e) => set("commune", e.target.value)}
              placeholder="ex: Cocody, Yopougon, Bassam"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-500 mb-1.5">Localisation précise *</label>
            <input
              required
              type="text"
              value={form.localisation}
              onChange={(e) => set("localisation", e.target.value)}
              placeholder="ex: Riviera 3, près du carrefour Akwaba"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">Lien Google Maps (optionnel)</label>
            <input
              type="url"
              value={form.gps}
              onChange={(e) => set("gps", e.target.value)}
              placeholder="https://maps.google.com/..."
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20"
            />
          </div>
        </div>
      </section>

      {/* Section 2 — Caractéristiques */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-base font-black text-[#0A2342] mb-5">Caractéristiques</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">Surface (m²) *</label>
            <input
              required
              type="number"
              min="1"
              value={form.surface}
              onChange={(e) => set("surface", e.target.value)}
              placeholder="600"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">Prix (FCFA) *</label>
            <input
              required
              type="number"
              min="0"
              value={form.prix}
              onChange={(e) => set("prix", e.target.value)}
              placeholder="45000000"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20"
            />
          </div>

          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.prix_negociable}
                onChange={(e) => set("prix_negociable", e.target.checked)}
                className="w-4 h-4 rounded accent-[#E8861A]"
              />
              <span className="text-sm font-semibold text-gray-700">Prix négociable</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">Titre de propriété *</label>
            <select
              required
              value={form.titre_propriete}
              onChange={(e) => set("titre_propriete", e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20 bg-white"
            >
              {TITRES_PROPRIETE.map((t) => (
                <option key={t} value={t}>{t} — {TITRE_LABELS[t]}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">Type de zone *</label>
            <select
              required
              value={form.type_zone}
              onChange={(e) => set("type_zone", e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20 bg-white"
            >
              <option value="intérieur">🏙️ Intérieur des terres</option>
              <option value="balnéaire">🌊 Balnéaire</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">Statut *</label>
            <select
              required
              value={form.statut}
              onChange={(e) => set("statut", e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20 bg-white"
            >
              <option value="disponible">✅ Disponible</option>
              <option value="réservé">🟡 Réservé</option>
              <option value="préfinancement">⏳ En préfinancement</option>
              <option value="vendu">🔴 Vendu</option>
            </select>
          </div>
        </div>

        {/* Viabilisation */}
        <div className="mt-5">
          <label className="block text-xs font-bold text-gray-500 mb-2.5">Viabilisation disponible</label>
          <div className="flex flex-wrap gap-2">
            {VIAB_OPTIONS.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => toggleViab(v)}
                className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-colors border ${
                  form.viabilisation.includes(v)
                    ? "bg-[#059669] text-white border-[#059669]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#059669]/40"
                }`}
              >
                {v === "eau" ? "💧" : v === "électricité" ? "⚡" : v === "voirie" ? "🛣️" : v === "assainissement" ? "🔧" : "🧱"} {v}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 — Description */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-base font-black text-[#0A2342] mb-5">Description</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">Description principale *</label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Décrivez le terrain : état, environnement, potentiel, accès…"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20 resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">
              Informations libres <span className="font-normal text-gray-400">(optionnel)</span>
            </label>
            <textarea
              rows={3}
              value={form.notes_libres}
              onChange={(e) => set("notes_libres", e.target.value)}
              placeholder="Conditions de vente, délais, conditions de visite, documents disponibles…"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20 resize-none"
            />
          </div>
        </div>
      </section>

      {/* Section 4 — Caractéristiques libres */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-base font-black text-[#0A2342] mb-5">Tags / Caractéristiques</h2>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={caraInput}
            onChange={(e) => setCaraInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCara(); } }}
            placeholder="ex: Terrain plat, Bornage effectué…"
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20"
          />
          <button
            type="button"
            onClick={addCara}
            className="px-4 py-2 bg-[#0A2342] text-white text-sm font-semibold rounded-xl hover:bg-[#E8861A] transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {form.caracteristiques.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {form.caracteristiques.map((c) => (
              <span key={c} className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg">
                {c}
                <button type="button" onClick={() => set("caracteristiques", form.caracteristiques.filter((x) => x !== c))}>
                  <X className="w-3.5 h-3.5 text-gray-400 hover:text-red-500 transition-colors" />
                </button>
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Section 5 — Images */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-base font-black text-[#0A2342] mb-1">Images</h2>
        <p className="text-xs text-gray-400 mb-4">Upload directement depuis votre appareil ou collez une URL.</p>
        <div className="mb-4">
          <ImageUpload
            value=""
            onChange={(url) => { if (url && !form.images.includes(url)) set("images", [...form.images, url]); }}
            folder="terrains"
            label="Ajouter une photo"
          />
        </div>
        <div className="flex gap-2 mb-3">
          <input
            type="url"
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImage(); } }}
            placeholder="Ou collez une URL https://..."
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20"
          />
          <button
            type="button"
            onClick={addImage}
            className="px-4 py-2 bg-[#0A2342] text-white text-sm font-semibold rounded-xl hover:bg-[#E8861A] transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {form.images.length > 0 ? (
          <div className="space-y-2">
            {form.images.map((url, i) => (
              <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="w-12 h-10 object-cover rounded-md shrink-0 bg-gray-200" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                <span className="flex-1 text-xs text-gray-500 truncate font-mono">{url}</span>
                <button type="button" onClick={() => set("images", form.images.filter((_, j) => j !== i))}>
                  <X className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic">Aucune image — un placeholder sera affiché sur la fiche publique.</p>
        )}
      </section>

      {/* Actions */}
      <div className="flex items-center gap-3 justify-end pb-8">
        <button
          type="button"
          onClick={() => router.push("/gervis/terrains")}
          className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:border-gray-300 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-[#059669] text-white text-sm font-semibold rounded-xl hover:bg-[#047857] transition-colors disabled:opacity-60"
        >
          {loading ? "Enregistrement…" : mode === "create" ? "Créer l'offre" : "Enregistrer les modifications"}
        </button>
      </div>
    </form>
  );
}
