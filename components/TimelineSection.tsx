import React, { useRef, useEffect } from 'react';

interface Milestone {
  id: string;
  step: string;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  details?: string[];
  achievement?: string;
  quote?: string;
  isCurrent?: boolean;
}

const MILESTONES: Milestone[] = [
  {
    id: 'school',
    step: '01',
    year: '2010 — 2018',
    title: 'EARLY SCHOOL EDUCATION',
    subtitle: 'The Learning Foundations',
    description:
      'Completed early schooling up to 8th standard, developing a strong interest in mathematics, science, creativity, and logical thinking. These years quietly built the intellectual scaffolding that would later carry the weight of engineering ambitions.',
  },
  {
    id: 'tenth',
    step: '02',
    year: '2019 — 2021',
    title: 'SECONDARY SCHOOL',
    subtitle: 'The Spark of Innovation',
    description:
      'Completed 10th grade from Khallingi High School, Ganjam. This phase sharpened curiosity toward science and technology — and produced a first real invention that reached the district stage.',
    details: [
      '82.5% (495/600) in BSE board examination',
      'Built a Solar Panel Wiper project for the district science exhibition',
      'Project selected for the next round — received Rs.10,000 cash award',
    ],
    achievement: 'Board Result — 82.5%',
  },
  {
    id: 'plus2',
    step: '03',
    year: '2021 — 2023',
    title: 'HIGHER SECONDARY',
    subtitle: 'Exploring Academic Depth',
    description:
      'Completed +2 from Nalanda Vidya Mandir, Berhampur with the Science stream. During this period, deep interest in technology, computers, and problem solving crystallized into a clear career direction.',
    achievement: '80.1% (481/600) — CHSE',
  },
  {
    id: 'explore',
    step: '04',
    year: '2023',
    title: 'FINDING DIRECTION',
    subtitle: 'The Search for the Right Path',
    description:
      'After completing +2, briefly joined a +3 undergraduate program and completed one semester while exploring the right academic path. The search led to a decisive pivot — towards Computer Science and Engineering.',
    quote: '"Not every path is a detour. Some are necessary discoveries."',
  },
  {
    id: 'btech',
    step: '05',
    year: '2024 — Present',
    title: 'BACHELOR OF TECHNOLOGY',
    subtitle: 'Engineering Journey — GIET University',
    description:
      'Joined B.Tech in Computer Science Engineering at Gandhi Institute of Engineering and Technology, Gunupur. Built strong academic foundations in the first year, overcame challenges in the second year, and continue building real-world AI and full-stack applications.',
    details: [
      'Algorithms, Data Structures and Problem Solving',
      'Full-Stack Web Development — React, Node.js, TypeScript',
      'Artificial Intelligence, Computer Vision and NLP',
      '5+ deployed applications serving real users',
    ],
    achievement: 'Current CGPA — 8.98 / 10',
    isCurrent: true,
  },
];

const MilestoneContent: React.FC<{ m: Milestone }> = ({ m }) => (
  <>
    <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.3em] text-green-700 mb-4">{m.year}</p>
    <h3
      className="font-black uppercase leading-none tracking-tight text-[#0a0a0a] mb-3"
      style={{ fontSize: 'clamp(1.6rem, 4vw, 3.2rem)' }}
    >
      {m.title}
    </h3>
    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-black/35 mb-7">{m.subtitle}</p>
    <div className="mb-7 h-[1px] w-10" style={{ background: m.isCurrent ? '#16a34a' : 'rgba(0,0,0,0.15)' }} />
    <p className="text-[#555] text-base md:text-lg leading-relaxed w-full mb-7">{m.description}</p>

    {m.details && (
      <ul className="space-y-3 mb-7">
        {m.details.map((d, i) => (
          <li key={i} className="flex items-start gap-3.5 text-[#666] text-sm md:text-base leading-relaxed">
            <span className="mt-[0.45rem] w-1.5 h-1.5 flex-shrink-0 rounded-full" style={{ background: '#16a34a' }} />
            <span>{d}</span>
          </li>
        ))}
      </ul>
    )}

    {m.achievement && (
      <div className="inline-flex items-center gap-2.5 border border-green-700/20 bg-green-700/[0.06] px-4 py-2 mb-5">
        <span className="w-1.5 h-1.5 bg-green-700 flex-shrink-0" />
        <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-green-800">{m.achievement}</span>
      </div>
    )}

    {m.quote && (
      <p className="font-serif italic text-black/30 text-base md:text-lg max-w-[44ch] mt-2">{m.quote}</p>
    )}

    {m.isCurrent && (
      <div className="mt-6 flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-green-700">Currently Here</span>
      </div>
    )}
  </>
);

