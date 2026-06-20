import React, { useEffect, useRef, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BOOK_PAGES, BookPageData } from '../data/bookPages';
import { DustParticles } from './DustParticles'; // Reusing dust particles

gsap.registerPlugin(ScrollTrigger);

export const RealisticBook: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const bookRef = useRef<HTMLDivElement>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [isFlipping, setIsFlipping] = useState(false);

    // Total spreads (cover + pages / 2)
    // We have 7 content pages (0-6). 
    // Page 0 (inner cover) is on the left.
    // Page 1 is on the right.
    // So distinct physical "sheets" needed.
    // Sheet 1: Front (Cover), Back (Page 0)
    // Sheet 2: Front (Page 1), Back (Page 2)
    // Sheet 3: Front (Page 3), Back (Page 4)
    // Sheet 4: Front (Page 5), Back (Page 6)
    // Sheet 5: Front (Page 7 - if any), Back (Back Cover)

    // Let's organize data into sheets for 3D rendering
    const sheets = useMemo(() => {
        // We need to map linear pages to physical sheets
        // Sheet 0 is the Cover (Front = Texture, Back = Page 0)
        // Last Sheet is Back Cover

        // This is a simplified model for the "Realistic Book"
        // We will render a stack of divs.

        const physicalSheets = [];

        // Front Cover Sheet (Logic handled separately or as index -1?)
        // Let's treat index 0 as the spread 0 (Inner Front Cover + Page 1)
        // Wait, standard book:
        // Closed: Front Cover visible.
        // Open 1: Inner Front Cover (Left), Page 1 (Right).
        // Flip: Page 1 moves to Left (becoming Page 2 on back), Page 3 reveals on Right.

        // Let's structure 'pages' for the flip animation.
        // A "Page" component in 3D has a Front and a Back.
        // Page 0 (Physical): Front = Cover, Back = Inner Cover (Page Data 0)
        // Page 1 (Physical): Front = Page Data 1, Back = Page Data 2
        // Page 2 (Physical): Front = Page Data 3, Back = Page Data 4
        // Page 3 (Physical): Front = Page Data 5, Back = Page Data 6
        // Page 4 (Physical): Front = Page Data 7... Back = Back Cover

        return [
            { id: 'cover', front: { type: 'cover' }, back: BOOK_PAGES[0] }, // Sheet 0
            { id: 'sheet-1', front: BOOK_PAGES[1], back: BOOK_PAGES[2] },   // Sheet 1
            { id: 'sheet-2', front: BOOK_PAGES[3], back: BOOK_PAGES[4] },   // Sheet 2
            { id: 'sheet-3', front: BOOK_PAGES[5], back: BOOK_PAGES[6] },   // Sheet 3
        ];
    }, []);

    // Initial Scroll Opening Animation
    useEffect(() => {
        if (!sectionRef.current || !bookRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top center",
                end: "center center",
                scrub: 1,
                onEnter: () => setIsOpen(true), // Start allowing interactions
            }
        });

        // Animate from closed flat state to slightly open angled state
        // User requested: "straight vertical" and "slightly right ward"
        tl.fromTo(bookRef.current,
            { rotationX: 0, rotationY: 0, rotateZ: 0, x: 0 },
            { rotationX: 5, rotationY: 0, rotateZ: 0, x: 50, duration: 1, ease: "power2.out" }
        );

        return () => {
            if (tl.scrollTrigger) tl.scrollTrigger.kill();
            tl.kill();
        };
    }, []);

    const handleFlip = (sheetIndex: number, direction: 'forward' | 'backward') => {
        if (isFlipping) return;
        setIsFlipping(true);

        const sheetId = `#sheet-${sheetIndex}`;
        const targetRotation = direction === 'forward' ? -180 : 0;

        // Advanced Physics: Add a slight "lift" and scale curve during the flip for realism
        const tl = gsap.timeline({
            onComplete: () => {
                setIsFlipping(false);
                setCurrentPage(prev => direction === 'forward' ? prev + 1 : prev - 1);
            }
        });

        // Rotation
        tl.to(sheetId, {
            rotationY: targetRotation,
            duration: 1.2,
            ease: "power2.inOut", // Smooth transition
        }, 0);

        // Z-axis lift (arc effect) to prevent clipping and add realism
        tl.to(sheetId, {
            z: 40, // Higher lift for realism
            duration: 0.6,
            ease: "sine.inOut",
            yoyo: true,
            repeat: 1
        }, 0);

        // Z-index management to prevent clipping during flip
        tl.set(sheetId, { zIndex: 20 }, 0); // Bring to front while flipping
        tl.set(sheetId, {
            zIndex: direction === 'forward' ? sheetIndex : (sheets.length - sheetIndex),
            immediateRender: false
        }, 0.6); // Restore z-index halfway through

        // Shadow intensity (optional, but adds depth)
    };


    return (
        <div ref={sectionRef} className="relative w-full h-[150vh] flex items-center justify-center bg-transparent perspective-3000 overflow-hidden pointer-events-none">
            {/* Extended height for scroll trigger space */}

            <div className="absolute inset-0 pointer-events-auto"> {/* Interactive layer */}
                <div className="sticky top-0 h-screen w-full flex items-center justify-center">

                    {/* The 3D Book Container */}
                    <div
                        ref={bookRef}
                        className="book-3d relative w-[350px] md:w-[450px] h-[500px] md:h-[600px] transform-style-3d cursor-grab active:cursor-grabbing transition-transform duration-500"
                    >
                        {/* Back Cover (Static at bottom of stack) */}
                        <div className="absolute inset-0 bg-[#2a1a10] rounded-l-md transform translate-z-[-20px] shadow-2xl" />

                        {/* Sheets */}
                        {sheets.map((sheet, index) => (
                            <div
                                key={sheet.id}
                                id={`sheet-${index}`}
                                className="book-page absolute inset-0 transform-style-3d origin-left"
                                style={{
                                    zIndex: sheets.length - index,
                                    transform: `translateZ(${index * 2}px)` // Increased spacing prevents z-fighting
                                }}
                                onClick={() => {
                                    // Logic: if current page matches index, we flip forward. 
                                    // If we are clicking a flipped page (already -180), we flip back.
                                    // Simplified interaction: Click right side to flip next, left side to flip back.

                                    // We need to know state. DOM rotation is truth.
                                    // GSAP handles the visual state.

                                    // Check current rotation via GSAP or state?
                                    // Let's use internal state tracking for simplicity in this MVP.
                                    // If index < currentPage, it's already flipped (on left). Click updates it to "unflipped".
                                    // If index === currentPage, it's on right (top of stack). Click flips it.

                                    // Note: "currentPage" tracks how many sheets are flipped.
                                    // 0 means only cover is visible (or closed).
                                    // Let's say 0 = closed.

                                    const element = document.getElementById(`sheet-${index}`);
                                    const currentRot = gsap.getProperty(element, "rotationY") as number;

                                    if (currentRot < -90) {
                                        handleFlip(index, 'backward');
                                    } else {
                                        handleFlip(index, 'forward');
                                    }
                                }}
                            >
                                {/* Front of Sheet */}
                                <div className="page-face page-front absolute inset-0 bg-[#f4e4bc] text-black backface-hidden overflow-hidden rounded-r-md shadow-inner border-l border-black/5">
                                    <PageContent data={sheet.front} side="front" />
                                    {/* Leather Cover override for Sheet 0 Front */}
                                    {index === 0 && (
                                        <div className="absolute inset-0 bg-leather-texture flex flex-col items-center justify-center text-center p-8 border-4 border-[#5d4037]">
                                            <div className="w-full h-full border-2 border-[#d4af37]/30 flex items-center justify-center">
                                                <h1 className="font-display text-4xl md:text-6xl text-[#d4af37] tracking-widest uppercase shadow-gold drop-shadow-md">
                                                    Archive<br />of the<br />Ancients
                                                </h1>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Back of Sheet */}
                                <div className="page-face page-back absolute inset-0 bg-[#f4e4bc] text-black backface-hidden rotate-y-180 overflow-hidden rounded-l-md shadow-inner border-r border-black/5">
                                    <PageContent data={sheet.back} side="back" />
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </div>

            {/* Ambient Atmosphere */}
            <div className="absolute inset-0 pointer-events-none">
                <DustParticles />
            </div>
        </div>
    );
};

// Sub-component for rendering content based on type
const PageContent: React.FC<{ data: any, side: 'front' | 'back' }> = ({ data, side }) => {
    if (!data) return null;
    if (data.type === 'cover') return null; // Handled inline

    return (
        <div className="w-full h-full p-6 md:p-8 flex flex-col relative">
            {/* Paper Texture Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-paper-noise opacity-10 mix-blend-multiply" />
            <div className={`absolute inset-0 pointer-events-none bg-gradient-to-r ${side === 'front' ? 'from-black/10 to-transparent' : 'from-transparent to-black/10'} opacity-30`} />

            {/* Content Container */}
            <div className="relative z-10 h-full flex flex-col">
                {/* Header */}
                {data.title && (
                    <div className="mb-6 border-b-2 border-black/10 pb-2">
                        <h2 className="font-display text-2xl md:text-3xl text-[#2c1810]">{data.title}</h2>
                        {data.subtitle && <span className="font-serif text-sm italic text-[#5d4037]">{data.subtitle}</span>}
                    </div>
                )}

                {/* Body Content based on Type */}
                <div className="flex-1 overflow-hidden">
                    {data.content?.paragraphs && (
                        <div className="space-y-4 font-serif text-sm md:text-base leading-relaxed text-[#3e2b20]">
                            {data.content.paragraphs.map((p: string, i: number) => (
                                <p key={i}>{p}</p>
                            ))}
                        </div>
                    )}

                    {data.type === 'profile' && data.content.profileImage && (
                        <div className="flex flex-col items-center mt-4">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-md overflow-hidden mb-4 sepia-[.3]">
                                <img src={data.content.profileImage} alt="Profile" className="w-full h-full object-cover" />
                            </div>
                            <div className="text-center font-serif">
                                <p className="font-bold text-lg">{data.content.name}</p>
                                <p className="italic text-sm">{data.content.role}</p>
                                <p className="text-xs uppercase tracking-widest mt-2">{data.content.location} • {data.content.timeline}</p>
                            </div>
                        </div>
                    )}

                    {data.content?.items && (
                        <ul className="space-y-4">
                            {data.content.items.map((item: any, i: number) => (
                                <li key={i} className="group">
                                    <h3 className="font-bold font-display text-lg text-[#2c1810] group-hover:text-[#8b4513] transition-colors">{item.title}</h3>
                                    <p className="font-serif text-xs md:text-sm text-[#5d4037]">{item.description}</p>
                                </li>
                            ))}
                        </ul>
                    )}

                    {data.content?.skills && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data.content.skills.map((cat: any, i: number) => (
                                <div key={i} className="bg-white/40 p-3 rounded-sm border border-black/5 shadow-sm">
                                    <h4 className="font-display font-bold text-sm mb-2 text-[#2c1810] uppercase tracking-wider">{cat.category}</h4>
                                    <div className="flex flex-wrap gap-1">
                                        {cat.items.map((skill: string, j: number) => (
                                            <span key={j} className="text-[10px] md:text-xs font-serif bg-[#e6d5b8] px-2 py-1 rounded-full text-[#3e2b20]">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {data.type === 'quote' && (
                        <div className="h-full flex flex-col justify-center text-center px-4">
                            <blockquote className="font-serif text-xl md:text-2xl italic text-[#2c1810] leading-loose">
                                {data.content.quote}
                            </blockquote>
                            <cite className="block mt-6 font-display text-sm font-bold not-italic">— {data.content.quoteAuthor}</cite>
                        </div>
                    )}
                </div>

                {/* Footer Decor */}
                <div className="mt-4 pt-2 border-t border-black/5 flex justify-between items-center font-serif text-[10px] uppercase tracking-[0.2em]">
                    <span>Fig. {data.id + 1}</span>
                    <span>{data.type}</span>
                </div>
            </div>
        </div>
    );
};
