import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const socialLinks = [
    {
        label: 'GitHub',
        href: 'https://github.com/riteshkumarlenka2005',
        icon: (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
        )
    },
    {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/ritesh-kumar-lenka-186010320/',
        icon: (
            <span className="font-bold text-[#0A66C2] text-xl tracking-tight leading-none">in</span>
        )
    },
    {
        label: 'Email',
        href: 'mailto:lenkariteshkumar2005@gmail.com',
        icon: (
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg" alt="Gmail" className="w-5 h-5 object-contain" />
        )
    },
    {
        label: 'LeetCode',
        href: 'https://leetcode.com/u/riteshkumarlenka/',
        icon: (
            <img src="https://cdn.simpleicons.org/leetcode/white" alt="LeetCode" className="w-5 h-5 object-contain group-hover/item:invert transition-all duration-700" />
        )
    }
];

const navLinks: Array<{ label: string; href: string; external?: boolean }> = [
    { label: 'About', href: '/about' },
    { label: 'Work', href: '/projects' },
    { label: 'Contact', href: '/contact' }
];

export const InteractiveFooter: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px 50px 0px', // Trigger slightly before it fully enters
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} className="w-full overflow-hidden">
            <footer
                className={`relative w-full overflow-hidden bg-[#0a0a0a] text-white py-12 md:py-16 px-6 md:px-16 flex flex-col justify-between transform transition-transform duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Huge Background Typography (Bottom Anchored like Reference) */}
                <div className="absolute bottom-0 left-0 w-full pointer-events-none z-0 overflow-hidden flex items-end justify-center select-none">
                    <span
                        className="font-bold text-white/[0.04] tracking-tighter leading-none whitespace-nowrap"
                        style={{ 
                            fontSize: '26vw', 
                            transform: isVisible ? 'translateY(12%)' : 'translateY(150%)',
                            opacity: isVisible ? 1 : 0,
                            transition: 'transform 1.5s cubic-bezier(0.16,1,0.3,1) 0.5s, opacity 1.5s ease 0.5s'
                        }}
                    >
                        RITESH
                    </span>
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row justify-between w-full max-w-7xl mx-auto gap-16 lg:gap-8">
                    {/* Left Side: Brand and Description */}
                    <div className="flex flex-col items-start max-w-xl">
                        {/* Availability Indicator */}
                        <div className="flex items-center gap-3 mt-2 mb-4">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-green-400 text-xs font-semibold tracking-widest uppercase">Available for work</span>
                        </div>

                        <p className="mt-4 text-zinc-300 font-sans text-xl md:text-2xl font-bold leading-relaxed max-w-md">
                            Crafting intelligent digital experiences through modern web development, AI engineering, and purposeful design.
                        </p>
                        
                        <a 
                            href="/resume.pdf"
                            target="_blank"
                            rel="noreferrer"
                            className="mt-8 inline-flex items-center gap-2 px-8 py-3 bg-white/5 hover:bg-white text-white hover:text-black border border-white/10 hover:border-white font-medium tracking-wide text-sm transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                        >
                            Résumé <span className="text-lg leading-none font-light">↗</span>
                        </a>
                    </div>

                    {/* Right Side: Links Columns */}
                    <div className="flex flex-col sm:flex-row gap-12 lg:gap-16 w-full lg:w-auto">
                        {/* Navigation Column */}
                        <div className="flex flex-col w-full sm:w-[220px]">
                            <h3 className="text-zinc-500 font-serif italic mb-6"></h3>
                            <div className="flex flex-col border-t border-white/10">
                                {navLinks.map((link) => {
                                    const linkClasses = "group/item relative flex items-center justify-between px-5 py-4 text-white hover:text-black transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden border-b border-white/10";
                                    const innerContent = (
                                        <>
                                            <div className="absolute bottom-0 left-0 right-0 h-0 bg-white transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/item:h-full z-0" />
                                            <span className="text-lg font-medium tracking-wide relative z-10">{link.label}</span>
                                            <span className="text-xl transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] font-light relative z-10">
                                                <span className="block group-hover/item:hidden">→</span>
                                                <span className="hidden group-hover/item:block">↗</span>
                                            </span>
                                        </>
                                    );

                                    return link.external ? (
                                        <a
                                            key={link.label}
                                            href={link.href}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={linkClasses}
                                        >
                                            {innerContent}
                                        </a>
                                    ) : (
                                        <Link
                                            key={link.label}
                                            to={link.href}
                                            className={linkClasses}
                                        >
                                            {innerContent}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Socials Column */}
                        <div className="flex flex-col w-full sm:w-[220px]">
                            <h3 className="text-zinc-500 font-serif italic mb-6"></h3>
                            <div className="flex flex-col border-t border-white/10">
                                {socialLinks.map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="group/item relative flex items-center justify-between px-5 py-4 text-white hover:text-black transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden border-b border-white/10"
                                    >
                                        <div className="absolute bottom-0 left-0 right-0 h-0 bg-white transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/item:h-full z-0" />
                                        <div className="flex items-center gap-3 relative z-10">
                                            {link.icon}
                                            <span className="text-lg font-medium tracking-wide">{link.label}</span>
                                        </div>
                                        <span className="text-xl transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] font-light relative z-10">
                                            <span className="block group-hover/item:hidden">→</span>
                                            <span className="hidden group-hover/item:block">↗</span>
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="relative z-10 flex flex-col justify-start items-center md:items-start w-full max-w-7xl mx-auto mt-16 lg:mt-24 gap-4">
                    <p className="font-serif italic text-zinc-300 text-base md:text-lg font-semibold text-center md:text-left">
                        "The best engineers are not just technically strong — they are thinkers first, builders second."
                    </p>
                    <p className="font-sans text-zinc-400 text-sm md:text-base font-medium tracking-wide text-center md:text-left">
                        Designed & built by Ritesh Kumar Lenka &nbsp;·&nbsp; All rights reserved
                    </p>
                </div>
            </footer>
        </div>
    );
};
