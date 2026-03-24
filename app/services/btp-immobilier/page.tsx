import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "WAYS Build — BTP & Immobilier",
  description:
    "Maîtrise d'œuvre, assistance à maîtrise d'ouvrage (AMO), pilotage de chantiers, permis de construire et suivi de projets immobiliers en Côte d'Ivoire.",
  openGraph: {
    title: "WAYS Build — BTP & Immobilier | Maîtrise d'Œuvre & Gestion de Projets",
    description:
      "MOE, AMO, pilotage de chantiers et structuration de projets immobiliers en Côte d'Ivoire. Expertise terrain et outils digitaux (MS Project, Primavera P6).",
    url: "https://ways-ci.com/services/btp-immobilier",
  },
};

const prestations = [
  { icon: "🏛️", title: "Maîtrise d'œuvre & AMO", description: "Assistance à Maîtrise d'Ouvrage : représentation du client, coordination des intervenants et contrôle de la conformité technique et contractuelle de votre projet." },
  { icon: "📍", title: "Pilotage & coordination de chantier", description: "Gestion opérationnelle de vos chantiers : planning, ressources, coûts et qualité. Reporting régulier et alertes en temps réel sur les écarts." },
  { icon: "🏘️", title: "Structuration de projets immobiliers", description: "Montage et suivi de projets immobiliers (promotion, investissement) : études de faisabilité, business plan immobilier et coordination des acteurs." },
  { icon: "📄", title: "Permis de construire & réglementaire", description: "Gestion complète de vos dossiers de permis de construire. Connaissance approfondie de la réglementation ivoirienne (+300 dossiers traités)." },
  { icon: "📅", title: "Planification MS Project / Primavera P6", description: "Élaboration et mise à jour de vos plannings de projet avec les meilleurs outils du marché (MS Project, Primavera P6, GanttProject)." },
  { icon: "📊", title: "Tableaux de bord de suivi chantier", description: "Dashboards en temps réel pour suivre l'avancement physique, financier et les indicateurs clés de votre chantier depuis n'importe quel appareil." },
];

const references = [
  { label: "Formation MS Project BTP", detail: "Etoiles Services Prémium — Juin 2024" },
  { label: "Formation conduite de projets BTP", detail: "Bâtir Pour Tous — Fév. 2024" },
  { label: "Chef de projet — Méga Challenge", detail: "Groupe hôtelier & BTP | 10+ projets PMI (2020–2024)" },
  { label: "AMO Immobilier — SCI Venise", detail: "Projet SONGON — Prospection & aspects juridiques (2019–2020)" },
  { label: "Technicien Projet BTP — UCT Bénin", detail: "Pose tuyauterie 50 km + 10 chambres télécom (2018)" },
  { label: "Assistant Gérant — BEK SARL", detail: "+300 dossiers permis de construire traités (2014–2019)" },
];

export default function WaysBuildPage() {
  return (
    <>
      <section className="bg-[#0A2342] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 bg-[#E8861A]/20 text-[#E8861A] text-sm font-semibold rounded-full mb-4 border border-[#E8861A]/30">
              BU 3
            </span>
            <h1 className="text-4xl md:text-5xl font-black mb-4">WAYS Build</h1>
            <p className="text-[#E8861A] text-lg font-semibold italic mb-4">
              Maîtrise d'œuvre, gestion et coordination de projets BTP et immobiliers
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              Plus de 10 ans d'expérience terrain en BTP et immobilier en Côte d'Ivoire
              et en Afrique de l'Ouest. Du permis de construire au suivi de chantier digitalisé.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#F8F9FA] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-[#0A2342] mb-10 text-center">Nos prestations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prestations.map((s) => (
              <div key={s.title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">{s.icon}</div>
                <h3 className="font-bold text-[#0A2342] text-lg mb-2">{s.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* References */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-[#0A2342] mb-10 text-center">Références & Missions réalisées</h2>
          <div className="space-y-3">
            {references.map((ref) => (
              <div key={ref.label} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 bg-[#F8F9FA] rounded-xl px-6 py-4 border border-gray-100">
                <p className="font-bold text-[#0A2342] text-sm sm:w-64 shrink-0">{ref.label}</p>
                <p className="text-gray-600 text-sm">{ref.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Terrain CTA */}
      <section className="bg-[#059669]/10 border-y border-[#059669]/20 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-xs font-semibold text-[#059669] uppercase tracking-wide mb-1">Opportunités foncières</p>
              <h2 className="text-xl font-black text-[#0A2342]">Terrains à vendre en Côte d'Ivoire</h2>
              <p className="text-gray-600 text-sm mt-1">Titres fonciers garantis — résidentiel & commercial</p>
            </div>
            <Link
              href="/terrains"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-[#059669] text-white font-semibold rounded-xl hover:bg-[#059669]/90 transition-colors text-sm"
            >
              Voir les offres disponibles →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#0A2342] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-4">Un projet de construction ou d'investissement immobilier ?</h2>
          <p className="text-gray-300 mb-8">Bénéficiez de l'expérience terrain de WAYS pour sécuriser et optimiser votre projet.</p>
          <Link href="/contact" className="inline-block px-8 py-4 bg-[#E8861A] text-white font-bold rounded-xl hover:bg-[#d4781a] transition-colors">
            Discuter de mon projet
          </Link>
        </div>
      </section>
    </>
  );
}
