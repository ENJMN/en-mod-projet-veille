"use client";

import { useEffect, useRef, useState } from "react";

interface BunnyPlayerProps {
  videoId: string;
  libraryId?: string;
  onProgress?: (percent: number) => void;
  onComplete?: () => void;
  className?: string;
}

export default function BunnyPlayer({
  videoId,
  libraryId = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID ?? "",
  onProgress,
  onComplete,
  className = "",
}: BunnyPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [completed, setCompleted] = useState(false);

  const embedUrl = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=false&loop=false&muted=false&preload=true&responsive=true`;

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== "object") return;
      if (event.data.type !== "timeupdate") return;

      const { currentTime, duration } = event.data;
      if (!duration || duration === 0) return;

      const percent = Math.round((currentTime / duration) * 100);
      onProgress?.(percent);

      // Marquer comme complété à 90%
      if (percent >= 90 && !completed) {
        setCompleted(true);
        onComplete?.();
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [completed, onComplete, onProgress]);

  return (
    <div className={`relative w-full aspect-video rounded-xl overflow-hidden bg-black ${className}`}>
      <iframe
        ref={iframeRef}
        src={embedUrl}
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        title="Lecteur vidéo"
      />
    </div>
  );
}
