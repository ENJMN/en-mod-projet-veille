import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

import { checkAdminKey } from "@/lib/admin-auth";
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY ?? "";

interface Topic {
  id: string;
  topic: string;
  category: string;
  keywords: string[];
  status: "pending" | "generated";
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

function getNextPendingTopic(): Topic | null {
  const filePath = path.join(process.cwd(), "content", "topics.json");
  if (!fs.existsSync(filePath)) return null;
  const topics: Topic[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return topics.find((t) => t.status === "pending") ?? null;
}

function markTopicGenerated(id: string): void {
  const filePath = path.join(process.cwd(), "content", "topics.json");
  const topics: Topic[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const updated = topics.map((t) => (t.id === id ? { ...t, status: "generated" } : t));
  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), "utf-8");
}

function buildPrompt(topic: string, category: string, keywords: string[]): string {
  const kwList = keywords.length ? keywords.join(", ") : topic;
  return `Tu es un expert en rédaction SEO et consultant senior chez WAYS Digital Solutions, cabinet de conseil opérationnel à intelligence augmentée basé à Abidjan, Côte d'Ivoire. Tu rédiges pour des dirigeants, managers et entrepreneurs d'Afrique de l'Ouest.

Rédige un article de blog complet, optimisé SEO, en français, d'un minimum de 1800 mots sur le sujet suivant :

**Sujet** : ${topic}
**Catégorie** : ${category}
**Mots-clés cibles** : ${kwList}

## Consignes de structure

1. **Frontmatter MDX** (en premier, obligatoire) :
\`\`\`
---
title: "[titre accrocheur incluant le mot-clé principal, max 65 caractères]"
date: "${todayISO()}"
author: "N'Guessan Jacques EBAKA"
excerpt: "[meta description SEO de 150-160 caractères, inclut le mot-clé principal et donne envie de cliquer]"
category: "${category}"
draft: true
---
\`\`\`

2. **Introduction** (150-200 mots) : accroche forte avec chiffre ou constat terrain, problématique claire, annonce du plan.

3. **Corps de l'article** : minimum 5 sections H2, chacune avec 2-3 paragraphes denses (200-300 mots chacun). Utilise des sous-titres H3 quand c'est pertinent. Intègre naturellement les mots-clés cibles (densité 1-2 %).

4. **Éléments de richesse** : inclus au moins 2 de ces éléments :
   - Liste à puces ou numérotée pratique
   - Citation mise en gras (**texte important**)
   - Exemple concret ou cas terrain africain/ivoirien
   - Statistique ou donnée chiffrée sourcée

5. **Conclusion** (100-150 mots) : synthèse des points clés, call-to-action naturel vers les services WAYS.

6. **Séparateur final** : termine par \`---\` puis une ligne commentée suggérant un lien interne WAYS pertinent.

## Consignes de style

- Ton : expert mais accessible, concret, orienté terrain africain
- Éviter : jargon inutile, répétitions, platitudes génériques
- Valoriser : exemples ivoiriens/ouest-africains, retours d'expérience terrain
- Ne jamais inventer des statistiques sans les attribuer à une source plausible

Génère maintenant l'article complet, sans commentaire introductif — commence directement par le frontmatter.`;
}

export async function POST(req: NextRequest) {
  // Auth
  if (!checkAdminKey(req)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY manquant dans les variables d'environnement." },
      { status: 500 }
    );
  }

  // Lire le body (optionnel)
  let topic: string | undefined;
  let category = "IA & Digital";
  let keywords: string[] = [];
  let topicId: string | undefined;

  try {
    const body = await req.json().catch(() => ({}));
    topic = body.topic;
    if (body.category) category = body.category;
    if (body.keywords) keywords = body.keywords;
  } catch {
    // body vide : on utilisera la queue
  }

  // Si pas de sujet fourni, prendre le prochain dans la queue
  if (!topic) {
    const next = getNextPendingTopic();
    if (!next) {
      return NextResponse.json(
        { message: "Aucun sujet en attente dans content/topics.json." },
        { status: 200 }
      );
    }
    topic = next.topic;
    category = next.category;
    keywords = next.keywords ?? [];
    topicId = next.id;
  }

  // Génération via Claude API
  const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  const message = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 8000,
    messages: [{ role: "user", content: buildPrompt(topic, category, keywords) }],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    return NextResponse.json({ error: "Réponse inattendue de l'API Claude." }, { status: 500 });
  }

  const articleText = content.text.trim();

  // Générer le slug depuis le titre dans le frontmatter
  const titleMatch = articleText.match(/^title:\s*["']?(.+?)["']?\s*$/m);
  const titleRaw = titleMatch ? titleMatch[1] : topic;
  const slug = slugify(titleRaw);

  // Sauvegarder le fichier MDX
  const blogsDir = path.join(process.cwd(), "content", "blog");
  const filename = `${slug}.mdx`;
  let finalPath = path.join(blogsDir, filename);

  if (fs.existsSync(finalPath)) {
    finalPath = path.join(blogsDir, `${slug}-${Date.now()}.mdx`);
  }

  fs.writeFileSync(finalPath, articleText, "utf-8");

  // Marquer le sujet comme généré
  if (topicId) {
    markTopicGenerated(topicId);
  }

  const wordCount = articleText.split(/\s+/).length;

  return NextResponse.json({
    success: true,
    slug: path.basename(finalPath, ".mdx"),
    title: titleRaw,
    category,
    wordCount,
    draft: true,
    message: `Article généré avec succès (~${wordCount} mots). Relisez-le avant de publier.`,
  });
}
