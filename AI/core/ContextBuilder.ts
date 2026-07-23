/**
 * AI Communication Engine — Context Builder
 * Assembles the full context object from user input + profile slice + purpose.
 */

import { CandidateProfile } from '../config/profile';
import type { AIRequest, RelevantProfile } from '../types/ai.types';

export interface GenerationContext {
  // Visitor info
  visitorName:     string;
  visitorEmail:    string;
  visitorPhone:    string;
  visitorLocation: string;
  visitorContext:  string;       // Free-text extra context

  // Purpose
  purposeId:       string;
  purposeLabel:    string;

  // Relevant candidate profile slice
  profile:         RelevantProfile;

  // Regeneration context
  isRegeneration:  boolean;
  variationIndex:  number;
  previousMessage: string;
  previousSubject: string;
}

export class ContextBuilder {
  build(request: AIRequest, profile: RelevantProfile): GenerationContext {
    return {
      visitorName:     request.formData.fullName,
      visitorEmail:    request.formData.email,
      visitorPhone:    request.formData.phone ?? '',
      visitorLocation: request.formData.location ?? '',
      visitorContext:  request.context ?? '',

      purposeId:    request.purpose,
      purposeLabel: this.purposeLabel(request.purpose),

      profile,

      isRegeneration:  !!(request.toneAction === 'regenerate' || request.variationIndex),
      variationIndex:  request.variationIndex ?? 0,
      previousMessage: request.previousMessage ?? '',
      previousSubject: request.previousSubject ?? '',
    };
  }

  private purposeLabel(purpose: string): string {
    const labels: Record<string, string> = {
      hiring:        'Job Opportunity',
      internship:    'Internship Opportunity',
      freelance:     'Freelance Project',
      collaboration: 'Project Collaboration',
      team:          'Team Invitation',
      startup:       'Startup Collaboration',
      research:      'Research Opportunity',
      mentorship:    'Mentorship',
      general:       'General Message',
    };
    return labels[purpose] ?? 'General Message';
  }

  /** Build a human-readable summary of the context for the candidate profile */
  get candidateName(): string {
    return CandidateProfile.name;
  }
}
