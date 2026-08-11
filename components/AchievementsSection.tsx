import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatedHeading } from "./AnimatedHeading";

gsap.registerPlugin(ScrollTrigger);

// 8 cards: interleaved achievements + stats
const CARDS = [
    { bigText: "9.82",  unit: "CGPA",  title: "University First Rank",    desc: "Rank #1 among 500+ students — 1st year B.Tech" },
    { bigText: "10+",   unit: "",       title: "Personal Projects",        desc: "Built & shipped to production" },
    { bigText: "SIH",   unit: "2025",  title: "Smart India Hackathon",    desc: "National satellite image analysis solution" },
    { bigText: "7+",    unit: "",       title: "Hackathons",               desc: "Competed across national events" },
    { bigText: "PMST",  unit: "",       title: "Merit Scholarship",        desc: "Awarded for outstanding academic performance" },
    { bigText: "5+",    unit: "",       title: "AI Experiments",           desc: "Researched, trained & deployed" },
    { bigText: "12+",   unit: "",       title: "Certificates",             desc: "Professional certifications", link: "/certificates" },
    { bigText: "10K",   unit: "₹ Prize", title: "Science Exhibition",     desc: "Solar Panel Auto-Wiper innovation" },
];

// Card size
const CW = 200;
const CH = 262;
const GAP = 24;

// Final positions: 4x2 grid, offsets from center
// Grid: 4*200 + 3*24 = 872 wide, center=436; 2*262 + 24 = 548 tall, center=274
// Col offsets: -336, -112, 112, 336
// Row offsets: -143, 143
const FINAL_POS = [
    { x: -336, y: -143 }, // row0 col0
    { x: -112, y: -143 }, // row0 col1
    { x:  112, y: -143 }, // row0 col2
    { x:  336, y: -143 }, // row0 col3
    { x: -336, y:  143 }, // row1 col0
    { x: -112, y:  143 }, // row1 col1
    { x:  112, y:  143 }, // row1 col2
    { x:  336, y:  143 }, // row1 col3
];

