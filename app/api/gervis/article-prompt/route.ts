import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { checkAdminKey } from "@/lib/admin-auth";

const PROMPT_FILE = path.join(process.cwd(), "data", "article-prompt.txt");

export async function GET(req: NextRequest) {
  if (!checkAdminKey(req)) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  const prompt = fs.existsSync(PROMPT_FILE) ? fs.readFileSync(PROMPT_FILE, "utf-8") : "";
  return NextResponse.json({ prompt });
}

export async function PUT(req: NextRequest) {
  if (!checkAdminKey(req)) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  const { prompt } = await req.json();
  if (typeof prompt !== "string" || !prompt.trim()) {
    return NextResponse.json({ error: "Prompt invalide." }, { status: 400 });
  }
  fs.writeFileSync(PROMPT_FILE, prompt, "utf-8");
  return NextResponse.json({ success: true });
}
