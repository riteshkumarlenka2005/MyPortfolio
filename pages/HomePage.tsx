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
import { CertificationsCarousel } from '../components/CertificationsCarousel';
import { StatsSection } from '../components/StatsSection';
import { ScrollRevealText } from '../components/ScrollRevealText';
import { SkillsSection } from '../components/SkillsSection';
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

// Skills/expertise data
const EXPERTISE_AREAS = [
    { icon: '◈', title: 'AI & Machine Learning', description: 'Exploring neural networks and predictive modeling through experimental projects' },
    { icon: '◇', title: 'Full-Stack Development', description: 'Building responsive web applications with modern frameworks and robust logic' },
    { icon: '○', title: 'Data Science', description: 'Parsing complex datasets to uncover hidden patterns and meaningful insights' },
    { icon: '△', title: 'Research & Engineering', description: 'Approaching problems with scientific rigor and a builder\'s mindset' },
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
    const expertiseRef = useRef<HTMLElement>(null);
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
                    }
                });
            },
            { threshold: 0.1, rootMargin: '-50px' }
        );

        const sections = [aboutRef, projectsRef, expertiseRef, statsRef, testimonialsRef, ctaRef];
        sections.forEach((ref) => {
            if (ref.current) observer.observe(ref.current);
        });

        // Also observe sections by ID for new animated sections
        const sectionIds = ['cover-cards-section', 'motivation-section', 'insights-section', 'philosophy-section'];
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
        <div className="min-h-screen bg-parchment-100 dark:bg-antique-50 text-parchment-900 dark:text-antique-800 transition-colors duration-500 overflow-x-hidden" style={{backgroundColor: '#000000', color: '#e0e0e0'}}>
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
                className="relative py-32 px-6 md:px-12 overflow-hidden"
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
                    <h2 
                        className={`
                            text-6xl md:text-8xl font-black tracking-widest uppercase mb-16 text-center text-white/90 drop-shadow-2xl
                            transform transition-all duration-1000 ease-out
                            ${sectionsVisible['about-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
                        `}
                    >
                        ABOUT ME
                    </h2>

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


                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* STATE A: Scroll-Locked Stacked Project Slides */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <div data-scroll-section>
                <ProjectStackSection onStateChange={(active) => console.log('State A active:', active)} />
            </div>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* MY SKILLS SECTION */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <div data-scroll-section>
                <SkillsSection />
            </div>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* CERTIFICATIONS CAROUSEL */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <div data-scroll-section>
                <CertificationsCarousel />
            </div>



            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* EXPERTISE SECTION */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <section
                ref={expertiseRef}
                id="expertise-section"
                data-scroll-section
                className="relative py-32 px-6 md:px-12"
            >
                <div className="max-w-6xl mx-auto">
                    {/* Section Header */}
                    <div
                        className={`
                            text-center mb-20 space-y-6
                            transition-all duration-1000 ease-out
                            ${sectionsVisible['expertise-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
                        `}
                    >
                        <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-wide">
                            Areas of Expertise
                        </h2>
                        <p className="font-serif text-lg max-w-2xl mx-auto">
                            The disciplines where my curiosity and capability intersect.
                        </p>
                    </div>

                    {/* Expertise Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {EXPERTISE_AREAS.map((area, index) => (
                            <div
                                key={area.title}
                                className={`
                                    group p-8 text-center border border-transparent hover:border-parchment-400/30 dark:hover:border-antique-200/20
                                    transition-all duration-700 ease-out hover:bg-parchment-200/30 dark:hover:bg-antique-100/30
                                    ${sectionsVisible['expertise-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
                                `}
                                style={{
                                    transitionDelay: sectionsVisible['expertise-section'] ? `${index * 100}ms` : '0ms',
                                }}
                            >
                                {/* Icon */}
                                <div className="text-5xl mb-6 group-hover: group-hover:text-green-500 dark:group-hover:text-green-400 transition-all duration-500 transform group-hover:scale-110">
                                    {area.icon}
                                </div>

                                {/* Title */}
                                <h3 className="font-display text-xl font-semibold mb-4">
                                    {area.title}
                                </h3>

                                {/* Description */}
                                <p className="font-serif text-sm leading-relaxed">
                                    {area.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

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
            {/* MOTIVATION CARDS - Inspirational Wisdom */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <section
                id="motivation-section"
                data-scroll-section
                className="relative py-32 px-6 md:px-12 bg-parchment-900 dark:bg-antique-800 text-parchment-100 dark:text-antique-100 overflow-hidden"
            >
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 left-0 w-full h-full" style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
                        backgroundSize: '40px 40px',
                    }} />
                </div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <div
                        className={`
                            text-center mb-20
                            transition-all duration-1000 ease-out
                            ${sectionsVisible['motivation-section'] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-90'}
                        `}
                    >
                        <span className="text-green-400 dark:text-green-500 font-serif italic text-sm tracking-widest uppercase mb-4 block">Words of Wisdom</span>
                        <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-wide mb-4">
                            Guiding Inspiration
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {MOTIVATION_QUOTES.map((item, index) => (
                            <div
                                key={index}
                                className={`
                                    group relative p-8 md:p-12 border border-parchment-100/10 dark:border-antique-100/10 
                                    hover:border-green-500/30 transition-all duration-700 ease-out 
                                    hover:bg-parchment-100/5 dark:hover:bg-antique-100/5
                                    ${sectionsVisible['motivation-section']
                                        ? 'opacity-100 translate-x-0'
                                        : `opacity-0 ${index % 2 === 0 ? '-translate-x-16' : 'translate-x-16'}`
                                    }
                                `}
                                style={{
                                    transitionDelay: sectionsVisible['motivation-section'] ? `${index * 150}ms` : '0ms',
                                }}
                            >
                                {/* Quote mark */}
                                <div className="absolute top-4 right-4 font-display text-8xl text-green-500/10 group-hover:text-green-500/20 transition-colors duration-500">"</div>

                                {/* Category tag */}
                                <span className="inline-block px-3 py-1 text-xs uppercase tracking-widest bg-green-500/20 text-green-400 mb-6">
                                    {item.category}
                                </span>

                                {/* Quote */}
                                <blockquote className="font-serif text-2xl md:text-3xl italic leading-relaxed mb-6">
                                    "{item.quote}"
                                </blockquote>

                                {/* Author */}
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-[1px] bg-green-500/50" />
                                    <span className="font-display text-sm tracking-wider">{item.author}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* INTERVIEW Q&A - Accordion */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <section
                id="insights-section"
                data-scroll-section
                className="relative py-32 px-6 md:px-12"
            >
                <div className="max-w-4xl mx-auto">
                    <div
                        className={`
                            text-center mb-16 space-y-4
                            transform transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]
                            ${sectionsVisible['insights-section'] ? 'opacity-100 translate-y-0 scale-100 rotate-0 blur-none' : 'opacity-0 translate-y-32 scale-90 -rotate-2 blur-md'}
                        `}
                    >
                        <div className="flex items-center justify-center gap-4 opacity-50">
                            <div className="h-[1px] w-8 bg-current" />
                            <span className="font-serif italic text-sm tracking-widest uppercase">Frequently Asked</span>
                            <div className="h-[1px] w-8 bg-current" />
                        </div>
                        <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-wide">
                            Interview
                            <span className="block text-green-500 dark:text-green-400">Questions & Answers</span>
                        </h2>
                        <p className="font-serif text-lg max-w-2xl mx-auto">
                            Questions I've been asked in interviews — click any question to see my answer.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: "Tell me about yourself.",
                                a: "I'm Ritesh Kumar Lenka, a B.Tech Computer Science student at GIET University, currently in my 4th semester with 8.98 CGPA. I specialize in AI/ML, computer vision, and full-stack web development. I've built and deployed 5+ production applications including VivaSense — a multimodal AI interview platform, and CyberGuardian AI — an adversarial cybersecurity trainer."
                            },
                            {
                                q: "What is the difference between Machine Learning and Deep Learning?",
                                a: "Machine Learning uses algorithms to learn patterns from data with manual feature extraction — like decision trees and linear regression. Deep Learning is a subset of ML that uses neural networks with multiple layers to automatically learn hierarchical features from raw data. Deep Learning excels with large datasets and complex tasks like image recognition and NLP, while traditional ML works well with smaller, structured datasets."
                            },
                            {
                                q: "Explain REST API and how you've used it.",
                                a: "REST API is an architectural style for building web services using HTTP methods (GET, POST, PUT, DELETE). I've built REST APIs in my Room Finder Platform using Node.js and Express to handle CRUD operations for listings, user authentication, and location-based search queries. I've also consumed REST APIs in my CareerSoulmate project for fetching career data."
                            },
                            {
                                q: "What is the difference between SQL and NoSQL databases?",
                                a: "SQL databases are relational, use structured schemas and tables with predefined relationships — like MySQL and PostgreSQL. NoSQL databases are non-relational, flexible in schema, and store data as documents, key-value pairs, or graphs — like MongoDB and Firebase. I've used MySQL for structured data in my internship, Supabase (PostgreSQL) for Room Finder, and Firebase for real-time data."
                            },
                            {
                                q: "What project are you most proud of and why?",
                                a: "VivaSense — my Holistic Interview Intelligence platform. It analyzes video, audio, and text simultaneously to evaluate interview performance. I integrated facial expression recognition across 7 emotional states with speech clarity scoring. It was technically challenging because it required combining computer vision, NLP, and audio processing into one cohesive system, and it directly helps students prepare for placements."
                            },
                            {
                                q: "How do you approach debugging a complex issue?",
                                a: "I follow a systematic approach: first, I reproduce the issue consistently. Then I isolate the problem by checking logs, using breakpoints, and narrowing down the component. I verify my assumptions by testing smaller parts independently. I use browser DevTools for frontend issues and console logging with structured data for backend. I also check git history to see if recent changes introduced the bug."
                            },
                        ].map((item, index) => {
                            const isOpen = openFaqIndex === index;
                            return (
                                <div
                                    key={index}
                                    className={`
                                        group border border-parchment-400/20 dark:border-antique-200/10
                                        hover:border-green-500/30 dark:hover:border-green-400/20
                                        transition-all duration-500 ease-out flex flex-col items-center justify-center
                                        ${sectionsVisible['insights-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
                                    `}
                                    style={{ transitionDelay: sectionsVisible['insights-section'] ? `${300 + index * 100}ms` : '0ms' }}
                                >
                                    <button
                                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                                        className="w-full flex items-center justify-between cursor-pointer px-6 py-5 font-display text-base md:text-lg font-semibold tracking-wide text-parchment-900 dark:text-antique-900 hover:bg-parchment-200/30 dark:hover:bg-antique-100/20 transition-colors duration-300"
                                    >
                                        <span className="flex items-center gap-3 text-left">
                                            <span className="text-green-500/40 dark:text-green-400/40 text-xl font-light">Q{index + 1}.</span>
                                            {item.q}
                                        </span>
                                        <span className={`ml-4 flex-shrink-0 w-6 h-6 flex items-center justify-center text-green-500 dark:text-green-400 text-lg transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
                                            +
                                        </span>
                                    </button>
                                    <div
                                        className={`w-full grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                                    >
                                        <div className="overflow-hidden">
                                            <div className="px-6 pb-6 pt-2 border-t border-parchment-400/10 dark:border-antique-200/5">
                                                <p className="font-serif text-base leading-relaxed text-parchment-800 dark:text-antique-800/90 pl-9 text-left">
                                                    {item.a}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

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

                    <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-wide">
                        Let's Create Something
                        <span className="block text-green-500 dark:text-green-400 mt-2">Extraordinary</span>
                    </h2>

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
