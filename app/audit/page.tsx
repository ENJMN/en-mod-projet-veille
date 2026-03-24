"use client";

import { useState, useRef } from "react";

type Step = "url" | "lead" | "loading" | "report";

interface SectionScore { score: number; max: number; items?: { label: string; ok: boolean; detail?: string }[]; feedback?: string }
interface Report {
  url: string; score: number; fetchOk: boolean; summary: string;
  sections: { seo: SectionScore; security: SectionScore; performance: SectionScore; content: SectionScore; digital: SectionScore };
  detectedTools: string[];
  automationOpportunities: string[];
  recommendations: { priority: string; section: string; action: string }[];
  analyzedAt: string;
}

const STEPS_LOADING = [
  "Connexion au site…",
  "Analyse SEO en cours…",
  "Vérification sécurité…",
  "Analyse des performances…",
  "Détection des outils…",
  "Génération du rapport IA…",
];

const PRIORITY_COLORS: Record<string, string> = {
  haute: "bg-red-100 text-red-700",
  moyenne: "bg-amber-100 text-amber-700",
  faible: "bg-blue-100 text-blue-700",
};

function ScoreCircle({ score, max = 100 }: { score: number; max?: number }) {
  const pct = Math.round((score / max) * 100);
  const color = pct >= 75 ? "#059669" : pct >= 50 ? "#E8861A" : "#dc2626";
  const r = 54; const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="140" height="140" className="-rotate-90">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#E5E7EB" strokeWidth="10" />
        <circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease" }} />
      </svg>
      <div className="absolute text-center">
        <p className="text-3xl font-black" style={{ color }}>{score}</p>
        <p className="text-xs text-gray-500 font-semibold">/ {max}</p>
      </div>
    </div>
  );
}

