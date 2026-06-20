import React, { useRef, useState, useEffect } from 'react';

import { JourneyRopePhysics, Attachment } from '../components/JourneyRopePhysics';
import { StarfieldBackground } from '../components/StarfieldBackground';
import { Link } from 'react-router-dom';


/* ───── Timeline Data ───── */
interface Milestone {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  description: string;
  details?: string[];
  achievement?: string;
  side: 'left' | 'right' | 'center';
  isGoal?: boolean;
  isCurrent?: boolean;
  nodeIndex: number;
  icon: string;
}

const MILESTONES: Milestone[] = [
  {
    id: 'future',
    title: 'Future Vision',
    subtitle: 'The Summit Ahead',
    date: 'Beyond',
    description: 'To architect scalable systems and craft intelligent AI solutions that leave a lasting legacy in the world.',
    side: 'center' as const,
    isGoal: true,
    nodeIndex: 3,
    icon: '🏆',
  },
  {
    id: 'current',
    title: 'Second Year (4th Semester)',
    subtitle: 'Current Stage',
    date: '2026 — Present',
    description: 'Currently in 4th Semester — the final semester of Second Year. Through consistent effort and learning, performance has improved again.',
    details: [
      'Algorithms and problem solving',
      'Full-stack web development',
      'Artificial Intelligence & Data Science',
      'Building impactful projects and developer portfolio',
    ],
    achievement: '📊 Current CGPA — 8.98',
    side: 'left' as const,
    isCurrent: true,
    nodeIndex: 16,
    icon: '🚀',
  },
  {
    id: 'sem3',
    title: 'Challenges and Growth',
    subtitle: 'Second Year Begins — 3rd Semester',
    date: '2025',
    description: 'Entered Second Year and completed 3rd Semester. This phase came with academic challenges, and CGPA dropped compared to the first year. However, it became an important learning period that strengthened discipline and focus.',
    side: 'right' as const,
    nodeIndex: 30,
    icon: '⚡',
  },
  {
    id: 'btech1',
    title: 'Beginning of Engineering Journey',
    subtitle: 'First Year Completed',
    date: '2024',
    description: 'Joined B.Tech in Computer Science Engineering. Completed First Year (1st & 2nd Semester) and built strong foundations in:',
    details: [
      'Programming',
      'Algorithms',
      'Computer Science fundamentals',
    ],
    achievement: '🏆 First Year CGPA — 9.82',
    side: 'left' as const,
    nodeIndex: 44,
    icon: '💻',
  },
  {
    id: 'explore',
    title: 'Exploring Academic Direction',
    subtitle: 'The Search for the Right Path',
    date: '2023',
    description: 'After completing +2, initially joined +3 (Undergraduate program) and completed one semester, while exploring the right academic path and future direction. Soon after, the decision was made to pursue a career in Computer Science and Technology.',
    side: 'right' as const,
    nodeIndex: 56,
    icon: '📚',
  },
  {
    id: 'plus2',
    title: 'Higher Secondary Education (+2)',
    subtitle: 'Exploring Academic Depth',
    date: '2021 — 2023',
    description: 'Completed +2 (Higher Secondary) from Nalanda Vidya Mandir, Berhampur. During this stage, interest in technology, computers, and problem solving began to grow stronger.',
    achievement: '80.1% (481/600)',
    side: 'left' as const,
    nodeIndex: 68,
    icon: '🎓',
  },
  {
    id: 'tenth',
    title: 'Secondary School (10th Grade)',
    subtitle: 'The Spark of Innovation',
    date: '2019 — 2021',
    description: 'Completed 10th grade from Khallingi High School, Khallingi, Ganjam. This phase strengthened curiosity toward science and technology.',
    details: [
      '82.5% (495/600) in board examination',
      'Built a Solar Panel Wiper project for science exhibition',
      'Project selected for next round — received ₹10,000 award',
      'Participated in Mathematics Olympiad',
    ],
    side: 'right' as const,
    nodeIndex: 82,
    icon: '🧪',
  },
  {
    id: 'school',
    title: 'Early School Education',
    subtitle: 'The Learning Foundations',
    date: '2010 — 2018',
    description: 'Completed early schooling up to 8th standard, developing strong interest in mathematics, science, creativity, and logical thinking.',
    side: 'left' as const,
    nodeIndex: 96,
    icon: '🎒',
  },
  {
    id: 'birth',
    title: 'The Beginning',
    subtitle: 'A Curious Mind Begins',
    date: 'March 8, 2006',
    description: 'Born on 8 March 2006 in Odisha. From the very beginning, curiosity and creativity shaped the way I observed and learned from the world around me.',
    side: 'right' as const,
    nodeIndex: 110,
    icon: '🌱',
  },
];

