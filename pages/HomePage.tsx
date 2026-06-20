import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);


import { ThreeBackground } from '../components/ThreeBackground';
import { ProjectStackSection } from '../components/ProjectStackSection';

import { BionicHero } from '../components/BionicHero';
import { SplitReveal } from '../components/SplitReveal';
import { AnimatedHeading } from '../components/AnimatedHeading';
import { StatsSection } from '../components/StatsSection';
import { ScrollRevealText } from '../components/ScrollRevealText';
import { SkillsSection } from '../components/SkillsSection';
import { AchievementsSection } from '../components/AchievementsSection';
import { InteractiveFooter } from '../components/InteractiveFooter';

// Featured projects data
const FEATURED_PROJECTS = [
    {
        id: 1,
        title: 'Digital Restoration Engine',
        category: 'Software Architecture',
        description: 'A comprehensive system for preserving and restoring degraded digital artifacts using advanced algorithmic techniques.',
        year: '2024',
        tags: ['TypeScript', 'Rust', 'ML'],
    },
    {
        id: 2,
        title: 'The Codex Project',
        category: 'Research Initiative',
        description: 'Documenting ancient programming paradigms and their influence on modern software development practices.',
        year: '2023',
        tags: ['Research', 'History', 'Documentation'],
    },
    {
        id: 3,
        title: 'Archival Interface System',
        category: 'User Experience',
        description: 'Designing intuitive interfaces for navigating vast collections of historical data and manuscripts.',
        year: '2024',
        tags: ['UX Design', 'React', 'Accessibility'],
    },
];



// Testimonials data - Removed as per student profile
const TESTIMONIALS: any[] = [];

// Stats data
const STATS = [
    { value: '10+', label: 'Personal Projects' },
    { value: '5+', label: 'AI Experiments' },
    { value: '7+', label: 'Hackathons' },
    { value: 'Top', label: 'University Topper (1st Year)' },
];

// MOTIVATION QUOTES - Inspirational wisdom
const MOTIVATION_QUOTES = [
    {
        quote: "The only way to do great work is to love what you do.",
        author: "Steve Jobs",
        category: "Passion",
    },
    {
        quote: "Simplicity is the ultimate sophistication.",
        author: "Leonardo da Vinci",
        category: "Design",
    },
    {
        quote: "The details are not the details. They make the design.",
        author: "Charles Eames",
        category: "Craftsmanship",
    },
    {
        quote: "Code is poetry.",
        author: "WordPress",
        category: "Expression",
    },
];

// VISUAL INSIGHTS - Adjusted for learning metrics
const VISUAL_INSIGHTS = [
    { label: 'Algorithms Practiced', value: 92, unit: '%', description: 'Progress in competitive programming' },
    { label: 'Projects Built', value: 85, unit: '%', description: 'Completion rate of technical builds' },
    { label: 'Technologies Explored', value: 78, unit: '%', description: 'Breadth of stack exploration' },
    { label: 'Hackathon Participation', value: 80, unit: '%', description: 'Engagement in competitive events' },
];

// TECHNOLOGY STACK
const TECH_STACK = [
    { name: 'React', level: 95 },
    { name: 'TypeScript', level: 92 },
    { name: 'Node.js', level: 88 },
    { name: 'Python', level: 85 },
    { name: 'Rust', level: 75 },
    { name: 'Three.js', level: 80 },
];

