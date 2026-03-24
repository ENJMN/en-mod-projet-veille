import type { Metadata } from "next";
import { getAllTerrainsDB } from "@/lib/terrains";
import TerrainListings from "./TerrainListings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Terrains à vendre — WAYS Build",
  description:
    "Découvrez nos offres de terrains à vendre en Côte d'Ivoire. Terrains résidentiels et commerciaux avec titres fonciers. Contactez WAYS Build pour plus d'informations.",
  robots: "noindex, nofollow",
};

export default async function TerrainsPage() {
  const terrains = await getAllTerrainsDB();
  const disponibles = terrains.filter((t) => t.statut === "disponible").length;
  const prefinancement = terrains.filter((t) => t.statut === "préfinancement").length;

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Hero */}
      <section className="bg-[#0A2342] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#059669]/20 text-[#059669] text-sm font-semibold rounded-full border border-[#059669]/30">
              WAYS Build
            </span>
            <span className="text-gray-400 text-sm">
              {terrains.length} offre{terrains.length > 1 ? "s" : ""} au total
            </span>
            {disponibles > 0 && (
              <span className="px-2 py-0.5 bg-[#059669]/15 text-[#059669] text-xs font-semibold rounded-full">
                {disponibles} disponible{disponibles > 1 ? "s" : ""}
              </span>
            )}
            {prefinancement > 0 && (
              <span className="px-2 py-0.5 bg-[#E8861A]/15 text-[#E8861A] text-xs font-semibold rounded-full">
                {prefinancement} en préfinancement
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-3">Terrains à vendre</h1>
          <p className="text-gray-300 text-lg max-w-xl">
            Des opportunités foncières sélectionnées en Côte d'Ivoire — titres fonciers garantis,
            accompagnement personnalisé de A à Z.
          </p>
        </div>
      </section>

      {/* Listings + Filtres */}
      {terrains.length === 0 ? (
        <div className="text-center py-20 max-w-xl mx-auto px-4">
          <p className="text-gray-400 mb-6">Aucune offre disponible pour le moment.</p>
          <a
            href={`https://wa.me/2250705133131?text=Bonjour, je suis intéressé par vos offres de terrains.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#059669] text-white font-semibold rounded-xl hover:bg-[#059669]/90 transition-colors"
          >
            Nous contacter sur WhatsApp
          </a>
        </div>
      ) : (
        <TerrainListings terrains={terrains} />
      )}

      {/* Footer CTA */}
      <section className="bg-white border-t border-gray-100 py-12 mt-4">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-xl font-black text-[#0A2342] mb-2">
            Vous ne trouvez pas ce que vous cherchez ?
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Décrivez-nous votre projet foncier et nous vous proposerons les meilleures opportunités
            selon votre budget et votre localisation cible.
          </p>
          <a
            href={`https://wa.me/2250705133131?text=Bonjour, j'ai un projet foncier et je souhaite être accompagné par WAYS Build.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#059669] text-white font-semibold rounded-xl hover:bg-[#059669]/90 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Parler à un conseiller
          </a>
        </div>
      </section>
    </div>
  );
}
