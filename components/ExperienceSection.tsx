import React, { useEffect, useRef, useState } from 'react';
import { AnimatedHeading } from './AnimatedHeading';
import { Brain, Database, CheckCircle2, ShieldCheck, Award, ChevronRight } from 'lucide-react';

const EXPERIENCES = [
    {
        id: 1,
        role: 'Intelligent Sales CRM Dashboard',
        company: 'IDS Company Internship',
        period: 'Recent',
        icon: <Brain className="w-10 h-10 text-white/80" />,
        mainFeature: 'Enterprise AI Copilot',
        features: [
            'Universal AI Query Engine — plain-English questions over thousands of DB records',
            '8-Stage Secure Orchestration Pipeline — AI never touches the database directly',
            'Role-Based Access Control: Sales Rep, Manager, Director, Finance, Support Agent',
            'AI Hallucination prevention via structured JSON intent, not raw SQL generation',
            'Compliance audit logging on every query with per-role response filtering',
        ],
        stats: [
            { label: 'Stack', value: 'Next.js 15' },
            { label: 'DB', value: 'PostgreSQL' },
            { label: 'AI', value: 'Gemini' },
        ],
        certificateTitle: 'IDS Certificate of Completion',
        certificateImage: '/certificates/IDS_Certificate.png',
    },
    {
        id: 2,
        role: 'Python with MySQL Pipeline',
        company: 'GIET University Internship',
        period: 'Previous',
        icon: <Database className="w-10 h-10 text-white/80" />,
        mainFeature: 'Backend Data Architecture',
        features: [
            'Designed & optimised relational database schemas in MySQL for production workloads',
            'Built robust ETL data pipelines in Python to move and transform structured datasets',
            'Integrated backend logic with frontend interfaces using RESTful principles',
            'Optimised SQL queries that reduced average query execution time by over 40%',
            'Implemented error handling, logging and rollback strategies for data integrity',
        ],
        stats: [
            { label: 'Lang', value: 'Python' },
            { label: 'DB', value: 'MySQL' },
            { label: 'Focus', value: 'Backend' },
        ],
        certificateTitle: 'GIET Internship Certificate',
        certificateImage: '/certificates/Internship.png',
    }
];

const TOTAL_CARDS = EXPERIENCES.length;

