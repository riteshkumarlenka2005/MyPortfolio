/**
 * AI Communication Engine — AIEngine (Single Orchestrator)
 *
 * This is the ONLY module the UI ever calls.
 * It owns the complete generation pipeline end-to-end.
 *
 * Pipeline:
 *   validate → rateLimit → cache → intent → profileSelect → context
 *   → prompt → safety → provider → parse → format → quality → cache.set
 *   → analytics → return
 */

import { AIConfig } from '../config/ai.config';
import { CandidateProfile } from '../config/profile';
import type { AIRequest, AIResponse, ContactFormData, Purpose, ToneAction, LLMOutput } from '../types/ai.types';
import { AIError, AIErrorCode } from '../types/error.types';

import { ValidationEngine }       from './ValidationEngine';
import { SafetyFilter }           from './SafetyFilter';
import { Cache }                  from './Cache';
import { RateLimiter }            from './RateLimiter';
import { IntentDetector }         from './IntentDetector';
import { RelevantProfileSelector } from './RelevantProfileSelector';
import { ContextBuilder }         from './ContextBuilder';
import { PromptBuilder }          from './PromptBuilder';
import { OutputParser }           from './OutputParser';
import { Formatter }              from './Formatter';
import { FallbackGenerator }      from './FallbackGenerator';
import { RegenerationEngine }     from './RegenerationEngine';
import { SessionManager }         from './SessionManager';
import { MailService }            from './MailService';
import { Analytics }              from '../analytics/Analytics';
import { GeminiProvider }         from '../providers/GeminiProvider';
import { hashInput, withRetry }   from '../utils/helpers';

// ─── Quality Check Helper ─────────────────────────────────────────────────────

function computeQuality(message: string) {
  const lower = message.toLowerCase();
  const words = message.split(/\s+/).filter(Boolean);
  const readTimeSec = Math.max(5, Math.round((words.length / 200) * 60));

  const greetings = ['hello', 'hi ', 'dear', 'greetings', 'good morning', 'good afternoon'];
  const closings  = ['regards', 'sincerely', 'thanks', 'thank you', 'cheers', 'best', 'looking forward'];

  return {
    hasGreeting:    greetings.some(g => lower.includes(g)),
    hasClosing:     closings.some(c => lower.includes(c)),
    grammarOk:      words.length >= 20,               // heuristic: too short = likely incomplete
    clearIntent:    words.length >= 30,
    readTimeSeconds: readTimeSec,
  };
}

// ─── AIEngine ────────────────────────────────────────────────────────────────

export class AIEngine {
  // All modules instantiated once and reused
  private readonly validator  = new ValidationEngine();
  private readonly safety     = new SafetyFilter();
  private readonly cache      = new Cache<AIResponse>();
  private readonly rateLimiter = new RateLimiter();
  private readonly intentDet  = new IntentDetector();
  private readonly profSel    = new RelevantProfileSelector();
  private readonly ctxBuilder = new ContextBuilder();
  private readonly promptBld  = new PromptBuilder();
  private readonly parser     = new OutputParser();
  private readonly formatter  = new Formatter();
  private readonly fallback   = new FallbackGenerator();
  private readonly regen      = new RegenerationEngine();
  private readonly session    = new SessionManager();
  private readonly mail       = new MailService();
  private readonly analytics  = new Analytics();
  private readonly provider   = new GeminiProvider();

  // ─── Public API (UI calls ONLY these) ──────────────────────────────────────

  /** Generate a new message from scratch */
  async generate(request: AIRequest): Promise<AIResponse> {
    return this.run(request, 'generate');
  }

  /** Regenerate — produces a different version */
  async regenerate(request: AIRequest): Promise<AIResponse> {
    const index = this.regen.nextVariation();
    return this.run({ ...request, variationIndex: index, toneAction: 'regenerate' }, 'regenerate');
  }

  /** Improve existing message with a tone action */
  async improve(
    request: AIRequest,
    toneAction: ToneAction,
    currentSubject: string,
    currentMessage: string,
  ): Promise<AIResponse> {
    return this.run(
      { ...request, toneAction, previousSubject: currentSubject, previousMessage: currentMessage },
      'improve',
    );
  }

  /** Generate dynamic greeting prompt */
  async generateGreeting(visitorName: string): Promise<string> {
    const prompt = this.promptBld.buildGreetingPrompt(visitorName);
    try {
      const rawText = await this.provider.generate(prompt);
      const parsed = JSON.parse(rawText.replace(/```json|```/g, '').trim());
      return parsed.greeting || "Hi! What would you like to write about?";
    } catch {
      return "Hi! Could you briefly tell me what you'd like to message Ritesh about?";
    }
  }

  /** Send the final message via Web3Forms */
  async send(formData: ContactFormData, subject: string, message: string): Promise<void> {
    await this.mail.send({ formData, subject, message });
    this.analytics.track('message_sent', { purpose: this.session.get().selectedPurpose });
    this.session.clear();
  }

  /** Check provider availability (for AIStatusBadge) */
  async checkStatus(): Promise<'online' | 'offline'> {
    try {
      const ok = await this.provider.isAvailable();
      return ok ? 'online' : 'offline';
    } catch {
      return 'offline';
    }
  }

