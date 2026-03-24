"use client";

import { useState } from "react";
import { MapPin, ChevronLeft, ChevronRight, Phone, Mail, Info } from "lucide-react";
import type { Terrain, TitreProprietType } from "@/lib/terrains";
import { formatPrix, formatPrixM2, TITRE_LABELS } from "@/lib/terrains";

const WHATSAPP = "2250705133131";
const PHONE = "+2250705133131";

const STATUT_CONFIG = {
  disponible: { label: "Disponible", bg: "bg-[#059669]/10", text: "text-[#059669]", dot: "bg-[#059669]" },
  réservé: { label: "Réservé", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  vendu: { label: "Vendu", bg: "bg-gray-100", text: "text-gray-500", dot: "bg-gray-400" },
  préfinancement: { label: "Préfinancement", bg: "bg-[#E8861A]/10", text: "text-[#E8861A]", dot: "bg-[#E8861A]" },
};

const TITRE_COLOR: Record<TitreProprietType, string> = {
  CF: "bg-emerald-50 text-emerald-700 border-emerald-200",
  TFA: "bg-blue-50 text-blue-700 border-blue-200",
  TFU: "bg-sky-50 text-sky-700 border-sky-200",
  ACD: "bg-violet-50 text-violet-700 border-violet-200",
  CP: "bg-yellow-50 text-yellow-700 border-yellow-200",
  CPF: "bg-orange-50 text-orange-700 border-orange-200",
  CMPF: "bg-red-50 text-red-700 border-red-200",
  Approbation: "bg-gray-50 text-gray-600 border-gray-200",
};

const VIAB_ICONS: Record<string, string> = {
  eau: "💧",
  électricité: "⚡",
  voirie: "🛣️",
  assainissement: "🔧",
  clôture: "🧱",
};

export default function TerrainCard({
  terrain,
  layout = "list",
}: {
  terrain: Terrain;
  layout?: "list" | "grid";
}) {
  const [imgIndex, setImgIndex] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const statut = STATUT_CONFIG[terrain.statut] ?? STATUT_CONFIG.disponible;
  const hasImages = terrain.images.length > 0;
  const isGrid = layout === "grid";

  const waMessage = encodeURIComponent(
    `Bonjour WAYS Build, je suis intéressé par le terrain "${terrain.titre}" (${terrain.surface} m² — ${formatPrix(terrain.prix)}) à ${terrain.localisation}. Merci de me recontacter.`
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nom,
        email: `${telephone}@terrain-lead.ways-ci.com`,
        subject: `Terrain : ${terrain.titre}`,
        message: `Téléphone : ${telephone}\n\nTerrain : ${terrain.titre}\nCommune : ${terrain.commune} — ${terrain.zone}\nSurface : ${terrain.surface} m²\nPrix : ${formatPrix(terrain.prix)}\nTitre : ${terrain.titre_propriete}\n\nMessage : ${message}`,
      }),
    });
    setSent(true);
    setLoading(false);
  }

  const ImageBlock = (
    <div
      className={`relative shrink-0 bg-gradient-to-br from-[#0A2342] to-[#059669]/30 flex items-center justify-center overflow-hidden ${
        isGrid ? "w-full h-48" : "md:w-72 min-h-48 md:min-h-full"
      }`}
    >
      {hasImages ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={terrain.images[imgIndex]}
            alt={terrain.titre}
            className="w-full h-full object-cover"
          />
          {terrain.images.length > 1 && (
            <>
              <button
                onClick={() => setImgIndex((i) => (i - 1 + terrain.images.length) % terrain.images.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setImgIndex((i) => (i + 1) % terrain.images.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {terrain.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIndex(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${i === imgIndex ? "bg-white" : "bg-white/40"}`}
                  />
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <div className="text-center p-6">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
          <p className="text-white/40 text-xs leading-snug">Photos disponibles<br />sur demande</p>
        </div>
      )}

      {/* Badge statut sur image */}
      <div className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 ${statut.bg} rounded-full border border-white/20`}>
        <span className={`w-1.5 h-1.5 rounded-full ${statut.dot}`} />
        <span className={`text-xs font-bold ${statut.text}`}>{statut.label}</span>
      </div>

      {/* GPS link */}
      {terrain.gps && (
        <a
          href={terrain.gps}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-3 right-3 w-7 h-7 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-colors"
          title="Voir sur la carte"
        >
          <MapPin className="w-3.5 h-3.5" />
        </a>
      )}
    </div>
  );

  const ContentBlock = (
    <div className="flex-1 p-5 flex flex-col gap-4">
      {/* En-tête */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <span
              className={`inline-block px-2 py-0.5 text-xs font-bold rounded border ${TITRE_COLOR[terrain.titre_propriete]}`}
              title={TITRE_LABELS[terrain.titre_propriete]}
            >
              {terrain.titre_propriete}
            </span>
            <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded bg-gray-100 text-gray-500">
              {terrain.type_zone === "balnéaire" ? "🌊 Balnéaire" : "🏙️ Intérieur"}
            </span>
            {terrain.prix_negociable && (
              <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded bg-[#E8861A]/10 text-[#E8861A]">
                Prix négociable
              </span>
            )}
            {terrain.statut === "préfinancement" && (
              <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded bg-[#E8861A]/15 text-[#E8861A] border border-[#E8861A]/30">
                ⏳ Préfinancement
              </span>
            )}
          </div>
          <h2 className="text-base font-black text-[#0A2342] leading-tight">{terrain.titre}</h2>
          <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 shrink-0" />
            <span>{terrain.commune} — {terrain.zone} · {terrain.localisation}</span>
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xl font-black text-[#0A2342] whitespace-nowrap">{formatPrix(terrain.prix)}</p>
          <p className="text-xs text-gray-400">{terrain.surface} m²</p>
          <p className="text-xs text-[#059669] font-semibold">{formatPrixM2(terrain.prix, terrain.surface)}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm leading-relaxed">{terrain.description}</p>

      {/* Viabilisation */}
      {terrain.viabilisation && terrain.viabilisation.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {terrain.viabilisation.map((v) => (
            <span key={v} className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#059669]/8 border border-[#059669]/20 text-[#059669] text-xs font-semibold rounded-lg">
              {VIAB_ICONS[v] ?? "✓"} {v}
            </span>
          ))}
        </div>
      )}

      {/* Caractéristiques */}
      {terrain.caracteristiques && terrain.caracteristiques.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {terrain.caracteristiques.map((c) => (
            <span key={c} className="px-2.5 py-1 bg-gray-50 border border-gray-100 text-gray-600 text-xs rounded-lg">
              {c}
            </span>
          ))}
        </div>
      )}

      {/* Notes libres */}
      {terrain.notes_libres && (
        <div className="border border-gray-100 rounded-xl overflow-hidden">
          <button
            onClick={() => setNotesOpen((o) => !o)}
            className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              Informations complémentaires
            </span>
            <ChevronLeft className={`w-3.5 h-3.5 transition-transform ${notesOpen ? "-rotate-90" : "rotate-180"}`} />
          </button>
          {notesOpen && (
            <div className="px-3 pb-3">
              <p className="text-xs text-gray-500 leading-relaxed">{terrain.notes_libres}</p>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mt-auto">
        <a
          href={`https://wa.me/${WHATSAPP}?text=${waMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#059669] text-white text-sm font-semibold rounded-xl hover:bg-[#059669]/90 transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          WhatsApp
        </a>

        <a
          href={`tel:${PHONE}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0A2342] text-white text-sm font-semibold rounded-xl hover:bg-[#0A2342]/90 transition-colors"
        >
          <Phone className="w-4 h-4" />
          Appeler
        </a>

        <button
          onClick={() => setFormOpen(!formOpen)}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:border-[#0A2342]/30 transition-colors"
        >
          <Mail className="w-4 h-4" />
          Être rappelé
        </button>
      </div>

      {/* Formulaire inline */}
      {formOpen && !sent && (
        <form onSubmit={handleSubmit} className="p-4 bg-[#F8F9FA] rounded-xl space-y-3 border border-gray-100">
          <p className="text-sm font-bold text-[#0A2342]">Demande de rappel — {terrain.titre}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="Votre nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20"
            />
            <input
              type="tel"
              required
              placeholder="Votre téléphone"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20"
            />
          </div>
          <textarea
            rows={2}
            placeholder="Message complémentaire (optionnel)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20 resize-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-[#0A2342] text-white text-sm font-semibold rounded-lg hover:bg-[#E8861A] transition-colors disabled:opacity-60"
          >
            {loading ? "Envoi en cours…" : "Envoyer ma demande"}
          </button>
        </form>
      )}

      {sent && (
        <div className="p-3 bg-[#059669]/10 border border-[#059669]/20 rounded-xl text-[#059669] text-sm font-semibold">
          ✓ Demande envoyée — un conseiller vous contactera rapidement.
        </div>
      )}
    </div>
  );

  if (isGrid) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
        {ImageBlock}
        {ContentBlock}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="md:flex">
        {ImageBlock}
        {ContentBlock}
      </div>
    </div>
  );
}
