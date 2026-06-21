import React, { useEffect, useState } from 'react';
import { InteractiveFooter } from '../components/InteractiveFooter';



interface Project {
    id: number;
    title: string;
    era: string;
    context: string;
    coreIdea: string;
    implementation: string;
    outcome: string;
    tags: string[];
    liveUrl?: string;
    sourceUrl?: string;
}

const PROJECTS: Project[] = [
    {
        id: 1,
        title: "Data Science Club Website",
        era: "2nd Year · Web Development & Community",
        context: "The Data Science Club at GIET University needed a centralized digital platform to showcase its activities, projects, and initiatives. Without a dedicated online presence, communication between members, organizers, and aspiring data enthusiasts was fragmented and inefficient.",
        coreIdea: "A centralized web platform serving as the official online hub for the Data Science Club — publishing events, workshops, and hackathons, showcasing student projects in ML, Data Analytics, and AI, and curating learning resources including tutorials, datasets, and tools.",
        implementation: "Built with HTML, CSS, and JavaScript with a modern responsive design for desktop and mobile. The platform features a club information section, events & workshops calendar, projects showcase, curated learning resources, and member engagement tools. Structured for future scalability.",
        outcome: "The platform significantly improved accessibility to Data Science knowledge and opportunities within the university community. It created a collaborative ecosystem for students interested in AI, Machine Learning, and Data Analytics, strengthening the club's reach and impact.",
        tags: ["HTML", "CSS", "JavaScript", "UI/UX", "Responsive Design"],
        liveUrl: "https://www.gietdsclub.me/",
        sourceUrl: "https://github.com/riteshkumarlenka2005/DS_ClubOfficial"
    },
    {
        id: 2,
        title: "Room Finder Platform",
        era: "2nd Year · Real-World Deployment",
        context: "Finding suitable accommodation or domestic help in Indian cities remains a challenge. Existing platforms are often cluttered, unreliable, or fail to understand local preferences and constraints.",
        coreIdea: "A streamlined platform connecting room seekers with landlords and domestic help providers. Search functionality respects locality, comfort requirements, and personal preferences—delivering relevant results without noise.",
        implementation: "The full-stack application features location-based search, preference filtering, and a verification system for listings. Deployed and maintained for real users, handling actual transactions and building genuine community utility.",
        outcome: "Unlike academic projects, this platform serves real people with real needs. It taught the difference between working code and deployed systems—the importance of reliability, user experience, and responsive maintenance.",
        tags: ["Full Stack", "Deployed Product", "Social Utility"],
        liveUrl: "https://room-finder-kappa.vercel.app/",
        sourceUrl: "https://github.com/riteshkumarlenka2005/RoomFinder"
    },
    {
        id: 3,
        title: "CyberGuardian AI",
        era: "2nd Year · Adversarial AI & Psychology",
        context: "Cybersecurity awareness training often fails because it's abstract and non-threatening. Real scammers succeed through emotional manipulation—fear, urgency, greed. Traditional education doesn't prepare people for these psychological pressures.",
        coreIdea: "An AI system that simulates realistic scammer behavior, employing the same emotional manipulation tactics used by actual fraudsters. When users fall for the simulation, the AI pauses to educate—transforming failure into a learning moment.",
        implementation: "The conversational AI uses emotion-detection and psychological modeling to craft convincing scam scenarios. Response analysis determines user vulnerability. Upon detecting potential capitulation, the system breaks character and provides targeted awareness training.",
        outcome: "This project explored the ethical edges of AI—using deceptive techniques for educational purposes. It deepened my understanding of human psychology, conversational AI, and the responsibility of building systems that influence behavior.",
        tags: ["AI Ethics", "Cybersecurity", "Psychology", "Conversational AI"],
        liveUrl: "https://www.cyberguardianai.tech/",
        sourceUrl: "https://github.com/riteshkumarlenka2005/CyberGuardianAI"
    },
    {
        id: 4,
        title: "Interview Preparation Platform",
        era: "2nd Year · Multimodal AI",
        context: "Interview success depends not just on knowledge, but on presentation—confidence, clarity, emotional regulation. Traditional preparation focuses on content while ignoring the crucial non-verbal dimensions that often determine outcomes.",
        coreIdea: "A multimodal AI system that analyzes both verbal and non-verbal interview performance. Real-time facial analysis detects confidence, nervousness, and emotional states. Parallel speech analysis evaluates clarity, rate, and accuracy.",
        implementation: "Computer vision models process webcam feeds for facial expression analysis. Speech recognition and NLP pipelines evaluate verbal responses. The fusion layer synthesizes these modalities into coherent feedback, identifying specific improvement areas with actionable recommendations.",
        outcome: "This platform represents the culmination of my AI journey so far—integrating computer vision, speech processing, and behavioral analysis. It directly serves student placement readiness, combining technical sophistication with genuine social value.",
        tags: ["Computer Vision", "Speech Analysis", "Multimodal AI", "EdTech"],
        liveUrl: "https://www.vivasense.app/",
        sourceUrl: "https://github.com/riteshkumarlenka2005/Holistic-Interview-Intelligence"
    },
    {
        id: 5,
        title: "CareerSoulmate",
        era: "2nd Year · Decision Intelligence",
        context: "Career decisions are among the most consequential choices students make, yet guidance is often generic, outdated, or biased toward popular fields. Personalized, data-driven career exploration remains elusive for most.",
        coreIdea: "An AI-driven career guidance ecosystem that understands individual aptitudes, interests, and constraints. The system doesn't just recommend—it enables exploration through comparison tools, timetable generation, and multilingual accessibility.",
        implementation: "Web scraping aggregates current career information from diverse sources. ML models process user profiles to generate personalized recommendations. The comparison engine visualizes career trajectories side-by-side. Multilingual support extends reach to vernacular communities.",
        outcome: "CareerSoulmate synthesized multiple AI capabilities into a cohesive product. It reinforced my belief that AI's highest purpose is empowering informed human decision-making, not replacing human judgment.",
        tags: ["AI", "Education", "Multilingual", "Career Guidance"],
        liveUrl: "https://career-soulmate-client.vercel.app/",
        sourceUrl: "https://github.com/riteshkumarlenka2005/CareerSoulmate"
    }
];

