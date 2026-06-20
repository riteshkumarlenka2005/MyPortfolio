import React from 'react';
import { Link } from 'react-router-dom';

const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Work', path: '/projects' },
    { label: 'About', path: '/about' },
    { label: 'Resources', path: '/resources' },
    { label: 'Contact', path: '/contact' }
];

export const GlobalNavbar: React.FC = () => {
    return (
        <div className="group font-sans">
            {/* Logo / Brand Name */}
            <Link 
                to="/" 
                className="fixed top-[30px] left-[40px] z-[100] mix-blend-difference text-white text-lg font-semibold tracking-[0.2em] uppercase transition-opacity hover:opacity-70"
            >
                ARCHIVIST
            </Link>

            {/* 
              Menu Trigger 
              Separated into its own fixed container so mix-blend-difference can interact directly with the page background.
              The extra padding (pb-8, pl-8) creates an invisible hover bridge to the dropdown.
            */}
            <div className="fixed top-[20px] right-[20px] pt-[10px] pr-[20px] pb-[20px] pl-[20px] z-[100] mix-blend-difference text-white cursor-pointer text-lg font-medium tracking-wide flex items-center justify-end gap-3 transition-opacity hover:opacity-80">
                <span>Menu</span>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </div>

            {/* Dropdown Menu Container */}
            <div className="fixed top-[70px] right-[40px] z-[99] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right group-hover:translate-y-0 translate-y-2">
                <div className="w-[280px] bg-[#0a0a0a]/70 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col">
                        {navItems.map((item, index) => (
                            <Link 
                                key={item.label} 
                                to={item.path} 
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
