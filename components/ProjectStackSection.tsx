import React from "react";
import { useNavigate } from "react-router-dom";

interface StackProject {
  id: number;
  title: string;
  era: string;
  context: string;
  tags: string[];
  image: string;
  liveUrl?: string;
  sourceUrl?: string;
}

const PROJECTS: StackProject[] = [
  {
    id: 1,
    title: "Data Science Club Website",
    era: "Web Development",
    context: "Centralized digital platform for GIET University's Data Science community — showcasing projects, events, and learning resources.",
    tags: ["HTML/CSS/JS", "UI/UX"],
    image: "/DataScience.png",
    liveUrl: "https://www.gietdsclub.me/",
    sourceUrl: "https://github.com/riteshkumarlenka2005/DS_ClubOfficial",
  },
  {
    id: 2,
    title: "Room Finder Platform",
    era: "Full Stack",
    context: "Platform connecting tenants and landlords with intelligent matching, real-time listings, and secure communication.",
    tags: ["Full Stack"],
    image: "/RoomFinder.png",
    liveUrl: "https://room-finder-kappa.vercel.app/",
    sourceUrl: "https://github.com/riteshkumarlenka2005/RoomFinder",
  },
  {
    id: 3,
    title: "CyberGuardian AI",
    era: "Adversarial AI",
    context: "AI simulating scammer behavior for cybersecurity awareness training, using adversarial techniques to educate users.",
    tags: ["Cybersecurity", "Psychology"],
    image: "/CyberGuardianAI.png",
    liveUrl: "https://www.cyberguardianai.tech/",
    sourceUrl: "https://github.com/riteshkumarlenka2005/CyberGuardianAI",
  },
  {
    id: 4,
    title: "Interview Prep Platform",
    era: "Multimodal AI",
    context: "AI analyzing interview performance through computer vision, speech analysis, and natural language processing.",
    tags: ["Computer Vision", "Speech"],
    image: "/Interview.png",
    liveUrl: "https://www.vivasense.app/",
    sourceUrl: "https://github.com/riteshkumarlenka2005/Holistic-Interview-Intelligence",
  },
  {
    id: 5,
    title: "CareerSoulmate",
    era: "Decision Intelligence",
    context: "AI-powered career comparison engine helping students find ideal career paths through multi-dimensional analysis.",
    tags: ["AI", "Education"],
    image: "/CareerSoulmate.png",
    liveUrl: "https://career-soulmate-client.vercel.app/",
    sourceUrl: "https://github.com/riteshkumarlenka2005/CareerSoulmate",
  },
  {
    id: 6,
    title: "TaskManager",
    era: "Productivity & Cloud",
    context: "A modern, all-in-one productivity platform combining smart task management, note-taking, and secure cloud synchronization.",
    tags: ["Java", "React", "Cloud Sync"],
    image: "/TaskManager.png",
    liveUrl: "https://task-manager-java.vercel.app/",
    sourceUrl: "https://github.com/riteshkumarlenka2005/TaskManager-JAVA-",
  }
];

interface ProjectStackSectionProps {
  onStateChange?: (active: boolean) => void;
}

