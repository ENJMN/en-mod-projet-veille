import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "WAYS Stratégie — Conseil & Management de Projets",
  description:
    "Diagnostic stratégique, business plans, PMO, management de projets PMI/PRINCE2 et conseil aux dirigeants. WAYS Stratégie accompagne les organisations d'Abidjan.",
  openGraph: {
    title: "WAYS Stratégie — Conseil, Stratégie & Management de Projets",
    description:
      "Diagnostic stratégique, plans d'affaires, PMO et conseil aux dirigeants. Accompagnement des organisations en Côte d'Ivoire par des experts certifiés PMI/PRINCE2.",
    url: "https://ways-ci.com/services/data-dashboards",
  },
};

const prestations = [
  { icon: "🔬", title: "Diagnostic stratégique & organisationnel", description: "Analyse approfondie de votre organisation, identification des points de friction et des leviers de performance. Rapport d'audit et recommandations actionnables." },
  { icon: "📋", title: "Plans stratégiques & business plans", description: "Élaboration de votre plan stratégique pluriannuel ou de votre business plan pour levée de fonds, partenariats ou structuration interne." },
  { icon: "⚡", title: "Optimisation des processus", description: "Cartographie et optimisation de vos processus opérationnels pour améliorer l'efficacité, réduire les coûts et renforcer la qualité de service." },
  { icon: "🏛️", title: "Pilotage de projets (PMO)", description: "Mise en place et animation d'un Bureau de Gestion de Projets (PMO) pour coordonner vos initiatives transverses et sécuriser vos livrables." },
  { icon: "📐", title: "Management de projet PMI & PRINCE2", description: "Application rigoureuse des méthodologies PMI (PMBOK) et PRINCE2 pour vos projets complexes. Planification, suivi et reporting structurés." },
  { icon: "👔", title: "Advisory — Directeur Stratégique à temps partagé", description: "Un directeur stratégique senior à vos côtés 2 à 4 jours/mois. Idéal pour les dirigeants qui ont besoin d'un sparring partner de haut niveau." },
  { icon: "📊", title: "Suivi-évaluation (GAR/SEAR)", description: "Conception et mise en œuvre de dispositifs de suivi-évaluation pour vos projets et programmes selon les méthodes GAR et SEAR." },
];

export default function WaysStrategiePage() {
  return (
    <>
      <section className="bg-[#0A2342] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 bg-[#E8861A]/20 text-[#E8861A] text-sm font-semibold rounded-full mb-4 border border-[#E8861A]/30">
              BU 2
            </span>
            <h1 className="text-4xl md:text-5xl font-black mb-4">WAYS Stratégie</h1>
            <p className="text-[#E8861A] text-lg font-semibold italic mb-4">
              Conseil en stratégie d'entreprise, optimisation organisationnelle et accompagnement des dirigeants
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              Nous travaillons aux côtés des dirigeants pour structurer leur vision, optimiser leurs
              opérations et piloter leurs projets avec les standards internationaux PMI et PRINCE2.
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

      {/* Advisory offer highlight */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0A2342] text-white rounded-2xl p-10">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                <p className="text-[#E8861A] text-sm font-bold uppercase tracking-wider mb-2">Offre phare</p>
                <h2 className="text-3xl font-black mb-4">WAYS ADVISORY</h2>
                <p className="text-gray-300 leading-relaxed mb-2">
                  <strong className="text-white">Directeur Stratégique à temps partagé</strong> — 2 à 4 jours/mois
                </p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Bénéficiez d'un expert senior à vos côtés sans les contraintes d'un recrutement.
                  Idéal pour les PME qui ont besoin d'un regard stratégique de haut niveau sur leurs
                  décisions et leur développement.
                </p>
              </div>
              <div className="shrink-0">
                <Link href="/contact" className="inline-block px-6 py-3 bg-[#E8861A] text-white font-bold rounded-xl hover:bg-[#d4781a] transition-colors text-sm">
                  En savoir plus →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0A2342] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-4">Parlons de votre stratégie</h2>
          <p className="text-gray-300 mb-8">Un diagnostic stratégique offert pour les nouveaux clients. Réservez votre session de 2h avec notre équipe.</p>
          <Link href="/contact" className="inline-block px-8 py-4 bg-[#E8861A] text-white font-bold rounded-xl hover:bg-[#d4781a] transition-colors">
            Demander un diagnostic gratuit
          </Link>
        </div>
      </section>
    </>
  );
}
