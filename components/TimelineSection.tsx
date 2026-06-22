import React, { useRef, useEffect } from 'react';

interface Milestone {
  id: string;
  step: string;
  year: string;
  title: string;
  subtitle: string;
  paragraphs: string[];
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
    title: 'Early School Education',
    subtitle: 'The Learning Foundations',
    paragraphs: [
      'The years between 2010 and 2018 were not merely a passage through grades and examinations — they were the quiet formation of a mind that would, years later, find its truest expression in code and creation. From the earliest mornings spent untangling arithmetic puzzles to the afternoons absorbed in science textbooks, a distinct pattern began to emerge: an insatiable curiosity, a deep love for systems, and the rare satisfaction of understanding precisely how things work.',
      'Mathematics was not just a subject — it was a language. Science was not just a syllabus — it was a lens through which the ordinary world became endlessly fascinating. The classroom became a place not of rote memorisation but of genuine intellectual engagement, where every solved problem felt less like a task completed and more like a territory explored.',
      'These years shaped the intellectual architecture that would underpin everything that followed. The foundations laid here were not loud or dramatic. They were steady, deliberate, and quietly transformative — the kind of beginnings that only reveal their full weight in hindsight.',
    ],
  },
  {
    id: 'tenth',
    step: '02',
    year: '2019 — 2021',
    title: 'Secondary School',
    subtitle: 'The Spark of Innovation',
    paragraphs: [
      'The 10th grade was where curiosity stopped being private and became public. It was where ambition raised its hand for the first time — and the room took notice. Completed at Khallingi High School, Ganjam, these years produced not simply a board result of 82.5% but something far more significant: a first real invention brought to life from nothing but a question.',
      'The Solar Panel Wiper project was born from a deceptively simple observation — that dust and debris diminish the efficiency of solar panels, and that this problem had a mechanical solution. What followed was months of prototyping, iterating, and refining. The project earned selection to the district-level science exhibition, and with it, a cash recognition of ₹10,000 — an acknowledgement not just of effort but of ingenuity.',
      'It was the first time that an idea forged quietly in curiosity became something tangible, competitive, and publicly recognised. The lesson was clear and lasting: the gap between imagination and execution is bridged not by talent alone, but by the willingness to begin.',
    ],
    details: [
      '82.5% — Board of Secondary Education (BSE)',
      'Solar Panel Wiper: district science exhibition selection',
      'Received ₹10,000 cash award for innovation',
    ],
    achievement: 'Board Result — 82.5% (495 / 600)',
  },
  {
    id: 'plus2',
    step: '03',
    year: '2021 — 2023',
    title: 'Higher Secondary',
    subtitle: 'Exploring Academic Depth',
    paragraphs: [
      'The science stream was chosen deliberately, not casually. The two years at Nalanda Vidya Mandir, Berhampur — with Physics, Chemistry, and Mathematics as the three pillars of study — were years defined by depth. Not the breadth of exposure, but the demanding depth of genuine comprehension. The curriculum was rigorous; the expectations were exacting; and the discipline it demanded proved formative.',
      'Graduating with 80.1% under the Council of Higher Secondary Education (CHSE), this chapter was ultimately less about the marks and more about the clarity they accompanied. The intellectual interest in computation, logic, and structured problem-solving shifted — almost imperceptibly at first, then all at once — from background noise to the foreground of ambition.',
      'By the final semester, the question was no longer what to study, but how far to take it. The answer was already forming, quietly and with conviction, in the hours spent reading about algorithms, software systems, and the engineers who had built the digital world that now felt like home.',
    ],
    achievement: '80.1% — CHSE (481 / 600)',
  },
  {
    id: 'explore',
    step: '04',
    year: '2023',
    title: 'Finding Direction',
    subtitle: 'The Search for the Right Path',
    paragraphs: [
      'Not all paths run in straight lines. Some of the most consequential journeys begin not with a clear destination but with the honest admission that the current road is not the right one. After completing +2, a semester was spent in a +3 undergraduate programme — a brief chapter that, in retrospect, served a purpose far greater than its duration might suggest.',
      'It was a period of deliberate self-examination. Of sitting with discomfort and asking what truly mattered. Of drawing a sharp distinction between a path chosen by default — by inertia, by expectation, by the path of least resistance — and one chosen with intention, with clarity, and with a genuine sense of where one\'s capabilities might meet the world\'s real needs.',
      'The pivot to Computer Science and Engineering was not impulsive. It was the result of reflection — the kind that only arrives in quieter moments, when the noise of external expectation fades and something closer to truth becomes audible. Every detour, it turns out, teaches something the direct route cannot.',
    ],
    quote: '"Not every path is a detour. Some are necessary discoveries."',
  },
  {
    id: 'btech',
    step: '05',
    year: '2024 — Present',
    title: 'Bachelor of Technology',
    subtitle: 'Engineering Journey — GIET University',
    paragraphs: [
      'In 2024, the next chapter began — not as a conclusion but as an acceleration. B.Tech in Computer Science Engineering at Gandhi Institute of Engineering and Technology, Gunupur, has been precisely what a rigorous technical education should be: demanding in its expectations, generous in its returns, and unsparing in the clarity it offers about what it truly means to build.',
      'The first year established the academic bedrock — algorithms, data structures, discrete mathematics, and the computational fundamentals that separate strong engineers from merely capable ones. The second year demanded more: navigating complexity under pressure, maintaining standards when the work grew harder, and producing outcomes that could withstand scrutiny beyond the classroom.',
      'Beyond the lecture halls, the real work has always lived in the projects — AI-powered systems, full-stack web platforms, computer vision tools, and natural language processing applications that have each moved from concept through architecture to deployment. Five applications now serve real users. A current CGPA of 8.98 reflects not perfection, but something more honest: precision, persistence, and the commitment to understand rather than merely complete.',
      'The journey is far from over. It has, in many ways, only just begun.',
    ],
    details: [
      'Algorithms, Data Structures & Computational Theory',
      'Full-Stack Development — React, Node.js, TypeScript',
      'Artificial Intelligence, Computer Vision & NLP',
      '5+ deployed applications serving real users',
    ],
    achievement: 'Current CGPA — 8.98 / 10',
    isCurrent: true,
  },
];

