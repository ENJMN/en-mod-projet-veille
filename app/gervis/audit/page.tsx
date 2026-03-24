"use client";

import { useState } from "react";

interface SectionScore { score: number; max: number; items?: { label: string; ok: boolean; detail?: string }[]; feedback?: string }
interface Report {
  url: string; score: number; fetchOk: boolean; summary: string;
  sections: { seo: SectionScore; security: SectionScore; performance: SectionScore; content: SectionScore; digital: SectionScore };
  detectedTools: string[];
  automationOpportunities: string[];
  recommendations: { priority: string; section: string; action: string }[];
  analyzedAt: string;
}

const PRIORITY_COLORS: Record<string, string> = {
  haute: "bg-red-100 text-red-700",
  moyenne: "bg-amber-100 text-amber-700",
  faible: "bg-blue-100 text-blue-700",
};

function ScoreCircle({ score }: { score: number }) {
  const color = score >= 75 ? "#059669" : score >= 50 ? "#E8861A" : "#dc2626";
  const r = 40; const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="100" height="100" className="-rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#E5E7EB" strokeWidth="8" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <div className="absolute text-center">
        <p className="text-xl font-black" style={{ color }}>{score}</p>
        <p className="text-xs text-gray-400">/100</p>
      </div>
    </div>
  );
}

export default function AdminAuditPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<{ url: string; score: number; date: string }[]>([]);

  const adminKey = typeof window !== "undefined" ? sessionStorage.getItem("ways_admin_key") ?? "" : "";

  async function handleAudit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setReport(null);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify({ url: url.trim(), email: "admin@ways-ci.com", phone: "" }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Erreur."); }
      else {
        setReport(data);
        setHistory(h => [{ url: url.trim(), score: data.score, date: new Date().toLocaleTimeString("fr-FR") }, ...h].slice(0, 10));
      }
    } catch {
      setError("Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  }

  function copyWhatsAppMessage() {
    if (!report) return;
    const score = report.score;
    const label = score >= 75 ? "bon" : score >= 50 ? "perfectible" : "critique";
    const top3 = report.recommendations.slice(0, 3).map((r, i) => `${i + 1}. [${r.section}] ${r.action}`).join("\n");
    const msg = `Bonjour,

Je me permets de vous contacter car nous avons analysé votre site *${report.url}* avec notre outil d'audit digital.

📊 Score global : *${score}/100* (${label})
${report.summary}

🎯 Top 3 recommandations :
${top3}

Chez WAYS Digital Solutions, nous pouvons vous accompagner dans l'amélioration de votre présence digitale.

Seriez-vous disponible pour en discuter ?

— Équipe WAYS Digital Solutions
📞 +225 07 05 13 31 31
🌐 ways-ci.com`;
    navigator.clipboard.writeText(msg);
    alert("Message WhatsApp copié !");
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0A2342]">Audit de site — Prospection</h1>
          <p className="text-gray-500 text-sm mt-1">Analysez les sites de vos prospects. Aucune limite de nombre.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: form + history */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h2 className="font-bold text-[#0A2342] mb-4 text-sm">Auditer un site</h2>
            <form onSubmit={handleAudit} className="space-y-3">
              <input
                type="text" value={url} onChange={e => setUrl(e.target.value)}
                placeholder="https://site-prospect.com"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20"
              />
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full py-2.5 bg-[#0A2342] text-white font-bold rounded-xl hover:bg-[#E8861A] transition-colors text-sm disabled:opacity-60">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    Analyse en cours…
                  </span>
                ) : "Lancer l'audit"}
              </button>
            </form>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h2 className="font-bold text-[#0A2342] mb-3 text-sm">Historique session</h2>
              <div className="space-y-2">
                {history.map((h, i) => (
                  <button key={i} onClick={() => setUrl(h.url)}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 text-left transition-colors">
                    <span className="text-xs text-gray-600 truncate max-w-[160px]">{h.url}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xs font-bold ${h.score >= 75 ? "text-green-600" : h.score >= 50 ? "text-amber-600" : "text-red-600"}`}>
                        {h.score}/100
                      </span>
                      <span className="text-gray-300 text-xs">{h.date}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: report */}
        <div className="lg:col-span-2">
          {!report && !loading && (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <p className="text-gray-400 text-sm">Entrez une URL pour lancer l'analyse.</p>
            </div>
          )}

          {loading && (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <div className="w-12 h-12 border-4 border-[#0A2342] border-t-[#E8861A] rounded-full animate-spin mx-auto mb-4" />
              <p className="text-[#0A2342] font-semibold text-sm">Analyse en cours…</p>
              <p className="text-gray-400 text-xs mt-1">Peut prendre 15-30 secondes</p>
            </div>
          )}

          {report && (
            <div className="space-y-4">
              {/* Score + actions */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="flex flex-wrap items-center gap-4">
                  <ScoreCircle score={report.score} />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#0A2342] text-sm truncate">{report.url}</p>
                    {report.summary && <p className="text-gray-500 text-xs mt-1 line-clamp-2">{report.summary}</p>}
                    <div className="flex flex-wrap gap-2 mt-3">
                      <button onClick={copyWhatsAppMessage}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#059669] text-white text-xs font-bold rounded-lg hover:bg-[#047857] transition-colors">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        Copier message WhatsApp
                      </button>
                      <button onClick={() => window.print()}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors">
                        Imprimer PDF
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scores */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h3 className="font-bold text-[#0A2342] text-sm mb-4">Scores par section</h3>
                <div className="space-y-3">
                  {[
                    { key: "seo", label: "🔍 SEO", max: 30 },
                    { key: "security", label: "🔒 Sécurité", max: 20 },
                    { key: "performance", label: "⚡ Performance", max: 20 },
                    { key: "content", label: "📝 Contenu", max: 15 },
                    { key: "digital", label: "🌐 Présence digitale", max: 15 },
                  ].map(({ key, label, max }) => {
                    const s = report.sections[key as keyof typeof report.sections];
                    const pct = Math.round((s.score / max) * 100);
                    const color = pct >= 75 ? "bg-[#059669]" : pct >= 50 ? "bg-[#E8861A]" : "bg-red-500";
                    return (
                      <div key={key}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-gray-700">{label}</span>
                          <span className="font-bold">{s.score}/{max}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recommendations */}
              {report.recommendations.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <h3 className="font-bold text-[#0A2342] text-sm mb-3">🎯 Recommandations</h3>
                  <div className="space-y-2">
                    {report.recommendations.map((r, i) => (
                      <div key={i} className="flex items-start gap-2 p-2.5 bg-gray-50 rounded-xl">
                        <span className={`px-2 py-0.5 text-xs font-bold rounded-full shrink-0 mt-0.5 ${PRIORITY_COLORS[r.priority] ?? "bg-gray-100 text-gray-600"}`}>
                          {r.priority}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase">{r.section}</p>
                          <p className="text-xs text-gray-700">{r.action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tools */}
              {report.detectedTools.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <h3 className="font-bold text-[#0A2342] text-sm mb-3">🛠 Outils détectés</h3>
                  <div className="flex flex-wrap gap-2">
                    {report.detectedTools.map(t => (
                      <span key={t} className="px-2.5 py-1 bg-[#0A2342]/10 text-[#0A2342] text-xs font-semibold rounded-full">{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
