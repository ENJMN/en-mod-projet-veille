import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "WAYS IA & Digital — Transformation Digitale & IA",
  description:
    "Audit digital, automatisation par IA, intégration ERP/CRM (Dolibarr), développement web. WAYS accompagne les entreprises ivoiriennes dans leur transformation numérique.",
  openGraph: {
    title: "WAYS IA & Digital — Transformation Digitale & Intelligence Artificielle",
    description:
      "Déployez des agents IA, automatisez vos processus et intégrez des solutions No-Code/Low-Code pour propulser votre entreprise. À Abidjan, Côte d'Ivoire.",
    url: "https://ways-ci.com/services/consulting",
  },
};

const prestations = [
  { icon: "🔍", title: "Audit de processus & diagnostic digital", description: "Analyse de vos processus métier, identification des gains d'efficacité et des opportunités d'automatisation. Feuille de route personnalisée en sortie." },
  { icon: "🤖", title: "Déploiement d'agents IA", description: "Automatisation des tâches répétitives grâce à des agents IA sur mesure. Réduction des coûts opérationnels et libération du temps de vos équipes." },
  { icon: "🔗", title: "Intégration ERP/CRM", description: "Déploiement et paramétrage de solutions ERP/CRM (Dolibarr et autres) adaptées à votre activité. Centralisation de vos données et processus." },
  { icon: "🔄", title: "Transformation digitale globale", description: "Accompagnement end-to-end : diagnostic, stratégie, déploiement des outils et conduite du changement auprès de vos équipes." },
  { icon: "📚", title: "Formation post-déploiement", description: "Formation de vos équipes aux nouveaux outils, support technique et optimisation continue pour garantir l'adoption et le ROI." },
  { icon: "💻", title: "Développement web", description: "Création de sites vitrines et d'applicatifs métier sur mesure. Solutions modernes et performantes adaptées à votre secteur." },
];

const offers = [
  {
    name: "WAYS DIAGNOSTIC IA",
    duration: "5 à 10 jours",
    description: "Audit IA complet + feuille de route personnalisée. Identification des processus automatisables, évaluation de la maturité digitale et plan d'action priorisé.",
    bg: "bg-[#E8861A]",
  },
  {
    name: "WAYS AUTOPILOT",
    duration: "4 à 12 semaines",
    description: "Déploiement d'agents IA + automatisations sur mesure. De l'audit initial au go-live, avec formation de vos équipes et support post-déploiement.",
    bg: "bg-[#0A2342]",
  },
];

export default function WaysIADigitalPage() {
  return (
    <>
      <section className="bg-[#0A2342] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 bg-[#E8861A]/20 text-[#E8861A] text-sm font-semibold rounded-full mb-4 border border-[#E8861A]/30">
              BU 1
            </span>
            <h1 className="text-4xl md:text-5xl font-black mb-4">WAYS IA & Digital</h1>
            <p className="text-[#E8861A] text-lg font-semibold italic mb-4">
              Audit, automatisation et intégration de solutions à intelligence artificielle
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              Nous aidons les entreprises ivoiriennes à franchir le cap du digital en déployant
              des solutions IA concrètes et mesurables — sans jargon, sans complexité inutile.
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

      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-[#0A2342] mb-10 text-center">Offres packagées</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {offers.map((offer) => (
              <div key={offer.name} className={`${offer.bg} text-white rounded-2xl p-8`}>
                <p className="text-xs font-bold uppercase tracking-wider opacity-75 mb-2">{offer.duration}</p>
                <h3 className="text-2xl font-black mb-4">{offer.name}</h3>
                <p className="text-sm leading-relaxed opacity-90 mb-6">{offer.description}</p>
                <Link href="/contact" className="inline-block px-5 py-2.5 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold rounded-xl text-sm transition-colors">
                  Demander un devis →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0A2342] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-4">Prêt à automatiser votre entreprise ?</h2>
          <p className="text-gray-300 mb-8">Commencez par un audit diagnostic. Nous identifions vos opportunités d'automatisation en 5 jours.</p>
          <Link href="/contact" className="inline-block px-8 py-4 bg-[#E8861A] text-white font-bold rounded-xl hover:bg-[#d4781a] transition-colors">
            Demander mon diagnostic IA
          </Link>
        </div>
      </section>
    </>
  );
}
