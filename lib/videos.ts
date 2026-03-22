import fs from "fs";
import path from "path";

export interface Video {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
}

export function getAllVideos(): Video[] {
  const filePath = path.join(process.cwd(), "content", "videos.json");
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf-8");
  const videos: Video[] = JSON.parse(raw);
  return videos.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getYoutubeThumbnail(id: string): string {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

export function getYoutubeUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}
