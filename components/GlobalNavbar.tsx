import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Work', path: '/projects' },
    { label: 'About', path: '/about' },
    { label: 'Resources', path: '/resources' },
    { label: 'Contact', path: '/contact' }
];

export const GlobalNavbar: React.FC = () => {
    const navigate = useNavigate();

    const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (window.location.pathname === '/') {
            // Already on home — smooth scroll to hero via Lenis
            window.dispatchEvent(new CustomEvent('scrollToTop'));
        } else {
            // Set a global flag so HomePage knows to scroll past SplitReveal on mount
            (window as any).__scrollToHero = true;
            navigate('/');
        }
    };

    return (
        <div className="group font-sans">
            {/* Logo / Brand Name */}
            <Link 
                to="/" 
                onClick={handleHomeClick}
                className="peer fixed top-[30px] left-[20px] md:left-[40px] z-[100] mix-blend-difference text-white text-lg font-semibold tracking-[0.2em] uppercase transition-opacity hover:opacity-70 pb-6"
            >
                ARCHIVIST
            </Link>

            {/* Premium Tooltip */}
            <div className="fixed top-[70px] left-[20px] md:left-[40px] z-[101] w-[260px] sm:w-[320px] p-5 rounded-2xl bg-[#0A0A0A]/95 backdrop-blur-md border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.5)] opacity-0 invisible peer-hover:opacity-100 peer-hover:visible hover:opacity-100 hover:visible transition-all duration-300 ease-out transform translate-y-2.5 peer-hover:translate-y-0 hover:translate-y-0">
                
                {/* Subtle connecting pointer/arrow */}
                <div className="absolute -top-2 left-8 w-4 h-4 bg-[#0A0A0A] border-t border-l border-white/10 transform rotate-45"></div>

                <div className="relative z-10 flex flex-col gap-3 font-sans">
                    <div className="text-white font-bold tracking-[0.15em] text-sm">
                        ARCHIVIST
                    </div>
                    <p className="text-[#a1a1aa] text-xs sm:text-sm leading-relaxed">
                        One who researches, structures, and preserves valuable records.
                    </p>
                    <div className="w-full h-px bg-white/10 my-1"></div>
                    <div className="flex items-center gap-2 text-[#e4e4e7] text-xs sm:text-sm font-medium">
                        Archivist <span className="text-green-400 font-bold">→</span> Me and my Portfolio
                    </div>
                </div>
            </div>

            {/* 
              Menu Trigger 
              Separated into its own fixed container so mix-blend-difference can interact directly with the page background.
              The extra padding (pb-8, pl-8) creates an invisible hover bridge to the dropdown.
            */}
            <div className="fixed top-[15px] right-[15px] md:top-[20px] md:right-[20px] p-2 md:pt-[10px] md:pr-[20px] md:pb-[20px] md:pl-[20px] z-[100] mix-blend-normal md:mix-blend-difference text-white cursor-pointer text-lg font-medium tracking-wide flex items-center justify-end gap-3 transition-opacity hover:opacity-80 bg-black/80 backdrop-blur-md md:bg-transparent md:backdrop-blur-none rounded-full md:rounded-none border border-white/10 md:border-transparent">
                <span className="hidden sm:inline-block">Menu</span>
                <svg width="24" height="24" className="md:w-[28px] md:h-[28px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </div>

            {/* Dropdown Menu Container */}
            <div className="fixed top-[70px] right-[20px] md:right-[40px] z-[99] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right group-hover:translate-y-0 translate-y-2">
                <div className="w-[280px] bg-[#0a0a0a]/70 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col">
                        {navItems.map((item, index) => (
                            <Link 
                                key={item.label} 
                                to={item.path} 
                                onClick={(e) => {
                                    if (item.path === '/') {
                                        handleHomeClick(e);
                                    } else {
                                        window.scrollTo(0, 0);
                                    }
                                }}
                                className={`
                                    group/item relative flex items-center justify-between px-6 py-5 
                                    text-white hover:text-black transition-colors duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden
                                    ${index !== navItems.length - 1 ? 'border-b border-white/10' : ''}
                                `}
                            >
                                {/* Bottom-to-Top Fill Background */}
                                <div className="absolute bottom-0 left-0 right-0 h-0 bg-white transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/item:h-full z-0" />

                                <span className="text-[17px] tracking-wide relative z-10">{item.label}</span>
                                <span className="text-xl transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] font-light relative z-10">
                                    <span className="block group-hover/item:hidden">→</span>
                                    <span className="hidden group-hover/item:block">↗</span>
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
    );
};
