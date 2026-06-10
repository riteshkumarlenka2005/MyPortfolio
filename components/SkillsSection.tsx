import React from 'react';

// Brain Icon SVG definition for Machine Learning since it lacks a singular official brand logo
const BrainIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-white/90">
        <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
        <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
        <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
        <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/>
        <path d="M6.002 6.5A3 3 0 0 1 5.603 5.125"/>
    </svg>
);

const ALL_SKILLS = [
    { name: "JavaScript", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" },
    { name: "Node.js", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" },
    { name: "Express.js", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg", invert: true },
    { name: "TypeScript", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" },
    { name: "Java", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg" },
    { name: "C", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg" },
    { name: "Docker", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" },
    { name: "PostgreSQL", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" },
    { name: "Python", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
    { name: "HTML", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" },
    { name: "CSS", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" },
    { name: "Tailwind CSS", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
    { name: "Next.JS", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg", invert: true },
    { name: "React.JS", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" },
    { name: "Vercel", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg", invert: true },
    { name: "Flask", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flask/flask-original.svg", invert: true },
    { name: "Canva", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/canva/canva-original.svg" },
    { name: "Supabase", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg" },
    { name: "Firebase", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-plain.svg" },
    { name: "Railway", src: "https://cdn.simpleicons.org/railway/white" },
    { name: "GitHub", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg", invert: true },
    { name: "Machine learning", customSvg: <BrainIcon /> },
    { name: "numpy", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/numpy/numpy-original.svg" },
    { name: "pandas", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pandas/pandas-original.svg" },
    { name: "scikit learn", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/scikitlearn/scikitlearn-original.svg" },
];

export const SkillsSection: React.FC = () => {
    return (
        <section
            id="skills-section"
            className="relative w-full bg-transparent py-24 px-4 sm:px-6 md:px-12 flex flex-col items-center font-sans overflow-hidden"
        >
            {/* Title - Matching ProjectStackSection style */}
            <div className="text-center pt-8 md:pt-12 pb-6 md:pb-8 px-4 z-20">
                <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="h-px w-8 md:w-12 bg-green-500/30 dark:bg-green-400/30" />
                    <span className="font-serif italic text-xs tracking-[0.2em] uppercase text-parchment-600 dark:text-antique-500">
                        The Toolkit
                    </span>
                    <div className="h-px w-8 md:w-12 bg-green-500/30 dark:bg-green-400/30" />
                </div>
                <h2 className="font-display text-2xl md:text-4xl font-semibold tracking-wide mb-2 text-parchment-900 dark:text-antique-900">
                    My Skills
                </h2>
            </div>

            {/* Grid Container */}
            <div className="relative z-20 w-full max-w-[1000px] mx-auto">
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-y-10 gap-x-2 sm:gap-x-4 justify-center">
                    {ALL_SKILLS.map((skill, index) => (
                        <div 
                            key={index} 
                            className="flex flex-col items-center group cursor-pointer"
                        >
                            {/* Transparent Circular Icon Wrapper - Scaled Down */}
                            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1 drop-shadow-md">
                                {skill.customSvg ? (
                                    skill.customSvg
                                ) : (
                                    <img 
                                        src={skill.src} 
                                        alt={skill.name} 
                                        className={`w-full h-full object-contain ${skill.invert ? 'filter invert brightness-0' : ''}`}
                                        loading="lazy"
                                    />
                                )}
                            </div>
                            
                            {/* Skill Name Label */}
                            <span className="mt-3 md:mt-4 text-stone-400 dark:text-stone-300 font-bold text-[10px] sm:text-[11px] md:text-xs text-center tracking-wide transition-opacity drop-shadow-sm pb-1">
                                {skill.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            
        </section>
    );
};
