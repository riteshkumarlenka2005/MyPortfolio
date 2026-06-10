import React, { useEffect, useRef, useState } from 'react';

// Manuscript content - structured like a real document
const MANUSCRIPT_LINES = [
    { type: 'heading', text: 'Research Notes — Volume VII' },
    { type: 'date', text: 'February 2026' },
    { type: 'divider' },
    { type: 'paragraph', text: 'The architecture of thought reveals itself through deliberate practice. Every system we build carries the fingerprints of intention.' },
    { type: 'space' },
    { type: 'note', text: '§ On the Nature of Craft' },
    { type: 'paragraph', text: 'Consider how the masters approached their work: with patience, precision, and an unwavering commitment to excellence.' },
    { type: 'paragraph', text: 'The details are never incidental. They are the substance of quality itself.' },
    { type: 'space' },
    { type: 'quote', text: '"Simplicity is the ultimate sophistication."' },
    { type: 'attribution', text: '— Leonardo da Vinci' },
    { type: 'space' },
    { type: 'note', text: '§ Observations on Process' },
    { type: 'paragraph', text: 'Great solutions emerge not from haste, but from deep understanding. The time spent in contemplation is never wasted.' },
    { type: 'list', text: '• Structure emerges from chaos through iteration' },
    { type: 'list', text: '• Constraints breed creativity' },
    { type: 'list', text: '• Every limitation is an opportunity' },
    { type: 'space' },
    { type: 'paragraph', text: 'The craft demands that we honor both tradition and innovation. We stand on the shoulders of those who came before.' },
    { type: 'divider' },
    { type: 'note', text: '§ Technical Marginalia' },
    { type: 'paragraph', text: 'Systems thinking: the whole exceeds the sum of its parts. What we build must serve those who use it.' },
    { type: 'paragraph', text: 'Code is poetry when written with care. It tells a story to those who read it.' },
    { type: 'space' },
    { type: 'paragraph', text: 'The pursuit of mastery is endless. Each project teaches something new, each challenge sharpens our skills.' },
    { type: 'quote', text: '"The only way to do great work is to love what you do."' },
    { type: 'attribution', text: '— Steve Jobs' },
    { type: 'space' },
    { type: 'note', text: '§ Looking Forward' },
    { type: 'paragraph', text: 'What we create today becomes the foundation for tomorrow. Build with permanence in mind.' },
    { type: 'paragraph', text: 'The archive grows, one careful entry at a time. This is the work that matters.' },
    { type: 'divider' },
    { type: 'footer', text: '— End of Entry —' },
];

