import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { NeuralPattern } from './NeuralPattern';

const TypewriterEffect = () => {
    const ROLES = [
        "FULL\nSTACK\nDEVELOPER.",
        "AI/ML\nENGINEER.",
        "UI/UX\nDESIGNER."
    ];

    const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentRole = ROLES[currentRoleIndex];
        let timeoutId: NodeJS.Timeout;

        if (!isDeleting && displayedText === currentRole) {
            // Pause before deleting
            timeoutId = setTimeout(() => setIsDeleting(true), 2000);
        } else if (isDeleting && displayedText === '') {
            // Move to next word
            setIsDeleting(false);
            setCurrentRoleIndex((prev) => (prev + 1) % ROLES.length);
            // Slight pause before typing again
            timeoutId = setTimeout(() => { }, 200);
        } else {
            // Type or delete characters
            const typingSpeed = isDeleting ? 30 : 80;
            // Add some randomness to typing speed to make it feel human
            const randomSpeed = typingSpeed + (isDeleting ? 0 : Math.random() * 40);

            timeoutId = setTimeout(() => {
                setDisplayedText(prev => {
                    if (isDeleting) {
                        return currentRole.substring(0, prev.length - 1);
                    } else {
                        return currentRole.substring(0, prev.length + 1);
                    }
                });
            }, randomSpeed);
        }

        return () => clearTimeout(timeoutId);
    }, [displayedText, isDeleting, currentRoleIndex]);

    const lines = displayedText.split('\n');

    return (
        <div className="relative w-full">
            {/* Hidden placeholder to maintain exact height and prevent layout shifts */}
            <h1 className="text-[12vw] lg:text-[4.5rem] xl:text-[5.5rem] 2xl:text-[6.5rem] font-black leading-[0.85] tracking-[-0.04em] text-transparent opacity-0 uppercase pointer-events-none select-none invisible" aria-hidden="true">
                FULL<br />
                STACK<br />
                DEVELOPER.
            </h1>

            {/* Visible animated text */}
            <h1 className="absolute top-0 left-0 w-full text-[12vw] lg:text-[4.5rem] xl:text-[5.5rem] 2xl:text-[6.5rem] font-black leading-[0.85] tracking-[-0.04em] text-white opacity-90 uppercase mix-blend-difference pointer-events-none">
                {lines.map((line, idx) => (
                    <React.Fragment key={idx}>
                        {line}
                        {idx < lines.length - 1 && <br />}
                    </React.Fragment>
                ))}
            </h1>
        </div>
    );
};

