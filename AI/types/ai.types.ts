/**
 * AI Communication Engine — Type Definitions
 * All core types for requests, responses, and state management.
 */

import type { AIError } from './error.types';


// ─── Purpose Categories ───────────────────────────────────────────────────────

export type Purpose =
  | 'hiring'
  | 'internship'
  | 'freelance'
  | 'collaboration'
  | 'team'
  | 'startup'
  | 'research'
  | 'mentorship'
  | 'general';

// ─── Tone / Improvement Actions ───────────────────────────────────────────────

export type ToneAction =
  | 'regenerate'
  | 'professional'
  | 'shorter'
  | 'friendlier'
  | 'technical'
  | 'persuasive'
  | 'human'
  | 'strongClosing'
  | 'betterSubject'
  | 'reset';

// ─── Contact Form ─────────────────────────────────────────────────────────────

export interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  location?: string;
}

// ─── AI Request ───────────────────────────────────────────────────────────────

export interface AIRequest {
  formData: ContactFormData;
  purpose: Purpose;
  context: string;                  // Optional extra context from user
  toneAction?: ToneAction;          // For improve calls
  previousMessage?: string;         // For regenerate / improve
  previousSubject?: string;
  variationIndex?: number;          // Tracked by RegenerationEngine
}

// ─── LLM Output Schema ────────────────────────────────────────────────────────

/** The exact JSON shape Gemini must return. OutputParser validates this. */
export interface LLMOutput {
  subject: string;
  message: string;
  tone: 'formal' | 'professional' | 'semi-formal' | 'friendly' | 'casual';
  intent: string;                   // Detected/confirmed purpose label
}

// ─── Quality Checks ───────────────────────────────────────────────────────────

export interface QualityCheckResult {
  hasGreeting: boolean;
  hasClosing: boolean;
  grammarOk: boolean;
  clearIntent: boolean;
  readTimeSeconds: number;
}

// ─── AI Response ──────────────────────────────────────────────────────────────

export interface AIResponse {
  subject: string;
  message: string;
  tone: string;
  intent: string;
  quality: QualityCheckResult;
  isFallback: boolean;              // True if FallbackGenerator was used
  cached: boolean;
  variationIndex: number;
}

// ─── Generation State ─────────────────────────────────────────────────────────

export type GenerationStatus =
  | 'idle'
  | 'validating'
  | 'generating'
  | 'done'
  | 'error'
  | 'fallback';

export interface GenerationState {
  status: GenerationStatus;
  response: AIResponse | null;
  error: AIError | null;
  generationCount: number;          // How many times generated this session
}

// ─── Intent Detection ─────────────────────────────────────────────────────────

export interface IntentResult {
  detected: Purpose | null;
  confidence: number;               // 0–100
  shouldAutoSelect: boolean;        // true if confidence >= 70
}

// ─── Relevant Profile Slice ───────────────────────────────────────────────────

export interface RelevantProfile {
  name: string;
  status: string;
  skills: string[];                 // Only relevant skills for this purpose
  projects: string[];               // Only relevant projects for this purpose
  seeking: string;                  // Most relevant goal for this purpose
}

// ─── Session State ────────────────────────────────────────────────────────────

export interface SessionState {
  formData: ContactFormData;
  selectedPurpose: Purpose | null;
  context: string;
  generatedSubject: string;
  generatedMessage: string;
  generationCount: number;
  lastGeneratedAt: number;
  sessionId: string;
}
