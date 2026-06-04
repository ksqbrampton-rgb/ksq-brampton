import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Rate limiters using Upstash Redis.
 * Falls back gracefully (allows request) if env vars are not set —
 * safe for local dev without Upstash configured.
 */

function createLimiter(requests: number, windowSeconds: number) {
  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    // Dev fallback — no rate limiting applied
    return null;
  }

  const redis = new Redis({ url, token });
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, `${windowSeconds} s`),
    analytics: false,
  });
}

// 3 booking attempts per IP per hour
export const bookingLimiter = createLimiter(3, 3600);

// 3 contact form submissions per IP per hour
export const contactLimiter = createLimiter(3, 3600);

/**
 * Check rate limit for a given IP.
 * Returns { allowed: true } if under limit or if Upstash not configured.
 * Returns { allowed: false, reset: Date } if over limit.
 */
export async function checkRateLimit(
  limiter: ReturnType<typeof createLimiter>,
  identifier: string
): Promise<{ allowed: boolean; reset?: Date }> {
  if (!limiter) return { allowed: true };

  const result = await limiter.limit(identifier);
  if (result.success) return { allowed: true };

  return {
    allowed: false,
    reset: new Date(result.reset),
  };
}

/**
 * Extract IP from Next.js request headers.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}
