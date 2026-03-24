import type { Metadata } from "next";
import Link from "next/link";
import ServiceCard from "@/components/ServiceCard";
import BlogCard from "@/components/BlogCard";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "WAYS Digital Solutions — We Act for Your Success",
  description:
    "Cabinet de conseil opérationnel à intelligence augmentée à Abidjan. WAYS accompagne les PME et organisations en Côte d'Ivoire : IA, stratégie, BTP et formation.",
  openGraph: {
    title: "WAYS Digital Solutions — We Act for Your Success",
    description:
      "Premier cabinet de conseil opérationnel à intelligence augmentée d'Afrique de l'Ouest. IA & Digital, Stratégie, BTP, Formation — Abidjan, Côte d'Ivoire.",
    url: "https://ways-ci.com",
  },
};

const services = [
  {
    icon: "🤖",
    title: "WAYS IA & Digital",
    description:
      "Audit, automatisation et intégration de solutions à intelligence artificielle. Déploiement d'agents IA, ERP/CRM (Dolibarr), transformation digitale globale.",
    href: "/services/consulting",
  },
  {
    icon: "♟️",
    title: "WAYS Stratégie",
    description:
      "Conseil en stratégie d'entreprise, plans stratégiques, business plans, PMO et management de projets selon les standards PMI et PRINCE2.",
    href: "/services/data-dashboards",
  },
  {
    icon: "🏗️",
    title: "WAYS Build",
    description:
      "Maîtrise d'œuvre, coordination de projets BTP et immobiliers, AMO, permis de construire et tableaux de bord de suivi chantier.",
    href: "/services/btp-immobilier",
  },
  {
    icon: "🎓",
    title: "WAYS Academy & Supply",
    description:
      "Formation professionnelle qualifiante : gestion de projet (PMI, PRINCE2), intelligence artificielle, outils digitaux et formation de formateurs (FDFP agréé).",
    href: "/services/formation",
  },
];

const whyWays = [
  {
    icon: "⚡",
    title: "Expertise No-Code & IA",
    description:
      "Maîtrise des meilleurs outils d'automatisation (n8n, Make, Zapier) et d'intelligence artificielle pour des résultats rapides et durables.",
  },
  {
    icon: "🤝",
    title: "Approche sur mesure",
    description:
      "Chaque mission est unique. Nous co-construisons avec vous des solutions adaptées à votre réalité africaine et à vos objectifs de croissance.",
  },
  {
    icon: "🌍",
    title: "Ancré en Côte d'Ivoire",
    description:
      "Basés à Abidjan, nous comprenons les enjeux locaux et accompagnons les entreprises ivoiriennes vers l'excellence digitale.",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Audit & Diagnostic",
    description:
      "Analyse approfondie de vos processus actuels, identification des opportunités de digitalisation et évaluation de votre maturité numérique.",
    color: "bg-[#E8861A]",
  },
  {
    number: "02",
    title: "Stratégie & Plan d'action",
    description:
      "Définition d'une feuille de route personnalisée avec les outils adaptés, les KPIs mesurables et un calendrier réaliste.",
    color: "bg-[#0A2342]",
  },
  {
    number: "03",
    title: "Déploiement & Mise en œuvre",
    description:
      "Implémentation des solutions retenues, formation de vos équipes et accompagnement au changement pour une adoption réussie.",
    color: "bg-[#E8861A]",
  },
  {
    number: "04",
    title: "Suivi & Optimisation",
    description:
      "Monitoring continu des performances, ajustements itératifs et support post-déploiement pour garantir un ROI maximal.",
    color: "bg-[#0A2342]",
  },
];

const testimonials = [
  {
    name: "Mme Adou",
    role: "Apprenante",
    company: "Formation MS Project",
    quote: "La formation MS Project m'a permis de piloter mes projets avec beaucoup plus de rigueur. Très pratique et directement applicable. Je recommande vivement !",
    initials: "A",
  },
  {
    name: "Mlle Aimée",
    role: "Apprenante",
    company: "WAYS Academy",
    quote: "Une formation de qualité, concrète et bien animée. J'ai acquis des compétences que j'utilise au quotidien. Merci à toute l'équipe WAYS !",
    initials: "A",
  },
  {
    name: "M. Konan",
    role: "Gérant",
    company: "Cabinet de formation",
    quote: "Un formateur passionné et sachant transmettre.",
    initials: "K",
  },
  {
    name: "Gérant",
    role: "Dirigeant",
    company: "Optinov Immobilier SARLU",
    quote: "WAYS et son équipe sont des partenaires sûrs qui cernent et proposent des solutions adaptées aux besoins de leurs clients.",
    initials: "O",
  },
];

