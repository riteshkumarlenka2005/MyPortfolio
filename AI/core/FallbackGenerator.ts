/**
 * AI Communication Engine — Fallback Generator
 * Generates a clean, professional template-based message when the AI API is unavailable.
 * The visitor can always send a message — the AI feature never becomes unusable.
 */

import { FALLBACK_TEMPLATE } from '../config/PromptTemplates';
import { CandidateProfile } from '../config/profile';
import type { AIRequest, LLMOutput } from '../types/ai.types';
import { PURPOSE_CATEGORIES } from '../config/constants';

export class FallbackGenerator {
  generate(request: AIRequest): LLMOutput {
    const { formData, purpose, context } = request;
    const purposeDef = PURPOSE_CATEGORIES.find(p => p.id === purpose) ?? PURPOSE_CATEGORIES.find(p => p.id === 'general')!;

    // Build context line from user's free-text context
    const contextLine = context.trim()
      ? context.trim()
      : `I am reaching out regarding a ${purposeDef.label.toLowerCase()} opportunity.`;

    const message = FALLBACK_TEMPLATE
      .replace('{candidateName}', CandidateProfile.name)
      .replace('{contextLine}',   contextLine)
      .replace('{visitorName}',   formData.fullName);

    const subject = this.buildSubject(purpose, formData.fullName);

    return {
      subject,
      message,
      tone:   'professional',
      intent: purpose,
    };
  }

  private buildSubject(purpose: string, senderName: string): string {
    const subjectMap: Record<string, string> = {
      hiring:        `Job Opportunity — Message from ${senderName}`,
      internship:    `Internship Opportunity — Message from ${senderName}`,
      freelance:     `Freelance Project Inquiry from ${senderName}`,
      collaboration: `Collaboration Opportunity from ${senderName}`,
      team:          `Team Invitation from ${senderName}`,
      startup:       `Startup Opportunity from ${senderName}`,
      research:      `Research Opportunity from ${senderName}`,
      mentorship:    `Mentorship Inquiry from ${senderName}`,
      general:       `Hello from ${senderName}`,
    };
    return subjectMap[purpose] ?? `Message from ${senderName}`;
  }
}