const OrganicImageShape = ({ src }: { src: string }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dim, setDim] = useState({ w: 0, h: 0 });

    useEffect(() => {
        const observer = new ResizeObserver((entries) => {
            if (entries[0]) {
                setDim({
                    w: entries[0].contentRect.width,
                    h: entries[0].contentRect.height
                });
            }
        });
        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    const { w, h } = dim;
    const k = 0.55228;

    // Outer corner radii
    const tlR = 40;
    const brR = 40;

    // Top-Right pill-shaped pocket
    const trW = 145;
    const trH = 60;
    const trF = 20; // Outer convex fillet blending into the top edge
    const trR = 20; // Inner concave corner of the pocket

    // Bottom-Left notch
    const blW = 100;
    const blH = 100;
    const blF = 40; // Convex fillet blending into the notch

    let path = '';
    if (w > 0 && h > 0) {
        // Mathematically perfect continuous superellipse curve path
        path = `
            M ${tlR},0
            
            L ${w - trW - trF},0
            C ${w - trW - trF + trF * k},0  ${w - trW},${trF - trF * k}  ${w - trW},${trF}
            L ${w - trW},${trH - trR}
            C ${w - trW},${trH - trR + trR * k}  ${w - trW + trR - trR * k},${trH}  ${w - trW + trR},${trH}
            L ${w - trF},${trH}
            C ${w - trF + trF * k},${trH}  ${w},${trH + trF - trF * k}  ${w},${trH + trF}
            
            L ${w},${h - brR}
            C ${w},${h - brR + brR * k}  ${w - brR + brR * k},${h}  ${w - brR},${h}
            
            L ${blW + blF},${h}
            C ${blW + blF - blF * k},${h}  ${blW},${h - blF + blF * k}  ${blW},${h - blF}
            C ${blW},${h - blF - (blH - blF) * k}  ${blF + (blW - blF) * k},${h - blH}  ${blF},${h - blH}
            C ${blF - blF * k},${h - blH}  0,${h - blH - blF + blF * k}  0,${h - blH - blF}
            
            L 0,${tlR}
            C 0,${tlR - tlR * k}  ${tlR - tlR * k},0  ${tlR},0
            Z
        `;
    }

    return (
        <div ref={containerRef} className="relative w-full h-full pointer-events-none z-0">
            <svg width="0" height="0">
                <clipPath id="organic-mask">
                    <path d={path} fill="black" />
                </clipPath>
            </svg>
            <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: 'url(#organic-mask)', WebkitClipPath: 'url(#organic-mask)' }}
            >
                <img src={src} className="w-full h-full object-cover" alt="Hero" />
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════
// Code Sidebar Component
// ═══════════════════════════════════════════════════════════════
const CodeSidebar = () => {
    const CodeBlock = () => (
        <>
            <span className="text-[#569cd6]">readonly</span> <span className="text-[#9cdcfe]">integrity</span>:<br />
            <span className="text-[#569cd6]">readonly</span> <span className="text-[#9cdcfe]">passion</span>:<br />
            <span className="text-white">{'}'}</span><br />
            <span className="text-[#569cd6]">type</span> <span className="text-[#4ec9b0]">Excellence</span> <span className="text-white">=</span><br />
            <br />
            <span className="text-[#569cd6]">class</span> <span className="text-[#4ec9b0]">Creator</span> <span className="text-[#569cd6]">implements</span><br />
            <span className="text-[#569cd6]">private readonly</span> <span className="text-[#9cdcfe]">st</span><br />
            <span className="text-[#569cd6]">private readonly</span> <span className="text-[#9cdcfe]">co</span><br />
            <span className="text-white">{'}'}</span><br />
            <br />
            <span className="text-[#6a9955]">/* The pursuit of m</span><br />
            <span className="text-[#569cd6]">export const</span> <span className="text-[#4ec9b0]">PRINCI</span><br />
            <span className="text-[#9cdcfe]">precision:</span> <span className="text-[#ce9178]">"non-neg</span><br />
            <span className="text-[#9cdcfe]">quality:</span> <span className="text-[#ce9178]">"relentles</span><br />
            <span className="text-[#9cdcfe]">craft:</span> <span className="text-[#ce9178]">"intentional</span><br />
            <span className="text-white">{'}'}</span> <span className="text-[#569cd6]">as const</span>;<br />
            <br />
            <span className="text-[#569cd6]">async function</span> <span className="text-[#dcdcaa]">build</span><br />
            <span className="text-[#569cd6]">const</span> <span className="text-[#9cdcfe]">foundation</span> <span className="text-white">=</span><br />
            <span className="text-[#569cd6]">const</span> <span className="text-[#9cdcfe]">structure</span> <span className="text-white">=</span><br />
            <span className="text-[#569cd6]">return</span> <span className="text-[#dcdcaa]">polish</span><span className="text-white">(obses</span><br />
            <span className="text-white">{'}'}</span><br />
            <br />
            <span className="text-[#6a9955]">// Digital preserva</span><br />
            <span className="text-[#569cd6]">interface</span> <span className="text-[#4ec9b0]">Archive</span><span className="text-white">&lt;T</span><br />
            <span className="text-[#dcdcaa]">preserve</span><span className="text-white">(artifact:</span><br />
            <span className="text-[#dcdcaa]">restore</span><span className="text-white">(memory: </span><span className="text-[#4ec9b0]">Fra</span><br />
            <span className="text-white">{'}'}</span><br />
            <br />
            <span className="text-[#569cd6]">const</span> <span className="text-[#4ec9b0]">PHILOSOPHY</span> <span className="text-white">=</span><br />
            <span className="text-white">Technology serves h</span><br />
            <span className="text-white">Design reveals inte</span><br />
            <span className="text-white">Code expresses thou</span><br />
            <span className="text-[#ce9178]">`;</span><br />
            <br />
            <span className="text-[#569cd6]">enum</span> <span className="text-[#4ec9b0]">Approach</span> <span className="text-white">{'{'}</span><br />
            <span className="text-[#4ec9b0]">THOUGHTFUL</span> <span className="text-white">=</span> <span className="text-[#ce9178]">"first</span><br />
            <span className="text-[#4ec9b0]">ITERATIVE</span> <span className="text-white">=</span> <span className="text-[#ce9178]">"always</span><br />
            <span className="text-[#4ec9b0]">EXCELLENT</span> <span className="text-white">=</span> <span className="text-[#ce9178]">"only"</span><br />
            <span className="text-white">{'}'}</span><br />
            <br />
            <span className="text-[#6a9955]">// Building bridges</span><br />
            <span className="text-[#569cd6]">function</span> <span className="text-[#dcdcaa]">connect</span><span className="text-white">(hu</span><br />
            <br />
        </>
    );

    return (
        <div className="relative w-full flex-1 overflow-hidden flex flex-col justify-start select-none mix-blend-screen mt-6 mb-2 opacity-90">
            <style>
                {`
                @keyframes scrollCode {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-50%); }
                }
                .code-scroll {
                    animation: scrollCode 25s linear infinite;
                }
                .mask-image-vertical {
                    mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
                    -webkit-mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
                }
                `}
            </style>
            <div className="absolute top-0 left-0 right-0 p-2 pl-3 font-mono text-[6px] xl:text-[7.5px] leading-[1.6] whitespace-pre flex flex-col text-gray-300 code-scroll mask-image-vertical">
                <CodeBlock />
                <CodeBlock />
            </div>
        </div>
    );
};

export const BionicHero: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    return (
        <section className="w-full h-screen bg-black flex items-center justify-center font-sans overflow-hidden">
            <div className="w-full h-full bg-[#f0f0f4] p-3 lg:p-5 flex flex-col lg:flex-row gap-4 shadow-2xl overflow-hidden relative">

                {/* ═══════════════════════════════════════════════════════════════ */}
                {/* DARK GRADIENT AND NEURAL PATTERN BACKGROUND */}
                {/* ═══════════════════════════════════════════════════════════════ */}
                <div className="absolute inset-y-0 left-0 w-full lg:w-[70%] xl:w-[65%] pointer-events-none z-0">
                    {/* Base linear gradient from pure black to transparent */}
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.98) 45%, rgba(0,0,0,0) 100%)' }} />
                    {/* Deep radial dark core on the far left for extra intensity */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_50%,rgba(0,0,0,1)_0%,rgba(0,0,0,0.95)_50%,transparent_100%)]" />
                    {/* Colored Dot Pattern Layer */}
                    <NeuralPattern />
                </div>

                {/* ═══════════════════════════════════════════════════════════════ */}
                {/* LEFT SIDEBAR (Black Pill) */}
                {/* ═══════════════════════════════════════════════════════════════ */}
                <div className="hidden lg:flex w-20 xl:w-24 h-full bg-[#0a0a0a] rounded-[40px] flex-col items-center justify-between py-6 flex-shrink-0 z-10 relative shadow-[0_0_15px_rgba(0,255,102,0.1),_inset_0_0_10px_rgba(0,255,102,0.05)] border border-[#00ff66]/20">

                    {/* Syntax Highlighted Code Scrolling Effect */}
                    <CodeSidebar />

                    {/* Bottom Profile Avatar */}
                    <div className="w-12 h-12 rounded-full bg-[#1a1a1a] p-[2px] overflow-hidden border border-[#00ff66]/30 mt-auto z-20 shadow-[0_0_10px_rgba(0,255,102,0.15)] relative">
                        <img src="/BackgroundPhoto.png" className="w-full h-full object-cover rounded-full filter grayscale contrast-125" alt="Profile" />
                    </div>
                </div>

                {/* Mobile Image Fallback with Navbar (Hidden on Desktop, Shows at Top on Mobile) */}
                <div className="lg:hidden w-full h-[220px] rounded-[32px] overflow-hidden relative flex-shrink-0 z-50 shadow-2xl">
                    <img src="/BackgroundPhoto.png" className="w-full h-full object-cover" alt="Hero" />
                    
                    {/* Hamburger Menu Button */}
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="absolute top-4 right-4 w-11 h-11 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 z-50 hover:bg-black/60 transition-colors"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            {isMobileMenuOpen 
                                ? <path d="M18 6L6 18M6 6l12 12" /> 
                                : <path d="M4 12h16M4 6h16M4 18h16" />
                            }
                        </svg>
                    </button>

                    {/* Mobile Menu Dropdown */}
                    {isMobileMenuOpen && (
                        <div className="absolute top-16 right-4 bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-5 flex flex-col gap-4 z-50 min-w-[180px] shadow-2xl animate-fade-in-up">
                             {[{ label: 'Home', path: '/' }, { label: 'About', path: '/about' }, { label: 'Projects', path: '/projects' }, { label: 'Resources', path: '/resources' }].map((item) => (
                                <Link key={item.label} to={item.path} className="text-white/90 hover:text-white text-sm font-semibold tracking-widest transition-all">
                                    {item.label}
                                </Link>
                            ))}
                            <div className="h-px w-full bg-white/20 my-1" />
                            <button className="text-left text-white text-sm font-semibold tracking-widest hover:text-[#ccff00] transition-colors">
                                Contact Us
                            </button>
                        </div>
                    )}
                </div>

                {/* ═══════════════════════════════════════════════════════════════ */}
                {/* LEFT CONTENT — Glassmorphic Bento Cards                       */}
                {/* ═══════════════════════════════════════════════════════════════ */}
                <div className="flex-1 lg:max-w-[50%] h-full flex flex-col justify-between pt-1 pb-4 px-2 lg:pr-6 lg:pl-0 z-10 relative">

                    {/* Top Info Card (Hidden on Mobile) */}
                    <div className="hidden lg:flex bg-white/5 backdrop-blur-md rounded-[28px] p-4 gap-4 xl:gap-5 shadow-sm border border-white/10 max-w-[420px] animate-fade-in-up lg:-ml-2 text-white">
                        <div className="w-20 h-24 xl:w-24 xl:h-28 rounded-2xl overflow-hidden bg-gray-800 flex-shrink-0">
                            <img src="/BackgroundPhoto.png" className="w-full h-full object-cover filter grayscale contrast-125" alt="Tech" />
                        </div>
                        <div className="flex flex-col justify-between py-1">
                            <p className="text-[11px] xl:text-xs leading-[1.4] font-medium text-gray-300">
                                This is the latest technology that allows you to build intelligent digital experiences using artificial intelligence.
                            </p>
                            <Link to="/projects" className="group self-start mt-4 pl-4 pr-1 py-1 border border-white/30 rounded-full text-[9px] font-bold tracking-widest flex items-center gap-3 hover:bg-white hover:text-black transition-all duration-300 text-white">
                                EXPLORE MORE
                                <span className="w-6 h-6 bg-white text-black rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                </span>
                            </Link>
                        </div>
                    </div>

                    {/* Premium Typography Focal Point */}
                    <div className="flex flex-col justify-center flex-1 py-2 lg:py-8 px-4 lg:px-0 lg:-ml-2 animate-fade-in-up" style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
                        <TypewriterEffect />
                        <p className="hidden lg:block mt-8 text-gray-300 font-serif text-lg md:text-xl max-w-[420px] leading-relaxed tracking-wide opacity-90 font-light">
                            Building intelligent digital experiences through modern web development, artificial intelligence, and thoughtful engineering.
                        </p>
                    </div>

                    {/* Bottom Actions Row: CTAs & Social Links */}
                    <div className="flex flex-col lg:flex-row items-center justify-start w-full gap-4 lg:gap-6 lg:-ml-2 pb-6">

                        <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up w-full sm:w-auto" style={{ animationDelay: '0.25s', animationFillMode: 'both' }}>
                            <Link to="/projects" className="w-full sm:w-auto justify-center px-6 py-3 bg-[#ccff00] text-black font-bold tracking-wider rounded-full text-xs flex items-center gap-2 hover:bg-[#b3e600] transition-colors shadow-[0_0_20px_rgba(204,255,0,0.3)]">
                                VIEW MY WORK
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                            </Link>

                            <a href="/resume.pdf" target="_blank" className="w-full sm:w-auto justify-center px-6 py-3 border border-white/30 text-white font-medium tracking-wider rounded-full text-xs flex items-center gap-2 hover:bg-white hover:text-black transition-colors backdrop-blur-sm bg-white/5">
                                DOWNLOAD RESUME
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
                            </a>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-3 lg:ml-auto lg:mr-12 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both', transform: 'translateY(-100px)' }}>
                            <a href="https://github.com/" target="_blank" rel="noreferrer" className="w-11 h-11 rounded-full bg-white/10 border border-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center transition-all shadow-sm">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                            </a>
                            <a href="https://linkedin.com/" target="_blank" rel="noreferrer" className="w-11 h-11 rounded-full bg-white/10 border border-white/20 hover:bg-[#0077b5] text-white hover:text-white flex items-center justify-center transition-all shadow-sm">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                </svg>
                            </a>
                            <a href="mailto:example@email.com" className="w-11 h-11 rounded-full bg-white/10 border border-white/20 hover:bg-[#EA4335] text-white hover:text-white flex items-center justify-center transition-all shadow-sm">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-9.458l4.623 3.746zm-4.141-5.929h19.035l-9.517 7.713-9.518-7.713zm5.694 7.188l3.824 3.099 3.83-3.104 5.612 6.817h-18.779l5.513-6.812zm9.208-1.264l4.616-3.741v9.348l-4.616-5.607z" />
                                </svg>
                            </a>
                            <a href="https://twitter.com/" target="_blank" rel="noreferrer" className="w-11 h-11 rounded-full bg-white/10 border border-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center transition-all shadow-sm">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                        </div>
                    </div>




                </div>

                {/* ═══════════════════════════════════════════════════════════════ */}
                {/* RIGHT IMAGE — Custom Responsive SVG Organic Shape             */}
                {/* ═══════════════════════════════════════════════════════════════ */}
                <div className="hidden lg:block absolute top-4 right-4 bottom-4 w-[51%] z-0 drop-shadow-xl">

                    {/* The dynamically generated organic clip-path image component */}
                    <OrganicImageShape src="/BackgroundPhoto.png" />

                    {/* Contact Us Button (sits inside the horizontal organic top-right concave pocket) */}
                    <button className="absolute top-[10px] right-[12px] px-6 py-[10px] bg-black border-[1.5px] border-white/30 rounded-full flex items-center justify-center text-white text-[10px] font-medium tracking-[0.05em] hover:bg-white hover:text-black hover:border-white transition-all cursor-pointer shadow-xl z-20">
                        Contact Us
                    </button>

                    {/* Top Center Navigation Buttons */}
                    <nav className="absolute top-[12px] left-[30%] lg:left-[40%] -translate-x-1/2 flex items-center gap-4 bg-[#111111]/90 backdrop-blur-md px-8 py-2 rounded-full z-20 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                        {[{ label: 'Home', path: '/' }, { label: 'About', path: '/about' }, { label: 'Projects', path: '/projects' }, { label: 'Resources', path: '/resources' }].map((item) => (
                            <Link key={item.label} to={item.path} className="px-6 py-2 rounded-full text-white/80 hover:text-white text-xs font-semibold tracking-widest transition-all">
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Mobile image fallback has been moved to the top */}

            </div>
        </section>
    );
};
