/**
 * AI Communication Engine — Candidate Profile
 *
 * Single source of truth about Ritesh Kumar Lenka.
 * PromptBuilder injects ONLY the relevant slice (via RelevantProfileSelector)
 * into each prompt — never the full profile.
 */

import type { Purpose } from '../types/ai.types';

export const CandidateProfile = {
  name:          'Ritesh Kumar Lenka',
  title:         'Full Stack & AI Developer',
  currentStatus: '3rd Year B.Tech CSE Student',
  email:         'lenkariteshkumar2005@gmail.com',
  location:      'Odisha, India',
  phone:         '+91 82600 49064',

  bio: 'A passionate developer building real-world AI and full stack applications. Currently seeking meaningful opportunities to contribute, learn, and grow.',

  skills: {
    ai:       ['Python', 'TensorFlow', 'Gemini API', 'OpenAI API', 'LangChain', 'ML/DL', 'NLP'],
    backend:  ['Node.js', 'Express', 'Java', 'PostgreSQL', 'MongoDB', 'REST APIs', 'SQL'],
    frontend: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'HTML/CSS'],
    tools:    ['Git', 'Docker', 'Vercel', 'Vite', 'Postman', 'Linux'],
    languages:['Python', 'Java', 'C++', 'JavaScript', 'TypeScript'],
  },

  projects: [
    {
      name:        'AI CRM Copilot',
      description: 'Production-grade AI assistant for CRM systems. Features conversational AI, smart analytics, and automated workflows.',
      tech:        ['React', 'Node.js', 'Gemini API', 'MongoDB', 'TypeScript'],
      category:    ['ai', 'backend', 'frontend'],
    },
    {
      name:        'FinSentinel AI',
      description: 'AI-powered financial intelligence platform with real-time market analysis and sentiment detection.',
      tech:        ['Python', 'TensorFlow', 'React', 'FastAPI'],
      category:    ['ai', 'backend'],
    },
    {
      name:        'Room Finder',
      description: 'Full stack platform connecting students with nearby rental rooms. Real-time listings, filters, and map integration.',
      tech:        ['React', 'Node.js', 'MongoDB', 'Express'],
      category:    ['frontend', 'backend'],
    },
    {
      name:        'Portfolio Website',
      description: 'Premium developer portfolio with 3D animations, AI contact assistant, and interactive sections.',
      tech:        ['React', 'TypeScript', 'Three.js', 'Framer Motion', 'Gemini API'],
      category:    ['frontend'],
    },
  ],

  seeking: [
    'Software Engineering Internship',
    'AI/ML Internship',
    'Full Stack Internship',
    'Remote Junior Developer Role',
    'Freelance Projects',
    'Startup Collaboration',
    'Research Opportunities',
    'Open Source Contributions',
    'Hackathon Teams',
  ],

  /** Maps each purpose to the most relevant skill categories and project categories */
  relevanceMap: {
    hiring:        { skills: ['frontend', 'backend', 'languages', 'tools'], projects: ['ai', 'backend', 'frontend'] },
    internship:    { skills: ['ai', 'backend', 'frontend', 'languages'],    projects: ['ai', 'backend', 'frontend'] },
    freelance:     { skills: ['frontend', 'backend', 'tools'],              projects: ['frontend', 'backend'] },
    collaboration: { skills: ['ai', 'frontend', 'backend'],                 projects: ['ai', 'backend', 'frontend'] },
    team:          { skills: ['frontend', 'backend', 'languages'],          projects: ['ai', 'frontend', 'backend'] },
    startup:       { skills: ['ai', 'backend', 'frontend', 'tools'],        projects: ['ai', 'backend'] },
    research:      { skills: ['ai', 'languages'],                           projects: ['ai'] },
    mentorship:    { skills: ['ai', 'backend', 'frontend'],                 projects: ['ai', 'backend', 'frontend'] },
    general:       { skills: ['frontend', 'backend', 'languages'],          projects: ['ai', 'frontend', 'backend'] },
  } satisfies Record<Purpose, { skills: string[]; projects: string[] }>,
};

export type CandidateProfileType = typeof CandidateProfile;
