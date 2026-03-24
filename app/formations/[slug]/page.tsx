import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type Formation = Database["public"]["Tables"]["formations"]["Row"];
type Module = Database["public"]["Tables"]["modules"]["Row"] & {
  lecons: Database["public"]["Tables"]["lecons"]["Row"][];
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("formations")
    .select("title, description")
    .eq("slug", slug)
    .eq("is_published", true)
    .single() as { data: Pick<Formation, "title" | "description"> | null; error: unknown };

  if (!data) return { title: "Formation introuvable" };

  return {
    title: data.title,
    description: data.description ?? undefined,
    openGraph: {
      title: `${data.title} — WAYS Formations`,
      description: data.description ?? undefined,
    },
  };
}

const categoryStyles: Record<string, string> = {
  "IA & Digital": "bg-[#0A2342]/10 text-[#0A2342] border-[#0A2342]/20",
  "Stratégie": "bg-[#E8861A]/10 text-[#E8861A] border-[#E8861A]/20",
  "BTP": "bg-[#059669]/10 text-[#059669] border-[#059669]/20",
  "Formation": "bg-[#7c3aed]/10 text-[#7c3aed] border-[#7c3aed]/20",
};

function formatPrice(xof: number) {
  if (xof === 0) return "Gratuit";
  return new Intl.NumberFormat("fr-FR").format(xof) + " FCFA";
}

export default async function FormationDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: formation } = await supabase
    .from("formations")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single() as { data: Formation | null; error: unknown };

  if (!formation) notFound();

  const { data: modules } = await supabase
    .from("modules")
    .select("*, lecons(*)")
    .eq("formation_id", formation.id)
    .order("position") as { data: Module[] | null; error: unknown };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isEnrolled = false; // Phase 2 : vérifier inscription

  return (
    <>
      {/* Hero */}
      <section className="bg-[#0A2342] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Link
              href="/formations"
              className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-6 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Toutes les formations
            </Link>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${categoryStyles[formation.category] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
                {formation.category}
              </span>
              <span className="text-gray-400 text-sm">{formation.level}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
              {formation.title}
            </h1>

            {formation.description && (
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                {formation.description}
              </p>
            )}

            <div className="flex flex-wrap gap-5 text-sm text-gray-300">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#E8861A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formation.duration_hours}h de contenu
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#E8861A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                {formation.lessons_count} leçons
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#E8861A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                {formation.instructor_name}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-10">
            {/* Objectifs */}
            {formation.objectives && formation.objectives.length > 0 && (
              <div>
                <h2 className="text-xl font-black text-[#0A2342] mb-4">Ce que vous allez apprendre</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {formation.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <svg className="w-4 h-4 text-[#059669] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Programme */}
            {modules && modules.length > 0 && (
              <div>
                <h2 className="text-xl font-black text-[#0A2342] mb-4">Programme de la formation</h2>
                <div className="space-y-3">
                  {modules.map((module) => (
                    <div key={module.id} className="border border-gray-100 rounded-xl overflow-hidden">
                      <div className="flex items-center justify-between px-5 py-3.5 bg-gray-50">
                        <h3 className="font-semibold text-[#0A2342] text-sm">{module.title}</h3>
                        <span className="text-xs text-gray-400">
                          {module.lecons?.length ?? 0} leçons
                        </span>
                      </div>
                      {module.lecons?.length > 0 && (
                        <ul className="divide-y divide-gray-50">
                          {module.lecons.map((lecon) => (
                            <li key={lecon.id} className="flex items-center gap-3 px-5 py-3 text-sm">
                              <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
                              </svg>
                              <span className="flex-1 text-gray-700">{lecon.title}</span>
                              {lecon.is_free_preview && (
                                <span className="px-1.5 py-0.5 bg-[#059669]/10 text-[#059669] text-xs font-semibold rounded">
                                  Aperçu
                                </span>
                              )}
                              {lecon.duration_minutes > 0 && (
                                <span className="text-gray-400 text-xs">{lecon.duration_minutes}min</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prérequis */}
            {formation.requirements && formation.requirements.length > 0 && (
              <div>
                <h2 className="text-xl font-black text-[#0A2342] mb-4">Prérequis</h2>
                <ul className="space-y-2">
                  {formation.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <svg className="w-4 h-4 text-[#E8861A] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar — Carte d'inscription */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sticky top-6">
              <div className="text-3xl font-black text-[#0A2342] mb-1">
                {formatPrice(formation.price_xof)}
              </div>
              {formation.price_eur && formation.price_eur > 0 && (
                <p className="text-sm text-gray-400 mb-5">≈ {formation.price_eur} €</p>
              )}

              {isEnrolled ? (
                <Link
                  href={`/formations/dashboard`}
                  className="block w-full text-center py-3 bg-[#059669] text-white font-semibold rounded-xl hover:bg-[#059669]/90 transition-colors mb-4"
                >
                  Accéder à ma formation
                </Link>
              ) : user ? (
                <Link
                  href={`/formations/${formation.slug}/checkout`}
                  className="block w-full text-center py-3 bg-[#E8861A] text-white font-semibold rounded-xl hover:bg-[#E8861A]/90 transition-colors mb-4"
                >
                  {formation.price_xof === 0 ? "S'inscrire gratuitement" : "S'inscrire maintenant"}
                </Link>
              ) : (
                <>
                  <Link
                    href={`/auth/register?redirect=/formations/${formation.slug}`}
                    className="block w-full text-center py-3 bg-[#E8861A] text-white font-semibold rounded-xl hover:bg-[#E8861A]/90 transition-colors mb-3"
                  >
                    {formation.price_xof === 0 ? "S'inscrire gratuitement" : "S'inscrire maintenant"}
                  </Link>
                  <Link
                    href={`/auth/login?redirect=/formations/${formation.slug}`}
                    className="block w-full text-center py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-[#0A2342]/30 transition-colors mb-4 text-sm"
                  >
                    Déjà un compte ? Se connecter
                  </Link>
                </>
              )}

              <ul className="space-y-2.5 text-sm text-gray-600">
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[#059669]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Accès à vie
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[#059669]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Certificat de réussite
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[#059669]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Support par email
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[#059669]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Mobile Money accepté
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
