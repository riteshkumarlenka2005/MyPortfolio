import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface ShowcaseProject {
    id: number;
    title: string;
    era: string;
    context: string;
    tags: string[];
}

const SHOWCASE_PROJECTS: ShowcaseProject[] = [
    {
        id: 1,
        title: "Data Science Club Website",
        era: "2nd Year · Web Development & Community",
        context: "The Data Science Club at GIET University needed a centralized digital platform to showcase activities, projects, and initiatives — bridging students with learning resources and collaborative opportunities.",
        tags: ["HTML", "CSS", "JavaScript", "UI/UX", "Responsive Design"]
    },
    {
        id: 2,
        title: "Room Finder Platform",
        era: "2nd Year · Real-World Deployment",
        context: "Finding suitable accommodation or domestic help in Indian cities remains a challenge. Existing platforms are often cluttered, unreliable, or fail to understand local preferences.",
        tags: ["Full Stack", "Deployed Product", "Social Utility"]
    },
    {
        id: 3,
        title: "CyberGuardian AI",
        era: "2nd Year · Adversarial AI & Psychology",
        context: "Cybersecurity awareness training often fails because it's abstract and non-threatening. Real scammers succeed through emotional manipulation—fear, urgency, greed.",
        tags: ["AI Ethics", "Cybersecurity", "Psychology", "Conversational AI"]
    },
    {
        id: 4,
        title: "Interview Preparation Platform",
        era: "2nd Year · Multimodal AI",
        context: "Interview success depends not just on knowledge, but on presentation—confidence, clarity, emotional regulation. Traditional preparation focuses on content while ignoring non-verbal dimensions.",
        tags: ["Computer Vision", "Speech Analysis", "Multimodal AI", "EdTech"]
    },
    {
        id: 5,
        title: "CareerSoulmate",
        era: "2nd Year · Decision Intelligence",
        context: "Career decisions are among the most consequential choices students make, yet guidance is often generic, outdated, or biased toward popular fields.",
        tags: ["AI", "Education", "Multilingual", "Career Guidance"]
    }
];