export const ManuscriptSurface: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [hasEntered, setHasEntered] = useState(false);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
                if (entry.isIntersecting && !hasEntered) {
                    setHasEntered(true);
                }
            },
            { threshold: 0.15 }
        );

        observer.observe(section);
        return () => observer.disconnect();
    }, [hasEntered]);

    // Double content for seamless loop
    const doubledContent = [...MANUSCRIPT_LINES, ...MANUSCRIPT_LINES];

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen bg-parchment-100 dark:bg-antique-50 overflow-hidden"
        >
            {/* Very subtle background pattern */}
            <div
                className="absolute inset-0 opacity-[0.015]"
                style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 0.5px, transparent 0)',
                    backgroundSize: '24px 24px'
                }}
            />

            {/* Main split container */}
            <div className="relative h-auto md:h-screen flex flex-col md:flex-row">

                {/* ═══════════════════════════════════════════════════════════ */}
                {/* LEFT ZONE - Static grounded content */}
                {/* ═══════════════════════════════════════════════════════════ */}
                <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-6 md:py-0 md:px-12 lg:px-20">
                    <div className="max-w-md space-y-4">
                        {/* Section label */}
                        <div className="flex items-center gap-4">
                            <div className="h-px w-10 bg-parchment-400 dark:bg-antique-300" />
                            <span className="font-serif italic text-xs tracking-[0.2em] uppercase text-parchment-600 dark:text-antique-500">
                                The Method
                            </span>
                        </div>

                        {/* Main heading */}
                        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-parchment-900 dark:text-antique-900 leading-[1.1]">
                            Thought
                            <span className="block text-amber-700 dark:text-amber-600">in Motion</span>
                        </h2>

                        {/* Body text */}
                        <div className="space-y-4 font-serif text-base md:text-lg leading-relaxed text-parchment-800 dark:text-antique-800/90">
                            <p>
                                Every meaningful work begins as a fragment—a note captured before it escapes,
                                a thought given form through patience.
                            </p>
                            <p>
                                What passes before you is a glimpse into that process: ideas in perpetual motion,
                                structured yet open to revision.
                            </p>
                        </div>

                        {/* Decorative element */}
                        <div className="flex items-center gap-4 pt-4">
                            <div className="w-2 h-2 border border-amber-700/50 dark:border-amber-600/50 rotate-45" />
                            <span className="font-serif italic text-sm text-parchment-500 dark:text-antique-400">
                                Research · Reflection · Refinement
                            </span>
                        </div>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════ */}
                {/* RIGHT ZONE - Transparent Floating Manuscript */}
                {/* ═══════════════════════════════════════════════════════════ */}
                <div className="w-full md:w-1/2 flex items-center justify-center relative overflow-hidden py-4 md:py-0">
                    <div
                        className={`
                            relative w-[95%] md:w-[500px] lg:w-[580px] xl:w-[680px] h-[35vh] md:h-[85vh]
                            transition-opacity duration-1000 ease-out
                            ${hasEntered ? 'opacity-100' : 'opacity-0'}
                        `}
                        style={{
                            transform: 'rotate(0deg)',
                        }}
                    >
                        {/* LEFT EDGE LINE */}
                        <div
                            className="absolute left-0 top-0 bottom-0 w-px"
                            style={{
                                background: 'linear-gradient(to bottom, transparent 0%, rgba(160, 160, 160, 0.35) 15%, rgba(160, 160, 160, 0.5) 50%, rgba(160, 160, 160, 0.35) 85%, transparent 100%)',
                            }}
                        />

                        {/* RIGHT EDGE LINE */}
                        <div
                            className="absolute right-0 top-0 bottom-0 w-px"
                            style={{
                                background: 'linear-gradient(to bottom, transparent 0%, rgba(160, 160, 160, 0.35) 15%, rgba(160, 160, 160, 0.5) 50%, rgba(160, 160, 160, 0.35) 85%, transparent 100%)',
                            }}
                        />

                        {/* SCROLLING CONTENT - transparent, floating text */}
                        <div
                            className="absolute inset-0 overflow-hidden"
                        >
                            <div
                                className="px-8 py-12"
                                style={{
                                    animation: isVisible ? 'manuscriptScroll 80s linear infinite' : 'none',
                                    willChange: 'transform',
                                }}
                            >
                                {/* Content items - fully readable, high contrast */}
                                {doubledContent.map((line, index) => (
                                    <div key={index} className="relative">
                                        {line.type === 'heading' && (
                                            <h3 className="font-display text-lg font-semibold text-parchment-900 dark:text-antique-900 mb-2 tracking-wide">
                                                {line.text}
                                            </h3>
                                        )}
                                        {line.type === 'date' && (
                                            <p className="font-serif text-xs text-parchment-600 dark:text-antique-500 mb-6 tracking-widest uppercase">
                                                {line.text}
                                            </p>
                                        )}
                                        {line.type === 'divider' && (
                                            <div className="flex items-center gap-3 my-6">
                                                <div className="flex-1 h-px bg-amber-700/20 dark:bg-amber-600/20" />
                                                <div className="w-1.5 h-1.5 border border-amber-700/40 dark:border-amber-600/40 rotate-45" />
                                                <div className="flex-1 h-px bg-amber-700/20 dark:bg-amber-600/20" />
                                            </div>
                                        )}
                                        {line.type === 'paragraph' && (
                                            <p className="font-serif text-sm leading-relaxed text-parchment-800 dark:text-antique-800/90 mb-4">
                                                {line.text}
                                            </p>
                                        )}
                                        {line.type === 'note' && (
                                            <p className="font-display text-sm font-semibold text-amber-800 dark:text-amber-600 mb-3 mt-2">
                                                {line.text}
                                            </p>
                                        )}
                                        {line.type === 'quote' && (
                                            <p className="font-serif text-sm italic text-parchment-700 dark:text-antique-600 pl-4 border-l-2 border-amber-700/30 dark:border-amber-600/30 mb-1">
                                                {line.text}
                                            </p>
                                        )}
                                        {line.type === 'attribution' && (
                                            <p className="font-serif text-xs text-parchment-600 dark:text-antique-500 pl-4 mb-4">
                                                {line.text}
                                            </p>
                                        )}
                                        {line.type === 'list' && (
                                            <p className="font-serif text-sm text-parchment-700 dark:text-antique-600 pl-4 mb-2">
                                                {line.text}
                                            </p>
                                        )}
                                        {line.type === 'space' && (
                                            <div className="h-4" />
                                        )}
                                        {line.type === 'footer' && (
                                            <p className="font-serif text-xs text-parchment-500 dark:text-antique-400 text-center mt-8 mb-12 tracking-widest">
                                                {line.text}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top subtle blend - very short, doesn't cover text */}
                        <div
                            className="absolute top-0 left-0 right-0 h-8 pointer-events-none z-10"
                            style={{
                                background: 'linear-gradient(to bottom, var(--color-parchment-100, #FAFAFA), transparent)',
                            }}
                        />

                        {/* Bottom subtle blend - very short, doesn't cover text */}
                        <div
                            className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none z-10"
                            style={{
                                background: 'linear-gradient(to top, var(--color-parchment-100, #FAFAFA), transparent)',
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};
