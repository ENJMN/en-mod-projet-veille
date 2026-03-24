"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import BunnyPlayer from "@/components/BunnyPlayer";
import { markLeconComplete } from "./actions";
import type { Database } from "@/lib/supabase/types";

type Formation = Database["public"]["Tables"]["formations"]["Row"];
type Lecon = Database["public"]["Tables"]["lecons"]["Row"];
type Module = Database["public"]["Tables"]["modules"]["Row"] & {
  lecons: Lecon[];
};

interface Props {
  formation: Formation;
  modules: Module[];
  activeLecon: Lecon;
  completedIds: string[];
  userId: string;
}

export default function LeconPlayer({
  formation,
  modules,
  activeLecon,
  completedIds,
  userId,
}: Props) {
  const [completed, setCompleted] = useState(new Set(completedIds));
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [, startTransition] = useTransition();

  const allLecons = modules.flatMap((m) => m.lecons);
  const currentIndex = allLecons.findIndex((l) => l.id === activeLecon.id);
  const prevLecon = currentIndex > 0 ? allLecons[currentIndex - 1] : null;
  const nextLecon = currentIndex < allLecons.length - 1 ? allLecons[currentIndex + 1] : null;

  const totalLessons = allLecons.length;
  const completedCount = allLecons.filter((l) => completed.has(l.id)).length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  function handleComplete() {
    if (completed.has(activeLecon.id)) return;
    setCompleted((prev) => new Set([...prev, activeLecon.id]));
    startTransition(() => {
      markLeconComplete(userId, activeLecon.id, formation.id);
    });
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#0A2342] overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-80" : "w-0"
        } transition-all duration-300 overflow-hidden flex-shrink-0 bg-[#0A2342] border-r border-white/10`}
      >
        <div className="w-80 h-full flex flex-col">
          {/* Header sidebar */}
          <div className="p-4 border-b border-white/10">
            <Link
              href={`/formations/${formation.slug}`}
              className="flex items-center gap-2 text-gray-400 hover:text-white text-xs mb-3 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Retour à la formation
            </Link>
            <h2 className="text-white font-black text-sm leading-snug line-clamp-2 mb-3">
              {formation.title}
            </h2>
            {/* Barre de progression */}
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white/10 rounded-full h-1.5">
                <div
                  className="bg-[#E8861A] h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 shrink-0">{progressPercent}%</span>
            </div>
          </div>

          {/* Liste des modules/leçons */}
          <div className="flex-1 overflow-y-auto">
            {modules.map((module) => (
              <div key={module.id}>
                <div className="px-4 py-2.5 bg-white/5">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {module.title}
                  </h3>
                </div>
                <ul>
                  {module.lecons.map((lecon) => {
                    const isActive = lecon.id === activeLecon.id;
                    const isDone = completed.has(lecon.id);
                    return (
                      <li key={lecon.id}>
                        <Link
                          href={`/formations/${formation.slug}/apprendre?lecon=${lecon.id}`}
                          className={`flex items-start gap-3 px-4 py-3 text-sm transition-colors ${
                            isActive
                              ? "bg-[#E8861A]/20 border-r-2 border-[#E8861A]"
                              : "hover:bg-white/5"
                          }`}
                        >
                          {/* Icône statut */}
                          <div className="shrink-0 mt-0.5">
                            {isDone ? (
                              <div className="w-5 h-5 rounded-full bg-[#059669] flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            ) : isActive ? (
                              <div className="w-5 h-5 rounded-full bg-[#E8861A] flex items-center justify-center">
                                <svg className="w-2.5 h-2.5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center">
                                <svg className="w-2.5 h-2.5 text-gray-500 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`leading-snug line-clamp-2 ${isActive ? "text-white font-semibold" : "text-gray-300"}`}>
                              {lecon.title}
                            </p>
                            {lecon.duration_minutes > 0 && (
                              <p className="text-xs text-gray-500 mt-0.5">{lecon.duration_minutes} min</p>
                            )}
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Zone principale */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-white font-semibold text-sm line-clamp-1 flex-1 mx-4">
            {activeLecon.title}
          </h1>
          <Link
            href="/formations/dashboard"
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            Mon espace
          </Link>
        </div>

        {/* Contenu leçon */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-6">
            {/* Lecteur vidéo */}
            {activeLecon.video_url ? (
              <BunnyPlayer
                videoId={activeLecon.video_url}
                onComplete={handleComplete}
                className="mb-6"
              />
            ) : (
              <div className="aspect-video bg-black/40 rounded-xl flex items-center justify-center mb-6">
                <div className="text-center">
                  <svg className="w-12 h-12 text-gray-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <p className="text-gray-500 text-sm">Vidéo bientôt disponible</p>
                </div>
              </div>
            )}

            {/* Contenu texte */}
            {activeLecon.content && (
              <div className="bg-white/5 rounded-xl p-6 text-gray-200 text-sm leading-relaxed mb-6 prose prose-invert max-w-none">
                {activeLecon.content}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div>
                {prevLecon && (
                  <Link
                    href={`/formations/${formation.slug}/apprendre?lecon=${prevLecon.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white border border-white/20 rounded-xl hover:border-white/40 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Leçon précédente
                  </Link>
                )}
              </div>

              <div className="flex items-center gap-3">
                {!completed.has(activeLecon.id) && (
                  <button
                    onClick={handleComplete}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-[#059669] text-white font-semibold rounded-xl hover:bg-[#059669]/90 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Marquer comme terminé
                  </button>
                )}

                {nextLecon && (
                  <Link
                    href={`/formations/${formation.slug}/apprendre?lecon=${nextLecon.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-[#E8861A] text-white font-semibold rounded-xl hover:bg-[#E8861A]/90 transition-colors"
                  >
                    Leçon suivante
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                )}

                {!nextLecon && completed.has(activeLecon.id) && (
                  <Link
                    href={`/formations/dashboard`}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-[#E8861A] text-white font-semibold rounded-xl hover:bg-[#E8861A]/90 transition-colors"
                  >
                    Terminer la formation
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
