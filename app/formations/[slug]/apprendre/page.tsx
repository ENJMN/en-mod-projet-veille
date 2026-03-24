import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";
import LeconPlayer from "./LeconPlayer";

type Formation = Database["public"]["Tables"]["formations"]["Row"];
type Module = Database["public"]["Tables"]["modules"]["Row"] & {
  lecons: Database["public"]["Tables"]["lecons"]["Row"][];
};

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lecon?: string }>;
}

export default async function ApprendrePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { lecon: leconId } = await searchParams;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/auth/login?redirect=/formations/${slug}/apprendre`);

  // Vérifier l'inscription (ou formation gratuite)
  const { data: formation } = await supabase
    .from("formations")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single() as { data: Formation | null; error: unknown };

  if (!formation) notFound();

  // Vérifier accès (gratuit ou inscrit+payé)
  if (formation.price_xof > 0) {
    const { data: inscription } = await supabase
      .from("inscriptions")
      .select("id, payment_status")
      .eq("user_id", user.id)
      .eq("formation_id", formation.id)
      .single();

    if (!inscription || inscription.payment_status !== "paid") {
      redirect(`/formations/${slug}`);
    }
  }

  // Charger modules + leçons
  const { data: modules } = await supabase
    .from("modules")
    .select("*, lecons(*)")
    .eq("formation_id", formation.id)
    .order("position") as { data: Module[] | null; error: unknown };

  if (!modules || modules.length === 0) notFound();

  // Trier les leçons dans chaque module
  const sortedModules = modules.map((m) => ({
    ...m,
    lecons: [...m.lecons].sort((a, b) => a.position - b.position),
  }));

  // Déterminer la leçon active
  const allLecons = sortedModules.flatMap((m) => m.lecons);
  const activeLecon = leconId
    ? allLecons.find((l) => l.id === leconId) ?? allLecons[0]
    : allLecons[0];

  if (!activeLecon) notFound();

  // Progression de l'utilisateur
  const { data: progressions } = await supabase
    .from("progression")
    .select("lecon_id, completed")
    .eq("user_id", user.id)
    .eq("formation_id", formation.id);

  const completedIds = new Set(
    progressions?.filter((p) => p.completed).map((p) => p.lecon_id) ?? []
  );

  return (
    <LeconPlayer
      formation={formation}
      modules={sortedModules}
      activeLecon={activeLecon}
      completedIds={[...completedIds]}
      userId={user.id}
    />
  );
}