function SectionBar({ label, score, max, emoji }: { label: string; score: number; max: number; emoji: string }) {
  const pct = Math.round((score / max) * 100);
  const color = pct >= 75 ? "bg-[#059669]" : pct >= 50 ? "bg-[#E8861A]" : "bg-red-500";
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold text-gray-700">{emoji} {label}</span>
        <span className="text-sm font-bold text-gray-900">{score}/{max}</span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function AuditPage() {
  const [step, setStep] = useState<Step>("url");
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState("");
  const reportRef = useRef<HTMLDivElement>(null);

  function handleUrl(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    setStep("lead");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep("loading");
    setError("");

    // Simulate loading steps
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i < STEPS_LOADING.length) setLoadingStep(i);
    }, 2800);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), email: email.trim(), phone: phone.trim() }),
      });
      clearInterval(interval);
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Erreur. Réessayez."); setStep("lead"); return; }
      setReport(data);
      setStep("report");
    } catch {
      clearInterval(interval);
      setError("Erreur de connexion. Réessayez.");
      setStep("lead");
    }
  }

  function handlePrint() { window.print(); }

  const globalScore = report?.score ?? 0;
  const scoreLabel = globalScore >= 75 ? "Bon" : globalScore >= 50 ? "À améliorer" : "Critique";
  const scoreColor = globalScore >= 75 ? "text-[#059669]" : globalScore >= 50 ? "text-[#E8861A]" : "text-red-600";

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          header, footer, nav, .no-print { display: none !important; }
          .print-full { page-break-inside: avoid; }
          body { font-size: 12px; }
        }
      `}</style>

      <div className="min-h-screen bg-[#F8F9FA]">
        {/* Hero */}
        <section className="bg-[#0A2342] text-white py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <span className="inline-block px-3 py-1 bg-[#E8861A]/20 text-[#E8861A] text-xs font-bold rounded-full mb-4 uppercase tracking-widest">
              Outil gratuit
            </span>
            <h1 className="text-3xl md:text-4xl font-black mb-4">
              Auditez votre site web en 60 secondes
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Obtenez un rapport complet : SEO, sécurité, performance, contenu et présence digitale.
              Score sur 100 + recommandations personnalisées.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-gray-400">
              {["✓ SEO & Structure", "✓ Sécurité HTTPS", "✓ Performance", "✓ Outils détectés", "✓ Recommandations IA"].map(t => (
                <span key={t} className="font-medium">{t}</span>
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-2xl mx-auto px-4 py-12">

          {/* ── Step 1: URL ─────────────────────────────────────────── */}
          {step === "url" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h2 className="text-xl font-black text-[#0A2342] mb-2">Entrez l'URL de votre site</h2>
              <p className="text-gray-500 text-sm mb-6">L'analyse est gratuite et prend moins d'une minute.</p>
              <form onSubmit={handleUrl} className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="https://monsite.com"
                    required
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20"
                  />
                  <button type="submit" className="px-6 py-3 bg-[#0A2342] text-white font-bold rounded-xl hover:bg-[#E8861A] transition-colors text-sm whitespace-nowrap">
                    Analyser →
                  </button>
                </div>
              </form>

              <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                {[["🔍", "Analyse SEO", "Titre, metas, structure"], ["🔒", "Sécurité", "HTTPS, RGPD, confidentialité"], ["⚡", "Performance", "Scripts, mobile, chargement"]].map(([icon, title, desc]) => (
                  <div key={title} className="p-4 bg-[#F8F9FA] rounded-xl">
                    <div className="text-2xl mb-1">{icon}</div>
                    <p className="font-bold text-[#0A2342] text-xs">{title}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 2: Lead capture ─────────────────────────────────── */}
          {step === "lead" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <button onClick={() => setStep("url")} className="text-gray-400 hover:text-gray-600 text-sm mb-4 flex items-center gap-1">
                ← Modifier l'URL
              </button>
              <div className="flex items-center gap-2 mb-6 p-3 bg-[#0A2342]/5 rounded-xl">
                <span className="text-lg">🌐</span>
                <span className="text-sm font-semibold text-[#0A2342] truncate">{url}</span>
              </div>
              <h2 className="text-xl font-black text-[#0A2342] mb-2">Où envoyer votre rapport ?</h2>
              <p className="text-gray-500 text-sm mb-6">
                Un conseiller WAYS pourra vous contacter pour vous accompagner dans l'implémentation des recommandations.
              </p>
              {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="Votre email professionnel *" required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20"
                />
                <input
                  type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="Votre numéro WhatsApp *" required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20"
                />
                <button type="submit" className="w-full py-3 bg-[#E8861A] text-white font-bold rounded-xl hover:bg-[#d4781a] transition-colors">
                  Lancer l'audit gratuit →
                </button>
                <p className="text-center text-xs text-gray-400">
                  Vos données ne seront jamais partagées. Utilisées uniquement par WAYS Digital Solutions.
                </p>
              </form>
            </div>
          )}

          {/* ── Step 3: Loading ──────────────────────────────────────── */}
          {step === "loading" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
              <div className="w-16 h-16 border-4 border-[#0A2342] border-t-[#E8861A] rounded-full animate-spin mx-auto mb-6" />
              <h2 className="text-xl font-black text-[#0A2342] mb-2">Analyse en cours…</h2>
              <p className="text-[#E8861A] font-semibold text-sm mb-6">{STEPS_LOADING[loadingStep]}</p>
              <div className="space-y-2 text-left max-w-xs mx-auto">
                {STEPS_LOADING.map((s, i) => (
                  <div key={s} className={`flex items-center gap-2 text-sm transition-all ${i <= loadingStep ? "text-[#0A2342]" : "text-gray-300"}`}>
                    <span>{i < loadingStep ? "✓" : i === loadingStep ? "⟳" : "○"}</span>
                    <span className={i === loadingStep ? "font-semibold" : ""}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 4: Report ───────────────────────────────────────── */}
          {step === "report" && report && (
            <div ref={reportRef}>
              {/* Report header */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4 print-full">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-black text-[#0A2342]">Rapport d'audit</h2>
                    <p className="text-gray-400 text-xs mt-0.5 truncate max-w-xs">{report.url}</p>
                  </div>
                  <button onClick={handlePrint} className="no-print flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-[#0A2342] hover:text-[#0A2342] transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                    Télécharger PDF
                  </button>
                </div>

                {/* Score global */}
                <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-[#F8F9FA] rounded-xl">
                  <ScoreCircle score={report.score} />
                  <div className="text-center sm:text-left">
                    <p className="text-sm text-gray-500 mb-1">Score global</p>
                    <p className={`text-2xl font-black ${scoreColor}`}>{scoreLabel}</p>
                    {report.summary && <p className="text-gray-600 text-sm mt-2 max-w-sm">{report.summary}</p>}
                    {!report.fetchOk && <p className="text-amber-600 text-xs mt-2 bg-amber-50 px-3 py-1 rounded-lg">⚠ Site partiellement accessible — analyse basée sur les données disponibles</p>}
                  </div>
                </div>
              </div>

              {/* Section scores */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4 print-full">
                <h3 className="font-black text-[#0A2342] mb-5">Scores par section</h3>
                <div className="space-y-4">
                  <SectionBar label="SEO & Référencement" score={report.sections.seo.score} max={30} emoji="🔍" />
                  <SectionBar label="Sécurité" score={report.sections.security.score} max={20} emoji="🔒" />
                  <SectionBar label="Performance" score={report.sections.performance.score} max={20} emoji="⚡" />
                  <SectionBar label="Contenu" score={report.sections.content.score} max={15} emoji="📝" />
                  <SectionBar label="Présence digitale" score={report.sections.digital.score} max={15} emoji="🌐" />
                </div>
              </div>

              {/* Details per section */}
              {(["seo", "security", "performance", "digital"] as const).map((key) => {
                const s = report.sections[key];
                if (!s.items) return null;
                const labels: Record<string, string> = { seo: "🔍 SEO", security: "🔒 Sécurité", performance: "⚡ Performance", digital: "🌐 Présence digitale" };
                return (
                  <div key={key} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4 print-full">
                    <h3 className="font-black text-[#0A2342] mb-4">{labels[key]} — {s.score}/{s.max} pts</h3>
                    <div className="space-y-2">
                      {s.items.map((item) => (
                        <div key={item.label} className={`flex items-start gap-3 p-3 rounded-xl text-sm ${item.ok ? "bg-green-50" : "bg-red-50"}`}>
                          <span className="text-base shrink-0">{item.ok ? "✅" : "❌"}</span>
                          <div>
                            <p className={`font-semibold ${item.ok ? "text-green-800" : "text-red-800"}`}>{item.label}</p>
                            {item.detail && <p className={`text-xs mt-0.5 ${item.ok ? "text-green-600" : "text-red-600"}`}>{item.detail}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                    {key === "seo" && report.sections.content.feedback && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-xl text-sm text-blue-800">
                        <p className="font-semibold mb-1">📝 Contenu — {report.sections.content.score}/15 pts</p>
                        <p>{report.sections.content.feedback}</p>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Outils détectés */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4 print-full">
                <h3 className="font-black text-[#0A2342] mb-4">🛠 Outils & automatisation détectés</h3>
                {report.detectedTools.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {report.detectedTools.map(t => (
                      <span key={t} className="px-3 py-1 bg-[#0A2342]/10 text-[#0A2342] text-xs font-semibold rounded-full">{t}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm mb-4">Aucun outil de marketing ou d'automatisation détecté.</p>
                )}
                {report.automationOpportunities.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-700">💡 Opportunités identifiées :</p>
                    {report.automationOpportunities.map((op, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-[#E8861A] shrink-0 mt-0.5">→</span>
                        <span>{op}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recommandations */}
              {report.recommendations.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4 print-full">
                  <h3 className="font-black text-[#0A2342] mb-4">🎯 Recommandations prioritaires</h3>
                  <div className="space-y-3">
                    {report.recommendations.map((r, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                        <span className={`px-2 py-0.5 text-xs font-bold rounded-full shrink-0 mt-0.5 ${PRIORITY_COLORS[r.priority] ?? "bg-gray-100 text-gray-600"}`}>
                          {r.priority}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{r.section}</p>
                          <p className="text-sm text-gray-700 mt-0.5">{r.action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA WAYS */}
              <div className="bg-[#0A2342] rounded-2xl p-8 text-center no-print">
                <h3 className="text-xl font-black text-white mb-2">Besoin d'aide pour améliorer votre site ?</h3>
                <p className="text-gray-300 text-sm mb-6">
                  L'équipe WAYS Digital Solutions vous accompagne de l'audit à l'implémentation.
                </p>
                <a
                  href={`https://wa.me/2250705133131?text=Bonjour%2C%20j'ai%20réalisé%20un%20audit%20de%20${encodeURIComponent(report.url)}%20et%20j'aimerais%20en%20discuter%20avec%20un%20conseiller%20WAYS.`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8861A] text-white font-bold rounded-xl hover:bg-[#d4781a] transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Parler à un conseiller WAYS
                </a>
                <p className="text-gray-500 text-xs mt-4">
                  Audit généré le {new Date(report.analyzedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
