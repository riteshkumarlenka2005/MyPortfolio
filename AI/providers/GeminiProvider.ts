/**
 * AI Communication Engine — Gemini Provider
 *
 * Calls the /api/ai/generate serverless function.
 * NEVER calls Gemini directly — keeps API key server-side.
 */

import { AIConfig } from '../config/ai.config';
import { AIError, AIErrorCode } from '../types/error.types';
import type { AIProvider, AIProviderCapabilities } from './AIProvider';

export class GeminiProvider implements AIProvider {
  private readonly endpoint: string;
  private readonly model: string;

  constructor() {
    this.endpoint = AIConfig.apiEndpoint;
    this.model = AIConfig.model;
  }

  capabilities(): AIProviderCapabilities {
    return {
      streaming: false,     // Serverless function returns complete response
      jsonMode:  true,      // We instruct JSON output via prompt
      vision:    false,
      functionCalling: false,
    };
  }

  async generate(prompt: string): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), AIConfig.timeoutMs);

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model: this.model }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: 'UNKNOWN' }));
        this.mapErrorCode(response.status, body.error);
      }

      const data = await response.json();

      // Surface API-level errors returned with 200 status
      if (data.error) {
        this.mapErrorCode(200, data.error);
      }

      return data.raw as string;

    } catch (err: unknown) {
      clearTimeout(timeoutId);

      if (err instanceof AIError) throw err;

      if (err instanceof DOMException && err.name === 'AbortError') {
        throw new AIError(AIErrorCode.TIMEOUT, 'Request timed out');
      }

      if (err instanceof TypeError && err.message.includes('fetch')) {
        throw new AIError(AIErrorCode.NETWORK_ERROR, err.message);
      }

      throw new AIError(AIErrorCode.UNKNOWN, String(err));
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      // Lightweight check — send minimal prompt, expect any JSON response
      const result = await this.generate('Reply with exactly this JSON: {"ok":true}');
      return result.includes('ok');
    } catch {
      return false;
    }
  }

  getProviderName(): string { return 'Gemini'; }
  getModelName(): string    { return this.model; }

  // ─── Private ───────────────────────────────────────────────────────────────

  private mapErrorCode(status: number, errorCode?: string): never {
    if (errorCode === 'SAFETY_BLOCKED')  throw new AIError(AIErrorCode.SAFETY_BLOCKED);
    if (errorCode === 'QUOTA_EXCEEDED')  throw new AIError(AIErrorCode.QUOTA_EXCEEDED);
    if (errorCode === 'INVALID_API_KEY') throw new AIError(AIErrorCode.INVALID_API_KEY);
    if (errorCode === 'NETWORK_ERROR')   throw new AIError(AIErrorCode.NETWORK_ERROR);

    if (status === 429) throw new AIError(AIErrorCode.QUOTA_EXCEEDED);
    if (status === 403) throw new AIError(AIErrorCode.INVALID_API_KEY);
    if (status === 503) throw new AIError(AIErrorCode.NETWORK_ERROR);

    throw new AIError(AIErrorCode.UNKNOWN, `HTTP ${status}: ${errorCode ?? 'unknown'}`);
  }
}
