/**
 * AI Communication Engine — Utilities
 * hashInput, withRetry, tokenEstimate — all in one file.
 */

import type { AIRequest } from '../types/ai.types';

// ─── Hash Input ───────────────────────────────────────────────────────────────
// Deterministic cache key from request fields that affect output.

export function hashInput(request: AIRequest): string {
  const key = [
    request.formData.fullName.trim().toLowerCase(),
    request.formData.location?.trim().toLowerCase() ?? '',
    request.purpose,
    request.context.trim().toLowerCase(),
    String(request.variationIndex ?? 0),
  ].join('|');

  // Simple djb2 hash — fast, no crypto needed for cache keys
  let hash = 5381;
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) + hash) + key.charCodeAt(i);
    hash |= 0; // Convert to 32-bit integer
  }
  return String(Math.abs(hash));
}

// ─── Retry with Exponential Backoff ──────────────────────────────────────────

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts: number,
  baseDelayMs: number,
  backoffFactor: number,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;

      // Don't retry non-retryable errors
      const { AIError } = await import('../types/error.types');
      if (err instanceof AIError && !err.retryable) throw err;

      if (attempt < maxAttempts) {
        const delay = baseDelayMs * Math.pow(backoffFactor, attempt - 1);
        await sleep(delay);
      }
    }
  }

  throw lastError;
}

// ─── Token Estimator ──────────────────────────────────────────────────────────
// Rough estimate: ~4 chars per token (GPT-4 / Gemini approximation)

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

// ─── Sleep ────────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
