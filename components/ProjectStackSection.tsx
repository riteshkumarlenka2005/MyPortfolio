import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatedHeading } from "./AnimatedHeading";

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

const AnimatedProjectCard = ({ project, index, setCursorHover }: { project: StackProject, index: number, setCursorHover: (v: boolean) => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    let ticking = false;

    const updatePosition = () => {
      if (!containerRef.current || !cardRef.current) return;
      
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
    updatePosition(); 

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="[perspective:1500px] cursor-none [&_*]:cursor-none" 
      onMouseEnter={() => setCursorHover(true)}
      onMouseLeave={() => { setIsFlipped(false); setCursorHover(false); }}
    >
      <div
        ref={cardRef}
        style={{
          opacity: 0,
          transform: 'translateY(150px) scale(0.95)',
          willChange: 'opacity, transform',
        }}
        className="group relative flex flex-col gap-5 w-full"
      >
        {/* Inner Card Flipper */}
        <div className="relative w-full h-[280px] sm:h-[340px] rounded-none z-10 [transform-style:preserve-3d] transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]" style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
          
          {/* FRONT FACE */}
          <div className={`absolute inset-0 w-full h-full rounded-none overflow-hidden bg-[#0a0a0a] [backface-visibility:hidden] ${isFlipped ? 'pointer-events-none' : ''}`}>
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Dark Overlay on Hover */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4 backdrop-blur-sm z-20">
              <a 
                href={project.liveUrl || project.sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="relative z-30 px-8 py-3 bg-white text-black font-bold text-sm tracking-widest uppercase rounded-full hover:scale-105 transition-transform"
              >
                VIEW
              </a>
              <button 
                onClick={(e) => { e.stopPropagation(); setIsFlipped(true); }} 
                className="relative z-30 px-8 py-3 bg-transparent border-2 border-white text-white font-bold text-sm tracking-widest uppercase rounded-full hover:bg-white hover:text-black transition-colors"
              >
                READ
              </button>
            </div>

          </div>

          {/* BACK FACE */}
          <div className={`absolute inset-0 w-full h-full rounded-none bg-[#0a0a0a] border border-white/10 flex flex-col items-center justify-center p-6 text-center [backface-visibility:hidden] ${!isFlipped ? 'pointer-events-none' : ''}`} style={{ transform: 'rotateY(180deg)' }}>
            <h3 className="text-2xl font-bold text-white mb-4 tracking-wide">{project.title}</h3>
            <p className="text-sm text-gray-300 mb-6 leading-relaxed line-clamp-4">
              {project.context}
            </p>
            <div className="flex gap-2 flex-wrap justify-center mb-6">
              {project.tags.map(tag => (
                <span
                  key={tag}
                  className="font-serif text-xs md:text-sm font-semibold border border-green-500/30 bg-green-500/10 text-green-400 px-3 py-1 rounded-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            {project.sourceUrl && (
              <a
                href={project.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="mt-auto relative z-30 inline-flex items-center justify-center px-6 py-2.5 bg-white/5 border border-white/10 text-white rounded-lg font-serif text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-white/10 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                GitHub Repo
              </a>
            )}
            
            {/* Close Button on back */}
            <button 
              onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }} 
              className="absolute top-3 right-3 text-white/50 hover:text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors z-30"
            >
              ✕
            </button>
          </div>

        </div>
        
        {/* Project Title Below Card */}
        <h3 className="text-xl md:text-2xl font-bold text-white text-center font-display tracking-wide uppercase transition-colors group-hover:text-white/80">
          {project.title}
        </h3>

      </div>
    </div>
  );
};

export const ProjectStackSection: React.FC<ProjectStackSectionProps> = ({ onStateChange }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHoveringCard, setIsHoveringCard] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX - 48}px, ${e.clientY - 48}px, 0)`;
      }
    };

    const handleScroll = () => {
      if (!isHoveringCard) return; // Only check if currently visible
      
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const { x, y } = mousePos.current;
        // If mouse is outside the section boundaries after scrolling, hide the cursor
        if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
          setIsHoveringCard(false);
        }
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isHoveringCard]);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative bg-[#000000] text-white overflow-hidden pt-8 pb-24 px-4 md:px-12"
        onMouseLeave={() => setIsHoveringCard(false)}
      >
        {/* Section Header */}
        <div className="text-center pb-16">
          <AnimatedHeading text="PROJECTS" className="mb-8" />
        </div>

        {/* Grid Layout: 1 column on mobile, 2 columns on tablet, 3 columns on desktop */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROJECTS.map((project, index) => (
            <AnimatedProjectCard key={project.id} project={project} index={index} setCursorHover={setIsHoveringCard} />
          ))}
        </div>
      </section>

      {/* Render the custom cursor at the document root using a Portal to prevent hit-testing interference */}
      {typeof document !== 'undefined' && createPortal(
        <div 
          ref={cursorRef}
          className={`hidden md:block fixed top-0 left-0 w-[96px] h-[96px] rounded-full pointer-events-none z-[999999] transition-opacity duration-300 ${isHoveringCard ? 'opacity-100' : 'opacity-0'}`}
          style={{
            backdropFilter: 'brightness(1.1) contrast(1.1) saturate(1.1)',
            WebkitBackdropFilter: 'brightness(1.1) contrast(1.1) saturate(1.1)',
            background: 'rgba(255,255,255,0.01)',
            boxShadow: 'inset 0 0 15px rgba(255,255,255,0.3), inset 0 0 4px rgba(255,255,255,0.8), 0 15px 30px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.5)',
            willChange: 'transform'
          }}
        >
          {/* Top-left flare (sharp & intense) */}
          <div className="absolute top-2 left-3 w-16 h-8 bg-gradient-to-br from-white/90 to-transparent rounded-[100%] transform -rotate-[35deg]" />
          {/* Core highlight spot (sharp) */}
          <div className="absolute top-4 left-6 w-4 h-1.5 bg-white rounded-full transform -rotate-[40deg]" />
          {/* Bottom sweeping reflection (sharp) */}
          <div className="absolute bottom-1 right-1 w-20 h-16 border-b-[6px] border-r-[3px] border-white/70 rounded-full" />
        </div>,
        document.body
      )}
    </>
  );
};
