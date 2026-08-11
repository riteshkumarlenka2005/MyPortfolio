import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { AnimatedHeading } from "./AnimatedHeading";

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

export const AchievementsSection: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div id="achievements-section" className="relative bg-black pb-24" style={{
            backgroundImage: `repeating-linear-gradient(135deg, #000000 0px, #000000 150px, rgba(255,255,255,0.06) 150px, rgba(255,255,255,0) 180px)`
        }}>
            {/* Heading */}
            <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-12 pt-24 pb-12 text-center">
                <AnimatedHeading text="Milestones That Define My Journey" />
            </div>

            {/* Grid */}
            <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto px-4 sm:px-6">
                {CARDS.map((card, i) => (
                    <div
                        key={i}
                        className="relative shadow-xl rounded-[24px] flex flex-col overflow-hidden p-[1.5px] w-[200px] h-[262px] mx-auto"
                    >
                        {/* The spinning gradient background */}
                        <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite]"
                             style={{
                                 background: 'conic-gradient(from 0deg, #ff007f, #7a00ff, #00f0ff, #00ffaa, #ffaa00, #ff007f)'
                             }}
                        />
                        
                        {/* Inner Card Container */}
                        <div 
                            className={`relative z-10 bg-black flex-1 w-full rounded-[21px] flex flex-col overflow-hidden group ${card.link ? 'cursor-pointer' : ''}`}
                            onClick={() => card.link && navigate(card.link)}
                        >
                            {/* Visual Indicator for Links */}
                            {card.link && (
                                <div className="absolute top-2.5 right-2.5 text-white/70 group-hover:text-white transition-colors z-20">
                                    <ArrowUpRight size={22} strokeWidth={2.5} />
                                </div>
                            )}

                            <div className="flex-1 flex flex-col items-center justify-center gap-1.5 px-4 pt-5">
                                <span className="text-3xl md:text-[2.6rem] font-black text-white leading-none tracking-tight">
                                    {card.bigText}
                                </span>
                                {card.unit && (
                                    <span className="text-[9px] md:text-[10px] tracking-[0.22em] text-white/35 uppercase">
                                        {card.unit}
                                    </span>
                                )}
                            </div>
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
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none z-10">
                                    <span className="text-white font-bold tracking-widest uppercase text-sm border border-white/20 px-6 py-2 rounded-full bg-white/5 transition-colors">
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