const partenaires = [
  "LEEC",
  "Cabinet VINCY CONSEIL",
  "Optinov SARLU",
  "Etoiles Services Premium",
  "Approbat Services",
];

const blogPosts = [
  {
    slug: "automatisation-pme-abidjan",
    title: "Automatisation des PME à Abidjan : par où commencer ?",
    date: "2026-01-15",
    author: "ENJ",
    excerpt:
      "Beaucoup de dirigeants ivoiriens savent qu'ils devraient automatiser leurs processus, mais ne savent pas par où commencer. Voici une méthode simple et éprouvée pour franchir le cap.",
    category: "IA & Digital",
  },
  {
    slug: "nocode-outils-entreprises-afrique",
    title: "No-Code & IA : les outils qui changent la donne pour les entreprises africaines",
    date: "2026-02-05",
    author: "ENJ",
    excerpt:
      "Le No-Code et l'intelligence artificielle démocratisent l'accès à la technologie. Voici les outils concrets que les entreprises africaines peuvent adopter dès aujourd'hui.",
    category: "Formation",
  },
  {
    slug: "tableau-bord-kpi-btp",
    title: "Tableau de bord KPI pour les projets BTP : pilotez votre chantier en temps réel",
    date: "2026-02-20",
    author: "ENJ",
    excerpt:
      "Les dépassements de budget et les retards de chantier coûtent des millions aux promoteurs ivoiriens. Un tableau de bord KPI bien conçu peut transformer votre manière de piloter.",
    category: "BTP",
  },
];