export const TimelineSection: React.FC = () => {
  const sectionRef  = useRef<HTMLElement>(null);
  const cellRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const numRefs     = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const TARGET_VH = 0.35; // stick at 35% from top

    // 0.0 = completely frozen, 1.0 = normal scroll speed
    // 0.30 = number moves at 30% of scroll speed — visible slow drift
    const DRIFT = 0.30;

    const tick = () => {
      const targetY = window.innerHeight * TARGET_VH;

      numRefs.current.forEach((numEl, i) => {
        const cell = cellRefs.current[i];
        if (!numEl || !cell) return;

        const cellRect     = cell.getBoundingClientRect();
        const numH         = numEl.offsetHeight;
        const cellH        = cell.offsetHeight;
        const scrolledPast = targetY - cellRect.top;

        if (scrolledPast <= 0) {
          numEl.style.transform = 'translateY(0)';
          return;
        }

        // Slow drift ty
        const driftTy = scrolledPast * (1 - DRIFT);

        // Hard limit: number must not go below the cell's bottom padding area.
        // pt-10 (40px) top + pb-10 (40px) bottom → maxTy = cellH - numH - 80
        // This ensures number exits WITH the content, not left behind.
        const maxTy = Math.max(0, cellH - numH - 80);

        // Smooth clamp — no jump because driftTy reaches maxTy continuously
        const ty = Math.min(driftTy, maxTy);

        numEl.style.transform = `translateY(${ty}px)`;
      });

      rafId = requestAnimationFrame(tick);
    };

    let rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
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

      {/* ══════════════════════════════════════════════════════════
          DESKTOP: 3-column grid
          Col 1 — large number (JS sticky for 01–04)
          Col 2 — title, subtitle, year, achievement
          Col 3 — rich editorial prose
         ══════════════════════════════════════════════════════════ */}
      <div
        className="hidden md:grid"
        style={{ gridTemplateColumns: '18% 26% 1fr' }}
      >
        {MILESTONES.map((m, i) => (
          <React.Fragment key={m.id}>

            {/* ── COL 1: Number ── */}
            <div
              ref={el => { cellRefs.current[i] = el; }}
              className="border-t border-black/[0.08] pl-8 lg:pl-10 pt-10 pb-10"
              style={{ minHeight: '65vh' }}
            >
              <span
                ref={el => { numRefs.current[i] = el; }}
                className="block font-black leading-none select-none text-[#0a0a0a]"
                style={{
                  fontSize: 'clamp(4.5rem, 9vw, 10rem)',
                  letterSpacing: '-0.06em',
                  willChange: 'transform',
                }}
              >
                {m.step}
              </span>
            </div>

            {/* ── COL 2: Title + Meta ── */}
            <div
              className="border-t border-l border-black/[0.08] pt-10 pb-10 px-8 lg:px-10"
              style={{ minHeight: '65vh' }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-green-700 mb-5">
                {m.year}
              </p>
              <h3
                className="font-black leading-tight tracking-tight text-[#0a0a0a] mb-4"
                style={{ fontSize: 'clamp(1.5rem, 2.4vw, 2.2rem)' }}
              >
                {m.title}
              </h3>
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-black/35 mb-8">
                {m.subtitle}
              </p>

              <div
                className="mb-8 h-[1px] w-8"
                style={{ background: m.isCurrent ? '#16a34a' : 'rgba(0,0,0,0.15)' }}
              />

              {m.achievement && (
                <div className="inline-flex items-center gap-2 border border-green-700/20 bg-green-700/[0.06] px-3 py-1.5 mb-6">
                  <span className="w-1.5 h-1.5 bg-green-700 flex-shrink-0 rounded-full" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-green-800">
                    {m.achievement}
                  </span>
                </div>
              )}

              {m.details && (
                <ul className="space-y-2.5 mt-4">
                  {m.details.map((d, di) => (
                    <li key={di} className="flex items-start gap-3 text-[#666] text-sm leading-relaxed">
                      <span className="mt-[0.4rem] w-1 h-1 flex-shrink-0 rounded-full bg-black/30" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              )}

              {m.isCurrent && (
                <div className="mt-8 flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-green-700">
                    Currently Here
                  </span>
                </div>
              )}
            </div>

            {/* ── COL 3: Rich prose ── */}
            <div
              className="border-t border-l border-black/[0.08] pt-10 pb-10 px-8 lg:px-12"
              style={{ minHeight: '65vh' }}
            >
              <div className="space-y-5 max-w-prose">
                {m.paragraphs.map((para, pi) => (
                  <p
                    key={pi}
                    className="text-[#4a4a4a] text-base md:text-[1.05rem] leading-[1.85] tracking-[0.01em]"
                  >
                    {para}
                  </p>
                ))}
                {m.quote && (
                  <blockquote className="mt-6 pl-5 border-l-2 border-black/20">
                    <p className="font-serif italic text-black/40 text-base md:text-lg leading-relaxed">
                      {m.quote}
                    </p>
                  </blockquote>
                )}
              </div>
            </div>

          </React.Fragment>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════
          MOBILE: single column
         ══════════════════════════════════════════════════════════ */}
      <div className="md:hidden">
        {MILESTONES.map((m) => (
          <div key={m.id} className="border-t border-black/[0.08] px-6 py-10">
            <p
              className="font-black leading-none tracking-tighter text-[#0a0a0a]/60 mb-4"
              style={{ fontSize: '4.5rem', letterSpacing: '-0.06em' }}
            >
              {m.step}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-green-700 mb-3">{m.year}</p>
            <h3 className="font-black leading-tight text-[#0a0a0a] mb-2 text-2xl">{m.title}</h3>
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-black/35 mb-6">{m.subtitle}</p>
            <div className="space-y-4 mb-6">
              {m.paragraphs.map((para, pi) => (
                <p key={pi} className="text-[#4a4a4a] text-base leading-relaxed">{para}</p>
              ))}
            </div>
            {m.achievement && (
              <div className="inline-flex items-center gap-2 border border-green-700/20 bg-green-700/[0.06] px-3 py-1.5 mb-4">
                <span className="w-1.5 h-1.5 bg-green-700 flex-shrink-0 rounded-full" />
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-green-800">{m.achievement}</span>
              </div>
            )}
            {m.quote && (
              <blockquote className="pl-4 border-l-2 border-black/20 mt-4">
                <p className="font-serif italic text-black/40 text-base leading-relaxed">{m.quote}</p>
              </blockquote>
            )}
            {m.isCurrent && (
              <div className="mt-6 flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-green-700">Currently Here</span>
              </div>
            )}
          </div>
        ))}
      </div>


    </section>
  );
};
