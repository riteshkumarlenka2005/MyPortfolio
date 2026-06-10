import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface HalfMoonContent {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    detailPath: string;
}

const LEFT_MOON: HalfMoonContent = {
    id: 'philosophy',
    title: 'Philosophy',
    subtitle: 'Guiding Principles',
    description: 'The foundational beliefs that shape how I approach problems, design systems, and create value through technology.',
    detailPath: '/about#philosophy'
};

const RIGHT_MOON: HalfMoonContent = {
    id: 'vision',
    title: 'Vision',
    subtitle: 'Future Horizons',
    description: 'Where curiosity leads next—the problems worth solving and the impact worth creating in the years ahead.',
    detailPath: '/about#vision'
};

interface HalfMoonRevealProps {
    isStateAActive?: boolean;
}

export const HalfMoonReveal: React.FC<HalfMoonRevealProps> = ({ isStateAActive = false }) => {
    const navigate = useNavigate();
    const sectionRef = useRef<HTMLDivElement>(null);

    const [progress, setProgress] = useState(0);
    const [isInView, setIsInView] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [moonSize, setMoonSize] = useState({ diameter: 0, half: 0 });

    // Detect mobile + compute moon size
    useEffect(() => {
        const compute = () => {
            const vh = window.innerHeight;
            const vw = window.innerWidth;
            const mobile = vw < 768;
            setIsMobile(mobile);
            // Desktop: use viewport height, Mobile: not used (different layout)
            const diameter = mobile ? vw : Math.min(vh, vw);
            setMoonSize({ diameter, half: diameter / 2 });
        };
        compute();
        window.addEventListener('resize', compute);
        return () => window.removeEventListener('resize', compute);
    }, []);

    // Scroll progress
    useEffect(() => {
        if (isStateAActive) return;

        const handleScroll = () => {
            const section = sectionRef.current;
            if (!section) return;

            const rect = section.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const sectionHeight = rect.height;

            const sectionCenter = rect.top + sectionHeight / 2;
            const viewportCenter = viewportHeight / 2;

            const distanceFromCenter = Math.abs(sectionCenter - viewportCenter);
            const maxDistance = viewportHeight / 2 + sectionHeight / 2;

            const rawProgress = 1 - (distanceFromCenter / maxDistance);
            const clampedProgress = Math.max(0, Math.min(1, rawProgress));
            const easedProgress = 1 - Math.pow(1 - clampedProgress, 3);

            setProgress(easedProgress);
            setIsInView(rect.top < viewportHeight && rect.bottom > 0);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [isStateAActive]);

    const handleMoonClick = (content: HalfMoonContent) => {
        if (progress > 0.5) {
            navigate(content.detailPath);
        }
    };

    const contentOpacity = Math.max(0, (progress - 0.2) / 0.8);
    const isClickable = progress > 0.5;

    /* ═════════════════════════════════════════
       MOBILE LAYOUT — Vertical stacked cards
       No overlapping semicircles at all
    ═════════════════════════════════════════ */
    if (isMobile) {
        return (
            <section
                ref={sectionRef}
                className="relative overflow-hidden bg-parchment-100 dark:bg-antique-50 py-16 px-4"
            >
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }} />
                </div>

                {/* Philosophy Card */}
                <div
                    className={`
                        relative mb-6 p-8 rounded-2xl cursor-pointer
                        bg-parchment-200/60 dark:bg-antique-100/60 
                        border border-amber-700/15 dark:border-amber-600/15
                        shadow-lg
                        transition-all duration-700 ease-out
                    `}
                    style={{
                        opacity: contentOpacity,
                        transform: `translateX(${-40 + progress * 40}px)`,
                    }}
                    onClick={() => handleMoonClick(LEFT_MOON)}
                >
                    {/* Decorative arc */}
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 border-amber-700/10 dark:border-amber-600/10" />
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3 opacity-50">
                            <span className="font-serif italic text-[10px] tracking-widest uppercase">{LEFT_MOON.subtitle}</span>
                            <div className="h-[1px] w-6 bg-current" />
                        </div>
                        <h3 className="font-display text-2xl font-semibold tracking-wide text-parchment-900 dark:text-antique-900 mb-3">
                            {LEFT_MOON.title}
                        </h3>
                        <p className="font-serif text-sm leading-relaxed mb-4">
                            {LEFT_MOON.description}
                        </p>
                        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-600 opacity-80">
                            <span className="font-serif text-xs uppercase tracking-widest">Explore</span>
                            <span>→</span>
                        </div>
                    </div>
                </div>

                {/* Center "Converge" */}
                <div
                    className="relative text-center py-8"
                    style={{
                        opacity: contentOpacity,
                        transform: `scale(${0.9 + progress * 0.1})`,
                    }}
                >
                    <div className="w-px h-10 bg-gradient-to-b from-transparent via-amber-700/40 to-amber-700/60 dark:via-amber-600/40 dark:to-amber-600/60 mx-auto mb-4" />
                    <div className="w-3 h-3 border border-amber-700/50 dark:border-amber-600/50 rotate-45 mx-auto mb-4" />
                    <span className="block font-serif italic text-xs tracking-[0.3em] uppercase mb-2">Where Ideas</span>
                    <h3 className="font-display text-2xl font-semibold text-parchment-900 dark:text-antique-900 mb-2">
                        Converge
                    </h3>
                    <span className="block font-serif italic text-xs tracking-[0.3em] uppercase mb-4">& Paths Align</span>
                    <div className="w-2 h-2 bg-amber-700/40 dark:bg-amber-600/40 rotate-45 mx-auto mb-4" />
                    <div className="w-px h-10 bg-gradient-to-t from-transparent via-amber-700/40 to-amber-700/60 dark:via-amber-600/40 dark:to-amber-600/60 mx-auto" />
                </div>

                {/* Vision Card */}
                <div
                    className={`
                        relative mt-6 p-8 rounded-2xl cursor-pointer
                        bg-parchment-200/60 dark:bg-antique-100/60
                        border border-amber-700/15 dark:border-amber-600/15
                        shadow-lg
                        transition-all duration-700 ease-out
                    `}
                    style={{
                        opacity: contentOpacity,
                        transform: `translateX(${40 - progress * 40}px)`,
                    }}
                    onClick={() => handleMoonClick(RIGHT_MOON)}
                >
                    {/* Decorative arc */}
                    <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 border-amber-700/10 dark:border-amber-600/10" />
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3 opacity-50">
                            <div className="h-[1px] w-6 bg-current" />
                            <span className="font-serif italic text-[10px] tracking-widest uppercase">{RIGHT_MOON.subtitle}</span>
                        </div>
                        <h3 className="font-display text-2xl font-semibold tracking-wide text-parchment-900 dark:text-antique-900 mb-3">
                            {RIGHT_MOON.title}
                        </h3>
                        <p className="font-serif text-sm leading-relaxed mb-4">
                            {RIGHT_MOON.description}
                        </p>
                        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-600 opacity-80">
                            <span>→</span>
                            <span className="font-serif text-xs uppercase tracking-widest">Explore</span>
                        </div>
                    </div>
                </div>

                {/* Decorative corners */}
                <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-amber-700/10 dark:border-amber-600/10" />
                <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-amber-700/10 dark:border-amber-600/10" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-amber-700/10 dark:border-amber-600/10" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-amber-700/10 dark:border-amber-600/10" />
            </section>
        );
    }

    /* ═════════════════════════════════════════
       DESKTOP LAYOUT — Semicircle reveal (unchanged)
    ═════════════════════════════════════════ */

    const leftTransform = -90 + (progress * 90);
    const rightTransform = 90 - (progress * 90);
    const { diameter, half } = moonSize;

    return (
        <section
            ref={sectionRef}
            className="relative h-[150vh] overflow-hidden bg-parchment-100 dark:bg-antique-50"
        >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }} />
            </div>

            {/* Center line indicator */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-amber-700/20 to-transparent dark:via-amber-600/20" />

            {/* CENTER CONTENT */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center pointer-events-none"
                style={{
                    opacity: progress > 0.3 ? Math.min(1, (progress - 0.3) * 2) : 0,
                    transform: `translate(-50%, -50%) scale(${0.9 + progress * 0.1})`,
                    transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)'
                }}
            >
                <div className="w-px h-16 bg-gradient-to-b from-transparent via-amber-700/40 to-amber-700/60 dark:via-amber-600/40 dark:to-amber-600/60 mx-auto mb-6" />
                <div className="w-3 h-3 border border-amber-700/50 dark:border-amber-600/50 rotate-45 mx-auto mb-6" />
                <div className="space-y-3 mb-6">
                    <span className="block font-serif italic text-xs tracking-[0.3em] uppercase">Where Ideas</span>
                    <h3 className="font-display text-3xl lg:text-4xl font-semibold text-parchment-900 dark:text-antique-900">
                        Converge
                    </h3>
                    <span className="block font-serif italic text-xs tracking-[0.3em] uppercase">& Paths Align</span>
                </div>
                <div className="w-2 h-2 bg-amber-700/40 dark:bg-amber-600/40 rotate-45 mx-auto mb-6" />
                <div className="w-px h-16 bg-gradient-to-t from-transparent via-amber-700/40 to-amber-700/60 dark:via-amber-600/40 dark:to-amber-600/60 mx-auto" />
            </div>

            {/* Scroll hint */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center pointer-events-none"
                style={{ opacity: isInView ? Math.max(0, 0.4 - progress * 1.2) : 0 }}
            >
                <span className="font-serif italic text-sm tracking-widest uppercase">Scroll to Reveal</span>
            </div>

            {/* LEFT HALF-MOON */}
            <div
                className={`
                    absolute left-0 top-1/2 overflow-hidden
                    transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
                    ${isClickable ? 'cursor-pointer' : 'cursor-default'}
                `}
                style={{
                    height: `${diameter}px`,
                    width: `${half}px`,
                    transform: `translateX(${leftTransform}%) translateY(-50%)`,
                }}
                onClick={() => handleMoonClick(LEFT_MOON)}
            >
                <div
                    className="absolute bg-parchment-200 dark:bg-antique-100 border-r-2 border-amber-700/20 dark:border-amber-600/20 shadow-2xl shadow-parchment-900/10 dark:shadow-black/20"
                    style={{
                        width: `${diameter}px`,
                        height: `${diameter}px`,
                        borderRadius: '50%',
                        left: `${-half}px`,
                        top: 0,
                    }}
                >
                    <div
                        className="absolute top-1/2 -translate-y-1/2 w-48 md:w-56 lg:w-72 text-right pr-6 lg:pr-8"
                        style={{
                            opacity: contentOpacity,
                            right: `${Math.max(20, half * 0.1)}px`,
                        }}
                    >
                        <div className="flex items-center justify-end gap-3 mb-4 opacity-50">
                            <span className="font-serif italic text-xs tracking-widest uppercase">{LEFT_MOON.subtitle}</span>
                            <div className="h-[1px] w-8 bg-current" />
                        </div>
                        <h3 className="font-display text-3xl lg:text-5xl font-semibold tracking-wide text-parchment-900 dark:text-antique-900 mb-6">
                            {LEFT_MOON.title}
                        </h3>
                        <p className="font-serif text-sm leading-relaxed mb-8">
                            {LEFT_MOON.description}
                        </p>
                        <div
                            className={`
                                flex items-center justify-end gap-2 text-amber-700 dark:text-amber-600
                                transition-opacity duration-500
                                ${isClickable ? 'opacity-80' : 'opacity-0'}
                            `}
                        >
                            <span className="font-serif text-xs uppercase tracking-widest">Explore</span>
                            <span>←</span>
                        </div>
                    </div>

                    <div
                        className="absolute top-0 bottom-0 w-1 bg-gradient-to-l from-amber-700/20 to-transparent dark:from-amber-600/20"
                        style={{ opacity: progress, right: `${half - 2}px` }}
                    />
                </div>
            </div>

            {/* RIGHT HALF-MOON */}
            <div
                className={`
                    absolute right-0 top-1/2 overflow-hidden
                    transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
                    ${isClickable ? 'cursor-pointer' : 'cursor-default'}
                `}
                style={{
                    height: `${diameter}px`,
                    width: `${half}px`,
                    transform: `translateX(${rightTransform}%) translateY(-50%)`,
                }}
                onClick={() => handleMoonClick(RIGHT_MOON)}
            >
                <div
                    className="absolute bg-parchment-200 dark:bg-antique-100 border-l-2 border-amber-700/20 dark:border-amber-600/20 shadow-2xl shadow-parchment-900/10 dark:shadow-black/20"
                    style={{
                        width: `${diameter}px`,
                        height: `${diameter}px`,
                        borderRadius: '50%',
                        right: `${-half}px`,
                        top: 0,
                    }}
                >
                    <div
                        className="absolute top-1/2 -translate-y-1/2 w-48 md:w-64 lg:w-80 text-left px-4"
                        style={{
                            opacity: contentOpacity,
                            left: `${Math.max(12, half * 0.08)}px`,
                        }}
                    >
                        <div className="flex items-center gap-3 mb-4 opacity-50">
                            <div className="h-[1px] w-8 bg-current" />
                            <span className="font-serif italic text-xs tracking-widest uppercase">{RIGHT_MOON.subtitle}</span>
                        </div>
                        <h3 className="font-display text-3xl lg:text-5xl font-semibold tracking-wide text-parchment-900 dark:text-antique-900 mb-6">
                            {RIGHT_MOON.title}
                        </h3>
                        <p className="font-serif text-sm leading-relaxed mb-8">
                            {RIGHT_MOON.description}
                        </p>
                        <div
                            className={`
                                flex items-center gap-2 text-amber-700 dark:text-amber-600
                                transition-opacity duration-500
                                ${isClickable ? 'opacity-80' : 'opacity-0'}
                            `}
                        >
                            <span>→</span>
                            <span className="font-serif text-xs uppercase tracking-widest">Explore</span>
                        </div>
                    </div>

                    <div
                        className="absolute top-0 bottom-0 w-1 bg-gradient-to-r from-amber-700/20 to-transparent dark:from-amber-600/20"
                        style={{ opacity: progress, left: `${half - 2}px` }}
                    />
                </div>
            </div>

            {/* Decorative corners */}
            <div className="absolute top-12 left-12 w-16 h-16 border-l-2 border-t-2 border-amber-700/10 dark:border-amber-600/10" />
            <div className="absolute top-12 right-12 w-16 h-16 border-r-2 border-t-2 border-amber-700/10 dark:border-amber-600/10" />
            <div className="absolute bottom-12 left-12 w-16 h-16 border-l-2 border-b-2 border-amber-700/10 dark:border-amber-600/10" />
            <div className="absolute bottom-12 right-12 w-16 h-16 border-r-2 border-b-2 border-amber-700/10 dark:border-amber-600/10" />
        </section>
    );
};
