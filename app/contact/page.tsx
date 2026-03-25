"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  nom: z.string().min(2, "Le nom doit comporter au moins 2 caractères."),
  email: z.string().email("Adresse e-mail invalide."),
  telephone: z.string().optional(),
  bu: z.string().min(1, "Veuillez sélectionner un service."),
  typeDemande: z.string().min(1, "Veuillez sélectionner un type de demande."),
  sujet: z.string().min(3, "Veuillez saisir un sujet."),
  budget: z.string().optional(),
  source: z.string().optional(),
  message: z.string().min(20, "Votre message doit comporter au moins 20 caractères."),
});

type FormData = z.infer<typeof schema>;

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2342] focus:border-transparent placeholder-gray-400 bg-white";

const contactInfo = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: "Adresse",
    value: "Abidjan, Côte d'Ivoire\nPlateau — Cocody",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: "E-mail",
    value: "contact@ways-ci.com",
    href: "mailto:contact@ways-ci.com",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    label: "Téléphone / WhatsApp",
    value: "+225 07 05 13 31 31",
    href: "tel:+2250705133131",
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json();
        setServerError(json.error ?? "Une erreur est survenue. Réessayez.");
        return;
      }
      setSubmitted(true);
      reset();
    } catch {
      setServerError("Impossible d'envoyer le message. Vérifiez votre connexion.");
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-[#0A2342] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 bg-[#E8861A]/20 text-[#E8861A] text-sm font-semibold rounded-full mb-4 border border-[#E8861A]/30">
              Contact
            </span>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Parlons de votre projet
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              Notre équipe est disponible pour répondre à toutes vos questions et
              vous accompagner dans la définition de vos besoins.
            </p>
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="bg-[#F8F9FA] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Contact info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-[#0A2342] mb-2">Nos coordonnées</h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Joignez-nous par e-mail, téléphone ou WhatsApp. Nous répondons sous 24h.
                </p>
              </div>

              {contactInfo.map((info) => (
                <div key={info.label} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-[#0A2342] text-[#E8861A] flex items-center justify-center shrink-0">
                    {info.icon}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
                      {info.label}
                    </p>
                    {info.href ? (
                      <a href={info.href} className="text-[#0A2342] font-medium hover:text-[#E8861A] transition-colors text-sm">
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-[#0A2342] font-medium text-sm whitespace-pre-line">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/2250705133131"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#25D366] text-white text-sm font-semibold rounded-xl hover:bg-[#20bd5a] transition-colors w-full justify-center"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Écrire sur WhatsApp
              </a>

              <div className="rounded-2xl bg-gray-200 h-44 flex items-center justify-center border border-gray-300">
                <div className="text-center text-gray-500">
                  <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <p className="text-sm font-medium">Abidjan, Côte d'Ivoire</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2" id="contact-form">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-black text-[#0A2342] mb-2">Message envoyé !</h3>
                    <p className="text-gray-600 mb-6">
                      Merci pour votre message. Nous vous répondrons sous 24 à 48 heures.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-3 bg-[#E8861A] text-white font-semibold rounded-xl hover:bg-[#d4781a] transition-colors text-sm"
                    >
                      Envoyer un autre message
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-black text-[#0A2342] mb-6">Envoyer un message</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                      {/* Nom + Email */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold text-[#0A2342] mb-1.5">
                            Nom complet <span className="text-[#E8861A]">*</span>
                          </label>
                          <input {...register("nom")} type="text" placeholder="Jacques Ebaka" className={inputClass} />
                          {errors.nom && <p className="mt-1 text-xs text-red-500">{errors.nom.message}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-[#0A2342] mb-1.5">
                            Adresse e-mail <span className="text-[#E8861A]">*</span>
                          </label>
                          <input {...register("email")} type="email" placeholder="vous@exemple.com" className={inputClass} />
                          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                        </div>
                      </div>

                      {/* Téléphone */}
                      <div>
                        <label className="block text-sm font-semibold text-[#0A2342] mb-1.5">
                          Téléphone / WhatsApp
                          <span className="text-gray-400 font-normal ml-1">(optionnel)</span>
                        </label>
                        <input {...register("telephone")} type="tel" placeholder="+225 07 00 00 00 00" className={inputClass} />
                      </div>

                      {/* BU + Type de demande */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold text-[#0A2342] mb-1.5">
                            Service concerné <span className="text-[#E8861A]">*</span>
                          </label>
                          <select {...register("bu")} className={inputClass}>
                            <option value="">Sélectionner…</option>
                            <option value="WAYS IA & Digital">WAYS IA & Digital</option>
                            <option value="WAYS Stratégie">WAYS Stratégie</option>
                            <option value="WAYS Build (BTP)">WAYS Build (BTP)</option>
                            <option value="WAYS Academy">WAYS Academy</option>
                            <option value="Non défini">Non défini</option>
                          </select>
                          {errors.bu && <p className="mt-1 text-xs text-red-500">{errors.bu.message}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-[#0A2342] mb-1.5">
                            Type de demande <span className="text-[#E8861A]">*</span>
                          </label>
                          <select {...register("typeDemande")} className={inputClass}>
                            <option value="">Sélectionner…</option>
                            <option value="Audit / Diagnostic">Audit / Diagnostic</option>
                            <option value="Demande de devis">Demande de devis</option>
                            <option value="Mission de conseil">Mission de conseil</option>
                            <option value="Formation">Formation</option>
                            <option value="Projet BTP / Immobilier">Projet BTP / Immobilier</option>
                            <option value="Partenariat">Partenariat</option>
                            <option value="Autre">Autre</option>
                          </select>
                          {errors.typeDemande && <p className="mt-1 text-xs text-red-500">{errors.typeDemande.message}</p>}
                        </div>
                      </div>

                      {/* Sujet */}
                      <div>
                        <label className="block text-sm font-semibold text-[#0A2342] mb-1.5">
                          Sujet <span className="text-[#E8861A]">*</span>
                        </label>
                        <input {...register("sujet")} type="text" placeholder="Ex : Audit de mes processus de gestion client" className={inputClass} />
                        {errors.sujet && <p className="mt-1 text-xs text-red-500">{errors.sujet.message}</p>}
                      </div>

                      {/* Budget + Source */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold text-[#0A2342] mb-1.5">
                            Budget estimé
                            <span className="text-gray-400 font-normal ml-1">(optionnel)</span>
                          </label>
                          <select {...register("budget")} className={inputClass}>
                            <option value="">Non défini</option>
                            <option value="Moins de 500 000 FCFA">Moins de 500 000 FCFA</option>
                            <option value="500 000 – 2 000 000 FCFA">500 000 – 2 000 000 FCFA</option>
                            <option value="2 000 000 – 5 000 000 FCFA">2 000 000 – 5 000 000 FCFA</option>
                            <option value="Plus de 5 000 000 FCFA">Plus de 5 000 000 FCFA</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-[#0A2342] mb-1.5">
                            Comment nous avez-vous connus ?
                            <span className="text-gray-400 font-normal ml-1">(optionnel)</span>
                          </label>
                          <select {...register("source")} className={inputClass}>
                            <option value="">Sélectionner…</option>
                            <option value="Google / Recherche web">Google / Recherche web</option>
                            <option value="Réseaux sociaux">Réseaux sociaux</option>
                            <option value="LinkedIn">LinkedIn</option>
                            <option value="Recommandation">Recommandation</option>
                            <option value="WhatsApp">WhatsApp</option>
                            <option value="Autre">Autre</option>
                          </select>
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-sm font-semibold text-[#0A2342] mb-1.5">
                          Message <span className="text-[#E8861A]">*</span>
                        </label>
                        <textarea
                          {...register("message")}
                          rows={5}
                          placeholder="Décrivez votre projet, vos besoins ou vos questions…"
                          className={`${inputClass} resize-none`}
                        />
                        {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
                      </div>

                      {serverError && (
                        <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                          {serverError}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-[#0A2342] text-white font-bold rounded-xl hover:bg-[#E8861A] transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Envoi en cours…" : "Envoyer le message"}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