export const TimelineSection: React.FC = () => {
  const sectionRef   = useRef<HTMLElement>(null);
  // refs to the LEFT cells (one per milestone)
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);
  // refs to the number spans inside each left cell
  const numRefs  = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    // ── JS-BASED STICKY ──────────────────────────────────────────────
    // We manually reimplement position:sticky here because CSS sticky
    // is unreliable when ancestor elements have CSS transforms.
    // STICKY TARGET: 38vh from top of viewport (upper-center of screen)
    const TARGET_VH = 0.38;

    const tick = () => {
      const targetY = window.innerHeight * TARGET_VH;
      const lastIndex = numRefs.current.length - 1;

      numRefs.current.forEach((numEl, i) => {
        const cell = cellRefs.current[i];
        if (!numEl || !cell) return;

        // Last number (05) scrolls normally — no sticky
        if (i === lastIndex) {
          numEl.style.transform = 'translateY(0)';
          return;
        }

        const cellRect = cell.getBoundingClientRect();
        const numH     = numEl.offsetHeight;
        const cellH    = cell.offsetHeight;

        const scrolledPast = targetY - cellRect.top;

        let translateY: number;

        if (scrolledPast <= 0) {
          translateY = 0;
        } else if (scrolledPast >= cellH - numH) {
          translateY = cellH - numH;
        } else {
          translateY = scrolledPast;
        }

        numEl.style.transform = `translateY(${translateY}px)`;
      });
    };

    window.addEventListener('scroll', tick, { passive: true });
    tick(); // run once on mount

    return () => window.removeEventListener('scroll', tick);
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#f5f4f0] text-[#0a0a0a]">

      {/* ── TITLE ── */}
      <div className="text-center pt-16 pb-8 px-6">
        <h2
          className="font-black uppercase leading-none tracking-tighter text-[#0a0a0a]"
          style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
        >
          Timeline
        </h2>
      </div>

      {/* ── DESKTOP: two-column grid ── */}
      <div className="hidden md:grid" style={{ gridTemplateColumns: '26% 1fr' }}>
        {MILESTONES.map((m, i) => (
          <React.Fragment key={m.id}>

            {/* LEFT CELL: number moves via JS sticky */}
            <div
              ref={el => { cellRefs.current[i] = el; }}
              className="border-t border-black/[0.08] pl-8 md:pl-10 pt-10 pb-10"
              style={{ minHeight: '60vh' }}
            >
              <span
                ref={el => { numRefs.current[i] = el; }}
                className="block font-black leading-none select-none text-[#0a0a0a]"
                style={{
                  fontSize: 'clamp(5rem, 10vw, 11rem)',
                  letterSpacing: '-0.06em',
                  opacity: 1,
                  willChange: 'transform',
                }}
              >
                {m.step}
              </span>
            </div>

            {/* RIGHT CELL: plain normal scroll — zero JS involved */}
            <div
              className="border-t border-l border-black/[0.08] py-10 md:py-14 pl-8 md:pl-14 pr-6 md:pr-16 lg:pr-20"
              style={{ minHeight: '60vh' }}
            >
              <MilestoneContent m={m} />
            </div>

          </React.Fragment>
        ))}
      </div>

      {/* ── MOBILE: stacked ── */}
      <div className="md:hidden">
        {MILESTONES.map((m) => (
          <div key={m.id} className="border-t border-black/[0.08] px-6 py-10">
            <p
              className="font-black leading-none tracking-tighter text-[#0a0a0a]/60 mb-6"
              style={{ fontSize: '5rem', letterSpacing: '-0.06em' }}
            >
              {m.step}
            </p>
            <MilestoneContent m={m} />
          </div>
        ))}
      </div>

      {/* ── FOOTER ── */}
      <div className="relative flex flex-col items-center justify-center min-h-[40vh] border-t border-black/[0.06] px-6 text-center bg-[#f0efe9]">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-green-700/60 mb-4">The Summit Ahead</p>
        <h3
          className="font-black uppercase leading-none tracking-tight text-[#0a0a0a] mb-5"
          style={{ fontSize: 'clamp(1.8rem, 5vw, 4rem)', opacity: 0.8 }}
        >
          Future Vision
        </h3>
        <p className="font-serif italic text-black/35 text-base md:text-lg max-w-md leading-relaxed">
          &ldquo;To architect scalable systems and craft intelligent AI solutions that leave a lasting legacy in the world.&rdquo;
        </p>
      </div>

    </section>
  );
};