export const HomePage: React.FC = () => {
    const [heroVisible, setHeroVisible] = useState(false);
    const [sectionsVisible, setSectionsVisible] = useState<{ [key: string]: boolean }>({});
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [scrollY, setScrollY] = useState(0);
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    const heroRef = useRef<HTMLDivElement>(null);
    const aboutRef = useRef<HTMLElement>(null);
    const projectsRef = useRef<HTMLElement>(null);
    const statsRef = useRef<HTMLElement>(null);
    const testimonialsRef = useRef<HTMLElement>(null);
    const ctaRef = useRef<HTMLElement>(null);

    // Hero fade in - faster on return visits
    useEffect(() => {
        const isReturning = sessionStorage.getItem('hasVisited');
        const delay = isReturning ? 400 : 2200;
        sessionStorage.setItem('hasVisited', 'true');
        const timer = setTimeout(() => setHeroVisible(true), delay);
        return () => clearTimeout(timer);
    }, []);

    // Scroll tracking for parallax effects
    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Mouse tracking for interactive effects
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Set up Lenis for ultra-smooth native scrolling
    // DELAYED until PremiumLoader finishes so Lenis doesn't fight the loader's scroll lock
    useEffect(() => {
        let lenis: Lenis | null = null;
        let rafId: number | null = null;

        const initLenis = () => {
            lenis = new Lenis({
                lerp: 0.05,
                smoothWheel: true,
                wheelMultiplier: 0.8,
                touchMultiplier: 1.5,
            });

            lenis.on('scroll', ScrollTrigger.update);

            const update = (time: number) => {
                lenis!.raf(time * 1000);
            };

            gsap.ticker.add(update);
            gsap.ticker.lagSmoothing(0);

            // Store for cleanup
            rafId = update as unknown as number;
        };

        // Wait for the PremiumLoader to be removed from DOM
        const loaderEl = document.querySelector('.z-\\[10000\\]');
        if (!loaderEl) {
            // Loader already gone, start immediately
            initLenis();
        } else {
            // Watch for loader removal
            const observer = new MutationObserver(() => {
                const stillThere = document.querySelector('.z-\\[10000\\]');
                if (!stillThere) {
                    observer.disconnect();
                    initLenis();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });

            return () => {
                observer.disconnect();
                if (lenis) {
                    lenis.destroy();
                    if (rafId !== null) gsap.ticker.remove(rafId as any);
                }
            };
        }

        return () => {
            if (lenis) {
                lenis.destroy();
                if (rafId !== null) gsap.ticker.remove(rafId as any);
            }
        };
    }, []);

    // Intersection Observer for scroll animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setSectionsVisible((prev) => ({
                            ...prev,
                            [entry.target.id]: true,
                        }));
                    } else if (entry.target.id === 'projects-section') {
                        // Allow project section to slide back out when scrolled away
                        setSectionsVisible((prev) => ({
                            ...prev,
                            'projects-section': false,
                        }));
                    }
                });
            },
            { threshold: 0.1, rootMargin: '-50px' }
        );

        const sections = [aboutRef, projectsRef, statsRef, testimonialsRef, ctaRef];
        sections.forEach((ref) => {
            if (ref.current) observer.observe(ref.current);
        });

        // Also observe sections by ID for new animated sections
        const sectionIds = ['achievements-section', 'cover-cards-section', 'philosophy-section'];
        sectionIds.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    // Auto-rotate testimonials
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    // Calculate parallax offset
    const getParallaxOffset = (factor: number) => scrollY * factor;

    // GSAP scroll animations: hero sinks down, sections rise up
    // Delayed to run AFTER SplitReveal's ScrollTrigger pin is established
    useEffect(() => {
        let ctx: gsap.Context;
        const timer = setTimeout(() => {
            // Refresh so GSAP knows about the SplitReveal pin spacer
            ScrollTrigger.refresh();

            ctx = gsap.context(() => {
                // Hero parallax sink — pushes downward + fades + scales down as you scroll past
                const heroEl = document.querySelector('[data-scroll-hero]');
                if (heroEl) {
                    gsap.to(heroEl, {
                        y: 300,
                        scale: 0.92,
                        opacity: 0.3,
                        ease: 'none',
                        force3D: true, // Hardware acceleration
                        autoRound: false, // Prevent pixel-snapping jitter
                        willChange: 'transform', // Hint to browser
                        scrollTrigger: {
                            trigger: heroEl,
                            // Offset start and end by exactly the SplitReveal pin duration (1.5x viewport height)
                            start: () => `top+=${window.innerHeight * 1.5} top`,
                            end: () => `bottom+=${window.innerHeight * 1.5} top`,
                            scrub: 1.5, // Extreme smoothing for parallax weight
                        },
                    });
                }
            });

            // Final refresh to lock in correct positions
            ScrollTrigger.refresh();
        }, 500); // Wait for SplitReveal's useEffect + pin spacer to be created

        return () => {
            clearTimeout(timer);
            if (ctx) ctx.revert();
        };
    }, []);

    return (
        <div className="min-h-screen bg-parchment-100 dark:bg-antique-50 text-parchment-900 dark:text-antique-800 transition-colors duration-500 overflow-x-hidden" style={{ backgroundColor: '#000000', color: '#e0e0e0' }}>
            {/* 3D Background */}
            <ThreeBackground />



            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* SPLIT REVEAL - Covers entire site */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <SplitReveal>



                {/* ═══════════════════════════════════════════════════════════════ */}
                {/* HERO SECTION - Living Identity System */}
                {/* ═══════════════════════════════════════════════════════════════ */}
                <div data-scroll-hero>
                    <BionicHero />
                </div>

                {/* ═══════════════════════════════════════════════════════════════ */}
                {/* ABOUT PREVIEW SECTION */}
                {/* ═══════════════════════════════════════════════════════════════ */}
                <div className="relative z-10 bg-[#000000]">
                    <section
                        ref={aboutRef}
                        id="about-section"
                        data-scroll-section
                        className="relative pt-32 pb-8 px-6 md:px-12 overflow-hidden"
                    >
                        {/* Background decorative elements */}
                        <div
                            className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                            }}
                        />

                        <div className="w-full px-4 mx-auto flex flex-col items-center z-10 relative">
                            {/* Big Centered ABOUT ME Heading */}
                            <div className="mb-12">
                                <AnimatedHeading text="ABOUT ME" />
                            </div>

                            {/* Content Box */}
                            <div
                                className={`
                            w-full max-w-7xl bg-black border border-white/10 rounded-3xl p-8 md:p-16 shadow-[0_0_50px_rgba(0,0,0,0.8)]
                            transform transition-all duration-1000 delay-200 ease-[cubic-bezier(0.25,1,0.5,1)]
                            ${sectionsVisible['about-section'] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-24 scale-95'}
                        `}
                            >
                                <div className="font-sans text-lg md:text-xl leading-relaxed space-y-8 text-center text-gray-300">
                                    <p className="text-2xl md:text-3xl font-bold text-white">
                                        <ScrollRevealText text="I'm Ritesh Kumar Lenka — a Computer Science engineer with a deep-rooted passion for Artificial Intelligence, thoughtful engineering, and purposeful creation. ✦" />
                                    </p>
                                    <p>
                                        <ScrollRevealText text="I don't just write code; I dive into problems with curiosity and don't surface until I truly understand them. Learning, for me, isn't a phase — it's a permanent state of being. I am drawn to the kind of work that demands both precision and imagination — researching ideas at their deepest level, then building them into something real and meaningful. 🧠" />
                                    </p>
                                    <p>
                                        <ScrollRevealText text="Every project I take on is deliberate, every decision calculated. I believe the best engineers are not just technically strong — they are thinkers first, builders second. Whether it's developing intelligent systems, crafting seamless experiences, or solving problems that don't yet have answers — I show up with depth, intention, and an unshakeable drive to create. ⚡" />
                                    </p>
                                </div>

                                {/* Know more link */}
                                <div className="flex justify-end mt-10">
                                    <Link
                                        to="/about"
                                        className="group/link inline-flex items-center gap-2 text-white/60 hover:text-white text-sm md:text-base font-medium tracking-wide transition-all duration-300"
                                    >
                                        Know more about me
                                        <span className="inline-block transition-transform duration-300 group-hover/link:translate-x-1">→</span>
                                    </Link>
                                </div>

                            </div>
                        </div>
                    </section>

                    {/* ═══════════════════════════════════════════════════════════════ */}
                    {/* STATE A: Scroll-Locked Stacked Project Slides */}
                    {/* ═══════════════════════════════════════════════════════════════ */}
                    <div
                        id="projects-section"
                        ref={projectsRef as any}
                        data-scroll-section
                        className="w-full overflow-hidden"
                    >
                        <div className={`transform transition-all duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${sectionsVisible['projects-section'] ? 'translate-x-0 opacity-100' : 'translate-x-[100vw] opacity-0'}`}>
                            <ProjectStackSection onStateChange={(active) => console.log('State A active:', active)} />
                        </div>
                    </div>

                    {/* ═══════════════════════════════════════════════════════════════ */}
                    {/* MY SKILLS SECTION */}
                    {/* ═══════════════════════════════════════════════════════════════ */}
                    <div data-scroll-section>
                        <SkillsSection />
                    </div>

                    {/* ═══════════════════════════════════════════════════════════════ */}
                    {/* ACHIEVEMENTS SECTION */}
                    {/* ═══════════════════════════════════════════════════════════════ */}
                    <div
                        id="achievements-section"
                        data-scroll-section
                        className={`transition-all duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${sectionsVisible['achievements-section'] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-24 scale-95'}`}
                    >
                        <AchievementsSection />
                    </div>




                    {/* ═══════════════════════════════════════════════════════════════ */}
                    {/* STATS SECTION - Animated Counters */}
                    {/* ═══════════════════════════════════════════════════════════════ */}
                    <section
                        ref={statsRef}
                        id="stats-section"
                        data-scroll-section
                        className="relative py-24 px-6 md:px-12 bg-parchment-900 dark:bg-antique-800 text-parchment-100 dark:text-antique-100"
                    >
                        {/* Decorative overlay */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-600/20 to-transparent" />
                        </div>

                        <div className="max-w-6xl mx-auto relative z-10">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16">
                                {STATS.map((stat, index) => (
                                    <div
                                        key={stat.label}
                                        className={`
                                    text-center
                                    transition-all duration-1000 ease-out
                                    ${sectionsVisible['stats-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                                `}
                                        style={{
                                            transitionDelay: sectionsVisible['stats-section'] ? `${index * 150}ms` : '0ms',
                                        }}
                                    >
                                        <div className="font-display text-5xl md:text-6xl font-bold mb-3 text-green-400 dark:text-green-500">
                                            {stat.value}
                                        </div>
                                        <div className="font-serif text-sm uppercase tracking-wider">
                                            {stat.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                    {/* Testimonials section removed for student profile */}





                    {/* ═══════════════════════════════════════════════════════════════ */}
                    {/* FINAL CTA SECTION */}
                    {/* ═══════════════════════════════════════════════════════════════ */}
                    <section
                        ref={ctaRef}
                        id="cta-section"
                        data-scroll-section
                        className="relative py-32 px-6 md:px-12"
                    >
                        <div
                            className={`
                        max-w-3xl mx-auto text-center space-y-8
                        transition-all duration-1000 ease-out
                        ${sectionsVisible['cta-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
                    `}
                        >
                            {/* Decorative element */}
                            <div className="flex items-center justify-center gap-6 opacity-30">
                                <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-current" />
                                <div className="w-3 h-3 rotate-45 border border-current" />
                                <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-current" />
                            </div>

                            <div className="mb-8">
                                <AnimatedHeading text="LET'S CONNECT" />
                            </div>

                            <p className="font-serif text-xl leading-relaxed">
                                Whether you have a project in mind, a question to ask, or simply wish to connect—
                                I welcome the opportunity to explore new collaborations.
                            </p>

                            <div className="pt-8">
                                <Link
                                    to="/contact"
                                    className="inline-flex items-center gap-4 px-12 py-6 bg-green-600 dark:bg-green-500 text-parchment-100 dark:text-antique-100 font-serif font-bold tracking-widest uppercase text-sm hover:bg-green-700 dark:hover:bg-green-600 transition-all duration-500 hover:shadow-xl hover:shadow-green-900/30 transform hover:-translate-y-1"
                                >
                                    Begin a Conversation
                                    <span>→</span>
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* ═══════════════════════════════════════════════════════════════ */}
                    {/* FOOTER */}
                    {/* ═══════════════════════════════════════════════════════════════ */}
                    <InteractiveFooter />
                </div>

                {/* Decorative Footer Line */}
                <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-900/10 to-transparent pointer-events-none z-50" />

            </SplitReveal>
        </div>
    );
};
