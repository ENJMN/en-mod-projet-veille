"use client";

import { useState } from "react";
import Link from "next/link";

const digitalSteps = [
  {
    number: "01",
    title: "Audit & Diagnostic",
    description:
      "Analyse approfondie de vos processus actuels, identification des opportunités de digitalisation et évaluation de votre maturité numérique.",
    accent: true,
  },
  {
    number: "02",
    title: "Stratégie & Plan d'action",
    description:
      "Définition d'une feuille de route personnalisée avec les outils adaptés, les KPIs mesurables et un calendrier réaliste.",
    accent: false,
  },
  {
    number: "03",
    title: "Déploiement & Mise en œuvre",
    description:
      "Implémentation des solutions retenues, formation de vos équipes et accompagnement au changement pour une adoption réussie.",
    accent: true,
  },
  {
    number: "04",
    title: "Suivi & Optimisation",
    description:
      "Monitoring continu des performances, ajustements itératifs et support post-déploiement pour garantir un ROI maximal.",
    accent: false,
  },
];

const interventionSteps = [
  {
    number: "01",
    title: "Détection du besoin",
    description:
      "Identification proactive par nos équipes ou expression d'un besoin par une organisation ou un individu.",
    accent: true,
    recurring: false,
  },
  {
    number: "02",
    title: "Analyse & Cahier des charges",
    description:
      "Étude approfondie, analyse de faisabilité, rédaction ou assistance à la rédaction du CDC.",
    accent: false,
    recurring: false,
  },
  {
    number: "03",
    title: "Cadrage & Planification",
    description:
      "Périmètre, ressources, calendrier et indicateurs de succès définis.",
    accent: true,
    recurring: false,
  },
  {
    number: "04",
    title: "Conception & Production",
    description:
      "Développement de la solution — outil digital, automatisation, formation ou tout livrable.",
    accent: false,
    recurring: false,
  },
  {
    number: "05",
    title: "Déploiement & Recette",
    description:
      "Mise en production, tests de validation, corrections et réception officielle.",
    accent: true,
    recurring: false,
  },
  {
    number: "06",
    title: "Évaluation & Suivi",
    description:
      "Mesure des résultats, retour d'expérience, ajustements et service après accompagnement.",
    accent: false,
    recurring: true,
  },
];

export default function ProcessSection() {
  const [tab, setTab] = useState<"digital" | "intervention">("digital");

  return (
    <section className="bg-[#F8F9FA] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 bg-[#E8861A]/10 text-[#E8861A] text-sm font-semibold rounded-full mb-4 border border-[#E8861A]/20">
            Notre méthode
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-[#0A2342] mb-4">
            Comment nous travaillons
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Deux processus complémentaires pour transformer votre organisation
            avec rigueur et efficacité.
          </p>
        </div>

        {/* Onglets */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setTab("digital")}
              className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                tab === "digital"
                  ? "bg-[#0A2342] text-white shadow"
                  : "text-gray-500 hover:text-[#0A2342]"
              }`}
            >
              Transformation digitale
            </button>
            <button
              onClick={() => setTab("intervention")}
              className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                tab === "intervention"
                  ? "bg-[#0A2342] text-white shadow"
                  : "text-gray-500 hover:text-[#0A2342]"
              }`}
            >
              Processus d'intervention
            </button>
          </div>
        </div>

        {/* Contenu onglet 1 */}
        {tab === "digital" && (
          <>
            <p className="text-center text-gray-500 text-sm mb-10 -mt-4">
              Un processus structuré en 4 étapes pour garantir le succès de votre
              transformation digitale, du diagnostic à l'optimisation continue.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {digitalSteps.map((step, i) => (
                <div key={step.number} className="relative">
                  {/* Connecteur horizontal (desktop) */}
                  {i < digitalSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-[calc(100%-0px)] w-6 z-10">
                      <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-300 -translate-x-1">
                        <path stroke="currentColor" strokeWidth="2" fill="none" d="M5 12h14m-5-5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center h-full">
                    <div className={`w-16 h-16 rounded-2xl ${step.accent ? "bg-[#E8861A]" : "bg-[#0A2342]"} text-white font-black text-xl flex items-center justify-center mx-auto mb-5`}>
                      {step.number}
                    </div>
                    <h3 className="text-lg font-bold text-[#0A2342] mb-3">{step.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Contenu onglet 2 */}
        {tab === "intervention" && (
          <>
            <p className="text-center text-gray-500 text-sm mb-10 -mt-4">
              De l'identification du besoin à l'évaluation finale — une méthode rigoureuse pour chaque mission WAYS.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {interventionSteps.map((step, i) => (
                <div key={step.number} className="relative">
                  <div className={`bg-white rounded-2xl p-6 shadow-sm border h-full transition-shadow hover:shadow-md ${step.recurring ? "border-[#E8861A]/40 ring-1 ring-[#E8861A]/20" : "border-gray-100"}`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl shrink-0 ${step.accent ? "bg-[#E8861A]" : "bg-[#0A2342]"} text-white font-black text-sm flex items-center justify-center`}>
                        {step.number}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-bold text-[#0A2342]">{step.title}</h3>
                          {step.recurring && (
                            <span className="text-xs px-2 py-0.5 bg-[#E8861A]/10 text-[#E8861A] rounded-full font-semibold border border-[#E8861A]/20 shrink-0">
                              Continu
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                    {/* Ligne de connexion verticale entre étapes sur mobile */}
                    {i < interventionSteps.length - 1 && (
                      <div className="sm:hidden absolute bottom-0 left-10 w-0.5 h-6 bg-gray-200 translate-y-full" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="text-center mt-10">
          {tab === "digital" ? (
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A2342] text-white font-semibold rounded-xl hover:bg-[#E8861A] transition-colors text-sm"
            >
              Démarrer votre audit gratuit
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          ) : (
            <Link
              href="/contact#contact-form"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8861A] text-white font-semibold rounded-xl hover:bg-[#0A2342] transition-colors text-sm"
            >
              Exprimer votre besoin
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          )}
        </div>

      </div>
    </section>
  );
}
