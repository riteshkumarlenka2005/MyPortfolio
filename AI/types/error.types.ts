/**
 * AI Communication Engine — Error Types
 * Categorized error codes with recovery strategies.
 */

export enum AIErrorCode {
  NETWORK_ERROR    = 'NETWORK_ERROR',       // Retry automatically
  QUOTA_EXCEEDED   = 'QUOTA_EXCEEDED',      // Switch to manual / fallback
  INVALID_API_KEY  = 'INVALID_API_KEY',     // Developer config error
  SAFETY_BLOCKED   = 'SAFETY_BLOCKED',      // Content policy — explain to user
  SCHEMA_INVALID   = 'SCHEMA_INVALID',      // Bad JSON from LLM — retry
  RATE_LIMITED     = 'RATE_LIMITED',        // Client-side rate limit hit
  TIMEOUT          = 'TIMEOUT',             // Request timed out
  VALIDATION_ERROR = 'VALIDATION_ERROR',    // Form input invalid
  UNKNOWN          = 'UNKNOWN',             // Fallback
}

/** Maps each error code to its retry/recovery behavior */
export const ERROR_RECOVERY: Record<AIErrorCode, {
  retryable: boolean;
  useFallback: boolean;
  userMessage: string;
}> = {
  [AIErrorCode.NETWORK_ERROR]: {
    retryable: true,
    useFallback: true,
    userMessage: 'Connection issue. Retrying...',
  },
  [AIErrorCode.QUOTA_EXCEEDED]: {
    retryable: false,
    useFallback: true,
    userMessage: 'AI limit reached. Using a template instead.',
  },
  [AIErrorCode.INVALID_API_KEY]: {
    retryable: false,
    useFallback: true,
    userMessage: 'AI is temporarily unavailable. You can still send a message manually.',
  },
  [AIErrorCode.SAFETY_BLOCKED]: {
    retryable: false,
    useFallback: false,
    userMessage: 'Your message was flagged by safety filters. Please adjust your input.',
  },
  [AIErrorCode.SCHEMA_INVALID]: {
    retryable: true,
    useFallback: true,
    userMessage: 'Generating...',   // Silent retry
  },
  [AIErrorCode.RATE_LIMITED]: {
    retryable: false,
    useFallback: false,
    userMessage: 'Too many requests. Please wait before generating again.',
  },
  [AIErrorCode.TIMEOUT]: {
    retryable: true,
    useFallback: true,
    userMessage: 'Request timed out. Retrying...',
  },
  [AIErrorCode.VALIDATION_ERROR]: {
    retryable: false,
    useFallback: false,
    userMessage: 'Please fill in all required fields correctly.',
  },
  [AIErrorCode.UNKNOWN]: {
    retryable: false,
    useFallback: true,
    userMessage: 'Something went wrong. Using a template instead.',
  },
};

export class AIError extends Error {
  code: AIErrorCode;
  retryable: boolean;
  useFallback: boolean;
  userMessage: string;

  constructor(code: AIErrorCode, devMessage?: string) {
    const recovery = ERROR_RECOVERY[code];
    super(devMessage ?? code);
    this.name = 'AIError';
    this.code = code;
    this.retryable = recovery.retryable;
    this.useFallback = recovery.useFallback;
    this.userMessage = recovery.userMessage;
  }
}
