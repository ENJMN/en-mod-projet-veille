#!/usr/bin/env node
/**
 * Générateur automatique d'articles de blog SEO — WAYS Digital Solutions
 *
 * Usage :
 *   node scripts/generate-post.mjs
 *     → prend le prochain sujet en attente dans content/topics.json
 *
 *   node scripts/generate-post.mjs --topic "Mon sujet" --category "IA & Digital" --keywords "mot1,mot2"
 *     → génère un article sur le sujet fourni (hors file d'attente)
 *
 * Variables d'environnement requises :
 *   ANTHROPIC_API_KEY  — clé API Anthropic (https://console.anthropic.com)
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ── Helpers ────────────────────────────────────────────────────────────────

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

function parseArgs() {
  const args = process.argv.slice(2);
  const result = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--topic") result.topic = args[++i];
    else if (args[i] === "--category") result.category = args[++i];
    else if (args[i] === "--keywords") result.keywords = args[++i].split(",").map((k) => k.trim());
  }
  return result;
}

function getNextPendingTopic() {
  const filePath = path.join(ROOT, "content", "topics.json");
  if (!fs.existsSync(filePath)) return null;
  const topics = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return topics.find((t) => t.status === "pending") ?? null;
}

function markTopicGenerated(id) {
  const filePath = path.join(ROOT, "content", "topics.json");
  const topics = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const updated = topics.map((t) => (t.id === id ? { ...t, status: "generated" } : t));
  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), "utf-8");
}

// ── Prompt ─────────────────────────────────────────────────────────────────

function buildPrompt(topic, category, keywords) {
  const kwList = keywords?.length ? keywords.join(", ") : topic;
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

4. **Éléments de richesse** : inclus au moins 2 de ces éléments dans l'article :
   - Liste à puces ou numérotée pratique
   - Citation mise en gras (**texte important**)
   - Exemple concret ou cas terrain africain/ivoirien
   - Statistique ou donnée chiffrée sourcée

5. **Conclusion** (100-150 mots) : synthèse des points clés, call-to-action naturel vers les services WAYS (sans être trop commercial).

6. **Séparateur final** : termine par \`---\` puis une phrase de lien interne suggérant un autre article ou service WAYS pertinent (commentée : \`{/* TODO: lien interne → /services/... */}\`).

## Consignes de style

- Ton : expert mais accessible, concret, orienté terrain africain
- Phrases : variées, ni trop courtes ni trop longues (15-25 mots en moyenne)
- Éviter : jargon inutile, répétitions, platitudes génériques non ancrées dans le contexte africain
- Valoriser : exemples ivoiriens/ouest-africains, retours d'expérience terrain, chiffres locaux quand disponibles
- Ne jamais inventer des statistiques sans les attribuer à une source plausible (Forum Économique Mondial, Banque Mondiale, BCEAO, INS-CI, etc.)

Génère maintenant l'article complet, sans commentaire introductif ni explication — commence directement par le frontmatter.`;
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("❌  ANTHROPIC_API_KEY manquant dans les variables d'environnement.");
    console.error("    Ajoutez ANTHROPIC_API_KEY=votre_clé dans .env.local");
    process.exit(1);
  }

  // Déterminer le sujet
  const args = parseArgs();
  let topic, category, keywords, topicId;

  if (args.topic) {
    // Mode on-demand : sujet fourni en argument
    topic = args.topic;
    category = args.category ?? "IA & Digital";
    keywords = args.keywords ?? [];
    console.log(`\n📝  Génération à la demande : "${topic}"`);
  } else {
    // Mode queue : prochain sujet en attente
    const next = getNextPendingTopic();
    if (!next) {
      console.log("✅  Aucun sujet en attente dans content/topics.json — ajoutez-en un !");
      process.exit(0);
    }
    topic = next.topic;
    category = next.category;
    keywords = next.keywords ?? [];
    topicId = next.id;
    console.log(`\n📝  Sujet suivant (id: ${topicId}) : "${topic}"`);
  }

  console.log(`    Catégorie : ${category}`);
  console.log(`    Mots-clés : ${keywords.join(", ") || "—"}\n`);

  // Appel Claude API
  const client = new Anthropic({ apiKey });
  console.log("⏳  Génération de l'article en cours (peut prendre 30-60 secondes)...\n");

  const message = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 8000,
    messages: [
      {
        role: "user",
        content: buildPrompt(topic, category, keywords),
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    console.error("❌  Réponse inattendue de l'API.");
    process.exit(1);
  }

  const articleText = content.text.trim();

  // Extraire le titre depuis le frontmatter pour générer le slug
  const titleMatch = articleText.match(/^title:\s*["']?(.+?)["']?\s*$/m);
  const titleRaw = titleMatch ? titleMatch[1] : topic;
  const slug = slugify(titleRaw);
  const filename = `${slug}.mdx`;
  const outPath = path.join(ROOT, "content", "blog", filename);

  // Vérifier si le fichier existe déjà
  if (fs.existsSync(outPath)) {
    const timestamp = Date.now();
    const altPath = path.join(ROOT, "content", "blog", `${slug}-${timestamp}.mdx`);
    fs.writeFileSync(altPath, articleText, "utf-8");
    console.log(`⚠️   Fichier existant — sauvegardé sous : content/blog/${slug}-${timestamp}.mdx`);
  } else {
    fs.writeFileSync(outPath, articleText, "utf-8");
    console.log(`✅  Article sauvegardé : content/blog/${filename}`);
  }

  // Statistiques
  const wordCount = articleText.split(/\s+/).length;
  console.log(`📊  Nombre de mots estimé : ~${wordCount}`);
  console.log(`🔖  Statut : brouillon (draft: true) — à relire avant publication\n`);

  // Marquer le sujet comme généré dans la queue
  if (topicId) {
    markTopicGenerated(topicId);
    console.log(`📋  topics.json mis à jour — sujet "${topic}" marqué "generated"\n`);
  }

  console.log("👉  Pour publier l'article :");
  console.log(`    1. Ouvrez content/blog/${filename}`);
  console.log("    2. Relisez et ajustez si nécessaire");
  console.log('    3. Changez "draft: true" en "draft: false"\n');
}

main().catch((err) => {
  console.error("❌  Erreur :", err.message);
  process.exit(1);
});
