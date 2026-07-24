import "server-only";

import type { NextRequest } from "next/server";

const DEFAULT_WINDOW_MS = 60_000;
const DEFAULT_MAX_REQUESTS = 5;

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const globalStore = globalThis as typeof globalThis & {
  internAiRateLimits?: Map<string, RateLimitEntry>;
};

const store =
  globalStore.internAiRateLimits ??
  (globalStore.internAiRateLimits = new Map<string, RateLimitEntry>());

function getClientIdentifier(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown-client";
}

interface RateLimitOptions {
  namespace: string;
  maxRequests?: number;
  windowMs?: number;
}

export function getRateLimitIdentifier(request: NextRequest) {
  return getClientIdentifier(request);
}

export function checkRateLimit(
  request: NextRequest,
  {
    namespace,
    maxRequests = DEFAULT_MAX_REQUESTS,
    windowMs = DEFAULT_WINDOW_MS,
  }: RateLimitOptions
) {
  // TODO: Firebase Admin token doğrulaması eklendiğinde anahtar olarak uid kullan.
  const identifier = getClientIdentifier(request);
  const key = `${namespace}:${identifier}`;
  const now = Date.now();
  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (current.count >= maxRequests) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

export function checkAiRateLimit(request: NextRequest) {
  return checkRateLimit(request, { namespace: "ai-generation" });
}