export default async function HomePage() {
  const supabase = createAdminClient();

  type TemoignageRow = { id: string; prenom: string; role: string | null; entreprise: string | null; citation: string; ordre: number };
  type PartenaireRow = { id: string; nom: string; logo_url: string | null; ordre: number };

  const [{ data: temoignagesDB }, { data: partenairesDB }] = await Promise.all([
    supabase.from("temoignages").select("id, prenom, role, entreprise, citation, ordre").eq("is_published", true).order("ordre"),
    supabase.from("partenaires").select("id, nom, logo_url, ordre").eq("is_published", true).order("ordre"),
  ]);

  const displayTestimonials = temoignagesDB && temoignagesDB.length > 0
    ? (temoignagesDB as TemoignageRow[]).map(t => ({
        name: t.prenom,
        role: t.role ?? "",
        company: t.entreprise ?? "",
        quote: t.citation,
        initials: t.prenom.slice(0, 1).toUpperCase(),
      }))
    : testimonials;

  const displayPartenaires = partenairesDB && partenairesDB.length > 0
    ? (partenairesDB as PartenaireRow[]).map(p => ({ nom: p.nom, logo_url: p.logo_url }))
    : partenaires.map(nom => ({ nom, logo_url: null }));

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-[#0A2342] text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A2342] via-[#0d2d56] to-[#0A2342] opacity-90" />
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-[#E8861A] blur-3xl opacity-5 pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-white blur-3xl opacity-5 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 bg-[#E8861A]/20 text-[#E8861A] text-sm font-semibold rounded-full mb-6 border border-[#E8861A]/30">
              Agence de transformation digitale — Abidjan, Côte d'Ivoire
            </span>
            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6 tracking-tight">
              We Act for{" "}
              <span className="text-[#E8861A]">Your Success.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-10 max-w-2xl">
              WAYS accompagne les PME, startups et organisations de Côte d'Ivoire
              dans leur transformation digitale. Automatisation, formation No-Code,
              BTP et Data — une expertise complète à votre service.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/services/consulting"
                className="px-6 py-3 bg-[#E8861A] text-white font-semibold rounded-xl hover:bg-[#d4781a] transition-colors text-sm md:text-base"
              >
                Nos services
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-colors text-sm md:text-base"
              >
                Contactez-nous
              </Link>
              <Link
                href="/terrains"
                className="px-6 py-3 bg-[#059669] text-white font-semibold rounded-xl hover:bg-[#047857] transition-colors text-sm md:text-base"
              >
                🏡 Offres de terrains
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[#E8861A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-black">50+</p>
              <p className="text-sm font-medium opacity-90 mt-1">Entreprises digitalisées</p>
            </div>
            <div>
              <p className="text-3xl font-black">200+</p>
              <p className="text-sm font-medium opacity-90 mt-1">Collaborateurs formés</p>
            </div>
            <div>
              <p className="text-3xl font-black">4</p>
              <p className="text-sm font-medium opacity-90 mt-1">Pôles d'expertise</p>
            </div>
            <div>
              <p className="text-3xl font-black">98%</p>
              <p className="text-sm font-medium opacity-90 mt-1">Clients satisfaits</p>
            </div>
          </div>
        </div>
      </section>

      {/* BUs Grid */}
      <section className="bg-[#F8F9FA] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-[#0A2342] mb-4">
              Nos domaines d'expertise
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Quatre pôles de compétences complémentaires pour vous offrir un accompagnement
              global dans chaque étape de votre transformation digitale.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.href} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* Why WAYS */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-[#0A2342] mb-4">
              Pourquoi choisir WAYS ?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Notre approche unique combine expertise no-code, connaissance du marché
              ivoirien et engagement envers vos résultats concrets.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyWays.map((item) => (
              <div
                key={item.title}
                className="text-center p-8 rounded-2xl bg-[#F8F9FA] hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-gray-100"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-[#0A2342] mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-[#F8F9FA] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 bg-[#E8861A]/10 text-[#E8861A] text-sm font-semibold rounded-full mb-4 border border-[#E8861A]/20">
              Notre méthode
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#0A2342] mb-4">
              Comment nous travaillons
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Un processus structuré en 4 étapes pour garantir le succès de votre
              transformation digitale, du diagnostic à l'optimisation continue.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step) => (
              <div key={step.number} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
                <div className={`w-16 h-16 rounded-2xl ${step.color} text-white font-black text-xl flex items-center justify-center mx-auto mb-5`}>
                  {step.number}
                </div>
                <h3 className="text-lg font-bold text-[#0A2342] mb-3">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A2342] text-white font-semibold rounded-xl hover:bg-[#E8861A] transition-colors text-sm"
            >
              Démarrer votre audit gratuit
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-[#0A2342] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 bg-[#E8861A]/20 text-[#E8861A] text-sm font-semibold rounded-full mb-4 border border-[#E8861A]/30">
              Témoignages
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Ce que disent nos clients
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Des entrepreneurs et managers ivoiriens qui ont transformé leur activité
              grâce à l'accompagnement WAYS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayTestimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-[#E8861A]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E8861A] text-white font-bold text-sm flex items-center justify-center shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.role} — {t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partenaires */}
      <section className="bg-white py-14 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-400 mb-8">
            Ils nous font confiance
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
            {displayPartenaires.map((p) => (
              <div key={p.nom} className="px-6 py-3 bg-[#F8F9FA] rounded-xl border border-gray-100 text-sm font-semibold text-[#0A2342] hover:border-[#E8861A] hover:text-[#E8861A] transition-colors">
                {p.nom}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="bg-[#F8F9FA] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-[#0A2342] mb-2">
                Derniers articles
              </h2>
              <p className="text-gray-600">
                Insights, analyses et conseils de nos experts.
              </p>
            </div>
            <Link
              href="/blog"
              className="px-5 py-2.5 border-2 border-[#0A2342] text-[#0A2342] font-semibold rounded-xl hover:bg-[#0A2342] hover:text-white transition-colors text-sm whitespace-nowrap"
            >
              Tous les articles →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <BlogCard key={post.slug} {...post} />
            ))}
          </div>
        </div>
      </section>

      {/* Terrains Banner */}
      <section className="bg-[#059669] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="inline-block px-2.5 py-0.5 bg-white/20 text-white text-xs font-semibold rounded-full mb-2">
                WAYS Build — Offres foncières
              </span>
              <h2 className="text-2xl md:text-3xl font-black">
                Consultez nos offres de terrains en ce moment
              </h2>
              <p className="text-white/80 text-sm mt-1">
                Terrains résidentiels et commerciaux avec titres fonciers — Abidjan, Côte d'Ivoire
              </p>
            </div>
            <Link
              href="/terrains"
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-white text-[#059669] font-bold rounded-xl hover:bg-white/90 transition-colors text-sm whitespace-nowrap"
            >
              Voir les offres
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-[#0A2342] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Prêt à digitaliser votre entreprise ?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Bénéficiez d'un audit gratuit de vos processus. Nos experts identifient
            les opportunités d'automatisation et vous proposent un plan d'action concret.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-[#E8861A] text-white font-bold rounded-xl hover:bg-[#d4781a] transition-colors text-base"
          >
            Demander un audit gratuit
          </Link>
        </div>
      </section>
    </>
  );
}