export const JourneyPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const milestoneRefs = useRef<Record<string, React.RefObject<HTMLDivElement>>>({});
  const boyRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Create refs for each milestone
  MILESTONES.forEach(m => {
    if (!milestoneRefs.current[m.id]) {
      milestoneRefs.current[m.id] = React.createRef<HTMLDivElement>();
    }
  });

  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showStory, setShowStory] = useState(false);
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const atts: Attachment[] = [];
    MILESTONES.forEach(m => {
      if (milestoneRefs.current[m.id]) {
        atts.push({
          nodeIndex: m.nodeIndex,
          ref: milestoneRefs.current[m.id],
        });
      }
    });
    // Boy at current milestone
    const currentMilestone = MILESTONES.find(m => m.isCurrent);
    if (currentMilestone && boyRef.current) {
      atts.push({
        nodeIndex: currentMilestone.nodeIndex,
        ref: boyRef as React.RefObject<HTMLElement>,
        offsetX: 0,
        offsetY: 0,
      });
    }
    setAttachments(atts);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleCards(prev => {
          const next = new Set(prev);
          entries.forEach(entry => {
            const id = entry.target.getAttribute('data-id');
            if (id && entry.isIntersecting) {
              next.add(id);
            }
          });
          return next;
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -15% 0px', // Trigger when 15% from bottom
        threshold: 0,
      }
    );

    MILESTONES.forEach(m => {
      if (milestoneRefs.current[m.id]?.current) {
        observer.observe(milestoneRefs.current[m.id]!.current!);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative w-full bg-[#050510] overflow-x-hidden selection:bg-green-200 dark:selection:bg-green-800" style={{ scrollBehavior: 'smooth' }}>
      {/* ═══════ STARFIELD BACKGROUND ═══════ */}
      <div className="fixed inset-0 w-full h-full" style={{ zIndex: 0 }}>
        <StarfieldBackground starCount={320} />
      </div>



      {/* ═══════ HERO SECTION ═══════ */}
      <div className="relative w-full pt-28 sm:pt-32 md:pt-40 pb-6 sm:pb-8 md:pb-12 text-center z-20 px-5">
        {/* Subtle radial glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 via-transparent to-transparent pointer-events-none" />
        
        <h1 className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-stone-50 mb-2 sm:mb-3">
          My <span className="bg-gradient-to-r from-green-600 via-green-500 to-green-700 bg-clip-text text-transparent">Journey</span>
        </h1>
        <p className="font-serif text-sm sm:text-base md:text-lg text-stone-400 max-w-md mx-auto leading-relaxed">
          From the beginning to the summit — every step connected by a single thread of ambition.
        </p>
        
        {/* Recruiter Story Button */}
        <button
          onClick={() => setShowStory(true)}
          className="mt-4 sm:mt-6 inline-flex items-center gap-2 px-5 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 bg-stone-100 text-stone-900 font-sans text-xs sm:text-sm md:text-base font-medium rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-[1.03] active:scale-[0.98] border border-stone-200"
        >
          <span className="text-base sm:text-lg">📋</span>
          My Story — For Recruiters
        </button>

        {/* Scroll hint */}
        <div className="mt-6 sm:mt-8 md:mt-12 flex flex-col items-center gap-1 text-stone-500 animate-bounce">
          <span className="text-[10px] sm:text-xs font-sans uppercase tracking-[0.3em]">Scroll & Drag the rope</span>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="sm:w-5 sm:h-5">
            <path d="M10 3v14M4 11l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* ═══════ ROPE + TIMELINE CONTAINER ═══════ */}
      <div className="relative w-full" style={{ minHeight: isMobile ? '550vh' : '600vh' }}>
        <div ref={containerRef} className="absolute inset-0">
          <JourneyRopePhysics containerRef={containerRef} numNodes={120} attachments={attachments} />

          {/* ═══════ MILESTONE CARDS ═══════ */}
          {MILESTONES.map((m) => {
            const ref = milestoneRefs.current[m.id];
            const isLeft = m.side === 'left';
            const isCenter = m.side === 'center';

            // Mobile: all cards go to the RIGHT of the rope (rope at ~12%)
            // Cards must NOT clip the right edge. Rope node is at ~12% of viewport.
            // Card anchor is already at the rope position via transform, so offsets are from rope.
            const mobilePosition = 'left-[30px] sm:left-[50px]';
            const desktopPosition = isLeft
              ? 'md:left-[60px] lg:left-[80px]'
              : 'md:right-[60px] lg:right-[80px] md:left-auto';

            return (
              <div
                key={m.id}
                ref={ref}
                data-id={m.id}
                className="absolute top-0 left-0 w-0 h-0 z-20"
              >
                <div
                  className={`
                    absolute top-1/2 -translate-y-1/2 pointer-events-auto
                    transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
                    ${visibleCards.has(m.id) ? 'opacity-100 translate-y-[-50%]' : 'opacity-0 translate-y-[-30%]'}
                    ${isCenter
                      ? `left-[30px] sm:left-[50px] md:left-1/2 md:-translate-x-1/2 w-[calc(100vw-90px)] sm:w-[calc(100vw-110px)] md:w-[88vw] max-w-[360px]`
                      : `${mobilePosition} ${desktopPosition} w-[calc(100vw-90px)] sm:w-[calc(100vw-110px)] md:w-[65vw] max-w-[300px]`
                    }
                  `}
                >
                  {/* The Card */}
                  <div
                    className={`
                      relative p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl md:rounded-3xl
                      backdrop-blur-xl border
                      shadow-lg hover:shadow-2xl
                      transition-all duration-300
                      hover:scale-[1.02] md:hover:scale-[1.03] active:scale-[0.98]
                      ${m.isGoal
                        ? 'bg-gradient-to-br from-green-900/30 via-stone-900/95 to-green-900/25 border-green-500/30 shadow-green-500/10'
                        : m.isCurrent
                          ? 'bg-stone-900/95 border-green-400/40 shadow-green-500/15'
                          : 'bg-stone-900/80 border-stone-700/40 hover:bg-stone-900/95'
                      }
                    `}
                  >
                    {/* Connector dot — always on the LEFT edge on mobile (facing the rope) */}
                    {!isCenter && (
                      <span
                        className={`
                          absolute top-1/2 -translate-y-1/2 
                          w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full
                          border-2 sm:border-[3px] shadow-md
                          ${m.isCurrent
                            ? 'bg-green-500 border-stone-900 shadow-green-500/50'
                            : 'bg-stone-500 border-stone-900'
                          }
                          -left-[6px] sm:-left-[7px] md:-left-[10px]
                          ${!isLeft ? 'md:left-auto md:-right-[10px]' : ''}
                        `}
                      />
                    )}

                    {/* Icon + Date row */}
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 md:mb-3">
                      <span className="text-base sm:text-xl md:text-2xl">{m.icon}</span>
                      <span className={`
                        text-[9px] sm:text-[10px] md:text-xs font-sans font-semibold uppercase tracking-[0.12em] sm:tracking-[0.15em]
                        ${m.isCurrent
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-stone-400 dark:text-stone-500'
                        }
                      `}>
                        {m.date}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className={`
                      font-display font-bold tracking-tight mb-0.5 sm:mb-1
                      ${m.isGoal
                        ? 'text-base sm:text-xl md:text-2xl lg:text-3xl text-green-700 dark:text-green-400'
                        : m.isCurrent
                          ? 'text-sm sm:text-lg md:text-xl lg:text-2xl text-stone-900 dark:text-stone-50'
                          : 'text-sm sm:text-base md:text-lg text-stone-800 dark:text-stone-200'
                      }
                    `}>
                      {m.title}
                    </h3>

                    {/* Subtitle */}
                    <p className={`
                      text-[8px] sm:text-[10px] md:text-xs font-sans uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-1.5 sm:mb-2 md:mb-3
                      ${m.isGoal
                        ? 'text-green-600/70 dark:text-green-500/70'
                        : 'text-stone-400 dark:text-stone-500'
                      }
                    `}>
                      {m.subtitle}
                    </p>

                    {/* Divider */}
                    <div className={`
                      w-6 sm:w-8 md:w-10 h-[1.5px] sm:h-[2px] mb-1.5 sm:mb-2 md:mb-3 rounded-full
                      ${m.isGoal || m.isCurrent
                        ? 'bg-gradient-to-r from-green-500 to-green-300 dark:from-green-400 dark:to-green-600'
                        : 'bg-stone-200 dark:bg-stone-700'
                      }
                    `} />

                    {/* Description */}
                    <p className="text-[11px] sm:text-xs md:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-sans">
                      {m.description}
                    </p>

                    {/* Detail bullet points */}
                    {m.details && m.details.length > 0 && (
                      <ul className="mt-1.5 sm:mt-2 md:mt-3 space-y-0.5 sm:space-y-1">
                        {m.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] md:text-xs text-stone-500 dark:text-stone-400 font-sans leading-relaxed">
                            <span className="mt-1 w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-green-500/60 dark:bg-green-400/50 flex-shrink-0" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Achievement badge */}
                    {m.achievement && (
                      <div className="mt-2 sm:mt-3 inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-green-500/10 dark:bg-green-400/10 border border-green-500/20 dark:border-green-400/20">
                        <span className="text-[10px] sm:text-[11px] md:text-xs font-sans font-bold text-green-700 dark:text-green-400">{m.achievement}</span>
                      </div>
                    )}

                    {/* Current indicator badge */}
                    {m.isCurrent && (
                      <div className="mt-2 sm:mt-3 md:mt-4 inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-green-500/10 dark:bg-green-400/10 border border-green-500/20 dark:border-green-400/20">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 dark:bg-green-400 animate-pulse" />
                        <span className="text-[8px] sm:text-[10px] md:text-xs font-sans font-semibold text-green-700 dark:text-green-400 uppercase tracking-wider">You are here</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* ═══════ THE CLIMBING BOY ═══════ */}
          <div ref={boyRef} className="absolute top-0 left-0 w-0 h-0 z-30 pointer-events-none">
            <div className="absolute top-1/2 -translate-y-1/2 left-[8px] sm:left-[12px] md:left-[20px] w-10 h-14 sm:w-14 sm:h-18 md:w-24 md:h-28">
              <svg viewBox="0 0 80 110" className="w-full h-full overflow-visible drop-shadow-lg" fill="none">
                <circle cx="40" cy="18" r="12" fill="currentColor" className="text-stone-700 dark:text-stone-300" />
                <ellipse cx="40" cy="12" rx="14" ry="6" className="text-green-600 dark:text-green-500" fill="currentColor" />
                <rect x="28" y="10" width="24" height="4" rx="2" className="text-green-700 dark:text-green-400" fill="currentColor" />
                <path d="M40 30 L40 65" stroke="currentColor" strokeWidth="10" strokeLinecap="round" className="text-stone-600 dark:text-stone-400" />
                <rect x="32" y="28" width="16" height="20" rx="4" className="text-stone-100 dark:text-stone-700" fill="currentColor" />
                <path d="M35 36 L20 15" stroke="currentColor" strokeWidth="7" strokeLinecap="round" className="text-stone-500 dark:text-stone-400" />
                <path d="M45 36 L55 18" stroke="currentColor" strokeWidth="7" strokeLinecap="round" className="text-stone-500 dark:text-stone-400" />
                <circle cx="20" cy="14" r="4" className="text-stone-500 dark:text-stone-400" fill="currentColor" />
                <circle cx="55" cy="17" r="4" className="text-stone-500 dark:text-stone-400" fill="currentColor" />
                <path d="M37 62 L25 82 L18 78" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" className="text-stone-600 dark:text-stone-400" />
                <path d="M43 62 L50 85 L42 88" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" className="text-stone-600 dark:text-stone-400" />
                <ellipse cx="17" cy="79" rx="6" ry="3" className="text-green-600 dark:text-green-500" fill="currentColor" />
                <ellipse cx="43" cy="89" rx="6" ry="3" className="text-green-600 dark:text-green-500" fill="currentColor" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ Bottom Section — Full Autobiography CTA ═══════ */}
      <div className="relative w-full py-12 sm:py-16 md:py-24 flex flex-col items-center gap-4 sm:gap-6 z-20 px-5 bg-gradient-to-t from-[#050510] via-[#050510]/90 to-transparent">
        <div className="w-12 sm:w-16 h-[2px] bg-stone-700 rounded-full" />
        <p className="font-serif text-xs sm:text-sm md:text-base text-stone-500 dark:text-stone-400 text-center">
          Want to know the full, unabridged story?
        </p>
        <Link
          to="/autobiography"
          className="group relative inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-5 font-serif text-base sm:text-lg md:text-xl font-medium bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.2)] dark:shadow-[0_15px_40px_rgba(255,255,255,0.04)] transition-all hover:scale-[1.03] active:scale-[0.98] hover:shadow-[0_20px_50px_rgba(34,197,94,0.15)] text-center"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/15 dark:via-black/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
          <span className="text-xl sm:text-2xl">📖</span>
          <span>Read My Full Autobiography</span>
        </Link>
        <span className="text-[10px] sm:text-xs text-stone-400 dark:text-stone-600 font-sans tracking-widest uppercase">
          The complete chronicle
        </span>
      </div>

      {/* ═══════ RECRUITER STORY MODAL ═══════ */}
      {showStory && (
        <div
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-8"
          onClick={(e) => { if (e.target === e.currentTarget) setShowStory(false); }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-stone-950/70 backdrop-blur-lg" />

          {/* Modal — slides up from bottom on mobile, centered on desktop */}
          <div className="relative bg-white dark:bg-stone-900 w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl border-t sm:border border-stone-200/50 dark:border-stone-700/30 z-10">
            {/* Drag handle (mobile only) */}
            <div className="sm:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-stone-300 dark:bg-stone-700" />
            </div>

            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl px-5 sm:px-6 md:px-10 pt-4 sm:pt-6 md:pt-8 pb-3 sm:pb-4 border-b border-stone-100 dark:border-stone-800 z-10">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-stone-900 dark:text-stone-50 tracking-tight">
                    My Story
                  </h2>
                  <p className="text-[10px] sm:text-xs md:text-sm text-stone-400 dark:text-stone-500 font-sans mt-0.5 sm:mt-1 uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                    For Recruiters & Partners
                  </p>
                </div>
                <button
                  onClick={() => setShowStory(false)}
                  className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-500 dark:text-stone-400 transition-colors text-base sm:text-lg"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-5 sm:px-6 md:px-10 py-5 sm:py-6 md:py-8 space-y-4 sm:space-y-5 md:space-y-6 font-serif text-sm sm:text-base md:text-lg text-stone-700 dark:text-stone-300 leading-relaxed">
              <p>
                <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-100 float-left mr-2 sm:mr-3 mt-0.5 sm:mt-1 leading-none">H</span>ello!
                I am <strong className="text-stone-900 dark:text-stone-50">Ritesh Kumar Lenka</strong>.
                My journey began with an intense curiosity for how systems operate under the hood, leading me directly into the world of computer science.
              </p>

              <p>
                Currently navigating my <strong className="text-green-700 dark:text-green-400">B.Tech 2nd Year</strong>, I specialize in full-stack web development and AI-driven applications with robust hands-on experience in React, Tailwind CSS, Node.js, and Python.
              </p>

              <p>
                My core strength lies in dismantling complex computational problems and presenting their solutions through <strong className="text-stone-900 dark:text-stone-50">highly interactive, visually striking user interfaces</strong>. The interactive rope timeline on this page is a testament to my dedication to merging structural logic with organic user experiences.
              </p>

              <blockquote className="relative p-4 sm:p-5 md:p-6 bg-green-50 dark:bg-green-900/10 rounded-xl sm:rounded-2xl border-l-4 border-green-500 italic text-stone-600 dark:text-stone-400 text-xs sm:text-sm md:text-base">
                <span className="absolute top-2 sm:top-3 left-3 sm:left-4 text-3xl sm:text-4xl text-green-400/30 dark:text-green-500/20 font-serif leading-none">"</span>
                I am actively seeking opportunities where I can combine my passion for premium design aesthetics with scalable, robust backend engineering. Let's create something extraordinary together.
              </blockquote>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl px-5 sm:px-6 md:px-10 py-4 sm:py-4 md:py-6 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
              <button
                onClick={() => setShowStory(false)}
                className="px-5 sm:px-6 py-2.5 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 font-sans text-xs sm:text-sm font-medium rounded-xl transition-colors"
              >
                Close
              </button>
              <Link
                to="/contact"
                className="px-6 sm:px-8 py-2.5 bg-green-600 hover:bg-green-500 text-white font-sans text-xs sm:text-sm font-medium rounded-xl shadow-lg hover:shadow-green-500/20 transition-all text-center"
              >
                Contact Me →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
