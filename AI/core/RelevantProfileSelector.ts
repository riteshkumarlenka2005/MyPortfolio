/**
 * AI Communication Engine — Relevant Profile Selector
 *
 * Selects ONLY the skills and projects relevant to the chosen purpose.
 * Prevents injecting the full profile into every prompt.
 * Makes generated messages feel tailored, not generic.
 */

import { CandidateProfile } from '../config/profile';
import type { Purpose, RelevantProfile } from '../types/ai.types';

export class RelevantProfileSelector {
  select(purpose: Purpose): RelevantProfile {
    const mapping = CandidateProfile.relevanceMap[purpose];

    // Collect relevant skills (flat array, deduplicated)
    const skills = [
      ...new Set(
        mapping.skills.flatMap(
          cat => CandidateProfile.skills[cat as keyof typeof CandidateProfile.skills] ?? []
        )
      ),
    ].slice(0, 8); // Max 8 skills to keep prompt concise

    // Collect relevant projects
    const projects = CandidateProfile.projects
      .filter(p => p.category.some(c => mapping.projects.includes(c)))
      .map(p => `${p.name} (${p.tech.slice(0, 3).join(', ')})`)
      .slice(0, 3); // Max 3 projects

    // Most relevant seeking goal
    const seekingMap: Record<Purpose, string> = {
      hiring:        'Seeking a junior developer or software engineering role',
      internship:    'Actively seeking AI/ML and Full Stack internship opportunities',
      freelance:     'Available for freelance and contract development projects',
      collaboration: 'Open to project collaborations and open-source contributions',
      team:          'Looking to join hackathon teams and student project groups',
      startup:       'Interested in early-stage startup opportunities and co-founder roles',
      research:      'Seeking research internship and academic collaboration opportunities',
      mentorship:    'Open to mentorship and knowledge-sharing connections',
      general:       'Open to all meaningful professional connections and opportunities',
    };

    return {
      name:     CandidateProfile.name,
      status:   CandidateProfile.currentStatus,
      skills,
      projects,
      seeking:  seekingMap[purpose],
    };
  }
}
