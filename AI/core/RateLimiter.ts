/**
 * AI Communication Engine — Rate Limiter
 * 5 generate calls per 60 seconds per session.
 * Returns remaining seconds when blocked.
 */

import { AIConfig } from '../config/ai.config';
import { AIError, AIErrorCode } from '../types/error.types';

export interface RateLimitStatus {
  allowed: boolean;
  remainingCalls: number;
  resetInSeconds: number;
}

export class RateLimiter {
  private calls: number[] = [];

  private get config() {
    return AIConfig.rateLimit;
  }

  check(): RateLimitStatus {
    this.prune();
    const remaining = this.config.maxCalls - this.calls.length;
    const allowed   = remaining > 0;

    let resetInSeconds = 0;
    if (!allowed && this.calls.length > 0) {
      const oldestCall = this.calls[0];
      resetInSeconds = Math.ceil((oldestCall + this.config.windowMs - Date.now()) / 1000);
    }

    return { allowed, remainingCalls: Math.max(0, remaining), resetInSeconds };
  }

  consume(): void {
    const { allowed, resetInSeconds } = this.check();
    if (!allowed) {
      const err = new AIError(
        AIErrorCode.RATE_LIMITED,
        `Rate limited. Wait ${resetInSeconds}s.`,
      );
      // Override user message with countdown
      err.userMessage = `Too many requests. Please wait ${resetInSeconds} second${resetInSeconds !== 1 ? 's' : ''}.`;
      throw err;
    }
    this.calls.push(Date.now());
  }

  /** Remove calls outside the current window */
  private prune(): void {
    const cutoff = Date.now() - this.config.windowMs;
    this.calls = this.calls.filter(t => t > cutoff);
  }
}
