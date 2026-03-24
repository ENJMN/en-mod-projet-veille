"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  GraduationCap,
  FileText,
  MessageSquare,
  Plus,
  ArrowRight,
  CheckCircle,
  Clock,
} from "lucide-react";

const ADMIN_KEY_STORAGE = "ways_admin_key";

interface Stats {
  terrains: { total: number; disponibles: number; prefinancement: number };
  formations: { total: number; publiees: number };
  articles: { drafts: number };
  commentaires: { pending: number };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const key = sessionStorage.getItem(ADMIN_KEY_STORAGE) ?? "";
    if (!key) return;

    async function loadStats() {
      const headers = { "x-admin-key": key };

      const [terrRes, formRes, artRes, comRes] = await Promise.allSettled([
        fetch("/api/admin/terrains", { headers }),
        fetch("/api/admin/formations", { headers }),
        fetch("/api/admin/articles", { headers }),
        fetch("/api/admin/comments", { headers }),
      ]);

      const terrains = terrRes.status === "fulfilled" && terrRes.value.ok ? await terrRes.value.json() : [];
      const formations = formRes.status === "fulfilled" && formRes.value.ok ? await formRes.value.json() : [];
      const articles = artRes.status === "fulfilled" && artRes.value.ok ? await artRes.value.json() : { drafts: [] };
      const commentaires = comRes.status === "fulfilled" && comRes.value.ok ? await comRes.value.json() : [];

      setStats({
        terrains: {
          total: terrains.filter((t: { disponible: boolean }) => t.disponible).length,
          disponibles: terrains.filter((t: { statut: string; disponible: boolean }) => t.statut === "disponible" && t.disponible).length,
          prefinancement: terrains.filter((t: { statut: string }) => t.statut === "préfinancement").length,
        },
        formations: {
          total: formations.length,
          publiees: formations.filter((f: { is_published: boolean }) => f.is_published).length,
        },
        articles: {
          drafts: (articles.drafts ?? []).length,
        },
        commentaires: {
          pending: Array.isArray(commentaires)
            ? commentaires.filter((c: { approved: boolean }) => !c.approved).length
            : 0,
        },
      });
    }

    loadStats();
  }, []);

  const sections = [
    {
      href: "/admin/terrains",
      label: "Terrains",
      description: "Gérez les offres foncières",
      icon: MapPin,
      color: "bg-[#059669]",
      light: "bg-[#059669]/10 text-[#059669]",
      createHref: "/admin/terrains/nouveau",
      createLabel: "Nouvelle offre",
      stat: stats ? `${stats.terrains.total} offre${stats.terrains.total > 1 ? "s" : ""}` : null,
      badges: stats ? [
        stats.terrains.disponibles > 0 && { label: `${stats.terrains.disponibles} disponible${stats.terrains.disponibles > 1 ? "s" : ""}`, color: "text-[#059669]" },
        stats.terrains.prefinancement > 0 && { label: `${stats.terrains.prefinancement} préfinancement`, color: "text-[#E8861A]" },
      ].filter(Boolean) : [],
    },
    {
      href: "/admin/formations",
      label: "Formations",
      description: "Gérez le catalogue WAYS Academy",
      icon: GraduationCap,
      color: "bg-[#0A2342]",
      light: "bg-[#0A2342]/10 text-[#0A2342]",
      createHref: "/admin/formations/nouvelle",
      createLabel: "Nouvelle formation",
      stat: stats ? `${stats.formations.total} formation${stats.formations.total > 1 ? "s" : ""}` : null,
      badges: stats ? [
        stats.formations.publiees > 0 && { label: `${stats.formations.publiees} publiée${stats.formations.publiees > 1 ? "s" : ""}`, color: "text-[#059669]" },
        (stats.formations.total - stats.formations.publiees) > 0 && { label: `${stats.formations.total - stats.formations.publiees} brouillon${(stats.formations.total - stats.formations.publiees) > 1 ? "s" : ""}`, color: "text-gray-400" },
      ].filter(Boolean) : [],
    },
    {
      href: "/admin/articles",
      label: "Articles / Blog",
      description: "Relisez et publiez les articles générés par IA",
      icon: FileText,
      color: "bg-[#7c3aed]",
      light: "bg-[#7c3aed]/10 text-[#7c3aed]",
      createHref: null,
      createLabel: null,
      stat: stats ? `${stats.articles.drafts} brouillon${stats.articles.drafts > 1 ? "s" : ""}` : null,
      badges: stats ? [
        stats.articles.drafts > 0 && { label: `${stats.articles.drafts} en attente de relecture`, color: "text-[#7c3aed]" },
      ].filter(Boolean) : [],
    },
    {
      href: "/admin/commentaires",
      label: "Commentaires",
      description: "Modérez les commentaires du blog",
      icon: MessageSquare,
      color: "bg-[#E8861A]",
      light: "bg-[#E8861A]/10 text-[#E8861A]",
      createHref: null,
      createLabel: null,
      stat: stats ? `${stats.commentaires.pending} en attente` : null,
      badges: stats ? [
        stats.commentaires.pending > 0 && { label: `${stats.commentaires.pending} à approuver`, color: "text-[#E8861A]" },
      ].filter(Boolean) : [],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <div className="bg-[#0A2342] text-white py-10 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-gray-400 text-sm mb-1">Bienvenue</p>
          <h1 className="text-3xl font-black">Dashboard Admin</h1>
          <p className="text-gray-400 text-sm mt-2">
            Gérez l'ensemble du contenu du site ways-ci.com depuis cet espace.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Cards sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.href} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    {s.createHref && (
                      <Link
                        href={s.createHref}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg transition-colors border border-gray-100"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        {s.createLabel}
                      </Link>
                    )}
                  </div>

                  <h2 className="text-base font-black text-[#0A2342] mb-1">{s.label}</h2>
                  <p className="text-gray-500 text-sm mb-4">{s.description}</p>

                  {/* Stats */}
                  {stats ? (
                    <div className="space-y-1.5 mb-4">
                      {s.stat && (
                        <p className="text-sm font-bold text-[#0A2342]">{s.stat}</p>
                      )}
                      {(s.badges as { label: string; color: string }[]).map((b, i) => (
                        <p key={i} className={`text-xs font-semibold ${b.color} flex items-center gap-1`}>
                          {b.color.includes("059669") ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {b.label}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <div className="h-12 flex items-center">
                      <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-50 px-6 py-3">
                  <Link
                    href={s.href}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0A2342] hover:text-[#E8861A] transition-colors"
                  >
                    Gérer
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Accès rapides */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-sm font-black text-gray-500 uppercase tracking-wide mb-4">Accès rapides</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/terrains/nouveau" className="inline-flex items-center gap-2 px-4 py-2 bg-[#059669] text-white text-sm font-semibold rounded-xl hover:bg-[#047857] transition-colors">
              <MapPin className="w-4 h-4" />
              Nouvelle offre terrain
            </Link>
            <Link href="/admin/formations/nouvelle" className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A2342] text-white text-sm font-semibold rounded-xl hover:bg-[#0A2342]/80 transition-colors">
              <GraduationCap className="w-4 h-4" />
              Nouvelle formation
            </Link>
            <Link href="/admin/articles" className="inline-flex items-center gap-2 px-4 py-2 bg-[#7c3aed] text-white text-sm font-semibold rounded-xl hover:bg-[#6d28d9] transition-colors">
              <FileText className="w-4 h-4" />
              Générer un article
            </Link>
            <a href="/terrains" target="_blank" className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:border-gray-300 transition-colors">
              Voir /terrains ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
