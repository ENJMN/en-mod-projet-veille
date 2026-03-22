import type { Metadata } from "next";
import Image from "next/image";
import { getAllVideos, getYoutubeThumbnail, getYoutubeUrl } from "@/lib/videos";

export const metadata: Metadata = {
  title: "Vidéos",
  description:
    "Retrouvez toutes les vidéos de la chaîne YouTube WAYS Digital Solutions : conseils, tutoriels et analyses sur la transformation digitale, la stratégie et le BTP.",
  openGraph: {
    title: "Vidéos — WAYS Digital Solutions",
    description:
      "Chaîne YouTube WAYS : conseils pratiques, tutoriels digitaux et analyses sectorielles pour les entrepreneurs et managers d'Afrique de l'Ouest.",
    url: "https://ways-ci.com/videos",
  },
};

const categoryStyles: Record<string, string> = {
  "IA & Digital": "bg-[#0A2342]/10 text-[#0A2342]",
  "Stratégie": "bg-[#E8861A]/10 text-[#E8861A]",
  "BTP": "bg-[#059669]/10 text-[#059669]",
  "Formation": "bg-[#7c3aed]/10 text-[#7c3aed]",
};

export default function VideosPage() {
  const videos = getAllVideos();

  return (
    <>
      {/* Hero */}
      <section className="bg-[#0A2342] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#E8861A]/20 text-[#E8861A] text-sm font-semibold rounded-full mb-4 border border-[#E8861A]/30">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-2.75 12.65 12.65 0 00-8.45 0A4.83 4.83 0 014.41 6.69 29.94 29.94 0 004 12a29.94 29.94 0 00.41 5.31 4.83 4.83 0 013.77 2.75 12.65 12.65 0 008.45 0 4.83 4.83 0 013.77-2.75A29.94 29.94 0 0020 12a29.94 29.94 0 00-.41-5.31zM10 15V9l5 3-5 3z" />
              </svg>
              Chaîne YouTube
            </span>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Nos vidéos & tutoriels
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              Conseils pratiques, analyses sectorielles et tutoriels digitaux pour
              les entrepreneurs et managers d'Afrique de l'Ouest.
            </p>
          </div>
        </div>
      </section>

      {/* Videos grid */}
      <section className="bg-[#F8F9FA] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {videos.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-2.75 12.65 12.65 0 00-8.45 0A4.83 4.83 0 014.41 6.69 29.94 29.94 0 004 12a29.94 29.94 0 00.41 5.31 4.83 4.83 0 013.77 2.75 12.65 12.65 0 008.45 0 4.83 4.83 0 013.77-2.75A29.94 29.94 0 0020 12a29.94 29.94 0 00-.41-5.31zM10 15V9l5 3-5 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-black text-[#0A2342] mb-2">Bientôt disponible</h2>
              <p className="text-gray-500 text-sm max-w-sm mx-auto">
                Notre chaîne YouTube est en préparation. Abonnez-vous pour être notifié dès la première vidéo.
              </p>
              <a
                href="https://www.youtube.com/@EnModProjet"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-2.75 12.65 12.65 0 00-8.45 0A4.83 4.83 0 014.41 6.69 29.94 29.94 0 004 12a29.94 29.94 0 00.41 5.31 4.83 4.83 0 013.77 2.75 12.65 12.65 0 008.45 0 4.83 4.83 0 013.77-2.75A29.94 29.94 0 0020 12a29.94 29.94 0 00-.41-5.31zM10 15V9l5 3-5 3z" />
                </svg>
                S'abonner sur YouTube
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <a
                  key={video.id}
                  href={getYoutubeUrl(video.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden bg-gray-100">
                    <Image
                      src={getYoutubeThumbnail(video.id)}
                      alt={video.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                        <svg className="w-6 h-6 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    {/* YouTube badge */}
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-2.75 12.65 12.65 0 00-8.45 0A4.83 4.83 0 014.41 6.69 29.94 29.94 0 004 12a29.94 29.94 0 00.41 5.31 4.83 4.83 0 013.77 2.75 12.65 12.65 0 008.45 0 4.83 4.83 0 013.77-2.75A29.94 29.94 0 0020 12a29.94 29.94 0 00-.41-5.31zM10 15V9l5 3-5 3z" />
                        </svg>
                        YouTube
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${categoryStyles[video.category] ?? "bg-gray-100 text-gray-600"}`}>
                        {video.category}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(video.date).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <h2 className="font-black text-[#0A2342] text-base leading-snug mb-2 group-hover:text-[#E8861A] transition-colors line-clamp-2">
                      {video.title}
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                      {video.description}
                    </p>
                    <div className="mt-4 flex items-center gap-1 text-[#E8861A] text-sm font-semibold">
                      Regarder sur YouTube
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA subscribe */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-red-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-2.75 12.65 12.65 0 00-8.45 0A4.83 4.83 0 014.41 6.69 29.94 29.94 0 004 12a29.94 29.94 0 00.41 5.31 4.83 4.83 0 013.77 2.75 12.65 12.65 0 008.45 0 4.83 4.83 0 013.77-2.75A29.94 29.94 0 0020 12a29.94 29.94 0 00-.41-5.31zM10 15V9l5 3-5 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-[#0A2342] mb-3">
            Abonnez-vous à la chaîne
          </h2>
          <p className="text-gray-600 mb-6">
            Ne manquez aucune vidéo — conseils, analyses et retours d'expérience
            publiés régulièrement.
          </p>
          <a
            href="https://www.youtube.com/@EnModProjet"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-2.75 12.65 12.65 0 00-8.45 0A4.83 4.83 0 014.41 6.69 29.94 29.94 0 004 12a29.94 29.94 0 00.41 5.31 4.83 4.83 0 013.77 2.75 12.65 12.65 0 008.45 0 4.83 4.83 0 013.77-2.75A29.94 29.94 0 0020 12a29.94 29.94 0 00-.41-5.31zM10 15V9l5 3-5 3z" />
            </svg>
            S'abonner sur YouTube
          </a>
        </div>
      </section>
    </>
  );
}
