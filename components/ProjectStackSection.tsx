import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
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
    id: 7,
    title: "Intelligent Sales CRM & AI Copilot",
    era: "Enterprise Architecture",
    context: "Engineered a production-grade Intelligent Sales CRM equipped with a Universal AI Query Engine. Designed an 8-Stage Secure Orchestration Pipeline that allows users to query thousands of database records using plain English while strictly enforcing Role-Based Access Control, entirely preventing AI hallucinations and SQL injection risks.",
    tags: ["Next.js 15", "TypeScript", "PostgreSQL", "Prisma", "Vercel AI SDK"],
    image: "/AI_CRM.jpg",
    liveUrl: "https://ai-sales-crm-seven.vercel.app/dashboard",
    sourceUrl: "https://github.com/riteshkumarlenka2005",
  },
  {
    id: 1,
    title: "Data Science Club Website",
    era: "Web Development",
    context: "Architected and launched the official digital hub for GIET University's Data Science Club, serving a 200+ member community. The platform centralizes event announcements, workshop registrations, student project showcases, and curated AI/ML resources — transforming fragmented club communication into a structured, accessible online ecosystem with measurable impact on engagement.",
    tags: ["HTML", "CSS", "JavaScript", "Responsive Design", "UI/UX"],
    image: "/DataScience.png",
    liveUrl: "https://www.gietdsclub.me/",
    sourceUrl: "https://github.com/riteshkumarlenka2005/DS_ClubOfficial",
  },
  {
    id: 2,
    title: "Room Finder Platform",
    era: "Full Stack",
    context: "A production-deployed full-stack rental platform engineered to solve accommodation discovery challenges in Indian cities. Delivers real-time listings with location-based search and preference filtering through a verified landlord-tenant system — actively serving 50+ users navigating housing decisions with reliability and precision.",
    tags: ["React.js", "Node.js", "Supabase", "REST API", "Vercel"],
    image: "/FinalRoomFinder.png",
    liveUrl: "https://room-finder-kappa.vercel.app/",
    sourceUrl: "https://github.com/riteshkumarlenka2005/RoomFinder",
  },
  {
    id: 3,
    title: "CyberGuardian AI",
    era: "Adversarial AI",
    context: "An adversarial AI trainer that simulates 5+ realistic scam scenarios using the same emotional manipulation tactics — fear, urgency, greed — deployed by actual fraudsters. When user vulnerability is detected, the system breaks character and delivers targeted cybersecurity education, achieving 85% user awareness improvement across all simulation sessions.",
    tags: ["Python", "NLP", "Conversational AI", "Flask", "Emotion Detection"],
    image: "/CyberGuardianAI.png",
    liveUrl: "https://cyber-guardian-ai-client.vercel.app/",
    sourceUrl: "https://github.com/riteshkumarlenka2005/CyberGuardianAI",
  },
  {
    id: 4,
    title: "Interview Prep Platform",
    era: "Multimodal AI",
    context: "A multimodal AI platform that simultaneously evaluates interview performance across three data streams: facial expression analysis tracking 7 emotional states via computer vision, speech clarity scoring through NLP-driven tone and pace evaluation, and response content assessment — delivering actionable feedback to power student placement readiness.",
    tags: ["Python", "OpenCV", "NLP", "React.js", "Flask", "Computer Vision"],
    image: "/FinalInterviewApp.png",
    liveUrl: "https://www.vivasense.app/",
    sourceUrl: "https://github.com/riteshkumarlenka2005/Holistic-Interview-Intelligence",
  },
  {
    id: 6,
    title: "TaskManager",
    era: "Productivity & Cloud",
    context: "A modern productivity platform built for individuals and teams who demand reliability. Combines intelligent task management with rich note-taking and secure cross-device cloud synchronization — engineered with Java on the backend for robust performance and React.js on the frontend for a fast, responsive user experience.",
    tags: ["Java", "React.js", "MySQL", "REST API", "Cloud Sync"],
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
          <div className={`absolute inset-0 w-full h-full rounded-none bg-black border border-white/[0.08] flex flex-col justify-between p-5 [backface-visibility:hidden] ${!isFlipped ? 'pointer-events-none' : ''}`} style={{ transform: 'rotateY(180deg)' }}>

            {/* Subtle top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

            {/* Top: Era + Description */}
            <div className="flex-1 overflow-hidden pr-8">
              <span className="inline-block text-[10px] uppercase tracking-[0.18em] text-amber-400 font-mono mb-2.5">
                {project.era}
              </span>
              <p className="text-[11px] sm:text-[12px] text-white/85 leading-relaxed">
                {project.context}
              </p>
            </div>

            {/* Middle: Tech Stack */}
            <div className="my-3">
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-mono mb-2">Stack</p>
              <div className="flex gap-1.5 flex-wrap">
                {project.tags.map(tag => (
                  <span
                    key={tag}
                    className="font-mono text-[10px] sm:text-[11px] tracking-wide text-white/80 border border-white/25 bg-white/[0.07] px-2 py-[3px] rounded-none"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom: Action Buttons */}
            <div className="w-full flex flex-row gap-2">
              {project.sourceUrl && (
                <a
                  href={project.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="relative z-30 flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 border border-white/35 text-white font-mono text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-200 rounded-none"
                >
                  <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                  GitHub
                </a>
              )}
              <Link
                to={`/project/${project.id}`}
                onClick={(e) => e.stopPropagation()}
                className="relative z-30 flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 border border-amber-400/70 text-amber-300 font-mono text-[10px] uppercase tracking-widest hover:bg-amber-400 hover:text-black hover:border-amber-400 transition-all duration-200 rounded-none"
              >
                Read More
              </Link>
            </div>

            {/* Close Button */}
            <button
              onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}
              className="absolute top-3 right-3 text-white/50 hover:text-white w-7 h-7 flex items-center justify-center hover:bg-white/10 transition-colors z-30 text-xs"
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
