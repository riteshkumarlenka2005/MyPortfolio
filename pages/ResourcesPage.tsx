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
    const stackReveal = useReveal();
    const notesReveal = useReveal();
    const recommendedReveal = useReveal();
    const downloadsReveal = useReveal();
    const setupReveal = useReveal();
    const quoteReveal = useReveal();
    const ctaReveal = useReveal();

    return (
        <div className="min-h-screen bg-[#000000] text-white font-sans selection:bg-white/20 selection:text-white">

            {/* ═══════════════════════════════════════════════
                1. HERO SECTION (Framer Motion Morphing Watercolor Reveal)
            ═══════════════════════════════════════════════ */}
            <section className="relative min-h-screen flex overflow-hidden bg-[#000000]">
                
                {/* Right side — Deep Dark Theme (Blank) */}
                <div className="absolute inset-0 z-0 bg-[#000000]" />

                {/* Left side — Single Flowing Irregular White Shape (Watercolor Effect) */}
                <div className="absolute inset-y-0 left-0 w-full z-10 pointer-events-none">
                    <svg viewBox="0 0 1440 1000" preserveAspectRatio="xMinYMid slice" className="w-full h-full">
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

            </section>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pb-32 space-y-32 bg-[#000000]">

                {/* ═══════════════════════════════════════════════
                    2. FEATURED RESOURCES — 3 Premium Cards
                ═══════════════════════════════════════════════ */}
                <section ref={featuredReveal.ref as React.Ref<HTMLElement>}>
                    <div className={`transition-all duration-1000 ${featuredReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                        <SectionLabel>Featured Resources</SectionLabel>
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white mb-12">
                            Start Your Journey
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Card 1 — Learning Roadmaps */}
                            <div className="group relative bg-[#0d0d0d] border border-white/8 rounded-3xl p-8 overflow-hidden hover:border-white/20 transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.04)] cursor-pointer">
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
                            <div className="group relative bg-[#111] border border-white/15 rounded-3xl p-8 overflow-hidden hover:border-white/30 transition-all duration-500 hover:shadow-[0_0_60px_rgba(255,255,255,0.06)] cursor-pointer md:scale-[1.02]">
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
                            <div className="group relative bg-[#0d0d0d] border border-white/8 rounded-3xl p-8 overflow-hidden hover:border-white/20 transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.04)] cursor-pointer">
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
                    3. MY TECH STACK
                ═══════════════════════════════════════════════ */}
                <section ref={stackReveal.ref as React.Ref<HTMLElement>}>
                    <div className={`transition-all duration-1000 ${stackReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                        <SectionLabel>Tech Stack</SectionLabel>
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white mb-4">
                            My Tech Arsenal
                        </h2>
                        <p className="text-gray-500 text-lg mb-12 max-w-xl">The technologies and tools I've been working with.</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {([
                                {
                                    category: 'Development', emoji: '⚡',
                                    color: 'from-blue-500/10 to-cyan-500/10',
                                    border: 'border-blue-500/20',
                                    pill: 'bg-blue-500/10 border-blue-500/20 text-blue-300',
                                    items: ['React', 'Next.js', 'TypeScript', 'Node.js']
                                },
                                {
                                    category: 'AI & ML', emoji: '🧠',
                                    color: 'from-purple-500/10 to-pink-500/10',
                                    border: 'border-purple-500/20',
                                    pill: 'bg-purple-500/10 border-purple-500/20 text-purple-300',
                                    items: ['Python', 'TensorFlow', 'Scikit-learn', 'Pandas']
                                },
                                {
                                    category: 'Database', emoji: '🗄️',
                                    color: 'from-amber-500/10 to-orange-500/10',
                                    border: 'border-amber-500/20',
                                    pill: 'bg-amber-500/10 border-amber-500/20 text-amber-300',
                                    items: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis']
                                },
                                {
                                    category: 'Design', emoji: '🎨',
                                    color: 'from-rose-500/10 to-red-500/10',
                                    border: 'border-rose-500/20',
                                    pill: 'bg-rose-500/10 border-rose-500/20 text-rose-300',
                                    items: ['Figma', 'Photoshop', 'Canva', 'Framer']
                                },
                            ] as const).map(({ category, emoji, color, border, pill, items }) => (
                                <div
                                    key={category}
                                    className={`relative bg-gradient-to-br ${color} border ${border} rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-300`}
                                >
                                    <div className="text-2xl mb-3">{emoji}</div>
                                    <h3 className="text-sm font-mono uppercase tracking-widest text-gray-400 mb-4">{category}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {items.map(item => (
                                            <span
                                                key={item}
                                                className={`text-xs font-medium px-3 py-1.5 rounded-full border ${pill} backdrop-blur-sm`}
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════
                    4. LEARNING NOTES — Digital Notebook
                ═══════════════════════════════════════════════ */}
                <section ref={notesReveal.ref as React.Ref<HTMLElement>}>
                    <div className={`transition-all duration-1000 ${notesReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                        <SectionLabel>Learning Notes</SectionLabel>
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white mb-4">
                            Digital Notebook
                        </h2>
                        <p className="text-gray-500 text-lg mb-12 max-w-xl">Personal notes, concepts, and learnings compiled while building projects.</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {[
                                {
                                    icon: '⚛️', title: 'React Notes',
                                    desc: 'My personal notes and concepts learned while building projects.',
                                    tag: 'Frontend'
                                },
                                {
                                    icon: '🤖', title: 'Machine Learning Notes',
                                    desc: 'Algorithms, datasets, experiments, and observations.',
                                    tag: 'AI/ML'
                                },
                                {
                                    icon: '🗃️', title: 'Database Notes',
                                    desc: 'SQL queries, optimization techniques, and schema designs.',
                                    tag: 'Database'
                                },
                                {
                                    icon: '🌿', title: 'Git & GitHub Notes',
                                    desc: 'Version control best practices and collaboration workflows.',
                                    tag: 'DevOps'
                                },
                            ].map(({ icon, title, desc, tag }) => (
                                <div
                                    key={title}
                                    className="group relative bg-[#0f0f0f] border border-white/6 rounded-2xl p-6 hover:border-white/15 transition-all duration-300 cursor-pointer overflow-hidden"
                                >
                                    {/* Paper lines decoration */}
                                    <div className="absolute inset-0 pointer-events-none opacity-[0.015]">
                                        {[...Array(8)].map((_, i) => (
                                            <div key={i} className="border-b border-white" style={{ height: '36px' }} />
                                        ))}
                                    </div>
                                    {/* Left accent bar (notebook binding) — white */}
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-white/20 via-white/10 to-transparent rounded-l-2xl" />

                                    <div className="relative z-10">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="text-3xl">{icon}</div>
                                            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 border border-white/10 px-2 py-0.5 rounded-full">
                                                {tag}
                                            </span>
                                        </div>
                                        <h3 className="text-sm font-bold text-white mb-2">{title}</h3>
                                        <p className="text-xs text-gray-500 leading-relaxed mb-5">{desc}</p>
                                        <button className="flex items-center gap-1.5 text-xs font-semibold text-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:text-white hover:gap-2.5">
                                            Read Notes <span>→</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════
                    5. RECOMMENDED RESOURCES
                ═══════════════════════════════════════════════ */}
                <section ref={recommendedReveal.ref as React.Ref<HTMLElement>}>
                    <div className={`transition-all duration-1000 ${recommendedReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                        <SectionLabel>Curated Picks</SectionLabel>
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white mb-12">
                            Recommended Resources
                        </h2>

                        <div className="space-y-6">
                            {/* Books */}
                            <div className="bg-[#060606] border border-white/6 rounded-2xl p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="text-2xl">📖</span>
                                    <h3 className="text-lg font-bold text-white">Books</h3>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {['Atomic Habits', 'Deep Work', 'Clean Code'].map(book => (
                                        <div
                                            key={book}
                                            className="group flex items-center gap-3 bg-white/4 border border-white/8 rounded-xl px-4 py-3 hover:border-white/20 hover:bg-white/6 transition-all duration-300 cursor-pointer"
                                        >
                                            <span className="text-sm">📚</span>
                                            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{book}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Courses */}
                            <div className="bg-[#060606] border border-white/6 rounded-2xl p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="text-2xl">🎓</span>
                                    <h3 className="text-lg font-bold text-white">Courses</h3>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {['Harvard CS50', 'FreeCodeCamp', 'Full Stack Open'].map(course => (
                                        <div
                                            key={course}
                                            className="group flex items-center gap-3 bg-white/4 border border-white/8 rounded-xl px-4 py-3 hover:border-white/20 hover:bg-white/6 transition-all duration-300 cursor-pointer"
                                        >
                                            <span className="text-sm">🎯</span>
                                            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{course}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* YouTube Channels */}
                            <div className="bg-[#060606] border border-white/6 rounded-2xl p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="text-2xl">▶️</span>
                                    <h3 className="text-lg font-bold text-white">YouTube Channels</h3>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {['Hitesh Choudhary', 'CodeWithHarry', 'Fireship'].map(channel => (
                                        <div
                                            key={channel}
                                            className="group flex items-center gap-3 bg-white/4 border border-white/8 rounded-xl px-4 py-3 hover:border-white/20 hover:bg-white/6 transition-all duration-300 cursor-pointer"
                                        >
                                            <span className="text-sm">📺</span>
                                            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{channel}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════
                    6. DOWNLOADS SECTION
                ═══════════════════════════════════════════════ */}
                <section ref={downloadsReveal.ref as React.Ref<HTMLElement>}>
                    <div className={`transition-all duration-1000 ${downloadsReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                        <SectionLabel>Downloads</SectionLabel>
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white mb-4">
                            Free Downloads
                        </h2>
                        <p className="text-gray-500 text-lg mb-12 max-w-xl">Grab my resume, portfolio case study, and more — absolutely free.</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {[
                                { icon: '📄', title: 'Resume', desc: 'Download latest resume', ext: 'PDF', color: 'from-white/4' },
                                { icon: '🎨', title: 'Portfolio Case Study', desc: 'How this portfolio was designed', ext: 'PDF', color: 'from-white/3' },
                                { icon: '📋', title: 'Project Documentation', desc: 'Technical documentation of major projects', ext: 'PDF', color: 'from-white/4' },
                                { icon: '📖', title: 'Autobiography', desc: 'The story behind my journey', ext: 'PDF', color: 'from-white/3' },
                            ].map(({ icon, title, desc, ext, color }) => (
                                <div
                                    key={title}
                                    className={`group relative bg-gradient-to-b ${color} to-[#000000] border border-white/8 rounded-2xl p-6 hover:border-white/20 hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden`}
                                >
                                    <div className="text-3xl mb-4">{icon}</div>
                                    <h3 className="text-sm font-bold text-white mb-1">{title}</h3>
                                    <p className="text-xs text-gray-500 leading-relaxed mb-5">{desc}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest border border-white/8 rounded px-1.5 py-0.5">{ext}</span>
                                        <div className="w-8 h-8 rounded-full bg-white/6 border border-white/10 flex items-center justify-center group-hover:bg-white/12 group-hover:border-white/25 transition-all duration-300">
                                            <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════
                    7. DEVELOPER SETUP — My Workspace
                ═══════════════════════════════════════════════ */}
                <section ref={setupReveal.ref as React.Ref<HTMLElement>}>
                    <div className={`transition-all duration-1000 ${setupReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                        <SectionLabel>Developer Setup</SectionLabel>
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white mb-4">
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
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
                                {[
                                    { label: 'Laptop', value: 'HP Laptop', icon: '💻' },
                                    { label: 'Editor', value: 'VS Code', icon: '📝' },
                                    { label: 'AI Assistants', value: 'ChatGPT, Claude', icon: '🤖' },
                                    { label: 'Version Control', value: 'GitHub', icon: '🌿' },
                                    { label: 'Database', value: 'MySQL', icon: '🗄️' },
                                    { label: 'Design Tool', value: 'Figma', icon: '🎨' },
                                    { label: 'OS', value: 'Windows 11', icon: '🖥️' },
                                    { label: 'Browser', value: 'Google Chrome', icon: '🌐' },
                                    { label: 'Terminal', value: 'PowerShell', icon: '⚡' },
                                ].map(({ label, value, icon }, idx) => (
                                    <div
                                        key={label}
                                        className={`flex items-center gap-4 p-6 border-white/4 hover:bg-white/[0.02] transition-colors duration-200 ${idx % 3 !== 2 ? 'md:border-r' : ''} ${idx < 6 ? 'border-b' : ''}`}
                                    >
                                        <span className="text-2xl shrink-0">{icon}</span>
                                        <div>
                                            <div className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-0.5">{label}</div>
                                            <div className="text-sm font-semibold text-gray-200">{value}</div>
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
                        className={`relative overflow-hidden bg-[#080808] border border-white/10 rounded-3xl px-8 md:px-16 py-16 md:py-24 text-center transition-all duration-1000 ${ctaReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                    >
                        {/* Subtle radial glow */}
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{ background: 'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 70%)' }}
                        />

                        <div className="relative z-10 max-w-2xl mx-auto">
                            <div className="inline-flex items-center gap-2 bg-white/6 border border-white/12 text-white/60 text-xs font-mono uppercase tracking-widest px-4 py-2 rounded-full mb-8">
                                <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
                                Available for opportunities
                            </div>

                            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white mb-6 leading-[0.9]">
                                Let's Build
                                <br />
                                Something Amazing
                            </h2>

                            <p className="text-gray-400 text-lg leading-relaxed mb-10">
                                Whether you have a project, collaboration opportunity, or simply want to connect, I'd love to hear from you.
                            </p>

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
    );
};
