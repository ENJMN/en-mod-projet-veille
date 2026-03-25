import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug } from "@/lib/blog";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

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

export default async function PreviewPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const htmlContent = renderContent(post.content);
  const wordCount = post.content.split(/\s+/).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Barre admin */}
      <div className="sticky top-0 z-10 bg-[#0A2342] text-white px-6 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <Link href="/gervis/articles" className="flex items-center gap-2 text-gray-300 hover:text-white text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Retour aux articles
          </Link>
          <span className="text-gray-500">|</span>
          <span className="text-sm font-semibold truncate max-w-xs">{post.title}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-full font-medium">
            {post.draft ? "Brouillon" : "Publié"}
          </span>
          <span className="text-xs text-gray-400">~{wordCount} mots</span>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header article */}
          <div className="bg-[#0A2342] text-white p-8">
            <span className="inline-block px-3 py-1 bg-[#E8861A]/20 text-[#E8861A] text-sm font-semibold rounded-full border border-[#E8861A]/30 mb-4">
              {post.category}
            </span>
            <h1 className="text-2xl md:text-3xl font-black mb-3 leading-tight">{post.title}</h1>
            <p className="text-gray-300 leading-relaxed">{post.excerpt}</p>
            <p className="text-gray-400 text-sm mt-4">{post.date} · {post.author}</p>
          </div>

          {/* Corps */}
          <div className="p-8">
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