export const ProjectShowcase: React.FC = () => {
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isInView, setIsInView] = useState(false);

    const totalSlides = SHOWCASE_PROJECTS.length;

    // Track scroll position within the container
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const scrollTop = container.scrollTop;
            const slideHeight = container.clientHeight;
            const newIndex = Math.round(scrollTop / slideHeight);
            setActiveIndex(Math.min(newIndex, totalSlides - 1));
        };

        container.addEventListener('scroll', handleScroll, { passive: true });
        return () => container.removeEventListener('scroll', handleScroll);
    }, [totalSlides]);

    // Intersection observer for the section
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new IntersectionObserver(
            ([entry]) => setIsInView(entry.isIntersecting),
            { threshold: 0.1 }
        );

        observer.observe(container);
        return () => observer.disconnect();
    }, []);

    const scrollToSlide = (index: number) => {
        const container = containerRef.current;
        if (!container) return;

        container.scrollTo({
            top: index * container.clientHeight,
            behavior: 'smooth'
        });
    };

    const handleSlideClick = (projectId: number) => {
        navigate(`/project/${projectId}`);
    };

    return (
        <section className="relative bg-parchment-200/50 dark:bg-antique-100/30">
            {/* Section Header - Outside scroll container */}
            <div className="max-w-6xl mx-auto px-6 md:px-12 py-24 text-center space-y-6">
                <div className="flex items-center justify-center gap-4 opacity-50">
                    <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-current" />
                    <span className="font-serif italic text-sm tracking-widest uppercase">Chronicle of Works</span>
                    <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-current" />
                </div>

                <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-wide text-parchment-900 dark:text-antique-900">
                    Projects Archive
                </h2>

                <p className="font-serif text-lg max-w-2xl mx-auto">
                    Scroll through eight years of engineering curiosity—each project a chapter of learning.
                </p>
            </div>

            {/* Scroll-Snap Container */}
            <div
                ref={containerRef}
                className="relative h-screen overflow-y-scroll snap-y snap-mandatory"
                style={{ scrollSnapType: 'y mandatory' }}
            >
                {SHOWCASE_PROJECTS.map((project, index) => (
                    <div
                        key={project.id}
                        className="h-screen w-full snap-start snap-always flex items-center justify-center p-4 md:p-8 lg:p-12"
                        style={{ scrollSnapAlign: 'start' }}
                    >
                        {/* Slide Card */}
                        <div
                            onClick={() => handleSlideClick(project.id)}
                            className="
                                relative w-full max-w-6xl h-[85vh] cursor-pointer
                                bg-parchment-100 dark:bg-antique-50
                                border-2 border-parchment-400/40 dark:border-antique-200/30
                                shadow-2xl shadow-parchment-900/10 dark:shadow-black/20
                                overflow-hidden
                                transition-all duration-500 ease-out
                                hover:border-amber-700/40 dark:hover:border-amber-600/40
                                hover:shadow-amber-900/20
                                group
                            "
                        >
                            {/* Large background number */}
                            <div className="absolute top-4 md:top-8 right-4 md:right-12 font-display text-[6rem] md:text-[10rem] lg:text-[14rem] leading-none text-parchment-400/10 dark:text-antique-200/5 pointer-events-none select-none transition-transform duration-700 group-hover:scale-110">
                                {String(project.id).padStart(2, '0')}
                            </div>

                            {/* Content */}
                            <div className="relative z-10 h-full flex flex-col justify-center p-6 md:p-12 lg:p-20 max-w-3xl">
                                {/* Era badge */}
                                <div className="flex items-center gap-4 mb-4 md:mb-6 opacity-60">
                                    <div className="h-[1px] w-6 md:w-8 bg-current" />
                                    <span className="font-serif italic text-xs md:text-sm tracking-widest">{project.era}</span>
                                </div>

                                {/* Title */}
                                <h3 className="font-display text-2xl md:text-3xl lg:text-5xl font-semibold tracking-wide text-parchment-900 dark:text-antique-900 mb-4 md:mb-8 group-hover:text-amber-800 dark:group-hover:text-amber-700 transition-colors duration-500">
                                    {project.title}
                                </h3>

                                {/* Description */}
                                <p className="font-serif text-sm md:text-lg lg:text-xl leading-relaxed mb-6 md:mb-10 max-w-2xl">
                                    {project.context}
                                </p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 md:gap-3 mb-6 md:mb-8">
                                    {project.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 md:px-4 py-1 md:py-2 font-serif text-xs md:text-sm tracking-wide border border-parchment-400/40 dark:border-antique-200/30 text-parchment-800 dark:text-antique-800 group-hover: transition-opacity duration-300"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* View indicator */}
                                <div className="flex items-center gap-3 text-amber-700 dark:text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
                                    <span className="font-serif text-xs md:text-sm uppercase tracking-widest">Click to Explore</span>
                                    <span className="text-lg transform group-hover:translate-x-2 transition-transform duration-500">→</span>
                                </div>
                            </div>

                            {/* Decorative corners */}
                            <div className="absolute top-3 md:top-6 left-3 md:left-6 w-6 md:w-12 h-6 md:h-12 border-l-2 border-t-2 border-amber-700/20 dark:border-amber-600/20" />
                            <div className="absolute bottom-3 md:bottom-6 right-3 md:right-6 w-6 md:w-12 h-6 md:h-12 border-r-2 border-b-2 border-amber-700/20 dark:border-amber-600/20" />

                            {/* Page number indicator */}
                            <div className="absolute bottom-4 md:bottom-6 left-4 md:left-12 font-display text-xs md:text-sm">
                                <span className="text-amber-700 dark:text-amber-600">{String(project.id).padStart(2, '0')}</span>
                                <span className="mx-2">/</span>
                                <span>{String(totalSlides).padStart(2, '0')}</span>
                            </div>

                            {/* Hover glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 via-transparent to-amber-600/0 group-hover:from-amber-500/5 group-hover:to-amber-600/5 transition-all duration-700 pointer-events-none" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Fixed Progress indicator */}
            {isInView && (
                <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2 transition-opacity duration-300">
                    {SHOWCASE_PROJECTS.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => scrollToSlide(index)}
                            className={`
                                w-2 rounded-full transition-all duration-500 hover:bg-amber-600
                                ${index === activeIndex
                                    ? 'h-8 bg-amber-700 dark:bg-amber-600'
                                    : index < activeIndex
                                        ? 'h-2 bg-amber-700/50 dark:bg-amber-600/50'
                                        : 'h-2 bg-parchment-400/40 dark:bg-antique-300/40'
                                }
                            `}
                            aria-label={`Go to project ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Slide counter */}
            {isInView && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 font-display text-sm tracking-widest transition-opacity duration-300">
                    <span className="text-amber-700 dark:text-amber-600">{String(activeIndex + 1).padStart(2, '0')}</span>
                    <span className="mx-3 text-parchment-600 dark:text-antique-600">of</span>
                    <span>{String(totalSlides).padStart(2, '0')}</span>
                </div>
            )}
        </section>
    );
};
