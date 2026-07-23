/**
 * AI Communication Engine — Intent Detector
 *
 * Keyword-based only. NO API calls.
 * Fires ONLY when the user has not selected a purpose (purpose === null).
 * Suggests but does not force — confidence < 70% shows a chip, not auto-select.
 */

import { INTENT_KEYWORDS } from '../config/constants';
import type { Purpose, IntentResult } from '../types/ai.types';

export class IntentDetector {
  detect(text: string): IntentResult {
    if (!text || text.trim().length < 3) {
      return { detected: null, confidence: 0, shouldAutoSelect: false };
    }

    const lower = text.toLowerCase();
    const scores: Array<{ purpose: Purpose; score: number }> = [];

    for (const [purpose, keywords] of Object.entries(INTENT_KEYWORDS) as Array<[Purpose, string[]]>) {
      if (keywords.length === 0) continue;

      let matchCount = 0;
      for (const kw of keywords) {
        if (lower.includes(kw)) matchCount++;
      }

      if (matchCount > 0) {
        const score = Math.min(100, Math.round((matchCount / keywords.length) * 200));
        scores.push({ purpose, score });
      }
    }

    if (scores.length === 0) {
      return { detected: 'general', confidence: 40, shouldAutoSelect: false };
    }

    scores.sort((a, b) => b.score - a.score);
    const best = scores[0];

    return {
      detected:        best.purpose,
      confidence:      best.score,
      shouldAutoSelect: best.score >= 70,
    };
  }
}
