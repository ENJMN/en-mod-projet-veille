import Link from "next/link";

interface BlogCardProps {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  category: string;
}

const categoryStyles: Record<string, { bar: string; badge: string; text: string }> = {
  "IA & Digital": { bar: "from-[#0A2342] to-[#1e40af]", badge: "bg-[#0A2342]/10 text-[#0A2342]", text: "IA & Digital" },
  "Stratégie":   { bar: "from-[#E8861A] to-[#f59e0b]", badge: "bg-[#E8861A]/10 text-[#E8861A]", text: "Stratégie" },
  "BTP":         { bar: "from-[#059669] to-[#10b981]", badge: "bg-[#059669]/10 text-[#059669]", text: "BTP" },
  "Formation":   { bar: "from-[#7c3aed] to-[#a78bfa]", badge: "bg-[#7c3aed]/10 text-[#7c3aed]", text: "Formation" },
};

const defaultStyle = { bar: "from-[#0A2342] to-[#E8861A]", badge: "bg-[#E8861A]/10 text-[#E8861A]", text: "" };

export default function BlogCard({ slug, title, date, author, excerpt, category }: BlogCardProps) {
  const style = categoryStyles[category] ?? defaultStyle;

  const formattedDate = new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 overflow-hidden flex flex-col">
      <div className={`h-1.5 bg-gradient-to-r ${style.bar}`} />

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${style.badge}`}>
            {category}
          </span>
          <span className="text-gray-400 text-xs">{formattedDate}</span>
        </div>

        <h2 className="text-lg font-bold text-[#0A2342] mb-2 group-hover:text-[#E8861A] transition-colors leading-snug">
          <Link href={`/blog/${slug}`}>{title}</Link>
        </h2>

        <p className="text-gray-600 text-sm leading-relaxed flex-1 line-clamp-3">{excerpt}</p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-gray-500">Par {author}</span>
          <Link
            href={`/blog/${slug}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#E8861A] hover:text-[#0A2342] transition-colors"
          >
            Lire la suite
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
