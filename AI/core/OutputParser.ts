/**
 * AI Communication Engine — Output Parser
 * Parses and validates the raw JSON string returned by the LLM.
 * Auto-retries with a stricter prompt if schema validation fails.
 * Falls back gracefully rather than crashing.
 */

import type { LLMOutput } from '../types/ai.types';
import { AIError, AIErrorCode } from '../types/error.types';

const REQUIRED_FIELDS: Array<keyof LLMOutput> = ['subject', 'message', 'tone', 'intent'];

export class OutputParser {
  /**
   * Parse raw LLM text into a validated LLMOutput.
   * Throws AIError(SCHEMA_INVALID) if parsing fails after all attempts.
   */
  parse(rawText: string): LLMOutput {
    if (!rawText?.trim()) {
      throw new AIError(AIErrorCode.SCHEMA_INVALID, 'Empty response from LLM');
    }

    // 1. Try direct JSON parse
    const direct = this.tryParseJSON(rawText);
    if (direct && this.isValid(direct)) return this.normalize(direct);

    // 2. Extract JSON block from markdown fences
    const extracted = this.extractFromMarkdown(rawText);
    if (extracted) {
      const parsed = this.tryParseJSON(extracted);
      if (parsed && this.isValid(parsed)) return this.normalize(parsed);
    }

    // 3. Try to find any JSON object in the text
    const found = this.findJSONObject(rawText);
    if (found) {
      const parsed = this.tryParseJSON(found);
      if (parsed && this.isValid(parsed)) return this.normalize(parsed);
    }

    throw new AIError(
      AIErrorCode.SCHEMA_INVALID,
      `Could not parse LLM output as valid JSON. Raw: ${rawText.slice(0, 200)}`,
    );
  }

  private tryParseJSON(text: string): Record<string, unknown> | null {
    try {
      const parsed = JSON.parse(text);
      return typeof parsed === 'object' && parsed !== null ? parsed : null;
    } catch {
      return null;
    }
  }

  private extractFromMarkdown(text: string): string | null {
    const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    return match ? match[1].trim() : null;
  }

  private findJSONObject(text: string): string | null {
    const start = text.indexOf('{');
    const end   = text.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) return null;
    return text.slice(start, end + 1);
  }

  private isValid(obj: Record<string, unknown>): boolean {
    return REQUIRED_FIELDS.every(
      f => typeof obj[f] === 'string' && (obj[f] as string).trim().length > 0
    );
  }

  private normalize(obj: Record<string, unknown>): LLMOutput {
    return {
      subject: String(obj.subject).trim(),
      message: String(obj.message).trim(),
      tone:    String(obj.tone).trim() as LLMOutput['tone'],
      intent:  String(obj.intent).trim(),
    };
  }
}
