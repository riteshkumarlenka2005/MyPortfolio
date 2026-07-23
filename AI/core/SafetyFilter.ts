/**
 * AI Communication Engine — Safety Filter
 * Client-side pre-check before sending to the server.
 * Catches obvious prompt injection and spam patterns.
 */

export interface SafetyResult {
  safe: boolean;
  reason?: string;
}

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /you\s+are\s+now/i,
  /act\s+as\s+a/i,
  /pretend\s+(you\s+are|to\s+be)/i,
  /jailbreak/i,
  /system\s+prompt/i,
  /override\s+(your\s+)?instructions/i,
  /forget\s+(everything|all|your)/i,
  /new\s+persona/i,
  /disregard\s+(your\s+)?previous/i,
];

const SPAM_PATTERNS = [
  /click\s+here\s+to\s+win/i,
  /congratulations\s+you\s+(have\s+)?won/i,
  /send\s+money/i,
  /wire\s+transfer/i,
  /nigerian\s+prince/i,
  /urgent\s+response\s+required/i,
];

export class SafetyFilter {
  check(text: string): SafetyResult {
    if (!text || text.trim().length === 0) {
      return { safe: true };
    }

    for (const pattern of INJECTION_PATTERNS) {
      if (pattern.test(text)) {
        return {
          safe: false,
          reason: 'Your message contains content that cannot be processed. Please rephrase.',
        };
      }
    }

    for (const pattern of SPAM_PATTERNS) {
      if (pattern.test(text)) {
        return {
          safe: false,
          reason: 'Your message was flagged as potential spam. Please write a genuine message.',
        };
      }
    }

    // Length check — extremely long context is suspicious
    if (text.length > 1500) {
      return {
        safe: false,
        reason: 'Message context is too long. Please keep it under 1500 characters.',
      };
    }

    return { safe: true };
  }

  checkAll(...texts: string[]): SafetyResult {
    for (const text of texts) {
      const result = this.check(text);
      if (!result.safe) return result;
    }
    return { safe: true };
  }
}
