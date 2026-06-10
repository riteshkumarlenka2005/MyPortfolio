import React from 'react';

// Organized into 6 categories, matching the 6-column layout request
const SKILL_CATEGORIES = [
    {
        name: "FRONTEND",
        colorClass: "bg-[#00e5ff] text-black",
        borderClass: "border-[#00e5ff]",
        shadowClass: "shadow-[0_0_15px_rgba(0,229,255,0.15)]",
        skills: [
            { name: "React.js", logo: "⚛️" },
            { name: "Next.js", logo: "N" },
            { name: "TypeScript", logo: "TS" },
            { name: "JavaScript", logo: "JS" },
            { name: "Tailwind", logo: "🌊" },
            { name: "HTML5", logo: "5" },
            { name: "CSS3", logo: "#" },
            { name: "Responsive", logo: "📱" },
        ]
    },
    {
        name: "BACKEND",
        colorClass: "bg-[#00ff88] text-black",
        borderClass: "border-[#00ff88]",
        shadowClass: "shadow-[0_0_15px_rgba(0,255,136,0.15)]",
        skills: [
            { name: "Node.js", logo: "⬢" },
            { name: "Express", logo: "EX" },
            { name: "Python", logo: "🐍" },
            { name: "Flask", logo: "🌶️" },
            { name: "REST API", logo: "🔗" },
            { name: "Auth", logo: "🔐" },
        ]
    },
    {
        name: "DATABASES",
        colorClass: "bg-[#3388ff] text-black",
        borderClass: "border-[#3388ff]",
        shadowClass: "shadow-[0_0_15px_rgba(51,136,255,0.15)]",
        skills: [
            { name: "MongoDB", logo: "🍃" },
            { name: "PostgreSQL", logo: "🐘" },
            { name: "Supabase", logo: "⚡" },
            { name: "Firebase", logo: "🔥" },
            { name: "DB Design", logo: "📐" },
        ]
    },
    {
        name: "AI & DATA",
        colorClass: "bg-[#b055ff] text-white",
        borderClass: "border-[#b055ff]",
        shadowClass: "shadow-[0_0_15px_rgba(176,85,255,0.15)]",
        skills: [
            { name: "Machine L.", logo: "🧠" },
            { name: "NumPy", logo: "🔢" },
            { name: "Pandas", logo: "🐼" },
            { name: "Scikit", logo: "🔬" },
            { name: "Data Anl.", logo: "📊" },
            { name: "Deep L.", logo: "🕸️" },
        ]
    },
    {
        name: "DEV TOOLS",
        colorClass: "bg-[#ff9900] text-black",
        borderClass: "border-[#ff9900]",
        shadowClass: "shadow-[0_0_15px_rgba(255,153,0,0.15)]",
        skills: [
            { name: "Docker", logo: "🐳" },
            { name: "AWS", logo: "☁️" },
            { name: "Vercel", logo: "▲" },
            { name: "Git", logo: "🐙" },
            { name: "Postman", logo: "📮" },
            { name: "Linux", logo: "🐧" },
        ]
    },
    {
        name: "CORE CS",
        colorClass: "bg-[#ff4466] text-white",
        borderClass: "border-[#ff4466]",
        shadowClass: "shadow-[0_0_15px_rgba(255,68,102,0.15)]",
        skills: [
            { name: "Algorithms", logo: "⚙️" },
            { name: "Data Struct", logo: "🗂️" },
            { name: "OOP", logo: "🧱" },
            { name: "OS Basics", logo: "💻" },
            { name: "Networks", logo: "🌐" },
            { name: "DBMS", logo: "💾" },
        ]
    }
];

export const TechArsenalGrid: React.FC = () => {
    return (
        <section
            id="tech-arsenal-grid"
            className="relative w-full bg-parchment-100 dark:bg-antique-50 py-20 px-4 md:px-8 flex flex-col items-center min-h-screen font-sans"
        >
            {/* Background glowing effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-amber-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-amber-800/10 rounded-full blur-[120px]" />
            </div>

            {/* Title */}
            <div className="text-center z-10 mb-16 md:mb-24">
                <div className="flex items-center justify-center gap-3">
                    <span className="text-amber-700 dark:text-amber-500 text-2xl md:text-3xl">✨</span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight text-parchment-900 dark:text-antique-900 uppercase">
                        64+ TOOLS YOU SHOULD TRY <br className="hidden md:block" />
                        <span className="text-parchment-900 dark:text-antique-900 mt-1 block">IN 2026</span>
                    </h2>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mt-2 tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 dark:from-amber-500 dark:via-amber-400 dark:to-amber-500">
                    MY TECH ARSENAL
                </h2>
            </div>

            {/* Grid Container: 2 cols on mobile, 6 on desktop */}
            <div className="w-full max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-6 gap-x-4 sm:gap-x-6 gap-y-16 z-10">
                {SKILL_CATEGORIES.map((category) => (
                    <div key={category.name} className="flex flex-col items-center w-full relative pt-4">
                        
                        {/* Overlapping Header Pill */}
                        <div 
                            className={`absolute top-0 px-4 sm:px-6 py-1.5 rounded-full font-bold text-[10px] sm:text-xs md:text-sm tracking-widest uppercase z-10 ${category.colorClass}`}
                            style={{ transform: 'translateY(-50%)' }}
                        >
                            {category.name}
                        </div>

                        {/* List Border Container */}
                        <div className={`w-full h-full rounded-[24px] border border-opacity-70 bg-parchment-200/30 dark:bg-antique-100/30 backdrop-blur-sm pb-6 pt-10 px-3 sm:px-4 flex flex-col gap-3 sm:gap-4 hover-extreme-scale cursor-default ${category.borderClass} ${category.shadowClass}`}>
                            {category.skills.map((skill) => (
                                <div key={skill.name} className="flex items-center gap-2 sm:gap-3 group">
                                    {/* Icon Box */}
                                    <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full shrink-0 flex items-center justify-center bg-parchment-400/10 dark:bg-antique-200/10 border border-parchment-400/20 dark:border-antique-200/10 text-[11px] sm:text-sm group-hover:bg-amber-700/15 transition-colors">
                                        {skill.logo}
                                    </div>
                                    {/* Skill Name */}
                                    <span className="text-parchment-900 dark:text-antique-800 font-semibold text-[10px] sm:text-xs md:text-[13px] whitespace-nowrap overflow-hidden text-ellipsis group-hover:opacity-100 transition-opacity tracking-wide">
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
