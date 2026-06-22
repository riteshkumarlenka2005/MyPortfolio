import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Lenis from 'lenis';
import { TimelineSection } from '../components/TimelineSection';
import { InteractiveFooter } from '../components/InteractiveFooter';
import { AnimatedPen } from '../components/AnimatedPen';
import { BlurReveal } from '../components/BlurReveal';

export const AboutPage: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStartPos = React.useRef({ x: 0, y: 0 });
    const cardSectionRef = React.useRef<HTMLElement>(null);
    const isReturning = typeof window !== 'undefined' && !!sessionStorage.getItem('hasVisited');

    // Ultra-smooth scrolling via Lenis (same as HomePage)
    useEffect(() => {
        const lenis = new Lenis({
            lerp: 0.05,
            smoothWheel: true,
            wheelMultiplier: 0.8,
            touchMultiplier: 1.5,
        });

        let rafId: number;
        const update = (time: number) => {
            lenis.raf(time);
            rafId = requestAnimationFrame(update);
        };
        rafId = requestAnimationFrame(update);

        return () => {
            lenis.destroy();
            cancelAnimationFrame(rafId);
        };
    }, []);

    useEffect(() => {
        // Fast entry on return visits, slower on first visit
        const delay = isReturning ? 300 : 2200;
        sessionStorage.setItem('hasVisited', 'true');
        const timer = setTimeout(() => setVisible(true), delay);
        return () => clearTimeout(timer);
    }, []);

    // Gentle nudge animation when entering view to show it's stretchable
    useEffect(() => {
        if (!cardSectionRef.current) return;
        let pullTimer: ReturnType<typeof setTimeout>;
        let releaseTimer: ReturnType<typeof setTimeout>;
        
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                // Wait a tiny bit so they see it start
                pullTimer = setTimeout(() => {
                    // Only trigger if user isn't already interacting
                    setDragOffset(prev => prev.x === 0 && prev.y === 0 ? { x: 35, y: 5 } : prev);
                    
                    // Release the card to let the smooth cubic-bezier physics swing it back
                    releaseTimer = setTimeout(() => {
                        setDragOffset(prev => (prev.x === 35 ? { x: 0, y: 0 } : prev));
                    }, 200);
                }, 400);
            }
        }, { threshold: 0.5 }); // Trigger whenever at least half the card is visible
        
        observer.observe(cardSectionRef.current);
        return () => {
            observer.disconnect();
            clearTimeout(pullTimer);
            clearTimeout(releaseTimer);
        };
    }, []);

    // Stagger timing for hero words
    const heroBaseDelay = isReturning ? 100 : 2200;
    const heroStagger = isReturning ? 60 : 150;
    const underlineDelay = isReturning ? 600 : 3400;

    // Handlers for interactive ID Card (Elastic Drag)
    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        setIsDragging(true);
        // Record where the drag started relative to the current offset
        dragStartPos.current = { 
            x: e.clientX - dragOffset.x, 
            y: e.clientY - dragOffset.y 
        };
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        
        // Calculate raw distance pulled
        const rawX = e.clientX - dragStartPos.current.x;
        const rawY = e.clientY - dragStartPos.current.y;
        
        // Apply elastic damping (feels like a thick rubber band)
        // The further you pull, the more it resists. Simple linear damping here for feel.
        const damping = 0.4;
        
        setDragOffset({ 
            x: rawX * damping, 
            y: rawY * damping 
        });
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        e.currentTarget.releasePointerCapture(e.pointerId);
        setIsDragging(false);
        setDragOffset({ x: 0, y: 0 }); // Spring back to center
    };

    // Interactive Card Physics Math
    const L = 120; // Base strap length
    const dx = dragOffset.x;
    const dy = dragOffset.y;
    const currentLength = Math.sqrt(dx * dx + (L + dy) * (L + dy));
    const stretchScale = currentLength / L;
    const strapAngle = -Math.atan2(dx, L + dy) * (180 / Math.PI);
    const thicknessScale = 1 / Math.sqrt(stretchScale);

    return (
        <div className="min-h-screen bg-black text-white transition-colors duration-500 font-sans relative">

            {/* Background Image for Hero */}
            <div className={`absolute top-0 left-0 w-full h-[70vh] z-0 transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}>
                <img 
                    src="/image.png" 
                    alt="Student in coffee shop" 
                    className="w-full h-full object-cover object-[center_60%] opacity-100" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </div>

            {/* Main Content - Manuscript Style */}
            <main className={`
        relative z-10 
        max-w-4xl mx-auto px-6 md:px-12 pt-32 pb-20
        transform transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]
        ${visible ? 'opacity-100 translate-y-0 scale-100 blur-none' : 'opacity-0 translate-y-32 scale-90 blur-md'}
      `}>

                {/* Hero Statement */}
                <div className="mb-20 py-16 text-center relative overflow-hidden">
                    {/* Subtle background accent */}
                    <div className="absolute inset-0 pointer-events-none"
                        style={{
                            background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 70%)',
                        }}
                    />

                    <h1 className="relative text-[10vw] lg:text-[4rem] xl:text-[5rem] 2xl:text-[6rem] font-black leading-[0.85] tracking-[-0.04em] text-white opacity-90 uppercase pointer-events-none flex flex-wrap justify-center items-center">
                        {['I', 'AM', 'THE', 'CEO', 'OF', 'MY', 'LIFE'].map((word, i) => (
                            <span
                                key={word + i}
                                className="inline-block mx-[1vw] md:mx-2 transition-all duration-700 ease-out"
                                style={{
                                    transitionDelay: `${heroBaseDelay + i * heroStagger}ms`,
                                    opacity: visible ? 1 : 0,
                                    transform: visible
                                        ? 'translateY(0) scale(1)'
                                        : 'translateY(40px) scale(0.9)',
                                }}
                            >
                                {word}
                            </span>
                        ))}
                    </h1>

                    {/* Animated underline */}
                    <div
                        className="mx-auto mt-8 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 ease-out"
                        style={{
                            width: visible ? '60%' : '0%',
                            transitionDelay: `${underlineDelay}ms`,
                            opacity: visible ? 1 : 0,
                        }}
                    />
                </div>

                {/* Philosophy Section Wrapper for Pen Animation */}
                <div className="relative w-full">
                    <AnimatedPen />
                    {/* Philosophy Section */}
                    <section className="mb-24 mt-16 relative z-10 w-full max-w-3xl text-left mr-auto -ml-4 md:-ml-20 lg:-ml-40">
                        <div className="mb-8">
                            <h2 className="font-sans text-5xl md:text-6xl font-bold text-white mb-3">
                                How I See the World
                            </h2>
                            <div className="text-sm md:text-base font-bold text-white/60 tracking-wide">
                                #philosophy
                            </div>
                        </div>
                        <div className="font-sans text-lg md:text-xl text-gray-300 leading-relaxed text-justify space-y-5">
                            <BlurReveal delay={0}>
                                <p>I believe every life is a project under construction.</p>
                            </BlurReveal>
                            <BlurReveal delay={200}>
                                <p>Every choice shapes the future. Every habit writes a new chapter. Every challenge carries a lesson waiting to be discovered.</p>
                            </BlurReveal>
                            <BlurReveal delay={400}>
                                <p>I am not searching for the perfect moment to begin. I believe growth comes from starting, learning, failing, improving, and moving forward.</p>
                            </BlurReveal>
                            <BlurReveal delay={600}>
                                <p>As a student and aspiring engineer, I see technology as more than a career path — it is a tool for turning ideas into reality.</p>
                            </BlurReveal>
                            <BlurReveal delay={800}>
                                <p className="font-semibold text-white/90">My philosophy is simple:</p>
                            </BlurReveal>
                            <BlurReveal delay={1000}>
                                <p className="font-bold text-white tracking-wide">Stay curious. Build consistently. Learn endlessly.</p>
                            </BlurReveal>
                            <BlurReveal delay={1200}>
                                <p>The destination matters, but the person I become along the way matters even more.</p>
                            </BlurReveal>
                        </div>
                    </section>
                </div>

                <div className="w-full ml-auto mr-0 -mr-4 md:-mr-20 lg:-mr-40 mt-32">
                    {/* Page Title - Understated */}
                    <header className="mb-12 border-b border-white/10 pb-8 flex flex-col items-end text-right">
                        <div className="flex items-center gap-4 mb-4 opacity-50 justify-end">
                            <span className="font-serif italic text-sm tracking-widest uppercase text-white">About the Author</span>
                            <div className="h-[1px] w-8 bg-current"></div>
                        </div>
                        <h2 className="font-sans text-5xl md:text-6xl font-bold tracking-wide text-white">
                            The Mind Behind the Archive
                        </h2>
                    </header>

                    {/* Introduction */}
                    <section className="mb-16" style={{ marginLeft: 'calc(-50vw + 50%)' }}>
                        <div className="font-sans text-lg md:text-xl text-gray-300 leading-relaxed text-justify space-y-6">
                            <BlurReveal delay={0}>
                                <p className="first-letter:text-5xl first-letter:font-sans first-letter:font-bold first-letter:mr-2 first-letter:float-left first-letter:leading-none first-letter:text-amber-500">
                                    I am Ritesh Kumar Lenka, a Computer Science Engineering student at GIET University, Gunupur, originally from the village of Mohiguda in Odisha, India.
                                </p>
                            </BlurReveal>
                            <BlurReveal delay={200}>
                                <p>
                                    Growing up in a small village taught me lessons that continue to shape the way I think today — curiosity, adaptability, and the importance of making the most of every opportunity. Those early experiences developed a mindset of learning, building, and continuously improving, which eventually led me toward the world of technology.
                                </p>
                            </BlurReveal>
                            <BlurReveal delay={400}>
                                <p>
                                    My primary interests lie in Artificial Intelligence and Machine Learning, where I explore how intelligent systems can solve real-world problems. Alongside AI, I enjoy Full Stack Web Development and Product Design, disciplines that allow me to transform ideas into practical, user-centered digital experiences.
                                </p>
                            </BlurReveal>
                            <BlurReveal delay={600}>
                                <p>
                                    What interests me most about technology is not simply writing code, but understanding how systems are designed, how products evolve, and how thoughtful engineering can create meaningful impact. I enjoy breaking down complex problems, exploring new technologies, and turning concepts into solutions that are both functional and intuitive.
                                </p>
                            </BlurReveal>
                            <BlurReveal delay={800}>
                                <p>
                                    This archive serves as a record of that journey — a collection of projects, experiments, lessons, and experiences that reflect my growth as an engineer and builder. Every project represents an opportunity to learn something new, refine my thinking, and deepen my understanding of the craft.
                                </p>
                            </BlurReveal>
                            <BlurReveal delay={1000}>
                                <p>
                                    My long-term goal is to contribute to the development of intelligent products and scalable systems that improve people's lives. I believe great technology is built at the intersection of engineering, creativity, and continuous learning, and I am committed to growing within all three.
                                </p>
                            </BlurReveal>
                        </div>
                    </section>
                </div>



                <div className="relative z-20 w-[94vw] max-w-[1600px] left-1/2 -translate-x-1/2 rounded-[2.5rem]">
                    <TimelineSection />
                </div>

                {/* The Future I Am Working Towards — Exact Mockup Design */}
                <section ref={cardSectionRef} className="mb-20 -mt-8 flex flex-col items-center relative z-10">
                    <div 
                        className="flex flex-col items-center" 
                        style={{ 
                            perspective: '1200px',
                            cursor: isDragging ? 'grabbing' : 'grab',
                            touchAction: 'none', // Prevent page scroll while dragging
                            userSelect: isDragging ? 'none' : 'auto', // Prevent text selection while dragging
                            WebkitUserSelect: isDragging ? 'none' : 'auto',
                        }}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerUp}
                    >

                        {/* Elastic Assembly Wrapper */}
                        <div style={{ 
                            display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10, position: 'relative',
                        }}>
                            
                            {/* Black Strap (Fixed Top, Stretches Down) */}
                            <div style={{
                                position: 'absolute',
                                top: 0, left: '50%', marginLeft: '-24px',
                                width: '48px', height: `${L}px`,
                                background: 'linear-gradient(to right, #111, #2a2a2a 15%, #2a2a2a 85%, #111)',
                                borderLeft: '1px solid #000',
                                borderRight: '1px solid #000',
                                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.9)',
                                transformOrigin: 'top center',
                                transform: `rotate(${strapAngle}deg) scaleY(${stretchScale}) scaleX(${thicknessScale})`,
                                transition: isDragging ? 'none' : 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                zIndex: 11
                            }} />

                            {/* Metal Clip and Card (Moves with Drag) */}
                            <div style={{ 
                                display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative',
                                marginTop: `${L}px`, // Starts exactly at the bottom of the unstretched strap
                                transform: `translate(${dx}px, ${dy}px) rotate(${strapAngle * 0.4}deg) rotateX(${dy * -0.05}deg)`,
                                transformOrigin: 'top center', // Ensures the top of the clip stays attached to the strap when rotating
                                transition: isDragging ? 'none' : 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                transformStyle: 'preserve-3d',
                                zIndex: 12
                            }}>

                            {/* Top Metal Clip Loop */}
                            <div style={{
                                width: '56px', height: '16px',
                                background: 'linear-gradient(to right, #aaa, #eee, #aaa)',
                                borderRadius: '4px 4px 0 0',
                                border: '1px solid #777',
                                borderBottom: 'none',
                                marginTop: '-8px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                            }} />

                            {/* Main Metal Clip Body */}
                            <div style={{
                                width: '64px', height: '44px',
                                background: 'linear-gradient(to right, #999, #ddd 20%, #ddd 80%, #999)',
                                border: '1px solid #666',
                                borderRadius: '2px',
                                position: 'relative',
                                boxShadow: '0 5px 12px rgba(0,0,0,0.4)',
                            }}>
                                {/* Horizontal crease/line on clip */}
                                <div style={{
                                    position: 'absolute', top: '20px', left: 0, right: 0, height: '2px',
                                    background: 'rgba(0,0,0,0.15)',
                                    borderBottom: '1px solid rgba(255,255,255,0.9)'
                                }} />
                            </div>

                            {/* Metal Clip Bottom (Jaw) */}
                            <div style={{
                                width: '48px', height: '20px',
                                background: 'linear-gradient(to right, #888, #ccc 20%, #ccc 80%, #888)',
                                border: '1px solid #555',
                                borderTop: 'none',
                                borderRadius: '0 0 4px 4px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.5)',
                                zIndex: 11
                            }} />

                        {/* Card Body */}
                        <div style={{
                            width: 'min(760px, 94vw)',
                            backgroundColor: '#1a1a1a', // Dark interior
                            borderRadius: '16px',
                            border: '6px solid #e5e5e5', // Thick white outer border
                            boxShadow: '0 25px 50px rgba(0,0,0,0.6), inset 0 0 0 1.5px #000, inset 0 0 0 3.5px #e5e5e5', // Inner thin black line + thin white line
                            padding: '48px 56px',
                            position: 'relative',
                            marginTop: '-14px', // Overlap with clip
                            zIndex: 5
                        }}>
                            
                            {/* Top Cutout (Pill shape) */}
                            <div style={{
                                position: 'absolute', top: '-6px', left: '50%', transform: 'translateX(-50%)',
                                width: '76px', height: '14px',
                                backgroundColor: '#000', // Black matching page bg to simulate transparency
                                borderRadius: '7px',
                                boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.8), 0 1px 1px rgba(255,255,255,0.3)',
                                zIndex: 6
                            }} />

                            {/* Content */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', color: '#f0f0f0', fontFamily: 'sans-serif', textAlign: 'left' }}>
                                {/* Heading */}
                                <h2 style={{
                                    fontFamily: 'sans-serif', fontWeight: 500,
                                    fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
                                    lineHeight: 1.2, letterSpacing: '0.01em',
                                    marginBottom: '4px',
                                    color: '#ffffff'
                                }}>
                                    The Future I Am Working Towards
                                </h2>

                                {/* Paragraphs */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', fontSize: '0.95rem', lineHeight: 1.6, color: '#c0c0c0', fontWeight: 400 }}>
                                    <p>The future I envision is one where technology feels more intelligent, accessible, and human-centered.</p>
                                    <p>My goal is not simply to build software, but to create products and systems that solve meaningful problems and improve the way people interact with technology. I am particularly drawn to the convergence of Artificial Intelligence, Software Engineering, and Product Design — three disciplines that, together, have the power to transform ideas into impactful experiences.</p>
                                    <p>As I continue to grow as an engineer, I aspire to contribute to products that are scalable, thoughtfully designed, and capable of creating real value for individuals, businesses, and communities. I believe the most enduring innovations are not built through complexity alone, but through a deep understanding of people, problems, and purpose.</p>
                                    <p>This journey is still in its early chapters, but the direction is clear: to keep learning, keep building, and contribute to a future where technology empowers more people to achieve their potential.</p>
                                </div>
                            </div>
                        </div>

                            </div>
                        </div>
                    </div>
                </section>


                {/* Footer Spacer */}
                <div className="h-20"></div>
            </main>

            {/* Subtle Footer Line */}
            <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent pointer-events-none"></div>
            <InteractiveFooter />
        </div>
    );
};
