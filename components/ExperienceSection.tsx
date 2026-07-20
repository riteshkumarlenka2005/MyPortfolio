import React, { useEffect, useRef, useState } from 'react';
import { AnimatedHeading } from './AnimatedHeading';
import { CheckCircle2, ShieldCheck, Award } from 'lucide-react';

// Data structure
const EXPERIENCES = [
    {
        id: 1,
        role: 'Python with MySQL',
        company: 'GIET University Internship',
        period: 'Previous',
        tag: 'Internship',
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
    },
    {
        id: 2,
        role: 'Data Science Course',
        company: 'Online Certification',
        period: 'Completed',
        tag: 'Course',
        mainFeature: 'Data Analytics & ML',
        features: [
            'Learned core principles of data analysis, cleaning, and preprocessing using Python',
            'Built and evaluated machine learning models with Scikit-learn',
            'Created interactive data visualizations with Matplotlib and Seaborn',
            'Explored advanced statistical methods and hypothesis testing',
            'Applied concepts to real-world datasets for actionable insights',
        ],
        stats: [
            { label: 'Lang', value: 'Python' },
            { label: 'Lib', value: 'Pandas' },
            { label: 'Focus', value: 'ML' },
        ],
        certificateTitle: 'Data Science Certificate',
        certificateImage: '/certificates/DataScienceCourse.jpg',
    },
    {
        id: 3,
        role: 'AI Sales CRM Dashboard',
        company: 'IDS Company Internship',
        period: 'Recent',
        tag: 'Internship',
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
    }
];

export const ExperienceSection: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const [openCert, setOpenCert] = useState<number | null>(null);

    const toggleCert = (id: number) => {
        setOpenCert(prev => prev === id ? null : id);
    };

    useEffect(() => {
        const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
        // Set initial hidden state - cards start far to the left
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateX(-300px)';
            card.style.transition = 'none';
        });

        let ticking = false;

        const updatePositions = () => {
            const windowHeight = window.innerHeight;

            cards.forEach((card, i) => {
                const rect = card.getBoundingClientRect();
                const triggerPoint = windowHeight - 50;
                const revealDistance = windowHeight * 0.6;

                // Stagger: each card triggers a little later
                const staggerOffset = i * 60; 
                const rawProgress = (triggerPoint - staggerOffset - rect.top) / revealDistance;
                const progress = Math.max(0, Math.min(1, rawProgress));

                const opacity = progress;
                const translateX = -300 * (1 - progress); // slides from left (-300px) to 0

                card.style.opacity = opacity.toFixed(3);
                card.style.transform = `translateX(${translateX.toFixed(2)}px)`;
            });

            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(updatePositions);
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        updatePositions(); // Run once on mount

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <section ref={sectionRef} id="experience-section" className="w-full bg-[#000000] text-white py-32 overflow-hidden relative">
            {/* Top Center Heading */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pb-20 text-center relative z-20">
                <AnimatedHeading text="EXPERIENCE" />
            </div>

            {/* Grid Layout */}
            <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 md:px-12 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {EXPERIENCES.map((exp, i) => {
                    return (
                        <div 
                            key={exp.id}
                            ref={el => { cardsRef.current[i] = el; }}
                            className="w-full h-full"
                        >
                            <div 
                                onMouseEnter={() => {
                                    if (openCert && openCert !== exp.id) setOpenCert(null);
                                }}
                                className="relative flex flex-col h-[750px] lg:h-[700px] overflow-hidden shadow-2xl transition-transform hover:-translate-y-2 duration-500 bg-[#080808] border border-white/10"
                            >
                                {/* Card Content Layer - Exact Original Content & Theme */}
                                <div className="flex flex-col h-full px-6 lg:px-8 py-10 gap-6 z-10 relative">
                                <div className="flex justify-between items-start flex-shrink-0">
                                    <div className="px-5 py-2.5 bg-white/5 rounded-xl border border-white/10 text-xs font-bold text-white/80 tracking-widest uppercase">{exp.tag}</div>
                                    <span className="text-[11px] font-bold px-3 py-1.5 bg-white/10 rounded-full text-white/50 uppercase tracking-widest">
                                        {i + 1}
                                    </span>
                                </div>
                                <div className="flex-shrink-0">
                                    <h3 className="text-2xl lg:text-3xl font-bold text-white/95 leading-tight mb-1">{exp.role}</h3>
                                    <h4 className="text-sm font-semibold text-white/40 tracking-wider uppercase">{exp.company}</h4>
                                </div>
                                <div className="flex-1 min-h-0 bg-[#f0f0f0] border border-[#e0e0e0] rounded-2xl p-5 flex flex-col">
                                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-black/10 flex-shrink-0">
                                        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                                        <span className="text-sm font-bold text-black/80">{exp.mainFeature}</span>
                                    </div>
                                    <div className="flex flex-col gap-4 overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                        {exp.features.map((f, idx) => (
                                            <div key={idx} className="flex items-start gap-3">
                                                <CheckCircle2 className="w-4 h-4 text-black/30 shrink-0 mt-0.5" />
                                                <span className="text-sm text-black/70 leading-snug">{f}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center flex-shrink-0 mt-auto">
                                    <div className="flex gap-1.5 lg:gap-2">
                                        {exp.stats.map((s, idx) => (
                                            <div key={idx} className="flex flex-col items-center px-2 lg:px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl min-w-[60px] lg:min-w-[68px]">
                                                <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-1">{s.label}</span>
                                                <span className="text-xs font-bold text-white/90 whitespace-nowrap text-center">{s.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => toggleCert(exp.id)}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-full text-sm font-bold hover:bg-gray-200 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                                    >
                                        <Award className="w-4 h-4" /> Verify
                                    </button>
                                </div>
                            </div>

                            {/* Certificate Curtain Overlay Layer */}
                            <div 
                                className={`absolute inset-0 bg-[#0a0a0a] z-30 flex items-center justify-center transition-all duration-700 ease-in-out ${openCert === exp.id ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}
                            >
                                <div className="w-full h-full p-6 flex items-center justify-center relative">
                                    <img 
                                        src={exp.certificateImage} 
                                        alt={exp.certificateTitle}
                                        className="w-full h-full object-contain drop-shadow-2xl"
                                    />
                                </div>
                            </div>
                        </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