export const AchievementsSection: React.FC = () => {
    const wrapperRef  = useRef<HTMLDivElement>(null);
    const cardRefs    = useRef<(HTMLDivElement | null)[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (window.innerWidth < 1024) return;
        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
        if (cards.length === 0) return;

        // Stacked deck initial state — front card (i=0) visible, others peek behind
        cards.forEach((card, i) => {
            gsap.set(card, {
                x:        0,
                y:        0,
                rotation: i * 3,
                scale:    1 - i * 0.025,
                opacity:  i === 0 ? 1 : Math.max(0, 0.55 - i * 0.12),
                zIndex:   8 - i,
            });
        });

        // Animate cards to final positions driven by scroll
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger:  wrapper,
                start:    "top top",
                end:      "bottom bottom",
                scrub:    1.2,
            },
        });

        FINAL_POS.forEach((pos, i) => {
            tl.to(cards[i], {
                x:        pos.x,
                y:        pos.y,
                opacity:  1,
                scale:    1,
                rotation: 0,
                ease:     "none",
            }, 0);
        });

        // Fix for initial load layout shifts (Preloaders / Conditional rendering)
        // Refresh GSAP calculations after the DOM has settled and animations finished.
        const timer1 = setTimeout(() => ScrollTrigger.refresh(), 500);
        const timer2 = setTimeout(() => ScrollTrigger.refresh(), 2500); // Matches the 2.2s hero delay
        const timer3 = setTimeout(() => ScrollTrigger.refresh(), 4000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            // Kill only the ScrollTrigger instances related to this component
            tl.kill();
        };
    }, []);

    return (
        <div id="achievements-section" className="relative bg-black" style={{
            backgroundImage: `repeating-linear-gradient(135deg, #000000 0px, #000000 150px, rgba(255,255,255,0.06) 150px, rgba(255,255,255,0) 180px)`
        }}>
            {/* Heading */}
            <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-12 pt-24 pb-4 text-center">
                <AnimatedHeading text="Milestones That Define My Journey" />
            </div>

            {/* ── Desktop: GSAP-pinned stack (locked until cards spread) ── */}
            <div
                ref={wrapperRef}
                className="hidden lg:flex flex-col items-center justify-center min-h-screen overflow-hidden -mt-12"
            >
                {/* Fixed-size grid container — cards are centered inside */}
                <div
                    className="relative"
                    style={{ width: `${4 * CW + 3 * GAP}px`, height: `${2 * CH + GAP}px` }}
                >
                        {CARDS.map((card, i) => (
                            <div
                                key={i}
                                ref={(el) => { cardRefs.current[i] = el; }}
                                className="absolute shadow-2xl rounded-[24px] flex flex-col overflow-hidden p-[1.5px] select-none"
                                style={{
                                    width:       `${CW}px`,
                                    height:      `${CH}px`,
                                    left:        "50%",
                                    top:         "50%",
                                    marginLeft:  `-${CW / 2}px`,
                                    marginTop:   `-${CH / 2}px`,
                                }}
                            >
                                {/* The spinning gradient background */}
                                <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite]"
                                     style={{
                                         background: 'conic-gradient(from 0deg, #ff007f, #7a00ff, #00f0ff, #00ffaa, #ffaa00, #ff007f)'
                                     }}
                                />
                                
                                {/* Inner Card Container */}
                                <div className="relative z-10 bg-black flex-1 w-full rounded-[21px] flex flex-col overflow-hidden group">
                                    {/* Visual area */}
                                    <div className="flex-1 flex flex-col items-center justify-center gap-1.5 px-4 pt-5">
                                        <span className="text-[2.6rem] font-black text-white leading-none tracking-tight">
                                            {card.bigText}
                                        </span>
                                        {card.unit && (
                                            <span className="text-[10px] tracking-[0.22em] text-white/35 uppercase">
                                                {card.unit}
                                            </span>
                                        )}
                                    </div>
                                    {/* Text area */}
                                    <div className="px-4 pb-4 pt-3 border-t border-white/[0.06]">
                                        <p className="text-[11px] font-semibold text-white mb-1 leading-snug">
                                            {card.title}
                                        </p>
                                        <p className="text-[10px] text-white/40 leading-snug">
                                            {card.desc}
                                        </p>
                                    </div>
                                    {/* Hover overlay for link */}
                                    {card.link && (
                                        <div
                                            onClick={() => navigate(card.link)}
                                            className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer z-20"
                                        >
                                            <span className="text-white font-bold tracking-widest uppercase text-sm border border-white/20 px-6 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                                                Verify
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            {/* ── Mobile: static 2-column grid ── */}
            <div className="lg:hidden grid grid-cols-2 gap-4 max-w-sm mx-auto px-4 pb-16">
                {CARDS.map((card, i) => (
                    <div
                        key={i}
                        className="relative shadow-xl rounded-[20px] flex flex-col overflow-hidden p-[1px]"
                    >
                        {/* The spinning gradient background */}
                        <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite]"
                             style={{
                                 background: 'conic-gradient(from 0deg, #ff007f, #7a00ff, #00f0ff, #00ffaa, #ffaa00, #ff007f)'
                             }}
                        />
                        
                        {/* Inner Card Container */}
                        <div className="relative z-10 bg-black flex-1 w-full rounded-[18px] flex flex-col overflow-hidden group">
                            <div className="flex-1 flex flex-col items-center justify-center gap-1 p-4 py-6">
                                <span className="text-3xl font-black text-white leading-none">
                                    {card.bigText}
                                </span>
                                {card.unit && (
                                    <span className="text-[9px] tracking-widest text-white/35 uppercase">
                                        {card.unit}
                                    </span>
                                )}
                            </div>
                            <div className="px-3 pb-3 pt-2 border-t border-white/[0.06]">
                                <p className="text-[11px] font-semibold text-white">{card.title}</p>
                                <p className="text-[10px] text-white/40 mt-0.5">{card.desc}</p>
                            </div>
                            {/* Hover overlay for link */}
                            {card.link && (
                                <div
                                    onClick={() => navigate(card.link)}
                                    className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer z-20"
                                >
                                    <span className="text-white font-bold tracking-widest uppercase text-[10px] border border-white/20 px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                                        Verify
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
