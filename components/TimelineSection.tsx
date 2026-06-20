import React, { useRef, useEffect, useState } from 'react';

interface Milestone {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  description: string;
  details?: string[];
  achievement?: string;
  isCurrent?: boolean;
  icon: string;
}

const MILESTONES: Milestone[] = [
  {
    id: 'current',
    title: 'Second Year (4th Semester)',
    subtitle: 'Current Stage',
    date: '2026 — Present',
    description: 'Currently in 4th Semester — the final semester of Second Year. Through consistent effort and learning, performance has improved again.',
    details: [
      'Algorithms and problem solving',
      'Full-stack web development',
      'Artificial Intelligence & Data Science',
      'Building impactful projects and developer portfolio',
    ],
    achievement: '📊 Current CGPA — 8.98',
    isCurrent: true,
    icon: '🚀',
  },
  {
    id: 'sem3',
    title: 'Challenges and Growth',
    subtitle: 'Second Year Begins — 3rd Semester',
    date: '2025',
    description: 'Entered Second Year and completed 3rd Semester. This phase came with academic challenges, and CGPA dropped compared to the first year. However, it became an important learning period that strengthened discipline and focus.',
    icon: '⚡',
  },
  {
    id: 'btech1',
    title: 'Beginning of Engineering Journey',
    subtitle: 'First Year Completed',
    date: '2024',
    description: 'Joined B.Tech in Computer Science Engineering. Completed First Year (1st & 2nd Semester) and built strong foundations.',
    achievement: '🏆 First Year CGPA — 9.82',
    icon: '💻',
  },
  {
    id: 'explore',
    title: 'Exploring Academic Direction',
    subtitle: 'The Search for the Right Path',
    date: '2023',
    description: 'After completing +2, initially joined +3 (Undergraduate program) and completed one semester, while exploring the right academic path and future direction. Soon after, the decision was made to pursue a career in Computer Science and Technology.',
    icon: '📚',
  },
  {
    id: 'plus2',
    title: 'Higher Secondary Education (+2)',
    subtitle: 'Exploring Academic Depth',
    date: '2021 — 2023',
    description: 'Completed +2 (Higher Secondary) from Nalanda Vidya Mandir, Berhampur. During this stage, interest in technology, computers, and problem solving began to grow stronger.',
    achievement: '80.1% (481/600)',
    icon: '🎓',
  },
  {
    id: 'tenth',
    title: 'Secondary School (10th Grade)',
    subtitle: 'The Spark of Innovation',
    date: '2019 — 2021',
    description: 'Completed 10th grade from Khallingi High School, Khallingi, Ganjam. This phase strengthened curiosity toward science and technology.',
    details: [
      '82.5% (495/600) in board examination',
      'Built a Solar Panel Wiper project for science exhibition',
      'Project selected for next round — received ₹10,000 award',
    ],
    icon: '🧪',
  },
  {
    id: 'school',
    title: 'Early School Education',
    subtitle: 'The Learning Foundations',
    date: '2010 — 2018',
    description: 'Completed early schooling up to 8th standard, developing strong interest in mathematics, science, creativity, and logical thinking.',
    icon: '🎒',
  },
];

