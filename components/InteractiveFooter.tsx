import React from 'react';
import { Link } from 'react-router-dom';

const socialLinks = [
    {
        label: 'GitHub',
        href: 'https://github.com',
        icon: (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
        )
    },
    {
        label: 'LinkedIn',
        href: 'https://linkedin.com',
        icon: (
            <span className="font-bold text-[#0A66C2] text-xl tracking-tight leading-none">in</span>
        )
    },
    {
        label: 'Email',
        href: 'mailto:ritesh@example.com',
        icon: (
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg" alt="Gmail" className="w-5 h-5 object-contain" />
        )
    },
    {
        label: 'Twitter',
        href: 'https://twitter.com',
        icon: (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        )
    }
];

const navLinks = [
    { label: 'About', href: '/about' },
    { label: 'Work', href: '/projects' },
    { label: 'Contact', href: '/contact' }
];

export const InteractiveFooter: React.FC = () => {
    return (
        <footer className="relative w-full bg-[#0a0a0a] text-white py-12 md:py-16 px-6 md:px-16 flex flex-col justify-between">
            {/* Warm, grainy film-leak gradient at the bottom */}
            <div 
                className="absolute bottom-0 left-0 w-full h-[140px] pointer-events-none z-0"
                style={{
                    background: 'linear-gradient(to right, #050505 0%, #4a1511 40%, #b8401b 75%, #e69022 100%)',
                    WebkitMaskImage: 'linear-gradient(to top, black 10%, transparent 100%)',
                    maskImage: 'linear-gradient(to top, black 10%, transparent 100%)'
                }}
            >
                {/* Heavy film grain noise overlay */}
                <div 
                    className="absolute inset-0 opacity-40 mix-blend-overlay" 
                    style={{ 
                        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E")' 
                    }} 
                />
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row justify-between w-full max-w-7xl mx-auto gap-16 lg:gap-8">
                {/* Left Side: Brand and Description */}
                <div className="flex flex-col items-start max-w-xl">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-[0.2em] uppercase">
                        ARCHIVIST
                    </h2>

                    <p className="mt-8 text-zinc-400 font-serif text-lg leading-relaxed max-w-md">
                        A digital sanctuary for thoughtful work and enduring ideas. Crafted with intention, preserved with care.
                    </p>
                </div>

                {/* Right Side: Links Columns */}
                <div className="flex flex-col sm:flex-row gap-12 lg:gap-16 w-full lg:w-auto">
                    {/* Navigation Column */}
                    <div className="flex flex-col w-full sm:w-[220px]">
                        <h3 className="text-zinc-500 font-serif italic mb-6"></h3>
                        <div className="flex flex-col border-t border-white/10">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    to={link.href}
                                    className="group/item relative flex items-center justify-between px-5 py-4 text-white hover:text-black transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden border-b border-white/10"
                                >
                                    <div className="absolute bottom-0 left-0 right-0 h-0 bg-white transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/item:h-full z-0" />
                                    <span className="text-lg font-medium tracking-wide relative z-10">{link.label}</span>
                                    <span className="text-xl transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] font-light relative z-10">
                                        <span className="block group-hover/item:hidden">→</span>
                                        <span className="hidden group-hover/item:block">↗</span>
                                    </span>
                                </Link>
                            ))}
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
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center md:items-end w-full max-w-7xl mx-auto mt-16 lg:mt-24 text-zinc-200 font-serif italic text-base md:text-lg tracking-wide drop-shadow-md gap-4">
                <p className="font-medium">@ 2025 Archivist</p>
                <p className="text-center md:text-right font-medium">"Knowledge, once recorded, becomes eternal."</p>
            </div>
        </footer>
    );
};
