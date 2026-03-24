import type { NextRequest } from "next/server";

/**
 * Vérifie si la clé x-admin-key est valide.
 * Supporte plusieurs clés séparées par des virgules via ADMIN_KEYS,
 * ou une clé unique via ADMIN_KEY (rétrocompatibilité).
 */
export function checkAdminKey(request: NextRequest): boolean {
  const key = request.headers.get("x-admin-key");
  if (!key) return false;

  // Support multi-clés : ADMIN_KEYS=cle1,cle2,cle3
  const multiKeys = process.env.ADMIN_KEYS;
  if (multiKeys) {
    return multiKeys.split(",").map((k) => k.trim()).includes(key);
  }

  // Fallback clé unique : ADMIN_KEY=cle
  return key === process.env.ADMIN_KEY;
}
