import terrainsData from "@/content/terrains.json";
import { createAdminClient } from "@/lib/supabase/admin";

/** Lecture depuis Supabase (pages server-side en production) */
export async function getAllTerrainsDB(): Promise<Terrain[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("terrains")
    .select("*")
    .eq("disponible", true)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[terrains] Supabase error:", error.message);
    return [];
  }
  return (data ?? []) as Terrain[];
}

export type TitreProprietType =
  | "CF"
  | "TFA"
  | "TFU"
  | "CP"
  | "CPF"
  | "CMPF"
  | "ACD"
  | "Approbation";

export type TypeZone = "balnéaire" | "intérieur";
export type StatutTerrain = "disponible" | "réservé" | "vendu" | "préfinancement";

export interface Terrain {
  id: string;
  titre: string;
  zone: string;              // Grande zone géo : "Abidjan", "Grand-Bassam", "Assinie"…
  commune: string;           // Commune précise : "Cocody", "Yopougon", "Bassam"…
  localisation: string;      // Description d'accès détaillée
  surface: number;           // m²
  prix: number;              // FCFA
  prix_negociable?: boolean;
  description: string;
  notes_libres?: string;     // Informations complémentaires libres
  titre_propriete: TitreProprietType;
  type_zone: TypeZone;
  viabilisation?: string[];  // "eau", "électricité", "voirie", "assainissement", "clôture"
  caracteristiques?: string[];
  images: string[];          // URLs (peut être vide, photos à venir)
  gps?: string;              // Lien Google Maps ou coordonnées GPS
  disponible: boolean;       // false = retiré du site
  statut: StatutTerrain;
  date: string;
}

export function getAllTerrains(): Terrain[] {
  return (terrainsData as Terrain[]).filter((t) => t.disponible);
}

export function getTerrainById(id: string): Terrain | undefined {
  return (terrainsData as Terrain[]).find((t) => t.id === id);
}

export function formatPrix(prix: number): string {
  if (prix >= 1_000_000_000) {
    return (prix / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + " Mrd FCFA";
  }
  if (prix >= 1_000_000) {
    return (prix / 1_000_000).toFixed(1).replace(/\.0$/, "") + " M FCFA";
  }
  return new Intl.NumberFormat("fr-FR").format(prix) + " FCFA";
}

export function formatPrixM2(prix: number, surface: number): string {
  const prixM2 = Math.round(prix / surface);
  return new Intl.NumberFormat("fr-FR").format(prixM2) + " FCFA/m²";
}

export const TRANCHES_SUPERFICIE = [
  { label: "< 400 m²", min: 0, max: 400 },
  { label: "400 – 600 m²", min: 400, max: 600 },
  { label: "600 – 1 000 m²", min: 600, max: 1000 },
  { label: "1 000 – 2 000 m²", min: 1000, max: 2000 },
  { label: "2 000 m² et +", min: 2000, max: Infinity },
] as const;

export const TRANCHES_BUDGET = [
  { label: "< 10 M", min: 0, max: 10_000_000 },
  { label: "10 – 25 M", min: 10_000_000, max: 25_000_000 },
  { label: "25 – 50 M", min: 25_000_000, max: 50_000_000 },
  { label: "50 – 100 M", min: 50_000_000, max: 100_000_000 },
  { label: "> 100 M", min: 100_000_000, max: Infinity },
] as const;

export const TITRES_PROPRIETE: TitreProprietType[] = [
  "CF", "TFA", "TFU", "CP", "CPF", "CMPF", "ACD", "Approbation",
];

export const TITRE_LABELS: Record<TitreProprietType, string> = {
  CF: "Certificat Foncier",
  TFA: "Titre Foncier Administratif",
  TFU: "Titre Foncier Urbain",
  CP: "Concession Provisoire",
  CPF: "Concession Provisoire Foncière",
  CMPF: "Concession en Milieu Périurbain et Foncier",
  ACD: "Arrêté de Concession Définitive",
  Approbation: "Approbation de Lotissement",
};
