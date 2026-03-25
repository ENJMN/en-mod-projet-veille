"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

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

interface Post {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  category: string;
  draft: boolean;
  cover_image: string | null;
  content: string;
}

export default function PreviewPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const [post, setPost] = useState<Post | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Cover image state
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [coverMsg, setCoverMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const adminKey = typeof window !== "undefined" ? sessionStorage.getItem("ways_admin_key") ?? "" : "";

  useEffect(() => {
    fetch(`/api/gervis/articles/${slug}`, { headers: { "x-admin-key": adminKey } })
      .then(async (res) => {
        if (!res.ok) { setNotFound(true); return; }
        const data = await res.json();
        setPost(data);
      });
  }, [slug, adminKey]);

  async function handleUrlUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!imageUrl.trim()) return;
    setUploading(true);
    const res = await fetch("/api/gervis/articles/cover", {
      method: "PUT",
      headers: { "x-admin-key": adminKey, "Content-Type": "application/json" },
      body: JSON.stringify({ slug, imageUrl: imageUrl.trim() }),
    });
    setUploading(false);
    if (res.ok) {
      const data = await res.json();
      setPost((p) => p ? { ...p, cover_image: data.coverImage } : p);
      setCoverMsg({ type: "success", text: "Image mise à jour." });
      setImageUrl("");
    } else {
      setCoverMsg({ type: "error", text: "Erreur lors de la mise à jour." });
    }
    setTimeout(() => setCoverMsg(null), 4000);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(",")[1];
      const res = await fetch("/api/gervis/articles/cover", {
        method: "PUT",
        headers: { "x-admin-key": adminKey, "Content-Type": "application/json" },
        body: JSON.stringify({ slug, imageBase64: base64, mimeType: file.type }),
      });
      setUploading(false);
      if (res.ok) {
        const data = await res.json();
        setPost((p) => p ? { ...p, cover_image: data.coverImage } : p);
        setCoverMsg({ type: "success", text: "Image uploadée et mise à jour." });
      } else {
        setCoverMsg({ type: "error", text: "Erreur lors de l'upload." });
      }
      setTimeout(() => setCoverMsg(null), 4000);
      if (fileRef.current) fileRef.current.value = "";
    };
    reader.readAsDataURL(file);
  }

  if (notFound) return <div className="p-8 text-gray-500">Article introuvable.</div>;
  if (!post) return <div className="p-8 text-gray-400 text-sm">Chargement...</div>;

  const htmlContent = renderContent(post.content);
  const wordCount = post.content.split(/\s+/).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Barre admin */}
      <div className="sticky top-0 z-10 bg-[#0A2342] text-white px-6 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-300 hover:text-white text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Retour
          </button>
          <span className="text-gray-500">|</span>
          <span className="text-sm font-semibold truncate max-w-xs">{post.title}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${post.draft ? "bg-yellow-500/20 text-yellow-300" : "bg-green-500/20 text-green-300"}`}>
            {post.draft ? "Brouillon" : "Publié"}
          </span>
          <span className="text-xs text-gray-400">~{wordCount} mots</span>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Cover image */}
          {post.cover_image && (
            <div className="relative w-full h-56 md:h-80 bg-gray-100">
              <Image src={post.cover_image} alt={post.title} fill className="object-cover" />
            </div>
          )}

          {/* Header article */}
          <div className="bg-[#0A2342] text-white p-8">
            <span className="inline-block px-3 py-1 bg-[#E8861A]/20 text-[#E8861A] text-sm font-semibold rounded-full border border-[#E8861A]/30 mb-4">
              {post.category}
            </span>
            <h1 className="text-2xl md:text-3xl font-black mb-3 leading-tight">{post.title}</h1>
            <p className="text-gray-300 leading-relaxed">{post.excerpt}</p>
            <p className="text-gray-400 text-sm mt-4">{post.date} · {post.author}</p>
          </div>

          {/* Remplacement image de couverture */}
          <div className="border-b border-gray-100 p-6 bg-gray-50">
            <h2 className="text-sm font-bold text-[#0A2342] mb-3">Image de couverture</h2>
            {coverMsg && (
              <div className={`mb-3 px-3 py-2 rounded-lg text-xs font-medium ${coverMsg.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                {coverMsg.text}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* URL */}
              <form onSubmit={handleUrlUpdate} className="flex gap-2 flex-1">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... (URL de l'image)"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20"
                />
                <button type="submit" disabled={uploading || !imageUrl.trim()}
                  className="px-4 py-2 bg-[#0A2342] text-white text-xs font-semibold rounded-lg hover:bg-[#E8861A] transition-colors disabled:opacity-50">
                  {uploading ? "..." : "Appliquer"}
                </button>
              </form>
              {/* Upload fichier */}
              <div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="cover-upload" />
                <label htmlFor="cover-upload"
                  className={`inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold cursor-pointer hover:bg-gray-100 transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  {uploading ? "Upload..." : "Envoyer un fichier"}
                </label>
              </div>
            </div>
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
