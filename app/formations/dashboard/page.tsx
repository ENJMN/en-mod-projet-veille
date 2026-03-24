import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type InscriptionWithFormation = Database["public"]["Tables"]["inscriptions"]["Row"] & {
  formations: Pick<
    Database["public"]["Tables"]["formations"]["Row"],
    "id" | "slug" | "title" | "category" | "duration_hours" | "thumbnail_url"
  > | null;
};

export const metadata: Metadata = {
  title: "Mon espace formation",
  description: "Accédez à vos formations WAYS et suivez votre progression.",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?redirect=/formations/dashboard");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single() as { data: Database["public"]["Tables"]["profiles"]["Row"] | null; error: unknown };

  const { data: inscriptions } = await supabase
    .from("inscriptions")
    .select("*, formations(*)")
    .eq("user_id", user.id)
    .eq("payment_status", "paid")
    .order("enrolled_at", { ascending: false }) as { data: InscriptionWithFormation[] | null; error: unknown };

  // Progression réelle
  const { data: progressions } = await supabase
    .from("formation_progress")
    .select("*")
    .eq("user_id", user.id) as { data: Database["public"]["Views"]["formation_progress"]["Row"][] | null; error: unknown };

  const progressMap = new Map(
    progressions?.map((p) => [p.formation_id, p.progress_percent ?? 0]) ?? []
  );

  const completedFormations = progressions?.filter((p) => (p.progress_percent ?? 0) >= 100).length ?? 0;

  const firstName = profile?.full_name?.split(" ")[0] ?? "Apprenant";

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header dashboard */}
      <div className="bg-[#0A2342] text-white py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Espace apprenant</p>
              <h1 className="text-2xl font-black">Bonjour, {firstName} 👋</h1>
            </div>
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                className="px-4 py-2 text-sm text-gray-300 hover:text-white border border-white/20 rounded-xl transition-colors"
              >
                Se déconnecter
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-2xl font-black text-[#0A2342]">{inscriptions?.length ?? 0}</p>
            <p className="text-sm text-gray-500 mt-1">Formation{(inscriptions?.length ?? 0) > 1 ? "s" : ""} inscrite{(inscriptions?.length ?? 0) > 1 ? "s" : ""}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-2xl font-black text-[#059669]">{completedFormations}</p>
            <p className="text-sm text-gray-500 mt-1">Terminée(s)</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-2xl font-black text-[#E8861A]">0</p>
            <p className="text-sm text-gray-500 mt-1">Certificat(s) obtenu(s)</p>
          </div>
        </div>

        {/* Mes formations */}
        <h2 className="text-lg font-black text-[#0A2342] mb-4">Mes formations</h2>

        {!inscriptions || inscriptions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <div className="w-14 h-14 bg-[#0A2342]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-[#0A2342]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <h3 className="font-black text-[#0A2342] mb-2">Aucune formation pour l'instant</h3>
            <p className="text-gray-500 text-sm mb-5">
              Explorez notre catalogue et inscrivez-vous à votre première formation.
            </p>
            <Link
              href="/formations"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E8861A] text-white text-sm font-semibold rounded-xl hover:bg-[#E8861A]/90 transition-colors"
            >
              Voir les formations
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {inscriptions.map((inscription) => {
              const formation = inscription.formations;
              if (!formation) return null;
              const progress = progressMap.get(formation.id) ?? 0;

              return (
                <div
                  key={inscription.id}
                  className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow flex flex-col gap-3"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-[#0A2342]/10 flex items-center justify-center shrink-0 overflow-hidden">
                      {formation.thumbnail_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={formation.thumbnail_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <svg className="w-6 h-6 text-[#0A2342]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400 mb-0.5">{formation.category}</p>
                      <h3 className="font-black text-[#0A2342] text-sm leading-snug line-clamp-2">{formation.title}</h3>
                      <div className="mt-2 bg-gray-100 rounded-full h-1.5">
                        <div
                          className="bg-[#E8861A] h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{progress}% complété</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/formations/${formation.slug}/apprendre`}
                      className="flex-1 text-center py-2 bg-[#0A2342] text-white text-xs font-semibold rounded-xl hover:bg-[#E8861A] transition-colors"
                    >
                      {progress >= 100 ? "Revoir" : progress > 0 ? "Continuer" : "Commencer"}
                    </Link>
                    {progress >= 100 && (
                      <a
                        href={`/api/formations/certificate?formation=${formation.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-[#059669] text-white text-xs font-semibold rounded-xl hover:bg-[#059669]/90 transition-colors flex items-center gap-1"
                        title="Télécharger le certificat"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        PDF
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
