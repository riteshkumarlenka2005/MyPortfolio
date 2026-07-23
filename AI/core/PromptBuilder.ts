/**
 * AI Communication Engine — Prompt Builder
 * Assembles the final prompt string from context + versioned templates.
 * This is the only place where prompts are constructed.
 */

import { SYSTEM_PROMPT, PURPOSE_TEMPLATES, IMPROVEMENT_PROMPT, PROMPT_META, GREETING_PROMPT } from '../config/PromptTemplates';
import { CandidateProfile } from '../config/profile';
import type { GenerationContext } from './ContextBuilder';
import type { ToneAction } from '../types/ai.types';
import { TONE_ACTIONS } from '../config/constants';

export class PromptBuilder {
  readonly metaVersion = PROMPT_META.version;

  /** Build a dynamic greeting prompt */
  buildGreetingPrompt(visitorName: string): string {
    return GREETING_PROMPT.replace('{visitorName}', visitorName || 'there');
  }

  /** Build a generation prompt for new messages */
  buildGenerationPrompt(ctx: GenerationContext): string {
    const template = PURPOSE_TEMPLATES[ctx.purposeId as keyof typeof PURPOSE_TEMPLATES];
    const templateV1 = template?.v1 ?? PURPOSE_TEMPLATES.general.v1;

    // Fill system prompt placeholders
    const system = SYSTEM_PROMPT
      .replace(/{candidateName}/g,    ctx.profile.name)
      .replace(/{candidateStatus}/g,  ctx.profile.status)
      .replace(/{candidateLocation}/g, CandidateProfile.location)
      .replace(/{candidateEmail}/g,   CandidateProfile.email)
      .replace(/{relevantSkills}/g,   ctx.profile.skills.join(', '))
      .replace(/{relevantProjects}/g, ctx.profile.projects.join('; '))
      .replace(/{candidateSeeking}/g, ctx.profile.seeking)
      .replace(/{candidateBio}/g,     CandidateProfile.bio);

    // Build visitor section
    const visitorSection = `
VISITOR DETAILS:
- Name: ${ctx.visitorName}
- Email: ${ctx.visitorEmail}
- Phone: ${ctx.visitorPhone}
${ctx.visitorLocation ? `- Location: ${ctx.visitorLocation}` : ''}
${ctx.visitorContext ? `- Additional context: ${ctx.visitorContext}` : ''}

COMMUNICATION PURPOSE: ${ctx.purposeLabel}
`.trim();

    // Add regeneration instruction if applicable
    const variationNote = ctx.isRegeneration && ctx.variationIndex > 0
      ? `\nIMPORTANT: This is variation #${ctx.variationIndex + 1}. Generate a genuinely DIFFERENT version — different opening, different structure, different angle. Do NOT repeat the previous version.`
      : '';

    return `${system}

---

${visitorSection}

SPECIFIC INSTRUCTIONS:
${templateV1.instruction}

Tone guide: ${templateV1.toneGuide}
${variationNote}

Now generate the JSON output:`;
  }

  /** Build an improvement prompt for tone/style actions */
  buildImprovementPrompt(
    ctx: GenerationContext,
    toneAction: ToneAction,
    currentSubject: string,
    currentMessage: string,
  ): string {
    const toneDef = TONE_ACTIONS.find(t => t.id === toneAction);
    const instruction = toneDef?.instruction ?? 'Improve the message quality.';

    return IMPROVEMENT_PROMPT
      .replace('{originalSubject}', currentSubject)
      .replace('{originalMessage}', currentMessage)
      .replace('{instruction}',     instruction)
      .replace('{intent}',          ctx.purposeId);
  }
}
