import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { getApprovedComments } from "@/lib/comments";
import CommentForm from "@/components/CommentForm";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://ways-ci.com/blog/${slug}`,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: [post.category, "WAYS Digital Solutions", "Côte d'Ivoire"],
    },
  };
}

function renderContent(content: string): string {
  return content
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[h|u|b|l|p])(.+)$/gm, "<p>$1</p>")
    .replace(/<p><\/p>/g, "");
}

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const formattedDate = new Date(post.date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const htmlContent = renderContent(post.content);
  const comments = getApprovedComments(slug);

  return (
    <>
      {/* Article Hero */}
      <section className="bg-[#0A2342] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#E8861A] text-sm mb-6 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Retour au blog
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <span className="inline-block px-3 py-1 bg-[#E8861A]/20 text-[#E8861A] text-sm font-semibold rounded-full border border-[#E8861A]/30">
              {post.category}
            </span>
            <span className="text-gray-400 text-sm">{formattedDate}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
            {post.title}
          </h1>

          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E8861A] text-white font-bold text-sm flex items-center justify-center shrink-0">
              {post.author.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <p className="text-sm font-semibold">{post.author}</p>
              <p className="text-gray-400 text-xs">Expert WAYS</p>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#F8F9FA] py-12 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0A2342] text-white rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-black mb-3">Cet article vous a inspiré ?</h2>
            <p className="text-gray-300 mb-6 max-w-lg mx-auto">
              Parlons de vos projets. Nos experts sont prêts à vous accompagner dans votre transformation.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact" className="px-6 py-3 bg-[#E8861A] text-white font-semibold rounded-xl hover:bg-[#d4781a] transition-colors text-sm">
                Nous contacter
              </Link>
              <Link href="/blog" className="px-6 py-3 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-colors text-sm">
                Lire d'autres articles
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Comments Section */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Approved comments */}
          <div className="mb-12">
            <h2 className="text-2xl font-black text-[#0A2342] mb-8 flex items-center gap-3">
              <svg className="w-6 h-6 text-[#E8861A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {comments.length > 0 ? `${comments.length} commentaire${comments.length > 1 ? "s" : ""}` : "Commentaires"}
            </h2>

            {comments.length === 0 ? (
              <div className="text-center py-10 bg-[#F8F9FA] rounded-2xl border border-gray-100">
                <p className="text-gray-500 text-sm">Soyez le premier à commenter cet article.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-[#F8F9FA] rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#0A2342] text-white font-bold text-sm flex items-center justify-center shrink-0">
                        {comment.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <p className="font-bold text-[#0A2342] text-sm">{comment.name}</p>
                          <span className="text-gray-400 text-xs">
                            {new Date(comment.date).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Comment form */}
          <div className="bg-[#F8F9FA] rounded-2xl p-6 sm:p-8 border border-gray-100">
            <h3 className="text-xl font-black text-[#0A2342] mb-6">Laisser un commentaire</h3>
            <CommentForm slug={slug} />
          </div>

        </div>
      </section>
    </>
  );
}
