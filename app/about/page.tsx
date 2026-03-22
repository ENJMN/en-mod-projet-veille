import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Découvrez WAYS, premier cabinet de conseil opérationnel à intelligence augmentée d'Afrique de l'Ouest. Mission, vision, valeurs et fondateur.",
  openGraph: {
    title: "À propos — WAYS Digital Solutions",
    description:
      "Premier cabinet de conseil opérationnel à intelligence augmentée d'Afrique de l'Ouest. Fondé par N'Guessan Jacques EBAKA, WAYS accompagne les organisations vers l'excellence.",
    url: "https://ways-ci.com/about",
  },
};

const values = [
  {
    icon: "⭐",
    title: "Excellence",
    description: "Qualité irréprochable dans chaque mission. Nous appliquons les standards internationaux (PMI, PRINCE2) avec un niveau d'exigence constant.",
  },
  {
    icon: "🎯",
    title: "Engagement",
    description: "Résultats mesurables et concrets. Nous ne conseillons pas seulement — nous agissons, transformons et mesurons notre impact à chaque étape.",
  },
  {
    icon: "💡",
    title: "Innovation",
    description: "IA et méthodes de pointe intégrées. Nous exploitons les meilleures technologies disponibles pour délivrer des solutions différenciantes.",
  },
  {
    icon: "🤝",
    title: "Intégrité",
    description: "Transparence et éthique professionnelle. Chaque relation avec nos clients est fondée sur la confiance, l'honnêteté et le respect des engagements.",
  },
];

const expertise = [
  {
    category: "Gestion & Management de Projet",
    items: ["PMI (PMBOK), PRINCE2, GAR/SEAR", "MS Project, Primavera P6, GanttProject", "Montage de projets complexes", "Suivi-évaluation et reporting"],
  },
  {
    category: "Conseil & Transformation Organisationnelle",
    items: ["Diagnostic organisationnel", "Conduite du changement", "Structuration des opérations", "Animation d'ateliers collaboratifs"],
  },
  {
    category: "Formation Professionnelle",
    items: ["Formateur agréé FDFP", "Formation en gestion de projet", "Ingénierie pédagogique"],
  },
  {
    category: "BTP, Immobilier & Digital",
    items: ["Maîtrise d'œuvre et AMO", "Gestion permis et aspects réglementaires", "Intégration ERP/CRM (Dolibarr)", "Intégration solutions No-Code & Low-Code", "Automatisation IA", "Développement web (HTML, CSS, JavaScript)"],
  },
];

const milestones = [
  {
    year: "2014–2019",
    title: "Terrain & Expertise BTP",
    description: "+300 dossiers de permis de construire traités. Missions BTP en Côte d'Ivoire et au Bénin (tuyauterie 50 km, infrastructures télécom).",
  },
  {
    year: "2019–2020",
    title: "AMO Immobilier",
    description: "Assistance à Maîtrise d'Ouvrage — Projet SONGON (SCI Venise). Prospection foncière et coordination des aspects juridiques.",
  },
  {
    year: "2020–2024",
    title: "Chef de Projet Sénior",
    description: "Pilotage de 10+ projets selon les standards PMI au sein d'un groupe hôtelier & BTP (Méga Challenge). Transformation organisationnelle à grande échelle.",
  },
  {
    year: "2026",
    title: "Création de WAYS",
    description: "Fondation de WAYS — We Act for Your Success — née de la transformation de WAS GROUPE CI, avec une vision claire : le conseil opérationnel à intelligence augmentée.",
  },
];

