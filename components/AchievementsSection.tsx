import React, { useEffect, useRef, useState } from 'react';
import { AnimatedHeading } from './AnimatedHeading';

const ACHIEVEMENTS = [
    {
        stat: "9.82",
        unit: "CGPA",
        title: "University First Rank",
        description: "Among 500+ students",
        colSpan: "md:col-span-1 lg:col-span-1",
        accent: "text-green-400"   // single site accent
    },
    {
        stat: "SIH 2025",
        unit: "",
        title: "Smart India Hackathon",
        description: "Satellite Image Analysis",
        colSpan: "md:col-span-1 lg:col-span-1",
        accent: "text-white"
    },
    {
        stat: "PMST",
        unit: "",
        title: "Merit Scholarship",
        description: "Academic Excellence",
        colSpan: "md:col-span-1 lg:col-span-1",
        accent: "text-white"
    },
    {
        stat: "₹10,000",
        unit: "",
        title: "Science Exhibition Winner",
        description: "Solar Panel Wiper Project",
        colSpan: "md:col-span-1 lg:col-span-1",
        accent: "text-white"
    }
];

export const AchievementsSection: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            {
                threshold: 0.2,
                rootMargin: '0px 0px -50px 0px',
            }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="achievements-section"
            className="relative w-full bg-transparent py-24 px-4 sm:px-6 md:px-12 flex flex-col items-center font-sans overflow-hidden"
        >
            {/* Title Block */}
            <div className="text-center pb-16 z-20">
                <AnimatedHeading text="ACHIEVEMENTS" className="mb-4" />
                <p className="text-lg md:text-xl font-medium tracking-wide text-white/50">
                    Milestones that shaped my journey.
                </p>
            </div>

            {/* Premium Bento Grid */}
            <div className="relative z-20 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {ACHIEVEMENTS.map((achievement, index) => {
                    // Calculate starting rotation based on index to simulate a fanned-out deck
                    const initialRotation = (index % 2 === 0 ? -1 : 1) * (10 + index * 5);
                    const delay = index * 150; // Staggered dealing

                    return (
                        <div 
                            key={index}
                            className={`group relative flex flex-col justify-center p-8 md:p-12 h-[280px] md:h-[320px] bg-[#050505] border border-white/10 overflow-hidden cursor-pointer ${achievement.colSpan} transform transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)]`}
                            style={{
                                transitionDelay: `${delay}ms`,
                                transform: isVisible 
                                    ? 'translate(0, 0) rotate(0deg) scale(1)' 
                                    : `translate(0, 100%) rotate(${initialRotation}deg) scale(0.8)`,
                                opacity: isVisible ? 1 : 0,
                                transformOrigin: 'bottom center'
                            }}
                        >
                        {/* Background Hover Effects */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out pointer-events-none" />
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-1000 pointer-events-none" />
                        
                        {/* Micro-interaction corner accent */}
                        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/0 group-hover:border-white/40 transition-colors duration-500 m-6" />

                        {/* Content */}
                        <div className="relative z-10 flex flex-col justify-end h-full transform transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2">
                            {/* Number / Stat */}
                            <div className="mb-auto flex items-baseline gap-2">
                                <span className={`text-5xl md:text-7xl font-display font-black tracking-tight ${achievement.accent}`}>
                                    {achievement.stat}
                                </span>
                                {achievement.unit && (
                                    <span className="text-xl md:text-3xl font-bold tracking-wide text-white/40">
                                        {achievement.unit}
                                    </span>
                                )}
                            </div>

                            {/* Text Details */}
                            <div className="mt-8">
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 tracking-wide uppercase">
                                    {achievement.title}
                                </h3>
                                <p className="text-sm md:text-base text-white/50 font-medium tracking-wide">
                                    {achievement.description}
                                </p>
                            </div>
                        </div>
                    </div>
                    );
                })}
            </div>
        </section>
    );
};
