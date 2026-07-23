/**
 * AI Communication Engine — Constants
 * Purpose categories, UI labels, placeholders, and tone definitions.
 */

import type { Purpose, ToneAction } from '../types/ai.types';

// ─── Purpose Category Definitions ────────────────────────────────────────────

export interface PurposeDefinition {
  id: Purpose;
  label: string;
  icon: string;
  placeholder: string;
  description: string;
}

export const PURPOSE_CATEGORIES: PurposeDefinition[] = [
  {
    id: 'hiring',
    label: 'Job Opportunity',
    icon: '💼',
    placeholder: "e.g. We're hiring a React developer at our company, remote position...",
    description: 'Full-time or part-time job offer',
  },
  {
    id: 'internship',
    label: 'Internship',
    icon: '🎓',
    placeholder: 'e.g. 3-month remote AI/ML internship, stipend provided...',
    description: 'Internship or placement opportunity',
  },
  {
    id: 'freelance',
    label: 'Freelance Project',
    icon: '💡',
    placeholder: 'e.g. Budget ₹15k, 3-week React dashboard project...',
    description: 'Short-term project or contract work',
  },
  {
    id: 'collaboration',
    label: 'Project Collaboration',
    icon: '🤝',
    placeholder: 'e.g. Open-source AI project, need a Full Stack contributor...',
    description: 'Build something together',
  },
  {
    id: 'team',
    label: 'Team Invitation',
    icon: '👥',
    placeholder: 'e.g. Hackathon team for SIH 2025, looking for an AI developer...',
    description: 'Hackathon, competition or student team',
  },
  {
    id: 'startup',
    label: 'Startup',
    icon: '🚀',
    placeholder: 'e.g. Pre-seed AI startup, need a co-founder or early engineer...',
    description: 'Early-stage startup or MVP collaboration',
  },
  {
    id: 'research',
    label: 'Research',
    icon: '🔬',
    placeholder: 'e.g. ML research paper, looking for a research intern...',
    description: 'Academic or industry research',
  },
  {
    id: 'mentorship',
    label: 'Mentorship',
    icon: '🧭',
    placeholder: 'e.g. Offering guidance on AI development and career growth...',
    description: 'Mentorship or knowledge sharing',
  },
  {
    id: 'general',
    label: 'General Message',
    icon: '💬',
    placeholder: 'e.g. Just want to connect, share feedback, or say hello...',
    description: 'Anything else',
  },
];

// ─── Tone / Improvement Actions ───────────────────────────────────────────────

export interface ToneDefinition {
  id: ToneAction;
  label: string;
  icon: string;
  instruction: string;             // Injected into the improvement prompt
}

export const TONE_ACTIONS: ToneDefinition[] = [
  {
    id: 'regenerate',
    label: 'Regenerate',
    icon: '🔄',
    instruction: 'Generate a completely different version with the same intent.',
  },
  {
    id: 'professional',
    label: 'More Professional',
    icon: '✨',
    instruction: 'Rewrite using formal business language suitable for a professional email.',
  },
  {
    id: 'shorter',
    label: 'Make Shorter',
    icon: '✂️',
    instruction: 'Condense to 3–4 concise sentences while preserving the core intent.',
  },
  {
    id: 'friendlier',
    label: 'Make Friendlier',
    icon: '😊',
    instruction: 'Rewrite with a warm, conversational, and approachable tone.',
  },
  {
    id: 'technical',
    label: 'More Technical',
    icon: '🧠',
    instruction: 'Add specific references to relevant technical skills and projects.',
  },
  {
    id: 'persuasive',
    label: 'More Persuasive',
    icon: '📈',
    instruction: 'Strengthen the value proposition and make a more compelling case.',
  },
  {
    id: 'human',
    label: 'More Human',
    icon: '❤️',
    instruction: 'Rewrite with a genuine, personal, and emotionally authentic tone.',
  },
  {
    id: 'strongClosing',
    label: 'Strong Closing',
    icon: '🚀',
    instruction: 'Keep the body as-is but rewrite the closing sentence with a strong, clear call-to-action.',
  },
  {
    id: 'betterSubject',
    label: 'Better Subject',
    icon: '📝',
    instruction: 'Generate only a new, more compelling subject line. Return JSON with just the "subject" field.',
  },
  {
    id: 'reset',
    label: 'Reset',
    icon: '🔁',
    instruction: '',  // Handled by UI, no AI call
  },
];

// ─── Intent Keywords (for client-side IntentDetector) ────────────────────────

export const INTENT_KEYWORDS: Record<Purpose, string[]> = {
  hiring:        ['hire', 'hiring', 'job', 'position', 'role', 'salary', 'employment', 'full-time', 'part-time', 'offer'],
  internship:    ['intern', 'internship', 'stipend', 'summer', 'placement', 'training', 'trainee'],
  freelance:     ['freelance', 'freelancer', 'budget', 'contract', 'project basis', 'gig', 'fixed price'],
  collaboration: ['collaborate', 'collaboration', 'open source', 'contribute', 'open-source', 'joint'],
  team:          ['team', 'hackathon', 'teammate', 'partner', 'competition', 'squad'],
  startup:       ['startup', 'co-founder', 'cofounder', 'mvp', 'equity', 'venture', 'seed'],
  research:      ['research', 'paper', 'professor', 'lab', 'thesis', 'academic', 'publication', 'study'],
  mentorship:    ['mentor', 'mentorship', 'guide', 'guidance', 'advice', 'learning'],
  general:       [],
};

// ─── Default Placeholder ──────────────────────────────────────────────────────

export const DEFAULT_CONTEXT_PLACEHOLDER =
  'Briefly describe your request... (optional — AI will generate based on your details)';