const ProjectSection: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
    const containerRef = React.useRef<HTMLElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        let ticking = false;

        const updatePosition = () => {
            if (!containerRef.current || !contentRef.current) return;
            // Use the untransformed container to track scroll. 
            // This prevents CSS transforms from corrupting scroll position tracking!
            const rect = containerRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            const triggerPoint = windowHeight - 50;
            const revealDistance = windowHeight * 0.7; 
            
            const rawProgress = (triggerPoint - rect.top) / revealDistance;
            const progress = Math.max(0, Math.min(1, rawProgress));

            const opacity = progress;
            const translateY = 150 * (1 - progress);
            const scale = 0.95 + (0.05 * progress);

            contentRef.current.style.opacity = opacity.toFixed(3);
            contentRef.current.style.transform = `translateY(${translateY.toFixed(2)}px) scale(${scale.toFixed(3)})`;
            
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

    const isEven = index % 2 === 0;

    return (
        <section
            ref={containerRef}
            id={`project-${project.id}`}
            className="relative py-20 md:py-32 border-b border-parchment-400/20 dark:border-antique-200/10 overflow-hidden"
        >
            <div
                ref={contentRef}
                style={{
                    opacity: 0,
                    transform: 'translateY(150px) scale(0.95)',
                    willChange: 'opacity, transform',
                }}
            >
                {/* Large Background Number */}
            <div className={`
        absolute top-8 ${isEven ? 'right-8 md:right-16' : 'left-8 md:left-16'}
        font-display text-[8rem] md:text-[12rem] leading-none
        text-parchment-400/10 dark:text-antique-200/5
        pointer-events-none select-none
      `}>
                {String(project.id).padStart(2, '0')}
            </div>

            <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10">
                {/* Era Badge */}
                <div className="flex items-center gap-4 mb-6 opacity-60">
                    <div className="h-[1px] w-8 bg-current"></div>
                    <span className="font-serif italic text-sm tracking-widest">{project.era}</span>
                </div>

                {/* Project Title */}
                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-wide text-parchment-900 dark:text-antique-900 mb-12">
                    {project.title}
                </h2>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                    {/* Left Column */}
                    <div className="space-y-10">
                        {/* Context */}
                        <div>
                            <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-3">
                                <span className="text-amber-700/40 dark:text-amber-600/40">§</span>
                                Context & Motivation
                            </h3>
                            <p className="font-serif text-lg leading-relaxed opacity-85 text-justify">
                                {project.context}
                            </p>
                        </div>

                        {/* Core Idea */}
                        <div>
                            <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-3">
                                <span className="text-amber-700/40 dark:text-amber-600/40">§</span>
                                Core Idea & Logic
                            </h3>
                            <p className="font-serif text-lg leading-relaxed opacity-85 text-justify">
                                {project.coreIdea}
                            </p>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-10">
                        {/* Implementation */}
                        <div>
                            <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-3">
                                <span className="text-amber-700/40 dark:text-amber-600/40">§</span>
                                Implementation
                            </h3>
                            <p className="font-serif text-lg leading-relaxed opacity-85 text-justify">
                                {project.implementation}
                            </p>
                        </div>

                        {/* Outcome */}
                        <div>
                            <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-3">
                                <span className="text-amber-700/40 dark:text-amber-600/40">§</span>
                                Outcome & Learning
                            </h3>
                            <p className="font-serif text-lg leading-relaxed opacity-85 text-justify">
                                {project.outcome}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Links & Tags */}
                <div className="mt-12 pt-8 border-t border-parchment-400/10 dark:border-antique-200/5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-3">
                            {project.tags.map((tag, i) => (
                                <span
                                    key={i}
                                    className="px-4 py-2 font-serif text-sm tracking-wide border border-parchment-400/30 dark:border-antique-200/20 text-parchment-800 dark:text-antique-800"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Project Links */}
                        <div className="flex flex-wrap gap-6 font-serif text-sm">
                            {project.sourceUrl && (
                                <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-amber-800 dark:text-amber-500 hover:text-amber-600 transition-colors">
                                    <span className="group-hover:opacity-100 italic">GitHub →</span>
                                </a>
                            )}
                            {project.liveUrl && (
                                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-amber-800 dark:text-amber-500 hover:text-amber-600 transition-colors">
                                    <span className="group-hover:opacity-100 italic">Live Demo →</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </section>
    );
};

export const ProjectsPage: React.FC = () => {
    const [headerVisible, setHeaderVisible] = useState(false);

    useEffect(() => {
        const isReturning = sessionStorage.getItem('hasVisited');
        const delay = isReturning ? 300 : 2200;
        sessionStorage.setItem('hasVisited', 'true');
        const timer = setTimeout(() => setHeaderVisible(true), delay);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-parchment-100 dark:bg-antique-50 text-parchment-900 dark:text-antique-800 transition-colors duration-500">



            {/* Page Header */}
            <header className={`
        pt-32 pb-16 md:pt-40 md:pb-24 border-b border-parchment-400/30 dark:border-antique-200/20
        transition-all duration-1000 ease-out
        ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}>
                <div className="max-w-5xl mx-auto px-6 md:px-12">
                    <div className="flex items-center gap-4 mb-6 opacity-50">
                        <div className="h-[1px] w-12 bg-current"></div>
                        <span className="font-serif italic text-sm tracking-widest uppercase">Catalog of Works</span>
                        <div className="h-[1px] w-12 bg-current"></div>
                    </div>

                    <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide text-parchment-900 dark:text-antique-900 mb-8">
                        Projects & Artifacts
                    </h1>

                    <p className="font-serif text-xl leading-relaxed max-w-3xl">
                        A chronological journey through eight years of engineering curiosity—from mechanical prototypes
                        to AI-driven systems. Each project represents a chapter of learning, a problem understood,
                        a solution crafted.
                    </p>
                </div>
            </header>

            {/* Projects Catalog */}
            <main>
                {PROJECTS.map((project, index) => (
                    <ProjectSection key={project.id} project={project} index={index} />
                ))}
            </main>

            <InteractiveFooter />

            {/* Subtle Footer Line */}
            <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-900/10 to-transparent pointer-events-none"></div>
        </div>
    );
};
