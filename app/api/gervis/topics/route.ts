import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { checkAdminKey } from "@/lib/admin-auth";

const TOPICS_FILE = path.join(process.cwd(), "data", "topics.json");

interface Topic {
  id: string;
  topic: string;
  category: string;
  keywords: string[];
  status: "pending" | "generated";
  source?: string;
  added_at?: string;
}

function loadTopics(): Topic[] {
  if (!fs.existsSync(TOPICS_FILE)) return [];
  return JSON.parse(fs.readFileSync(TOPICS_FILE, "utf-8"));
}

function saveTopics(topics: Topic[]): void {
  fs.mkdirSync(path.dirname(TOPICS_FILE), { recursive: true });
  fs.writeFileSync(TOPICS_FILE, JSON.stringify(topics, null, 2), "utf-8");
}

// GET — liste tous les sujets
export async function GET(req: NextRequest) {
  if (!checkAdminKey(req)) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  return NextResponse.json({ topics: loadTopics() });
}

// POST — ajouter un ou plusieurs sujets
export async function POST(req: NextRequest) {
  if (!checkAdminKey(req)) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const body = await req.json();
  const items: { topic: string; category?: string; keywords?: string[]; source?: string }[] =
    Array.isArray(body) ? body : [body];

  if (!items.length) return NextResponse.json({ error: "Aucun sujet fourni." }, { status: 400 });

  const topics = loadTopics();
  const existing = new Set(topics.map(t => t.topic.toLowerCase()));
  const added: Topic[] = [];

  for (const item of items) {
    if (!item.topic?.trim()) continue;
    if (existing.has(item.topic.toLowerCase())) continue; // éviter les doublons

    const newTopic: Topic = {
      id: `topic-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      topic: item.topic.trim(),
      category: item.category ?? "IA & Digital",
      keywords: item.keywords ?? [],
      status: "pending",
      source: item.source ?? "manual",
      added_at: new Date().toISOString(),
    };
    topics.push(newTopic);
    existing.add(newTopic.topic.toLowerCase());
    added.push(newTopic);
  }

  saveTopics(topics);
  return NextResponse.json({ success: true, added: added.length, topics: added });
}

// DELETE — réinitialiser les sujets générés (garder uniquement les pending)
export async function DELETE(req: NextRequest) {
  if (!checkAdminKey(req)) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  const topics = loadTopics().filter(t => t.status === "pending");
  saveTopics(topics);
  return NextResponse.json({ success: true, remaining: topics.length });
}
