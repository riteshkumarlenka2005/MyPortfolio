import React, { useEffect, useRef, useState } from 'react';
import { AnimatedHeading } from './AnimatedHeading';

const SKILL_CATEGORIES = [
    {
        label: "Languages",
        skills: [
            { name: "C", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg" },
            { name: "Java", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg" },
            { name: "Python", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
            { name: "JavaScript", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" },
        ],
    },
    {
        label: "AI & Machine Learning",
        skills: [
            { name: "TensorFlow", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tensorflow/tensorflow-original.svg" },
            { name: "NumPy", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/numpy/numpy-original.svg" },
            { name: "Pandas", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pandas/pandas-original.svg" },
            { name: "Scikit Learn", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/scikitlearn/scikitlearn-original.svg" },
        ],
    },
    {
        label: "Web Development",
        skills: [
            { name: "Node.js", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" },
            { name: "React.JS", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" },
            { name: "Next.JS", src: "https://cdn.simpleicons.org/nextdotjs/white" },
            { name: "Flask", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flask/flask-original.svg", invert: true },
        ],
    },
    {
        label: "Backend & Database",
        skills: [
            { name: "MySQL", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg" },
            { name: "Supabase", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg" },
            { name: "Firebase", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-plain.svg" },
            { name: "FastAPI", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg" },
        ],
    },
    {
        label: "Tools & Platforms",
        skills: [
            { name: "GitHub", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg", invert: true },
            { name: "Vercel", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg", invert: true },
            { name: "Railway", src: "https://cdn.simpleicons.org/railway/white" },
            { name: "Canva", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/canva/canva-original.svg" },
        ],
    },
];

// Tiny hook: toggles visible every time the ref element enters/leaves the viewport
function useInView(rootMargin = '0px 0px -80px 0px') {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([entry]) => {
                // Re-animate every time — set true on enter, false on leave
                setVisible(entry.isIntersecting);
            },
            { threshold: 0.1, rootMargin }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [rootMargin]);
    return { ref, visible };
}

export const SkillsSection: React.FC = () => {
    const { ref: gridRef, visible } = useInView('0px 0px -60px 0px');

    return (
        <section
            id="skills-section"
            className="relative w-full bg-transparent py-24 px-4 sm:px-6 md:px-12 flex flex-col items-center font-sans overflow-hidden"
        >


            {/* Heading */}
            <div className="text-center pb-4 z-20">
                <AnimatedHeading text="TECH STACK" />
                <p
                    className="mt-5 text-xs tracking-[0.3em] uppercase text-white/30 font-light"
                >
                </p>
            </div>

            {/* Grid — observed by IntersectionObserver */}
            <div
                ref={gridRef}
                className="relative z-20 w-full max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 lg:gap-6 mt-12"
            >
                {SKILL_CATEGORIES.map((category, colIdx) => {
                    // Each column has its own stagger delay
                    const colDelay = colIdx * 75;

                    return (
                        <div
                            key={category.label}
                            className="flex flex-col items-center"
                            style={{
                                opacity: visible ? 1 : 0,
                                transform: visible ? 'translateY(0px)' : 'translateY(50px)',
                                transition: `opacity 0.5s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1)`,
                                transitionDelay: `${colDelay}ms`,
                            }}
                        >
                            {/* Category label */}
                            <h3
                                className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-5 text-center"
                                style={{
                                    opacity: visible ? 1 : 0,
                                    transform: visible ? 'translateY(0)' : 'translateY(10px)',
                                    transition: 'opacity 0.35s ease, transform 0.35s ease',
                                    transitionDelay: `${colDelay + 50}ms`,
                                }}
                            >
                                {category.label}
                            </h3>

                            {/* Scan-line divider */}
                            <div
                                className="h-px w-full mb-7"
                                style={{
                                    background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)',
                                    transform: visible ? 'scaleX(1)' : 'scaleX(0)',
                                    transformOrigin: 'left center',
                                    transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)',
                                    transitionDelay: `${colDelay + 100}ms`,
                                }}
                            />

                            {/* Skills */}
                            <div className="flex flex-col gap-5 items-center w-full">
                                {category.skills.map((skill, skillIdx) => {
                                    const skillDelay = colDelay + 140 + skillIdx * 50;
                                    return (
                                        <div
                                            key={skillIdx}
                                            className="group flex items-center gap-3 w-full justify-center cursor-default"
                                            style={{
                                                opacity: visible ? 1 : 0,
                                                transform: visible ? 'translateX(0px)' : 'translateX(-18px)',
                                                transition: 'opacity 0.38s ease, transform 0.38s cubic-bezier(0.16,1,0.3,1)',
                                                transitionDelay: `${skillDelay}ms`,
                                            }}
                                        >
                                            {/* Icon */}
                                            <div className="relative w-8 h-8 md:w-9 md:h-9 flex-shrink-0 flex items-center justify-center">
                                                <span className="absolute inset-0 rounded-lg bg-white/0 group-hover:bg-white/6 transition-colors duration-300" />
                                                <img
                                                    src={skill.src}
                                                    alt={skill.name}
                                                    className={`relative w-full h-full object-contain transition-transform duration-300 ease-out group-hover:scale-110 ${skill.invert ? 'invert' : ''}`}
                                                    loading="lazy"
                                                />
                                            </div>

                                            {/* Name */}
                                            <span className="text-white/45 group-hover:text-white/90 font-medium text-xs md:text-sm tracking-wide whitespace-nowrap transition-colors duration-300">
                                                {skill.name}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Bottom accent */}
            <div
                className="mt-20 h-px w-48"
                style={{
                    background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)',
                    opacity: visible ? 1 : 0,
                    transition: 'opacity 1s ease',
                    transitionDelay: '800ms',
                }}
            />
        </section>
    );
};
