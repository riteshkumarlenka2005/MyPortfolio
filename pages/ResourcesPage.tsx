import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Lenis from 'lenis';
import { InteractiveFooter } from '../components/InteractiveFooter';


// ─────────────────────────────────────────────────────────────────────────────
// Intersection Observer hook for scroll-reveal animations
// ─────────────────────────────────────────────────────────────────────────────
function useReveal(threshold = 0.15) {
    const ref = useRef<HTMLElement>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold]);
    return { ref, visible };
}

// ─────────────────────────────────────────────────────────────────────────────
// Section label component
// ─────────────────────────────────────────────────────────────────────────────
const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="flex items-center gap-3 mb-4">
        <div className="h-[1px] w-8 bg-white/40" />
        <span className="text-white/50 text-xs font-mono uppercase tracking-[0.2em]">{children}</span>
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// RESOURCES PAGE
// ─────────────────────────────────────────────────────────────────────────────
export const ResourcesPage: React.FC = () => {
    const [heroVisible, setHeroVisible] = useState(false);

    // Smooth scroll
    useEffect(() => {
        const lenis = new Lenis({ lerp: 0.05, smoothWheel: true, wheelMultiplier: 0.8, touchMultiplier: 1.5 });
        let rafId: number;
        const update = (time: number) => { lenis.raf(time); rafId = requestAnimationFrame(update); };
        rafId = requestAnimationFrame(update);
        return () => { lenis.destroy(); cancelAnimationFrame(rafId); };
    }, []);

    // Hero entrance - triggers fluid animation
    useEffect(() => {
        const t = setTimeout(() => setHeroVisible(true), 100);
        return () => clearTimeout(t);
    }, []);

    // Section refs for reveal
    const featuredReveal = useReveal();
    const recommendedReveal = useReveal();
    const setupReveal = useReveal();
    const quoteReveal = useReveal();
    const ctaReveal = useReveal();

    // State for 'Coming Soon' on cards
    const [comingSoonCard, setComingSoonCard] = useState<string | null>(null);
    const handleComingSoon = (id: string) => {
        setComingSoonCard(id);
        setTimeout(() => setComingSoonCard(null), 2500);
    };

    return (
        <div className="min-h-screen bg-[#000000] text-white font-sans selection:bg-white/20 selection:text-white">

            {/* ═══════════════════════════════════════════════
                1. HERO SECTION (Framer Motion Morphing Watercolor Reveal)
            ═══════════════════════════════════════════════ */}
            <section className="fixed inset-0 z-0 min-h-screen flex overflow-hidden bg-[#000000]">

                {/* Right side — Deep Dark Theme (Blank) */}
                <div className="absolute inset-0 z-0 bg-[#000000]" />

                {/* Left side — Single Flowing Irregular White Shape (Watercolor Effect) */}
                <div className="absolute inset-y-0 left-0 w-full z-10 pointer-events-none">
                    {/* Desktop/Tablet SVG */}
                    <svg viewBox="0 0 1440 1000" preserveAspectRatio="xMinYMid slice" className="hidden sm:block w-full h-full">
                        {/* Single Irregular White Layer */}
                        <motion.path
                            initial={{
                                d: "M0,0 L 20,0 A 60 60 0 0 1 20 120 L 15,120 A 40 40 0 0 0 15 200 L 25,200 A 60 60 0 0 1 25 320 L 10,320 A 50 50 0 0 0 10 420 L 20,420 A 40 40 0 0 1 20 500 L 5,500 A 70 70 0 0 0 5 640 L 25,640 A 50 50 0 0 1 25 740 L 15,740 A 30 30 0 0 0 15 800 L 20,800 A 50 50 0 0 1 20 900 L 10,900 A 50 50 0 0 0 10 1000 L 0,1000 Z",
                                x: "-100%"
                            }}
                            animate={heroVisible ? {
                                d: "M0,0 L 690,0 A 60 60 0 0 1 690 120 L 640,120 A 40 40 0 0 0 640 200 L 700,200 A 60 60 0 0 1 700 320 L 610,320 A 50 50 0 0 0 610 420 L 680,420 A 40 40 0 0 1 680 500 L 570,500 A 70 70 0 0 0 570 640 L 690,640 A 50 50 0 0 1 690 740 L 650,740 A 30 30 0 0 0 650 800 L 710,800 A 50 50 0 0 1 710 900 L 660,900 A 50 50 0 0 0 660 1000 L 0,1000 Z",
                                x: 0
                            } : {}}
                            transition={{ duration: 2.2, ease: [0.2, 0.9, 0.2, 1] }}
                            className="fill-white filter drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] drop-shadow-2xl"
                        />
                    </svg>
                    {/* Mobile SVG */}
                    <svg viewBox="0 0 1440 1000" preserveAspectRatio="xMidYMid slice" className="block sm:hidden w-full h-full">
                        {/* Single Irregular White Layer */}
                        <motion.path
                            initial={{
                                d: "M0,0 L 20,0 A 60 60 0 0 1 20 120 L 15,120 A 40 40 0 0 0 15 200 L 25,200 A 60 60 0 0 1 25 320 L 10,320 A 50 50 0 0 0 10 420 L 20,420 A 40 40 0 0 1 20 500 L 5,500 A 70 70 0 0 0 5 640 L 25,640 A 50 50 0 0 1 25 740 L 15,740 A 30 30 0 0 0 15 800 L 20,800 A 50 50 0 0 1 20 900 L 10,900 A 50 50 0 0 0 10 1000 L 0,1000 Z",
                                x: "-100%"
                            }}
                            animate={heroVisible ? {
                                d: "M0,0 L 690,0 A 60 60 0 0 1 690 120 L 640,120 A 40 40 0 0 0 640 200 L 700,200 A 60 60 0 0 1 700 320 L 610,320 A 50 50 0 0 0 610 420 L 680,420 A 40 40 0 0 1 680 500 L 570,500 A 70 70 0 0 0 570 640 L 690,640 A 50 50 0 0 1 690 740 L 650,740 A 30 30 0 0 0 650 800 L 710,800 A 50 50 0 0 1 710 900 L 660,900 A 50 50 0 0 0 660 1000 L 0,1000 Z",
                                x: 0
                            } : {}}
                            transition={{ duration: 2.2, ease: [0.2, 0.9, 0.2, 1] }}
                            className="fill-white filter drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] drop-shadow-2xl"
                        />
                    </svg>
                </div>

                {/* Text Overlays */}
                <div className="absolute inset-0 z-20 flex flex-row items-center justify-between px-4 sm:px-8 md:px-24 w-full pointer-events-none">
                    {/* Left Text (Dark text on white shape) */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={heroVisible ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                        className="w-1/2 flex justify-start"
                    >
                        <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-8xl font-black text-black uppercase tracking-tighter leading-[0.9] drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)] md:drop-shadow-none">
                            Tech<br />Library
                        </h1>
                    </motion.div>

                    {/* Right Text (White text on dark bg) */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={heroVisible ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                        className="w-1/2 flex justify-end text-right"
                    >
                        <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9] drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] md:drop-shadow-none">
                            Knowledge<br />Is Ocean
                        </h1>
                    </motion.div>
                </div>

            </section>

            {/* Main Content & Footer Wrapper for Parallax */}
            <div className="relative z-10 mt-[100vh] bg-[#000000]">
                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-24 pb-32 space-y-32">

                    {/* ═══════════════════════════════════════════════
                    2. FEATURED RESOURCES — 3 Premium Cards
                ═══════════════════════════════════════════════ */}
                    <section ref={featuredReveal.ref as React.Ref<HTMLElement>}>
                        <div className={`transition-all duration-1000 ${featuredReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                            <SectionLabel>Featured Resources</SectionLabel>
                            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white mb-12">
                                Start Your Journey
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Card 1 — Learning Roadmaps */}
                                <div
                                    onClick={() => handleComingSoon('card1')}
                                    className="group relative bg-[#0d0d0d] border border-white/8 rounded-3xl p-8 overflow-hidden hover:border-white/20 transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.04)] cursor-pointer"
                                >
                                    {/* Coming Soon Overlay */}
                                    <div className={`absolute inset-0 z-50 flex items-center justify-center bg-[#060606]/90 backdrop-blur-sm transition-all duration-300 ${comingSoonCard === 'card1' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                                        <div className="text-white font-bold text-lg tracking-widest uppercase border border-white/20 px-6 py-2.5 rounded-full bg-white/5">
                                            Coming Soon
                                        </div>
                                    </div>

                                    <div className="absolute inset-0 bg-gradient-to-br from-white/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                                    <div className="relative z-10">
                                        <div className="text-4xl mb-5">📚</div>
                                        <h3 className="text-xl font-bold text-white mb-2">Learning Roadmaps</h3>
                                        <p className="text-gray-500 text-sm mb-6">Structured paths to master the skills that matter most.</p>
                                        <ul className="space-y-2.5 mb-8">
                                            {['Web Development Roadmap', 'AI/ML Roadmap', 'DSA Roadmap', 'System Design Roadmap'].map(item => (
                                                <li key={item} className="flex items-center gap-2.5 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                        <button className="flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white hover:gap-3 transition-all duration-300">
                                            Explore <span>→</span>
                                        </button>
                                    </div>
                                    <div className="absolute bottom-6 right-6 text-6xl opacity-[0.04] pointer-events-none select-none font-black">01</div>
                                </div>

                                {/* Card 2 — Developer Toolkit (center — slightly elevated) */}
                                <div
                                    onClick={() => handleComingSoon('card2')}
                                    className="group relative bg-[#111] border border-white/15 rounded-3xl p-8 overflow-hidden hover:border-white/30 transition-all duration-500 hover:shadow-[0_0_60px_rgba(255,255,255,0.06)] cursor-pointer md:scale-[1.02]"
                                >
                                    {/* Coming Soon Overlay */}
                                    <div className={`absolute inset-0 z-50 flex items-center justify-center bg-[#060606]/90 backdrop-blur-sm transition-all duration-300 ${comingSoonCard === 'card2' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                                        <div className="text-white font-bold text-lg tracking-widest uppercase border border-white/20 px-6 py-2.5 rounded-full bg-white/5">
                                            Coming Soon
                                        </div>
                                    </div>

                                    {/* Premium badge */}
                                    <div className="absolute top-4 right-4 bg-white/8 border border-white/15 text-white/60 text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full">
                                        Featured
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/4 to-transparent rounded-3xl" />
                                    <div className="relative z-10">
                                        <div className="text-4xl mb-5">🛠</div>
                                        <h3 className="text-xl font-bold text-white mb-2">Developer Toolkit</h3>
                                        <p className="text-gray-400 text-sm mb-6">The exact tools I use daily to build and ship projects.</p>
                                        <ul className="space-y-2.5 mb-8">
                                            {['VS Code Extensions', 'AI Tools', 'Browser Extensions', 'Productivity Apps'].map(item => (
                                                <li key={item} className="flex items-center gap-2.5 text-sm text-gray-300 transition-colors">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-white/60 shrink-0" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                        <button className="flex items-center gap-2 text-sm font-semibold text-white hover:gap-3 transition-all duration-300">
                                            View Toolkit <span>→</span>
                                        </button>
                                    </div>
                                    <div className="absolute bottom-6 right-6 text-6xl opacity-[0.04] pointer-events-none select-none font-black">02</div>
                                </div>

                                {/* Card 3 — Interview Prep */}
                                <div
                                    onClick={() => handleComingSoon('card3')}
                                    className="group relative bg-[#0d0d0d] border border-white/8 rounded-3xl p-8 overflow-hidden hover:border-white/20 transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.04)] cursor-pointer"
                                >
                                    {/* Coming Soon Overlay */}
                                    <div className={`absolute inset-0 z-50 flex items-center justify-center bg-[#060606]/90 backdrop-blur-sm transition-all duration-300 ${comingSoonCard === 'card3' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                                        <div className="text-white font-bold text-lg tracking-widest uppercase border border-white/20 px-6 py-2.5 rounded-full bg-white/5">
                                            Coming Soon
                                        </div>
                                    </div>

                                    <div className="absolute inset-0 bg-gradient-to-br from-white/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                                    <div className="relative z-10">
                                        <div className="text-4xl mb-5">🎯</div>
                                        <h3 className="text-xl font-bold text-white mb-2">Interview Preparation</h3>
                                        <p className="text-gray-500 text-sm mb-6">Everything you need to crack technical interviews.</p>
                                        <ul className="space-y-2.5 mb-8">
                                            {['DSA Resources', 'Aptitude Resources', 'Resume Tips', 'Interview Questions'].map(item => (
                                                <li key={item} className="flex items-center gap-2.5 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                        <button className="flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white hover:gap-3 transition-all duration-300">
                                            Start Learning <span>→</span>
                                        </button>
                                    </div>
                                    <div className="absolute bottom-6 right-6 text-6xl opacity-[0.04] pointer-events-none select-none font-black">03</div>
                                </div>
                            </div>
                        </div>
                    </section>



                    {/* ═══════════════════════════════════════════════
                    5. RECOMMENDED RESOURCES
                ═══════════════════════════════════════════════ */}
                    <section ref={recommendedReveal.ref as React.Ref<HTMLElement>}>
                        <div className={`transition-all duration-1000 ${recommendedReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                            <SectionLabel>Curated Picks</SectionLabel>
                            <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white mb-12">
                                Recommended Resource
                            </h2>

                            <div className="space-y-6">
                                {/* GitHub Repo Link Button */}
                                <a
                                    href="https://github.com/riteshkumarlenka2005/LearnSKILLS"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-6 sm:gap-10 bg-[#060606] border border-white/10 hover:border-white/30 rounded-[32px] p-8 md:p-12 min-h-[180px] w-full transition-all duration-500 hover:shadow-[0_0_60px_rgba(255,255,255,0.05)] hover:bg-[#0a0a0a] overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[32px] pointer-events-none" />

                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-24 h-24 sm:w-28 sm:h-28 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform duration-500 shrink-0">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>

                                    <div className="flex flex-col items-center sm:items-start text-center sm:text-left relative z-10">
                                        <h3 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight mb-2 group-hover:text-gray-100 transition-colors">
                                            GitHub
                                        </h3>
                                        <p className="text-gray-500 font-mono text-sm sm:text-base tracking-widest uppercase mt-2">
                                            Explore LearnSKILLS Repo
                                        </p>
                                    </div>

                                    {/* Arrow icon that animates on hover */}
                                    <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-14 h-14 rounded-full border border-white/10 bg-white/5 group-hover:bg-white/10 group-hover:border-white/30 transition-all duration-300 shadow-lg">
                                        <svg className="w-6 h-6 text-white transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </section>



                    {/* ═══════════════════════════════════════════════
                    7. DEVELOPER SETUP — My Workspace
                ═══════════════════════════════════════════════ */}
                    <section ref={setupReveal.ref as React.Ref<HTMLElement>}>
                        <div className={`transition-all duration-1000 ${setupReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                            <SectionLabel>Developer Setup</SectionLabel>
                            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white mb-4">
                                My Workspace
                            </h2>
                            <p className="text-gray-500 text-lg mb-12 max-w-xl">The hardware, software, and tools that power my workflow every day.</p>

                            <div className="relative bg-[#050505] border border-white/8 rounded-3xl overflow-hidden">
                                {/* Terminal header */}
                                <div className="flex items-center gap-2 px-6 py-4 border-b border-white/6 bg-[#080808]">
                                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                                    <div className="w-3 h-3 rounded-full bg-gray-500/70" />
                                    <span className="ml-4 text-xs font-mono text-gray-600">workspace.config</span>
                                </div>

                                {/* Setup grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-white/10 border-t border-white/10">
                                    {[
                                        { label: 'Laptop', value: 'ASUS Laptop' },
                                        { label: 'Editor', value: 'VS Code' },
                                        { label: 'AI Assistants', value: 'Claude, ChatGPT' },
                                        { label: 'Version Control', value: 'GitHub' },
                                        { label: 'Database', value: 'MySQL' },
                                        { label: 'Design Tool', value: 'Figma, Dribble, Pinterest' },
                                        { label: 'OS', value: 'Windows 11, Linux' },
                                        { label: 'Browser', value: 'Brave Browser,Google Chrome' },
                                        { label: 'Terminal', value: 'PowerShell' },
                                    ].map(({ label, value }) => (
                                        <div
                                            key={label}
                                            className="flex items-center gap-4 sm:gap-6 p-6 sm:p-8 lg:p-10 bg-[#050505] hover:bg-[#0a0a0a] transition-colors duration-200"
                                        >
                                            <div>
                                                <div className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-1">{label}</div>
                                                <div className="text-lg lg:text-xl font-bold text-gray-200">{value}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ═══════════════════════════════════════════════
                    8. QUOTE SECTION
                ═══════════════════════════════════════════════ */}
                    <section ref={quoteReveal.ref as React.Ref<HTMLElement>}>
                        <div
                            className={`relative text-center py-16 px-8 transition-all duration-1000 ${quoteReveal.visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                        >
                            {/* Big decorative quote */}
                            <div
                                className="absolute top-0 left-1/2 -translate-x-1/2 text-[10rem] leading-none font-serif text-white/4 pointer-events-none select-none"
                                aria-hidden="true"
                            >
                                "
                            </div>
                            <div className="relative z-10 max-w-3xl mx-auto">
                                <p className="text-2xl md:text-3xl lg:text-4xl font-light italic text-gray-300 leading-relaxed mb-8">
                                    "Learning never stops. Every project teaches something new, and every challenge becomes an opportunity to grow."
                                </p>
                                <div className="flex items-center justify-center gap-3">
                                    <div className="h-[1px] w-12 bg-white/20" />
                                    <span className="text-sm font-mono text-white/40 tracking-widest uppercase">Ritesh Kumar Lenka</span>
                                    <div className="h-[1px] w-12 bg-white/20" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ═══════════════════════════════════════════════
                    9. CTA SECTION
                ═══════════════════════════════════════════════ */}
                    <section ref={ctaReveal.ref as React.Ref<HTMLElement>}>
                        <div
                            className={`relative overflow-hidden bg-black border border-white/10 rounded-3xl px-8 md:px-16 py-16 md:py-24 text-center transition-all duration-1000 ${ctaReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                        >

                            <div className="relative z-10 max-w-2xl mx-auto">
                                <h2 className="text-4xl md:text-5xl font-black text-white mb-12 tracking-tight uppercase">
                                    You Should
                                </h2>
                                {/* Motivational Quote */}
                                <div className="mb-12 flex flex-col items-center justify-center text-lg sm:text-xl md:text-2xl lg:text-3xl text-white tracking-wider leading-[1.6]">
                                    <p>Become a ghost for 6 months.</p>
                                    <p>Make everything your fault.</p>
                                    <p>Find the beast within you.</p>
                                    <p>Throw yourself into pain.</p>
                                    <p>Cut out all the excuses.</p>
                                    <p>Go all in on yourself.</p>
                                    <p>Train like a warrior.</p>
                                    <p>Work like a robot.</p>
                                    <p>Eat like a king.</p>
                                    <p>Reject vices.</p>
                                    <p>Transform.</p>
                                    <p>Upgrade.</p>
                                    <p>Create.</p>
                                    <p>Thrive.</p>
                                    <p>Win.</p>
                                </div>

                                <div className="flex flex-wrap items-center justify-center gap-4">
                                    <Link
                                        to="/contact"
                                        className="group inline-flex items-center gap-2.5 bg-white hover:bg-gray-100 text-black font-bold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:scale-105"
                                    >
                                        Contact Me
                                        <svg className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </Link>
                                    <Link
                                        to="/projects"
                                        className="group inline-flex items-center gap-2.5 bg-white/6 hover:bg-white/10 border border-white/10 hover:border-white/25 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300"
                                    >
                                        View My Work
                                        <svg className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>

                <InteractiveFooter />
            </div>
        </div>
    );
};
