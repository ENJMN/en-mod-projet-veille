"use client";

import { useState, useMemo } from "react";
import { SlidersHorizontal, X, ChevronDown, LayoutList, LayoutGrid } from "lucide-react";
import type { Terrain } from "@/lib/terrains";
import {
  TRANCHES_SUPERFICIE,
  TRANCHES_BUDGET,
  TITRES_PROPRIETE,
} from "@/lib/terrains";
import TerrainCard from "./TerrainCard";

type SortKey = "date-desc" | "prix-asc" | "prix-desc" | "surface-asc" | "surface-desc";
type ViewMode = "list" | "grid";

interface Filters {
  commune: string;
  zone: string;
  superficie: string;
  budget: string;
  titres: string[];
  type_zone: "" | "balnéaire" | "intérieur";
  statut: "" | "disponible" | "réservé" | "préfinancement";
}

const EMPTY_FILTERS: Filters = {
  commune: "",
  zone: "",
  superficie: "",
  budget: "",
  titres: [],
  type_zone: "",
  statut: "",
};

export default function TerrainListings({ terrains }: { terrains: Terrain[] }) {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<SortKey>("date-desc");
  const [view, setView] = useState<ViewMode>("list");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Valeurs uniques dérivées des données
  const communes = useMemo(
    () => [...new Set(terrains.map((t) => t.commune))].sort(),
    [terrains]
  );
  const zones = useMemo(
    () => [...new Set(terrains.map((t) => t.zone))].sort(),
    [terrains]
  );

  // Filtrage
  const filtered = useMemo(() => {
    let result = [...terrains];

    if (filters.commune) result = result.filter((t) => t.commune === filters.commune);
    if (filters.zone) result = result.filter((t) => t.zone === filters.zone);
    if (filters.type_zone) result = result.filter((t) => t.type_zone === filters.type_zone);
    if (filters.statut) result = result.filter((t) => t.statut === filters.statut);

    if (filters.superficie) {
      const tranche = TRANCHES_SUPERFICIE.find((t) => t.label === filters.superficie);
      if (tranche) result = result.filter((t) => t.surface >= tranche.min && t.surface < tranche.max);
    }

    if (filters.budget) {
      const tranche = TRANCHES_BUDGET.find((t) => t.label === filters.budget);
      if (tranche) result = result.filter((t) => t.prix >= tranche.min && t.prix < tranche.max);
    }

    if (filters.titres.length > 0) {
      result = result.filter((t) => filters.titres.includes(t.titre_propriete));
    }

    // Tri
    result.sort((a, b) => {
      switch (sort) {
        case "prix-asc": return a.prix - b.prix;
        case "prix-desc": return b.prix - a.prix;
        case "surface-asc": return a.surface - b.surface;
        case "surface-desc": return b.surface - a.surface;
        case "date-desc": return new Date(b.date).getTime() - new Date(a.date).getTime();
        default: return 0;
      }
    });

    return result;
  }, [terrains, filters, sort]);

  // Nombre de filtres actifs
  const activeCount =
    (filters.commune ? 1 : 0) +
    (filters.zone ? 1 : 0) +
    (filters.superficie ? 1 : 0) +
    (filters.budget ? 1 : 0) +
    filters.titres.length +
    (filters.type_zone ? 1 : 0) +
    (filters.statut ? 1 : 0);

  function toggleTitre(t: string) {
    setFilters((f) => ({
      ...f,
      titres: f.titres.includes(t) ? f.titres.filter((x) => x !== t) : [...f.titres, t],
    }));
  }

  function resetFilters() {
    setFilters(EMPTY_FILTERS);
  }

  return (
    <div>
      {/* Barre de contrôles */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Bouton filtres */}
            <button
              onClick={() => setFiltersOpen((o) => !o)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                filtersOpen || activeCount > 0
                  ? "bg-[#0A2342] text-white border-[#0A2342]"
                  : "bg-white text-gray-700 border-gray-200 hover:border-[#0A2342]/30"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtres
              {activeCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 bg-[#E8861A] text-white text-xs rounded-full">
                  {activeCount}
                </span>
              )}
            </button>

            {/* Type zone (pills rapides) */}
            <div className="flex items-center gap-1.5">
              {(["", "balnéaire", "intérieur"] as const).map((v) => (
                <button
                  key={v || "tous"}
                  onClick={() => setFilters((f) => ({ ...f, type_zone: v }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    filters.type_zone === v
                      ? "bg-[#0A2342] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {v === "" ? "Tous" : v === "balnéaire" ? "🌊 Balnéaire" : "🏙️ Intérieur"}
                </button>
              ))}
            </div>

            {/* Séparateur */}
            <div className="hidden sm:block w-px h-6 bg-gray-200 mx-1" />

            {/* Compteur résultats */}
            <span className="text-sm text-gray-500 ml-auto mr-2">
              <span className="font-bold text-[#0A2342]">{filtered.length}</span> offre{filtered.length > 1 ? "s" : ""}
            </span>

            {/* Tri */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="appearance-none pl-3 pr-8 py-2 text-xs font-semibold border border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20 cursor-pointer"
              >
                <option value="date-desc">Plus récents</option>
                <option value="prix-asc">Prix croissant</option>
                <option value="prix-desc">Prix décroissant</option>
                <option value="surface-asc">Surface croissante</option>
                <option value="surface-desc">Surface décroissante</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>

            {/* Vue liste/grille */}
            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setView("list")}
                className={`p-1.5 rounded-md transition-colors ${view === "list" ? "bg-white shadow-sm text-[#0A2342]" : "text-gray-400 hover:text-gray-600"}`}
                title="Vue liste"
              >
                <LayoutList className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView("grid")}
                className={`p-1.5 rounded-md transition-colors ${view === "grid" ? "bg-white shadow-sm text-[#0A2342]" : "text-gray-400 hover:text-gray-600"}`}
                title="Vue grille"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Panneau filtres avancés */}
        {filtersOpen && (
          <div className="border-t border-gray-100 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Commune */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                    Commune
                  </label>
                  <div className="relative">
                    <select
                      value={filters.commune}
                      onChange={(e) => setFilters((f) => ({ ...f, commune: e.target.value }))}
                      className="w-full appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20"
                    >
                      <option value="">Toutes les communes</option>
                      {communes.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Zone géographique */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                    Zone
                  </label>
                  <div className="relative">
                    <select
                      value={filters.zone}
                      onChange={(e) => setFilters((f) => ({ ...f, zone: e.target.value }))}
                      className="w-full appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20"
                    >
                      <option value="">Toutes les zones</option>
                      {zones.map((z) => (
                        <option key={z} value={z}>{z}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Statut */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                    Disponibilité
                  </label>
                  <div className="relative">
                    <select
                      value={filters.statut}
                      onChange={(e) => setFilters((f) => ({ ...f, statut: e.target.value as Filters["statut"] }))}
                      className="w-full appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20"
                    >
                      <option value="">Tous les statuts</option>
                      <option value="disponible">Disponible</option>
                      <option value="réservé">Réservé</option>
                      <option value="préfinancement">En préfinancement</option>
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Superficie */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                    Superficie
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {TRANCHES_SUPERFICIE.map((t) => (
                      <button
                        key={t.label}
                        onClick={() => setFilters((f) => ({ ...f, superficie: f.superficie === t.label ? "" : t.label }))}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          filters.superficie === t.label
                            ? "bg-[#0A2342] text-white"
                            : "bg-white border border-gray-200 text-gray-600 hover:border-[#0A2342]/30"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                    Budget (FCFA)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {TRANCHES_BUDGET.map((t) => (
                      <button
                        key={t.label}
                        onClick={() => setFilters((f) => ({ ...f, budget: f.budget === t.label ? "" : t.label }))}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          filters.budget === t.label
                            ? "bg-[#E8861A] text-white"
                            : "bg-white border border-gray-200 text-gray-600 hover:border-[#E8861A]/30"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Titre de propriété */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                    Titre de propriété
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {TITRES_PROPRIETE.map((t) => (
                      <button
                        key={t}
                        onClick={() => toggleTitre(t)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          filters.titres.includes(t)
                            ? "bg-[#059669] text-white"
                            : "bg-white border border-gray-200 text-gray-600 hover:border-[#059669]/40"
                        }`}
                        title={t}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reset */}
              {activeCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1.5 text-sm text-red-500 font-semibold hover:text-red-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          </div>
        )}

        {/* Filtres actifs (badges) */}
        {activeCount > 0 && !filtersOpen && (
          <div className="border-t border-gray-100 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap gap-2 items-center">
              {filters.commune && (
                <ActiveBadge label={`Commune : ${filters.commune}`} onRemove={() => setFilters((f) => ({ ...f, commune: "" }))} />
              )}
              {filters.zone && (
                <ActiveBadge label={`Zone : ${filters.zone}`} onRemove={() => setFilters((f) => ({ ...f, zone: "" }))} />
              )}
              {filters.type_zone && (
                <ActiveBadge label={filters.type_zone === "balnéaire" ? "🌊 Balnéaire" : "🏙️ Intérieur"} onRemove={() => setFilters((f) => ({ ...f, type_zone: "" }))} />
              )}
              {filters.statut && (
                <ActiveBadge label={filters.statut} onRemove={() => setFilters((f) => ({ ...f, statut: "" }))} />
              )}
              {filters.superficie && (
                <ActiveBadge label={filters.superficie} onRemove={() => setFilters((f) => ({ ...f, superficie: "" }))} />
              )}
              {filters.budget && (
                <ActiveBadge label={`Budget : ${filters.budget}`} onRemove={() => setFilters((f) => ({ ...f, budget: "" }))} />
              )}
              {filters.titres.map((t) => (
                <ActiveBadge key={t} label={t} onRemove={() => toggleTitre(t)} />
              ))}
              <button onClick={resetFilters} className="text-xs text-red-400 hover:text-red-600 font-semibold ml-1">
                Tout effacer
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Résultats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-gray-500 font-semibold mb-2">Aucun terrain ne correspond à vos critères.</p>
            <button onClick={resetFilters} className="mt-4 text-sm text-[#0A2342] font-semibold underline hover:text-[#E8861A]">
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-6"}>
            {filtered.map((terrain) => (
              <TerrainCard key={terrain.id} terrain={terrain} layout={view} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ActiveBadge({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#0A2342]/10 text-[#0A2342] text-xs font-semibold rounded-full">
      {label}
      <button onClick={onRemove} className="hover:text-red-500 transition-colors">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}