export const TimelineSection: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                setVisibleItems(prev => {
                    const newSet = new Set(prev);
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const index = Number(entry.target.getAttribute('data-index'));
                            newSet.add(index);
                        }
                    });
                    return newSet;
                });
            },
            {
                threshold: 0.2,
                rootMargin: '0px 0px -100px 0px'
            }
        );

        if (containerRef.current) {
            const elements = containerRef.current.querySelectorAll('.timeline-item');
            elements.forEach(el => observer.observe(el));
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section className="relative py-32 px-6 md:px-12 bg-transparent overflow-hidden">
            <div className="max-w-6xl mx-auto relative z-10" ref={containerRef}>
                <div className="text-center mb-24">
                    <h2 className="text-5xl md:text-7xl font-black tracking-widest uppercase text-parchment-900/90 dark:text-white/90 drop-shadow-sm dark:drop-shadow-2xl mb-6">
                        Timeline
                    </h2>
                    <p className="font-serif text-lg md:text-xl text-parchment-600 dark:text-gray-400 max-w-2xl mx-auto">
                        My journey from the beginning, driven by an unshakeable curiosity and passion for technology.
                    </p>
                </div>

                <div className="relative">
                    {/* The Center Line */}
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-parchment-400/50 dark:via-white/20 to-transparent transform md:-translate-x-1/2" />

                    <div className="space-y-16 md:space-y-24">
                        {MILESTONES.map((milestone, index) => {
                            const isVisible = visibleItems.has(index);
                            const isEven = index % 2 === 0;

                            return (
                                <div 
                                    key={milestone.id}
                                    data-index={index}
                                    className={`timeline-item relative flex flex-col md:flex-row items-start md:items-center w-full group
                                        ${isVisible ? 'opacity-100' : 'opacity-0'}
                                        transition-all duration-1000 ease-out
                                    `}
                                    style={{ transitionDelay: `${index * 100}ms` }}
                                >
                                    {/* The Node on the line */}
                                    <div className={`
                                        absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-parchment-100 dark:bg-[#050510] border-2 z-10
                                        transform -translate-x-1/2 mt-6 md:mt-0
                                        transition-all duration-500
                                        ${milestone.isCurrent ? 'border-amber-600 dark:border-green-400 scale-125' : 'border-parchment-400 dark:border-white/30 group-hover:border-amber-600 dark:group-hover:border-green-400 group-hover:scale-110'}
                                    `}>
                                        {milestone.isCurrent && (
                                            <div className="absolute inset-0 rounded-full bg-amber-600 dark:bg-green-400 blur-sm opacity-50 animate-pulse" />
                                        )}
                                    </div>

                                    {/* Content Container */}
                                    <div className={`
                                        ml-12 md:ml-0 w-full md:w-1/2 flex
                                        ${isEven ? 'md:pr-16 md:justify-end' : 'md:pl-16 md:justify-start md:ml-auto'}
                                        ${isVisible 
                                            ? 'translate-x-0' 
                                            : (isEven ? 'md:-translate-x-12 -translate-x-8' : 'md:translate-x-12 -translate-x-8')
                                        }
                                        transition-transform duration-1000 ease-out
                                    `}>
                                        <div className={`
                                            relative p-6 md:p-8 rounded-2xl w-full max-w-xl
                                            backdrop-blur-sm bg-white/40 dark:bg-white/[0.02] border border-parchment-200/50 dark:border-white/5
                                            hover:bg-white/60 dark:hover:bg-white/[0.04] hover:border-parchment-300 dark:hover:border-white/10
                                            transition-all duration-300 shadow-sm dark:shadow-none
                                            ${isEven ? 'md:text-right' : 'md:text-left'}
                                        `}>
                                            <div className={`flex items-center gap-3 mb-4 ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                                                <span className="text-2xl">{milestone.icon}</span>
                                                <span className="text-xs md:text-sm font-sans font-bold tracking-widest uppercase text-amber-700 dark:text-green-400">
                                                    {milestone.date}
                                                </span>
                                            </div>

                                            <h3 className="text-2xl md:text-3xl font-display font-bold text-parchment-900 dark:text-white mb-2">
                                                {milestone.title}
                                            </h3>
                                            
                                            <div className="text-sm font-sans tracking-wider uppercase text-parchment-600 dark:text-gray-400 mb-4">
                                                {milestone.subtitle}
                                            </div>

                                            <p className="text-parchment-700 dark:text-gray-300 font-serif leading-relaxed mb-4 text-sm md:text-base">
                                                {milestone.description}
                                            </p>

                                            {milestone.details && (
                                                <ul className={`space-y-2 mb-4 ${isEven ? 'md:items-end flex flex-col' : ''}`}>
                                                    {milestone.details.map((detail, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-parchment-600 dark:text-gray-400 text-sm">
                                                            {!isEven && <span className="text-amber-600 dark:text-green-500 mt-1">✦</span>}
                                                            <span className={isEven ? 'md:text-right' : ''}>{detail}</span>
                                                            {isEven && <span className="text-amber-600 dark:text-green-500 mt-1">✦</span>}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}

                                            {milestone.achievement && (
                                                <div className={`inline-block px-4 py-2 rounded-lg bg-amber-700/10 dark:bg-green-500/10 border border-amber-700/20 dark:border-green-500/20 text-amber-700 dark:text-green-400 text-sm font-bold mt-2`}>
                                                    {milestone.achievement}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};
