import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import BlogList from "@/components/BlogList";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights, analyses et conseils des experts WAYS sur la stratégie, la formation, l'immobilier et le digital en Afrique de l'Ouest.",
  openGraph: {
    title: "Blog — WAYS Digital Solutions",
    description:
      "Articles et analyses sur la transformation digitale, la stratégie d'entreprise, le BTP et la formation professionnelle en Côte d'Ivoire.",
    url: "https://ways-ci.com/blog",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      {/* Hero */}
      <section className="bg-[#0A2342] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 bg-[#E8861A]/20 text-[#E8861A] text-sm font-semibold rounded-full mb-4 border border-[#E8861A]/30">
              Blog & Insights
            </span>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Nos articles et analyses
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              Les experts WAYS partagent leurs perspectives sur les enjeux stratégiques,
              les tendances sectorielles et les meilleures pratiques pour développer
              votre organisation.
            </p>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="bg-[#F8F9FA] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlogList posts={posts} />
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-black text-[#0A2342] mb-3">
            Restez informé
          </h2>
          <p className="text-gray-600 mb-6">
            Recevez nos derniers articles et analyses directement dans votre boîte mail.
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="votre@email.com"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2342] focus:border-transparent"
            />
            <button className="px-5 py-3 bg-[#0A2342] text-white text-sm font-semibold rounded-xl hover:bg-[#E8861A] transition-colors whitespace-nowrap">
              S'abonner
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
