"use client";

import { useState } from "react";
import BlogCard from "@/components/BlogCard";
import type { BlogPost } from "@/lib/blog";

const categories = ["Tous", "IA & Digital", "Stratégie", "Formation", "BTP"];

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  const [active, setActive] = useState("Tous");

  const filtered =
    active === "Tous" ? posts : posts.filter((p) => p.category === active);

  return (
    <>
      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              active === cat
                ? "bg-[#0A2342] text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-[#0A2342] hover:text-[#0A2342]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-12">
          Aucun article dans cette catégorie.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => (
            <BlogCard key={post.slug} {...post} />
          ))}
        </div>
      )}
    </>
  );
}
