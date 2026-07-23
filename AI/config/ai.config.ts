/**
 * AI Communication Engine — Central Configuration
 * Change model, limits, and behavior here only. Nothing else needs to change.
 */

export const AIConfig = {
  // ── Provider ──────────────────────────────────────────────────────────────
  provider: 'gemini' as const,

  /** Model loaded from env — change VITE_GEMINI_MODEL to switch models */
  model: (import.meta.env.VITE_GEMINI_MODEL as string) || 'gemini-3.1-flash-lite',
  fallbackModel: 'gemini-1.5-flash-8b',

  // ── Generation ────────────────────────────────────────────────────────────
  temperature: 0.8,
  topP: 0.95,
  maxTokens: 1024,
  timeoutMs: 15_000,

  // ── Retry ─────────────────────────────────────────────────────────────────
  retry: {
    maxAttempts: 3,
    baseDelayMs: 1_000,
    backoffFactor: 2,
  },

  // ── Rate Limiting ─────────────────────────────────────────────────────────
  rateLimit: {
    maxCalls: 5,
    windowMs: 60_000,           // 5 calls per minute
  },

  // ── Cache ─────────────────────────────────────────────────────────────────
  cache: {
    enabled: true,
    ttlMs: 30_000,              // 30 seconds
  },

  // ── API Endpoint ──────────────────────────────────────────────────────────
  /** Serverless function — key lives there, not here */
  apiEndpoint: '/api/ai/generate',

  // ── Version ───────────────────────────────────────────────────────────────
  version: '1.0.0',

  // ── Development ───────────────────────────────────────────────────────────
  /** Enables PromptDebugPanel, verbose logging */
  dev: import.meta.env.DEV as boolean,
} as const;
