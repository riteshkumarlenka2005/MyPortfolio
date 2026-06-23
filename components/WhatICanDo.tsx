import React, { useState, useRef } from 'react';
import { AnimatedHeading } from './AnimatedHeading';

const ITEMS = [
    {
        label: 'Research & Development',
        img: '/Research & Development.png',
        alt: 'Research and Development',
    },
    {
        label: 'Intelligent Automation',
        img: '/IntelligentAutomation.png',
        alt: 'Intelligent Automation',
    },
    {
        label: 'Digital Experiences',
        img: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&q=80',
        alt: 'Digital Experiences',
    },
    {
        label: 'Scalable Systems',
        img: '/ScalableSystem.png',
        alt: 'Scalable Systems',
    },
    {
        label: 'Product Innovation',
        img: '/Product.png',
        alt: 'Product Innovation',
    },
];

export const WhatICanDo: React.FC = () => {
    const [hovered, setHovered] = useState<number | null>(null);
    const [previewTop, setPreviewTop] = useState(0);
    const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = (i: number) => {
        setHovered(i);
        const row = rowRefs.current[i];
        const container = containerRef.current;
        if (row && container) {
            const rowRect = row.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const rowMidY = rowRect.top - containerRect.top + rowRect.height / 2;
            setPreviewTop(rowMidY);
        }
    };

    return (
        <section className="relative w-full bg-transparent py-24 px-4 sm:px-6 md:px-12 font-sans overflow-hidden">
            <div className="w-full max-w-7xl mx-auto mb-12">
                <AnimatedHeading text="CAPABILITIES" />
            </div>

            <div className="w-full max-w-7xl mx-auto flex gap-16 items-start">
                <div ref={containerRef} className="flex-1 relative flex flex-col divide-y divide-white/[0.06]">
                    {ITEMS.map((item, i) => (
                        <div
                            key={i}
                            ref={(el) => { rowRefs.current[i] = el; }}
                            className="group relative py-5 cursor-default select-none"
                            onMouseEnter={() => handleMouseEnter(i)}
                            onMouseLeave={() => setHovered(null)}
                        >
                            <span
                                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-none tracking-tight transition-all duration-300"
                                style={{
                                    color: hovered === null
                                        ? 'rgba(255,255,255,0.18)'
                                        : hovered === i
                                            ? 'rgba(255,255,255,1)'
                                            : 'rgba(255,255,255,0.08)',
                                }}
                            >
                                {item.label}
                            </span>
                        </div>
                    ))}

                    <div
                        className="hidden lg:block absolute right-0 w-[160px] aspect-square rounded-xl overflow-hidden pointer-events-none transition-all duration-300"
                        style={{
                            opacity: hovered !== null ? 1 : 0,
                            top: previewTop,
                            transform: 'translateY(-50%)',
                        }}
                    >
                        {hovered !== null && (
                            <img
                                src={ITEMS[hovered].img}
                                alt={ITEMS[hovered].alt}
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
