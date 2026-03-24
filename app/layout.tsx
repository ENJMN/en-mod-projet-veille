import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ways-ci.com"),
  title: {
    template: "%s | WAYS Digital Solutions",
    default: "WAYS Digital Solutions — We Act for Your Success",
  },
  description:
    "Cabinet de conseil opérationnel à intelligence augmentée. Transformation digitale, stratégie, BTP/Immobilier et formation professionnelle à Abidjan, Côte d'Ivoire.",
  keywords: [
    "conseil digital Abidjan",
    "transformation digitale Côte d'Ivoire",
    "formation professionnelle Abidjan",
    "intelligence artificielle PME Afrique",
    "BTP immobilier Côte d'Ivoire",
    "WAYS Digital Solutions",
  ],
  authors: [{ name: "N'Guessan Jacques EBAKA" }],
  creator: "WAYS Digital Solutions",
  openGraph: {
    type: "website",
    locale: "fr_CI",
    url: "https://ways-ci.com",
    siteName: "WAYS Digital Solutions",
    title: "WAYS Digital Solutions — We Act for Your Success",
    description:
      "Cabinet de conseil opérationnel à intelligence augmentée. Transformation digitale, stratégie, BTP et formation à Abidjan.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "WAYS Digital Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WAYS Digital Solutions",
    description:
      "Cabinet de conseil opérationnel à intelligence augmentée à Abidjan, Côte d'Ivoire.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex flex-col min-h-screen bg-white text-[#1A1A2E]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
