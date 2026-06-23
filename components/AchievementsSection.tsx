import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// 8 cards: interleaved achievements + stats
const CARDS = [
    { bigText: "9.82",  unit: "CGPA",  title: "University First Rank",    desc: "Rank #1 among 500+ students — 1st year B.Tech" },
    { bigText: "10+",   unit: "",       title: "Personal Projects",        desc: "Built & shipped to production" },
    { bigText: "SIH",   unit: "2025",  title: "Smart India Hackathon",    desc: "National satellite image analysis solution" },
    { bigText: "7+",    unit: "",       title: "Hackathons",               desc: "Competed across national events" },
    { bigText: "PMST",  unit: "",       title: "Merit Scholarship",        desc: "Awarded for outstanding academic performance" },
    { bigText: "5+",    unit: "",       title: "AI Experiments",           desc: "Researched, trained & deployed" },
    { bigText: "#1",    unit: "",       title: "University Topper",        desc: "1st Year B.Tech rank holder" },
    { bigText: "10K",   unit: "₹ Prize", title: "Science Exhibition",     desc: "Solar Panel Auto-Wiper innovation" },
];

// Card size
const CW = 192;
const CH = 252;
const GAP = 18;

// Final positions: 4x2 grid, offsets from center
// Grid: 4*192 + 3*18 = 822 wide, center=411; 2*252 + 18 = 522 tall, center=261
// Col offsets: -315, -105, 105, 315
// Row offsets: -135, 135
const FINAL_POS = [
    { x: -315, y: -135 }, // row0 col0
    { x: -105, y: -135 }, // row0 col1
    { x:  105, y: -135 }, // row0 col2
    { x:  315, y: -135 }, // row0 col3
    { x: -315, y:  135 }, // row1 col0
    { x: -105, y:  135 }, // row1 col1
    { x:  105, y:  135 }, // row1 col2
    { x:  315, y:  135 }, // row1 col3
];

export const AchievementsSection: React.FC = () => {
    const wrapperRef  = useRef<HTMLDivElement>(null);
    const cardRefs    = useRef<(HTMLDivElement | null)[]>([]);

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

        return () => {
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, []);

    return (
        <div id="achievements-section">
            {/* Heading */}
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-12 pt-24 pb-10">
                <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-white leading-snug">
                    Milestones That<br />Define My Journey
                </h2>
            </div>

            {/* ── Desktop: GSAP-pinned stack (locked until cards spread) ── */}
            <div
                ref={wrapperRef}
                className="hidden lg:flex flex-col items-center justify-center min-h-screen overflow-hidden"
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
                                className="absolute bg-[#111111] border border-white/[0.08] rounded-2xl flex flex-col overflow-hidden select-none"
                                style={{
                                    width:       `${CW}px`,
                                    height:      `${CH}px`,
                                    left:        "50%",
                                    top:         "50%",
                                    marginLeft:  `-${CW / 2}px`,
                                    marginTop:   `-${CH / 2}px`,
                                }}
                            >
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
                            </div>
                        ))}
                </div>
            </div>

            {/* ── Mobile: static 2-column grid ── */}
            <div className="lg:hidden grid grid-cols-2 gap-3 max-w-sm mx-auto px-4 pb-16">
                {CARDS.map((card, i) => (
                    <div
                        key={i}
                        className="bg-[#111111] border border-white/[0.08] rounded-2xl flex flex-col overflow-hidden"
                    >
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
                    </div>
                ))}
            </div>
        </div>
    );
};
