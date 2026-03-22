import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "WAYS Academy & Supply — Formation Professionnelle",
  description:
    "Formations certifiantes en gestion de projet (PMI, PRINCE2), intelligence artificielle et outils digitaux. Formateur agréé FDFP. Abidjan, Côte d'Ivoire.",
  openGraph: {
    title: "WAYS Academy & Supply — Formation Professionnelle Qualifiante",
    description:
      "Programmes certifiants en gestion de projet PMI/PRINCE2, IA, suivi-évaluation et BTP. Formateur agréé FDFP — financement éligible. Abidjan, Côte d'Ivoire.",
    url: "https://ways-ci.com/services/formation",
  },
};

const formations = [
  { icon: "📐", title: "Gestion de projet (PMI, PRINCE2)", description: "Formation pratique aux méthodologies PMI (PMBOK) et PRINCE2. Préparation aux certifications, ateliers de cas concrets et coaching individuel." },
  { icon: "🤖", title: "Intelligence artificielle & outils digitaux", description: "Formation à l'utilisation de l'IA en entreprise : prompting, outils no-code, automatisation, agents IA. Des compétences immédiatement applicables." },
  { icon: "📊", title: "Suivi-évaluation de projets & programmes", description: "Maîtrise des méthodes GAR et SEAR pour la conception et le pilotage de dispositifs de suivi-évaluation. Idéal pour ONG, institutions et projets de développement." },
  { icon: "🏗️", title: "MS Project pour le BTP", description: "Formation complète à MS Project appliquée aux projets de construction : planification, ressources, suivi de chantier et reporting. Niveau débutant à avancé." },
  { icon: "🛠️", title: "Programmes sur mesure pour entreprises", description: "Conception et déploiement de programmes de formation entièrement adaptés à votre secteur, vos équipes et vos objectifs de montée en compétences." },
];

const certifications = [
  "Formateur agréé — FDFP (Fonds de Développement de la Formation Professionnelle)",
  "Méthodes PMI (PMBOK), PRINCE2, GAR/SEAR",
  "Formation en gestion de projet et ingénierie pédagogique",
];

const references = [
  { label: "Formation Gestion de Projet — LEEC", detail: "Cabinet VINCY CONSEIL — Avr. 2025 | Attestation de Bonne Exécution" },
  { label: "Formation MS Project BTP", detail: "Etoiles Services Prémium — Juin 2024" },
  { label: "Formation conduite de projets BTP", detail: "Bâtir Pour Tous — Fév. 2024" },
];

export default function WaysAcademyPage() {
  return (
    <>
      <section className="bg-[#0A2342] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 bg-[#E8861A]/20 text-[#E8861A] text-sm font-semibold rounded-full mb-4 border border-[#E8861A]/30">
              BU 4
            </span>
            <h1 className="text-4xl md:text-5xl font-black mb-4">WAYS Academy & Supply</h1>
            <p className="text-[#E8861A] text-lg font-semibold italic mb-4">
              Formation professionnelle qualifiante et fourniture de services support
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              Des formations pratiques et certifiantes pour renforcer les compétences de vos équipes —
              gestion de projet, IA, outils digitaux — dispensées par des formateurs certifiés FDFP.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#F8F9FA] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-[#0A2342] mb-10 text-center">Nos formations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {formations.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-[#0A2342] text-lg mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications & References */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-black text-[#0A2342] mb-6">Accréditations & méthodes</h2>
              <div className="space-y-3">
                {certifications.map((cert) => (
                  <div key={cert} className="flex items-start gap-3 bg-[#F8F9FA] rounded-xl p-4 border border-gray-100">
                    <span className="text-[#E8861A] font-bold shrink-0">✓</span>
                    <p className="text-gray-700 text-sm">{cert}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#0A2342] mb-6">Références récentes</h2>
              <div className="space-y-3">
                {references.map((ref) => (
                  <div key={ref.label} className="bg-[#F8F9FA] rounded-xl p-4 border border-gray-100">
                    <p className="font-bold text-[#0A2342] text-sm mb-1">{ref.label}</p>
                    <p className="text-gray-600 text-xs">{ref.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0A2342] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-4">Former vos équipes, c'est investir dans votre avenir</h2>
          <p className="text-gray-300 mb-8">Contactez-nous pour un programme de formation sur mesure adapté à vos besoins et à votre secteur.</p>
          <Link href="/contact" className="inline-block px-8 py-4 bg-[#E8861A] text-white font-bold rounded-xl hover:bg-[#d4781a] transition-colors">
            Demander un programme sur mesure
          </Link>
        </div>
      </section>
    </>
  );
}
