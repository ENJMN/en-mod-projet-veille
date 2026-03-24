import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type Formation = Database["public"]["Tables"]["formations"]["Row"];

export const metadata: Metadata = {
  title: "Formations",
  description:
    "Découvrez toutes nos formations en IA, stratégie digitale, BTP et management — dispensées par des experts pour les entrepreneurs et managers d'Afrique de l'Ouest.",
  openGraph: {
    title: "Formations — WAYS Digital Solutions",
    description:
      "Formations certifiantes en IA & Digital, Stratégie, BTP et Management. Apprenez à votre rythme avec WAYS Academy.",
    url: "https://ways-ci.com/formations",
  },
};

const categoryStyles: Record<string, { bg: string; text: string; border: string }> = {
  "IA & Digital": { bg: "bg-[#0A2342]/10", text: "text-[#0A2342]", border: "border-[#0A2342]/20" },
  "Stratégie": { bg: "bg-[#E8861A]/10", text: "text-[#E8861A]", border: "border-[#E8861A]/20" },
  "BTP": { bg: "bg-[#059669]/10", text: "text-[#059669]", border: "border-[#059669]/20" },
  "Formation": { bg: "bg-[#7c3aed]/10", text: "text-[#7c3aed]", border: "border-[#7c3aed]/20" },
};

const levelIcons: Record<string, string> = {
  "Débutant": "🟢",
  "Intermédiaire": "🟡",
  "Avancé": "🔴",
};

function formatPrice(xof: number) {
  if (xof === 0) return "Gratuit";
  return new Intl.NumberFormat("fr-FR").format(xof) + " FCFA";
}

export default async function FormationsPage() {
  const supabase = await createClient();
  const { data: formations } = await supabase
    .from("formations")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false }) as { data: Formation[] | null; error: unknown };

  const categories = ["Tous", "IA & Digital", "Stratégie", "BTP", "Formation"];

  return (
    <>
      {/* Hero */}
      <section className="bg-[#0A2342] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#E8861A]/20 text-[#E8861A] text-sm font-semibold rounded-full mb-4 border border-[#E8861A]/30">
              WAYS Academy
            </span>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Nos formations
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              Montez en compétences avec des formations pratiques conçues pour
              les entrepreneurs et managers d'Afrique de l'Ouest.
            </p>
          </div>
        </div>
      </section>

      {/* Catalogue */}
      <section className="bg-[#F8F9FA] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filtres catégories */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <span
                key={cat}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors cursor-default ${
                  cat === "Tous"
                    ? "bg-[#0A2342] text-white border-[#0A2342]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#0A2342]/30"
                }`}
              >
                {cat}
              </span>
            ))}
          </div>

          {!formations || formations.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-16 h-16 bg-[#0A2342]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#0A2342]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h2 className="text-xl font-black text-[#0A2342] mb-2">Formations bientôt disponibles</h2>
              <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
                Notre catalogue de formations est en cours de préparation. Laissez-nous vos coordonnées pour être notifié en avant-première.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E8861A] text-white text-sm font-semibold rounded-xl hover:bg-[#E8861A]/90 transition-colors"
              >
                Me tenir informé
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {formations.map((formation) => {
                const style = categoryStyles[formation.category] ?? {
                  bg: "bg-gray-100",
                  text: "text-gray-600",
                  border: "border-gray-200",
                };
                return (
                  <Link
                    key={formation.id}
                    href={`/formations/${formation.slug}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-gradient-to-br from-[#0A2342] to-[#0A2342]/70 flex items-center justify-center">
                      {formation.thumbnail_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={formation.thumbnail_url}
                          alt={formation.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg className="w-12 h-12 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                        </svg>
                      )}
                      {/* Prix badge */}
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 bg-white text-[#0A2342] text-xs font-black rounded-lg shadow">
                          {formatPrice(formation.price_xof)}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${style.bg} ${style.text} ${style.border}`}>
                          {formation.category}
                        </span>
                        <span className="text-xs text-gray-400">
                          {levelIcons[formation.level] ?? "⚪"} {formation.level}
                        </span>
                      </div>

                      <h2 className="font-black text-[#0A2342] text-base leading-snug mb-2 group-hover:text-[#E8861A] transition-colors line-clamp-2">
                        {formation.title}
                      </h2>

                      {formation.description && (
                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
                          {formation.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-gray-400 pt-3 border-t border-gray-50 mt-auto">
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {formation.duration_hours}h
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                          {formation.lessons_count} leçons
                        </span>
                        <span className="ml-auto flex items-center gap-1 text-[#E8861A] font-semibold">
                          Voir la formation
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA inscription */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-black text-[#0A2342] mb-3">
            Prêt à vous former ?
          </h2>
          <p className="text-gray-600 mb-6">
            Créez votre compte gratuitement et accédez à notre catalogue de formations.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#E8861A] text-white font-semibold rounded-xl hover:bg-[#E8861A]/90 transition-colors"
            >
              Créer un compte gratuit
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#0A2342] font-semibold rounded-xl border border-gray-200 hover:border-[#0A2342]/30 transition-colors"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
