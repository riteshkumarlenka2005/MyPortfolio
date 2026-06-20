import React from 'react';



const SKILL_CATEGORIES = [
    {
        label: "Languages",
        skills: [
            { name: "C", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg" },
            { name: "Java", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg" },
            { name: "Python", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
            { name: "JavaScript", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" },
        ]
    },

    {
        label: "AI & Machine Learning",
        skills: [
            { name: "TensorFlow", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tensorflow/tensorflow-original.svg" },
            { name: "NumPy", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/numpy/numpy-original.svg" },
            { name: "Pandas", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pandas/pandas-original.svg" },
            { name: "Scikit Learn", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/scikitlearn/scikitlearn-original.svg" },
        ]
    },

    {
        label: "Web Development",
        skills: [
            { name: "Node.js", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" },
            { name: "React.JS", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" },
            { name: "Next.JS", src: "https://cdn.simpleicons.org/nextdotjs/white" },
            { name: "Flask", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flask/flask-original.svg", invert: true },
        ]
    },

    {
        label: "Backend & Database",
        skills: [
            { name: "MySQL", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg" },
            { name: "Supabase", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg" },
            { name: "Firebase", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-plain.svg" },
            { name: "FastAPI", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg" },
        ]
    },
    {
        label: "Tools & Platforms",
        skills: [
            { name: "GitHub", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg", invert: true },
            { name: "Vercel", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg", invert: true },
            { name: "Railway", src: "https://cdn.simpleicons.org/railway/white" },
            { name: "Canva", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/canva/canva-original.svg" },
        ]
    },
];

export const SkillsSection: React.FC = () => {
    return (
        <section
            id="skills-section"
            className="relative w-full bg-transparent py-16 px-4 sm:px-6 md:px-12 flex flex-col items-center font-sans overflow-hidden"
        >
            {/* Title */}
            <div className="text-center pb-12 z-20">
                <h2 className="text-6xl md:text-8xl font-black tracking-widest uppercase text-white/90 drop-shadow-2xl">
                    TECH STACK
                </h2>
            </div>

            {/* Columns Layout */}
            <div className="relative z-20 w-full max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-4">
                {SKILL_CATEGORIES.map((category) => (
                    <div key={category.label} className="flex flex-col items-center">
                        {/* Category Label */}
                        <h3 className="text-xs md:text-sm font-bold tracking-widest uppercase text-white/50 mb-6 text-center">
                            {category.label}
                        </h3>
                        <div className="h-px w-full bg-white/10 mb-6" />

                        {/* Skills stacked vertically */}
                        <div className="flex flex-col gap-5 items-center w-full">
                            {category.skills.map((skill, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 group cursor-pointer w-full justify-center"
                                >
                                    <div className="w-8 h-8 md:w-9 md:h-9 flex-shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
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
                                    <span className="text-stone-400 font-semibold text-xs md:text-sm tracking-wide whitespace-nowrap">
                                        {skill.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

        </section>
    );
};
