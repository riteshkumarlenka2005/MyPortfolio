import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ScrollNavbar } from '../components/ScrollNavbar';
import { HeritageFrame } from '../components/HeritageFrame';




interface ProjectDetail {
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

// Full project data
const PROJECTS: ProjectDetail[] = [
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
    },
    {
        id: 6,
        title: "TaskManager",
        era: "2nd Year · Productivity & Cloud",
        context: "TaskManager is a modern, all-in-one productivity platform designed to help users organize their daily workflow with clarity and efficiency. Built with a clean, minimal, and high-performance design philosophy.",
        coreIdea: "Combining smart task management, seamless note-taking, and secure cloud synchronization into a single, intuitive interface. It allows users to manage tasks, capture ideas, and access their data anytime, anywhere.",
        implementation: "Developed with a focus on speed and distraction-free productivity. The platform integrates a robust backend for secure data synchronization across devices, paired with a sleek, responsive frontend for an optimal user experience.",
        outcome: "An ideal solution for students, developers, and professionals who want to simplify their work. The project showcases my ability to build utility-focused applications that bridge the gap between complex functionality and user-friendly design.",
        tags: ["Java", "React", "Cloud Sync", "Productivity"],
        liveUrl: "https://task-manager-java.vercel.app/",
        sourceUrl: "https://github.com/riteshkumarlenka2005/TaskManager-JAVA-"
    }
];