const certifications = [
  { label: "Master Management des Org. & Projets", detail: "CERAP / Université Jésuite — Abidjan (2023–2025)" },
  { label: "Formateur agréé", detail: "FDFP — Côte d'Ivoire" },
  { label: "Préparation PRINCE2 Foundation & Pract.", detail: "Cabinet MIT Institute — Abidjan (2025)" },
  { label: "Certificat Consultant / Formateur", detail: "KEN'S COMPANY — Abidjan (2024) — Agréé FDFP" },
  { label: "Formation Développement Web", detail: "GoMyCode Abidjan (2024) — HTML, CSS, JS, Git" },
  { label: "Membre actif", detail: "PMI Chapitre Côte d'Ivoire" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#0A2342] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 bg-[#E8861A]/20 text-[#E8861A] text-sm font-semibold rounded-full mb-4 border border-[#E8861A]/30">
              Qui sommes-nous
            </span>
            <h1 className="text-4xl md:text-5xl font-black mb-6">
              À propos de WAYS
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              WAYS est le <strong className="text-white">premier cabinet de conseil opérationnel à intelligence augmentée
              d'Afrique de l'Ouest</strong>. Fondé en 2026 à Abidjan, il est né de la transformation
              de WAS GROUPE CI avec une ambition claire : aller au-delà du conseil classique.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Nous ne conseillons pas seulement — nous transformons et nous exécutons.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-[#F8F9FA] rounded-2xl border-l-4 border-[#0A2342]">
              <h2 className="text-2xl font-black text-[#0A2342] mb-4">Notre Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                WAYS accompagne les entreprises, institutions et porteurs de projets dans leur
                transformation stratégique, digitale et opérationnelle, en leur apportant des
                solutions concrètes, mesurables et durables — <strong>adaptées au contexte africain,
                avec des standards internationaux.</strong>
              </p>
            </div>
            <div className="p-8 bg-[#F8F9FA] rounded-2xl border-l-4 border-[#E8861A]">
              <h2 className="text-2xl font-black text-[#0A2342] mb-4">Notre Vision 2035</h2>
              <p className="text-gray-600 leading-relaxed italic">
                "D'ici 2035, WAYS sera le cabinet de référence en Afrique francophone pour la
                transformation stratégique et opérationnelle des organisations — reconnu pour son
                modèle unique alliant intelligence artificielle, conseil de haut niveau et
                exécution terrain."
              </p>
            </div>
          </div>

          {/* Positioning */}
          <div className="mt-8 p-8 bg-[#0A2342] text-white rounded-2xl">
            <div className="max-w-3xl">
              <p className="text-[#E8861A] text-sm font-bold uppercase tracking-wider mb-3">Notre positionnement</p>
              <p className="text-xl font-bold mb-3">
                Ancrage local (Côte d'Ivoire / Afrique de l'Ouest) + Standards internationaux (PMI, PRINCE2, IA)
              </p>
              <p className="text-gray-300 leading-relaxed">
                Combinaison unique en Afrique de l'Ouest : IA + Conseil stratégique + Maîtrise d'œuvre BTP.
                Des méthodes internationales adaptées au contexte africain, portées par un fondateur
                opérateur capable d'intervenir sur plusieurs pôles simultanément.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="bg-[#F8F9FA] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-[#0A2342] mb-4">
              Notre équipe
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Une équipe jeune, dynamique et passionnée, menée par un fondateur opérateur
              et renforcée par un réseau de consultants et formateurs spécialisés.
            </p>
          </div>

          {/* Founder card */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-shrink-0 text-center">
                  <div className="w-24 h-24 rounded-2xl bg-[#0A2342] text-white font-black text-2xl flex items-center justify-center mx-auto mb-3">
                    NJE
                  </div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Fondateur</p>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-[#0A2342] mb-1">N'Guessan Jacques EBAKA</h3>
                  <p className="text-[#E8861A] font-semibold mb-4">Fondateur & Directeur Général — WAYS</p>
                  <p className="text-gray-500 text-sm italic mb-4">
                    Ingénieur Projets | Consultant Formateur | Expert en Management des Organisations
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Avec plus de 10 années d'expérience dans la gestion de projets complexes,
                    la transformation organisationnelle et la formation professionnelle, Jacques est un
                    expert reconnu dans le management de projet, la stratégie d'entreprise et
                    l'intégration de solutions digitales.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Membre actif du <strong>PMI Chapitre Côte d'Ivoire</strong>, il maîtrise les méthodologies
                    PMI, PRINCE2 et GAR, et les applique avec pragmatisme dans des contextes africains variés
                    (BTP, hôtellerie, immobilier, services professionnels). Formateur agréé <strong>FDFP</strong> (Côte d'Ivoire), il conçoit et anime des programmes de formation
                    sur mesure pour les entreprises et institutions.
                  </p>

                  {/* Certifications */}
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {certifications.map((cert) => (
                      <div key={cert.label} className="flex items-start gap-2">
                        <span className="text-[#E8861A] mt-1 shrink-0">✓</span>
                        <div>
                          <span className="text-sm font-semibold text-[#0A2342]">{cert.label}</span>
                          <span className="text-xs text-gray-500 block">{cert.detail}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Young team message */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
              <div className="text-3xl mb-3">👥</div>
              <h4 className="font-bold text-[#0A2342] mb-2">Consultants Associés</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Un réseau de consultants spécialisés mobilisés selon les besoins de chaque mission.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
              <div className="text-3xl mb-3">🎓</div>
              <h4 className="font-bold text-[#0A2342] mb-2">Formateurs Certifiés</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Des formateurs agréés FDFP, passionnés par la transmission et l'impact pédagogique.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
              <div className="text-3xl mb-3">🤝</div>
              <h4 className="font-bold text-[#0A2342] mb-2">Partenaires Stratégiques</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                PMI CI, CERAP, FDFP et cabinets partenaires pour absorber les projets d'envergure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise domains */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-[#0A2342] mb-4">
              Domaines d'expertise
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Une maîtrise pluridisciplinaire rare — combinant IA, stratégie, BTP et formation
              au sein d'un seul cabinet opérationnel.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {expertise.map((domain) => (
              <div key={domain.category} className="p-6 bg-[#F8F9FA] rounded-2xl border border-gray-100">
                <h3 className="font-bold text-[#0A2342] text-sm mb-4 leading-tight">{domain.category}</h3>
                <ul className="space-y-2">
                  {domain.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-gray-600 text-sm">
                      <span className="text-[#E8861A] shrink-0 mt-0.5">▸</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#F8F9FA] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-[#0A2342] mb-4">
              Nos valeurs
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Les principes qui guident chacune de nos missions.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="p-6 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="text-3xl mb-4">{value.icon}</div>
                <h3 className="font-bold text-[#0A2342] text-lg mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-[#0A2342] mb-4">
              Notre parcours
            </h2>
            <p className="text-gray-600">
              Plus de 10 ans d'expérience terrain qui fondent l'expertise de WAYS.
            </p>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 md:left-1/2" />
            <div className="space-y-10">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.year}
                  className={`relative flex flex-col md:flex-row gap-6 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="flex-1 pl-14 md:pl-0 md:pr-10">
                    {index % 2 === 0 ? (
                      <div className="bg-[#F8F9FA] rounded-2xl p-6 border border-gray-100">
                        <span className="inline-block px-3 py-1 bg-[#E8861A]/10 text-[#E8861A] text-sm font-bold rounded-full mb-2">
                          {milestone.year}
                        </span>
                        <h3 className="font-bold text-[#0A2342] text-lg mb-2">{milestone.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{milestone.description}</p>
                      </div>
                    ) : (
                      <div className="hidden md:block" />
                    )}
                  </div>

                  <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-6 w-4 h-4 rounded-full bg-[#0A2342] border-4 border-[#E8861A] z-10" />

                  <div className="flex-1 pl-14 md:pl-10">
                    {index % 2 !== 0 ? (
                      <div className="bg-[#F8F9FA] rounded-2xl p-6 border border-gray-100">
                        <span className="inline-block px-3 py-1 bg-[#E8861A]/10 text-[#E8861A] text-sm font-bold rounded-full mb-2">
                          {milestone.year}
                        </span>
                        <h3 className="font-bold text-[#0A2342] text-lg mb-2">{milestone.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{milestone.description}</p>
                      </div>
                    ) : (
                      <div className="hidden md:block" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0A2342] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black mb-4">
            Travaillons ensemble
          </h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Vous avez un projet de transformation digitale, de formation ou de construction ?
            Parlons-en — la première consultation est gratuite.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-[#E8861A] text-white font-bold rounded-xl hover:bg-[#d4781a] transition-colors"
          >
            Prendre contact
          </Link>
        </div>
      </section>
    </>
  );
}