const AnimatedProjectCard = ({ project, navigate, index }: { project: StackProject, navigate: any, index: number }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const cardRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let ticking = false;

    const updatePosition = () => {
      if (!containerRef.current || !cardRef.current) return;
      
      // Use the untransformed container to track scroll. 
      // This permanently fixes ANY vibration/feedback loops.
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const triggerPoint = windowHeight - 50; 
      const revealDistance = windowHeight * 0.7; 
      
      const rawProgress = (triggerPoint - rect.top) / revealDistance;
      const progress = Math.max(0, Math.min(1, rawProgress));

      const opacity = progress;
      const translateY = 150 * (1 - progress); 
      const scale = 0.95 + (0.05 * progress);

      cardRef.current.style.opacity = opacity.toFixed(3);
      cardRef.current.style.transform = `translateY(${translateY.toFixed(2)}px) scale(${scale.toFixed(3)})`;
      
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updatePosition);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updatePosition(); // Initial calculation

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const getGlowStyles = (idx: number) => {
    switch (idx % 3) {
      case 0:
        return "from-orange-500 via-amber-500 to-yellow-500";
      case 1:
        return "from-purple-600 via-fuchsia-500 to-pink-500";
      case 2:
        return "from-cyan-400 via-teal-400 to-emerald-400";
      default:
        return "";
    }
  };

  const glowGradient = getGlowStyles(index);

  return (
    <div ref={containerRef} className="h-full">
      <div
        ref={cardRef}
        style={{
          opacity: 0,
          transform: 'translateY(150px) scale(0.95)',
          willChange: 'opacity, transform',
        }}
        onClick={() => navigate(`/project/${project.id}`)}
        className="group relative rounded-2xl h-full cursor-pointer p-[2px]"
      >
        {/* Animated Edge Glow Background */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${glowGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        
        {/* Ambient Blur Glow (Tightened) */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${glowGradient} opacity-0 group-hover:opacity-60 blur-lg transition-opacity duration-500`} />

        {/* Inner Card Content */}
        <div className="relative flex flex-col bg-white dark:bg-[#0a0a0a] rounded-[14px] overflow-hidden z-10 h-full border border-parchment-400/20 dark:border-white/5 group-hover:border-transparent transition-colors duration-500">
        
        {/* ─── IMAGE SECTION ─── */}
        <div className="relative w-full h-[200px] sm:h-[220px] shrink-0 overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white dark:from-[#0a0a0a] via-white/50 dark:via-[#0a0a0a]/50 to-transparent" />
          
          {/* Era badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg border border-white/5">
            <div className="w-1.5 h-1.5 border border-green-500 rotate-45" />
            <span className="font-serif text-[10px] md:text-xs font-medium text-white/90 uppercase tracking-widest">{project.era}</span>
          </div>
        </div>

        {/* ─── CONTENT SECTION ─── */}
        <div className="flex flex-col flex-1 p-6 sm:p-8 bg-white dark:bg-[#0a0a0a] text-parchment-900 dark:text-antique-800 relative z-10">
          <h2 className="font-display text-xl sm:text-2xl font-bold tracking-wide leading-tight mb-3 text-parchment-900 dark:text-white line-clamp-2">
            {project.title}
          </h2>

          <p className="font-serif text-sm sm:text-base opacity-100 leading-relaxed mb-6 flex-1 text-parchment-800 dark:text-antique-500">
            {project.context}
          </p>

          <div className="flex gap-2 flex-wrap mb-6">
            {project.tags.map(tag => (
              <span
                key={tag}
                className="font-serif text-xs md:text-sm font-semibold border border-green-500/30 dark:border-green-400/30 bg-green-500/10 dark:bg-green-400/10 text-green-700 dark:text-green-400 px-3 py-1 rounded-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Links row */}
          <div className="flex items-center gap-6 pt-5 border-t border-parchment-400/20 dark:border-white/10 mt-auto">
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors drop-shadow-sm transition-all"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" /><path strokeLinecap="round" strokeLinejoin="round" d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                <span className="font-serif text-xs sm:text-sm font-bold uppercase tracking-wider">Live Demo</span>
              </a>
            ) : (
              <span className="flex items-center gap-2 text-parchment-900/40 dark:text-antique-500/40 cursor-not-allowed">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" /><path strokeLinecap="round" strokeLinejoin="round" d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                <span className="font-serif text-xs sm:text-sm font-bold uppercase tracking-wider">Live Demo</span>
              </span>
            )}

            {project.sourceUrl ? (
              <a
                href={project.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors drop-shadow-sm transition-all"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                <span className="font-serif text-xs sm:text-sm font-bold uppercase tracking-wider">Source</span>
              </a>
            ) : (
              <span className="flex items-center gap-2 text-parchment-900/40 dark:text-antique-500/40 cursor-not-allowed">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                <span className="font-serif text-xs sm:text-sm font-bold uppercase tracking-wider">Source</span>
              </span>
            )}

            {/* Explore arrow */}
            <span className="ml-auto flex items-center gap-1.5 text-green-700 dark:text-green-400">
              <span className="font-serif text-xs sm:text-sm font-bold uppercase tracking-widest">Explore</span>
              <span className="transform group-hover:translate-x-1.5 transition-transform duration-300">→</span>
            </span>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProjectStackSection: React.FC<ProjectStackSectionProps> = ({ onStateChange }) => {
  const navigate = useNavigate();

  return (
    <section
      className="relative bg-parchment-200/30 dark:bg-antique-100/30 text-parchment-900 dark:text-antique-800 overflow-hidden py-24 px-4 md:px-12"
    >
      {/* Section Header */}
      <div className="text-center pb-16">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-8 md:w-12 bg-green-500/30 dark:bg-green-400/30" />
          <span className="font-serif italic text-xs tracking-[0.2em] uppercase text-parchment-600 dark:text-antique-500">
            Archive
          </span>
          <div className="h-px w-8 md:w-12 bg-green-500/30 dark:bg-green-400/30" />
        </div>
        <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-wide mb-4 text-parchment-900 dark:text-antique-900">
          Projects
        </h2>
        <p className="font-serif text-sm md:text-base max-w-md mx-auto text-parchment-800 dark:text-antique-600">
          A showcase of my recent work, designed to solve problems through engineering and artificial intelligence.
        </p>
      </div>      {/* Grid Layout: 1 column on mobile, 2 columns on tablet, 3 columns on desktop */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PROJECTS.map((project, index) => (
          <AnimatedProjectCard key={project.id} project={project} navigate={navigate} index={index} />
        ))}
      </div>
    </section>
  );
};