export const ExperienceSection: React.FC = () => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const headingRef  = useRef<HTMLDivElement>(null);

    const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
    const handleFlip = (id: number) => setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));

    // ── Parallax drift: heading moves at ~40% of scroll speed ─────────────
    // Same rAF pattern as TimelineSection's number drift.
    // DRIFT = fraction of scroll the heading actually travels
    //   0.0 = completely frozen, 1.0 = normal scroll speed
    useEffect(() => {
        if (!wrapperRef.current || !headingRef.current) return;

        const DRIFT = 0.4;          // heading moves at 40% of scroll speed
        const TARGET_VH = 0.50;     // pin position = 50% from viewport top (center)

        let rafId: number;

        const tick = () => {
            const wrapper  = wrapperRef.current!;
            const heading  = headingRef.current!;
            const VH       = window.innerHeight;
            const targetY  = VH * TARGET_VH;

            const wRect       = wrapper.getBoundingClientRect();
            const scrolledPast = targetY - wRect.top;  // px past the anchor

            if (scrolledPast <= 0) {
                // Section hasn't entered the anchor yet — no transform
                heading.style.transform = 'translateY(0)';
            } else {
                // Slow drift: heading moves DRIFT × scroll speed
                // ty = how much to move heading DOWN to slow it
                const driftTy = scrolledPast * (1 - DRIFT);

                // Cap: when card 2 finishes, heading exits with the page naturally
                // Max drift = distance from center to top of section (50vh worth)
                const maxTy = VH * TARGET_VH * (1 / DRIFT - 1);

                const ty = Math.min(driftTy, maxTy);
                heading.style.transform = `translateY(${ty}px)`;
            }

            rafId = requestAnimationFrame(tick);
        };

        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
    }, []);

    /* ─────────────────────── Card render helper ──────────────────────── */
    const renderCard = (exp: typeof EXPERIENCES[0]) => (
        <div
            key={exp.id}
            className="w-full flex-shrink-0 relative"
            style={{ height: '100vh', perspective: '1200px' }}
        >
            <div
                className="w-full h-full transition-transform duration-700"
                style={{
                    transformStyle: 'preserve-3d',
                    transform: flippedCards[exp.id] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
            >
                {/* FRONT */}
                <div
                    className="absolute inset-0 bg-gradient-to-b from-[#161616] to-[#0a0a0a] border-x border-white/10 flex flex-col"
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    <div className="flex flex-col h-full px-8 sm:px-10 py-12 sm:py-16 gap-6 overflow-auto">
                        <div className="flex justify-between items-start flex-shrink-0">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">{exp.icon}</div>
                            <span className="text-[11px] font-bold px-3 py-1.5 bg-white/10 rounded-full text-white/50 uppercase tracking-widest">
                                {exp.period}
                            </span>
                        </div>
                        <div className="flex-shrink-0">
                            <h3 className="text-2xl sm:text-3xl font-bold text-white/95 leading-tight mb-1">{exp.role}</h3>
                            <h4 className="text-sm font-semibold text-white/40 tracking-wider uppercase">{exp.company}</h4>
                        </div>
                        <div className="flex-1 min-h-0 bg-black/40 border border-white/5 rounded-2xl p-5 flex flex-col">
                            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5 flex-shrink-0">
                                <ShieldCheck className="w-5 h-5 text-emerald-400/80 shrink-0" />
                                <span className="text-sm font-bold text-white/80">{exp.mainFeature}</span>
                            </div>
                            <div className="flex flex-col gap-4">
                                {exp.features.map((f, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-4 h-4 text-white/30 shrink-0 mt-0.5" />
                                        <span className="text-sm text-white/60 leading-snug">{f}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-between items-center flex-shrink-0 mt-auto">
                            <div className="flex gap-2 sm:gap-3">
                                {exp.stats.map((s, i) => (
                                    <div key={i} className="flex flex-col items-center p-3 bg-white/5 border border-white/10 rounded-xl min-w-[68px]">
                                        <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-1">{s.label}</span>
                                        <span className="text-sm font-bold text-white/90">{s.value}</span>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => handleFlip(exp.id)}
                                className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-full text-sm font-bold hover:bg-gray-200 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                            >
                                <Award className="w-4 h-4" /> Verify
                            </button>
                        </div>
                    </div>
                </div>

                {/* BACK */}
                <div
                    className="absolute inset-0 bg-[#111] border-x border-white/20 flex flex-col"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                    <div className="flex flex-col h-full px-8 sm:px-10 py-12 sm:py-16 gap-6">
                        <div className="flex items-center justify-between flex-shrink-0">
                            <h3 className="text-xl font-bold text-white/90">Certificate</h3>
                            <button
                                onClick={() => handleFlip(exp.id)}
                                className="flex items-center gap-1 text-sm font-bold text-white/50 hover:text-white transition-colors"
                            >
                                Back <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex-1 min-h-0 border border-white/10 rounded-2xl flex flex-col items-center justify-center p-2 text-center bg-white/5 relative overflow-hidden group">
                            <img
                                src={exp.certificateImage}
                                alt={exp.certificateTitle}
                                className="w-full h-full object-contain rounded-xl opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    /* ──────────────────────────── JSX ─────────────────────────────────── */
    return (
        <section id="experience-section" className="w-full bg-[#000000] text-white">

            {/* Main flex row: left column (heading) + right column (cards) */}
            <div
                ref={wrapperRef}
                className="flex flex-col md:flex-row w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12"
            >
                {/* Left: heading with parallax drift */}
                <div
                    className="hidden md:block w-1/2"
                    style={{ height: `${TOTAL_CARDS * 100}vh` }}
                >
                    {/* Natural start: heading centered in first-card zone */}
                    <div className="flex items-center" style={{ height: '100vh' }}>
                        <div
                            ref={headingRef}
                            style={{ willChange: 'transform' }}
                        >
                            <AnimatedHeading text="EXPERIENCE" />
                        </div>
                    </div>
                    <div style={{ height: '100vh' }} />
                </div>

                {/* Right: cards scroll naturally */}
                <div className="w-full md:w-1/2 border-l border-white/5 flex flex-col relative">
                    {/* Top mist */}
                    <div
                        className="sticky top-0 left-0 right-0 h-20 z-20 pointer-events-none -mb-20"
                        style={{ background: 'linear-gradient(to bottom, #000 0%, transparent 100%)' }}
                    />
                    <div>
                        {EXPERIENCES.map(renderCard)}
                    </div>
                    {/* Bottom mist */}
                    <div
                        className="absolute bottom-0 left-0 right-0 h-24 z-20 pointer-events-none"
                        style={{ background: 'linear-gradient(to top, #000 0%, transparent 100%)' }}
                    />
                </div>
            </div>

            {/* Mobile heading */}
            <div className="md:hidden sticky top-0 z-30 bg-black/80 backdrop-blur-md px-6 py-4 border-b border-white/10">
                <AnimatedHeading text="EXPERIENCE" />
            </div>

        </section>
    );
};