  /** Detect intent from free-text context (when purpose not selected) */
  detectIntent(text: string) {
    return this.intentDet.detect(text);
  }

  /** Get current session state */
  getSession() {
    return this.session.get();
  }

  /** Update session form data */
  updateSession(partial: Parameters<SessionManager['update']>[0]) {
    this.session.update(partial);
  }

  /** Provider info for AIFooter */
  getProviderInfo() {
    return {
      name:    this.provider.getProviderName(),
      model:   this.provider.getModelName(),
      version: AIConfig.version,
    };
  }

  // ─── Private Pipeline ───────────────────────────────────────────────────────

  private async run(
    request: AIRequest,
    operation: 'generate' | 'regenerate' | 'improve',
  ): Promise<AIResponse> {
    const startTime = Date.now();

    // 1. Validate inputs
    const cleanData = this.validator.validateOrThrow(request.formData);
    const cleanRequest: AIRequest = { ...request, formData: cleanData };

    // 2. Rate limit (skip for improve — only generation is rate-limited)
    if (operation !== 'improve') {
      this.rateLimiter.consume();
    }

    // 3. Safety check on context
    const safetyResult = this.safety.checkAll(
      cleanRequest.context,
      cleanRequest.formData.fullName,
    );
    if (!safetyResult.safe) {
      throw new AIError(AIErrorCode.SAFETY_BLOCKED, safetyResult.reason);
    }

    // 4. Cache check (only for fresh generation with same input)
    if (operation === 'generate') {
      const cacheKey = hashInput(cleanRequest);
      const cached = this.cache.get(cacheKey);
      if (cached) {
        this.analytics.track('cache_hit', { purpose: cleanRequest.purpose });
        return { ...cached, cached: true };
      }
    }

    // 5. Select relevant profile slice
    const profile = this.profSel.select(cleanRequest.purpose);

    // 6. Build context
    const ctx = this.ctxBuilder.build(cleanRequest, profile);

    // 7. Build prompt
    const prompt = operation === 'improve' && cleanRequest.toneAction && cleanRequest.previousMessage
      ? this.promptBld.buildImprovementPrompt(
          ctx,
          cleanRequest.toneAction,
          cleanRequest.previousSubject ?? '',
          cleanRequest.previousMessage,
        )
      : this.promptBld.buildGenerationPrompt(ctx);

    // 8. Call provider with retry + fallback
    let llmOutput: LLMOutput;
    let isFallback = false;

    try {
      const rawText = await withRetry(
        () => this.provider.generate(prompt),
        AIConfig.retry.maxAttempts,
        AIConfig.retry.baseDelayMs,
        AIConfig.retry.backoffFactor,
      );
      llmOutput = this.parser.parse(rawText);
    } catch (err) {
      const aiErr = err instanceof AIError ? err : new AIError(AIErrorCode.UNKNOWN);

      // Use fallback for recoverable errors (not safety blocks)
      if (aiErr.useFallback && aiErr.code !== AIErrorCode.SAFETY_BLOCKED) {
        llmOutput = this.fallback.generate(cleanRequest);
        isFallback = true;
      } else {
        throw aiErr;
      }
    }

    // 9. Format output
    const formattedMessage = this.formatter.format(llmOutput.message, cleanRequest.formData.fullName);
    const formattedSubject = this.formatter.formatSubject(llmOutput.subject);

    // 10. Compute quality checks
    const quality = computeQuality(formattedMessage);

    // 11. Build response
    const response: AIResponse = {
      subject:        formattedSubject,
      message:        formattedMessage,
      tone:           llmOutput.tone,
      intent:         llmOutput.intent,
      quality,
      isFallback,
      cached:         false,
      variationIndex: cleanRequest.variationIndex ?? 0,
    };

    // 12. Cache the result (only non-fallback, non-improvement)
    if (!isFallback && operation === 'generate') {
      const cacheKey = hashInput(cleanRequest);
      this.cache.set(cacheKey, response, AIConfig.cache.ttlMs);
    }

    // 13. Update session
    this.session.setGeneratedContent(formattedSubject, formattedMessage);
    if (operation !== 'improve') {
      this.regen.record(formattedSubject, formattedMessage);
    }

    // 14. Track analytics
    this.analytics.track(operation, {
      purpose:   cleanRequest.purpose,
      isFallback,
      latencyMs: Date.now() - startTime,
      tone:      cleanRequest.toneAction,
    });

    // 15. Dev logging
    if (AIConfig.dev) {
      console.group(`[AI Engine] ${operation}`);
      console.log('Purpose:', cleanRequest.purpose);
      console.log('Prompt length:', prompt.length, 'chars');
      console.log('Latency:', Date.now() - startTime, 'ms');
      console.log('Fallback:', isFallback);
      console.log('Response:', response);
      console.groupEnd();
    }

    return response;
  }
}

// ─── Singleton Export ─────────────────────────────────────────────────────────
// One instance shared across all components — no re-instantiation on re-renders.
export const aiEngine = new AIEngine();