export const ProjectDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);

    const projectId = parseInt(id || '1', 10);
    const project = PROJECTS.find(p => p.id === projectId);

    useEffect(() => {
        window.scrollTo(0, 0);
        const timer = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    if (!project) {
        return (
            <div className="min-h-screen bg-parchment-100 dark:bg-antique-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="font-display text-4xl mb-4">Project Not Found</h1>
                    <Link to="/" className="font-serif text-amber-700 dark:text-amber-600 hover:underline">
                        Return to Archive
                    </Link>
                </div>
            </div>
        );
    }

    const prevProject = PROJECTS.find(p => p.id === projectId - 1);
    const nextProject = PROJECTS.find(p => p.id === projectId + 1);

    return (
        <div className="min-h-screen bg-parchment-100 dark:bg-antique-50 text-parchment-900 dark:text-antique-800 transition-colors duration-500">
            <HeritageFrame />
            <ScrollNavbar />

            {/* Hero Section */}
            <header className={`
                relative pt-32 pb-20 md:pt-40 md:pb-32 px-6 md:px-12
                transition-all duration-1000 ease-out
                ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}>
                {/* Background number */}
                <div className="absolute top-20 right-8 md:right-20 font-display text-[12rem] md:text-[20rem] leading-none text-parchment-300/20 dark:text-antique-200/10 pointer-events-none select-none">
                    {String(project.id).padStart(2, '0')}
                </div>

                <div className="max-w-5xl mx-auto relative z-10">
                    {/* Back link */}
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-3 font-serif text-sm hover:opacity-100 hover:text-amber-700 dark:hover:text-amber-600 transition-all duration-300 mb-8"
                    >
                        <span>←</span>
                        <span>Back to Archive</span>
                    </button>

                    {/* Era badge */}
                    <div className="flex items-center gap-4 mb-6 opacity-60">
                        <div className="h-[1px] w-12 bg-current" />
                        <span className="font-serif italic text-sm tracking-widest">{project.era}</span>
                    </div>

                    {/* Title */}
                    <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide text-parchment-900 dark:text-antique-900 mb-8">
                        {project.title}
                    </h1>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-3 mb-10">
                        {project.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-4 py-2 font-serif text-sm tracking-wide border border-parchment-400/40 dark:border-antique-200/30 text-parchment-800 dark:text-antique-800"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap gap-8">
                        {project.liveUrl && (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-3 text-amber-800 dark:text-amber-500 hover:text-amber-600 transition-colors"
                            >
                                <span className="font-serif italic text-lg border-b border-amber-800/30 dark:border-amber-500/30 leading-none pb-1">Live Project →</span>
                            </a>
                        )}
                        {project.sourceUrl && (
                            <a
                                href={project.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-3 text-amber-800 dark:text-amber-500 hover:text-amber-600 transition-colors"
                            >
                                <span className="font-serif italic text-lg border-b border-amber-800/30 dark:border-amber-500/30 leading-none pb-1">Source Code →</span>
                            </a>
                        )}
                    </div>
                </div>
            </header>

            {/* Content Sections */}
            <main className={`
                max-w-5xl mx-auto px-6 md:px-12 pb-32
                transition-all duration-1000 delay-200 ease-out
                ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                    {/* Left Column */}
                    <div className="space-y-16">
                        {/* Context */}
                        <section>
                            <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-3">
                                <span className="text-amber-700/50 dark:text-amber-600/50">§</span>
                                Context & Motivation
                            </h2>
                            <p className="font-serif text-lg leading-relaxed opacity-85 text-justify">
                                {project.context}
                            </p>
                        </section>

                        {/* Core Idea */}
                        <section>
                            <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-3">
                                <span className="text-amber-700/50 dark:text-amber-600/50">§</span>
                                Core Idea & Logic
                            </h2>
                            <p className="font-serif text-lg leading-relaxed opacity-85 text-justify">
                                {project.coreIdea}
                            </p>
                        </section>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-16">
                        {/* Implementation */}
                        <section>
                            <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-3">
                                <span className="text-amber-700/50 dark:text-amber-600/50">§</span>
                                Implementation
                            </h2>
                            <p className="font-serif text-lg leading-relaxed opacity-85 text-justify">
                                {project.implementation}
                            </p>
                        </section>

                        {/* Outcome */}
                        <section>
                            <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-3">
                                <span className="text-amber-700/50 dark:text-amber-600/50">§</span>
                                Outcome & Learning
                            </h2>
                            <p className="font-serif text-lg leading-relaxed opacity-85 text-justify">
                                {project.outcome}
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            {/* Navigation */}
            <nav className={`
                border-t border-parchment-400/20 dark:border-antique-200/10
                transition-all duration-1000 delay-400 ease-out
                ${visible ? 'opacity-100' : 'opacity-0'}
            `}>
                <div className="max-w-5xl mx-auto px-6 md:px-12 py-12">
                    <div className="flex justify-between items-center">
                        {/* Previous */}
                        {prevProject ? (
                            <Link
                                to={`/project/${prevProject.id}`}
                                className="group flex items-center gap-4 hover:text-amber-700 dark:hover:text-amber-600 transition-colors duration-300"
                            >
                                <span className="transform group-hover:-translate-x-2 transition-transform duration-300">←</span>
                                <div className="text-right">
                                    <span className="block font-serif text-xs uppercase tracking-widest">Previous</span>
                                    <span className="font-display text-lg">{prevProject.title}</span>
                                </div>
                            </Link>
                        ) : (
                            <div />
                        )}

                        {/* Next */}
                        {nextProject ? (
                            <Link
                                to={`/project/${nextProject.id}`}
                                className="group flex items-center gap-4 hover:text-amber-700 dark:hover:text-amber-600 transition-colors duration-300"
                            >
                                <div className="text-left">
                                    <span className="block font-serif text-xs uppercase tracking-widest">Next</span>
                                    <span className="font-display text-lg">{nextProject.title}</span>
                                </div>
                                <span className="transform group-hover:translate-x-2 transition-transform duration-300">→</span>
                            </Link>
                        ) : (
                            <div />
                        )}
                    </div>
                </div>
            </nav>

            {/* Footer */}
            <footer className="py-16 text-center border-t border-parchment-400/10 dark:border-antique-200/5">
                <Link
                    to="/"
                    className="inline-flex items-center gap-3 font-serif text-lg hover:text-amber-700 dark:hover:text-amber-600 transition-colors duration-300"
                >
                    <span>←</span>
                    <span>Return to Archive</span>
                </Link>
            </footer>

            {/* Decorative Line */}
            <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-900/10 to-transparent pointer-events-none z-50" />
        </div>
    );
};
