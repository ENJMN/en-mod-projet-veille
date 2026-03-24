const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  ip: string,
  options: { max: number; windowMs: number }
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + options.windowMs });
    return { allowed: true, remaining: options.max - 1 };
  }

  if (entry.count >= options.max) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: options.max - entry.count };
}

export function getIP(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}
