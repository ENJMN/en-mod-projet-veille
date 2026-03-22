import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez WAYS Digital Solutions à Abidjan. Décrivez votre projet et obtenez une réponse sous 24h. Formulaire, e-mail ou WhatsApp.",
  openGraph: {
    title: "Contact — WAYS Digital Solutions",
    description:
      "Un projet ? Une question ? Contactez notre équipe à Abidjan. Réponse garantie sous 24h.",
    url: "https://ways-ci.com/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
