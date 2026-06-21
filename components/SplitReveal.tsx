import React, { useRef, useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SplitRevealProps {
    children: React.ReactNode;
}

export const SplitReveal: React.FC<SplitRevealProps> = ({ children }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const doorsRef = useRef<HTMLDivElement>(null);
    const topDoorRef = useRef<HTMLDivElement>(null);
    const bottomDoorRef = useRef<HTMLDivElement>(null);
    const textTopRef = useRef<HTMLDivElement>(null);
    const textBottomRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        // Use GSAP to handle all transforms so there are no conflicts with Tailwind classes during scale
        gsap.set(textTopRef.current, { xPercent: -50, yPercent: -50, left: "50%", top: "100%" });
        gsap.set(textBottomRef.current, { xPercent: -50, yPercent: -50, left: "50%", top: "0%" });

        // If returning via Home/Archivist, jump scroll before GSAP initializes so it doesn't play the scrub animation!
        if ((window as any).__scrollToHero) {
            window.scrollTo(0, window.innerHeight * 1.5);
        }

        const ctx = gsap.context(() => {
            // Normal first-visit path: animated door split with scrub
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: () => "+=" + (window.innerHeight * 1.5), // Pins for 1.5x viewport height to scrub the animation smoothly
                    scrub: 1.5, // High smooth interpolation
                    pin: true,
                }
            });

            // The doors move apart smoothly
            tl.to(topDoorRef.current, { yPercent: -100, ease: "power2.inOut" }, 0);
            tl.to(bottomDoorRef.current, { yPercent: 100, ease: "power2.inOut" }, 0);

            // The text fades and scales up slightly during the split
            tl.to([textTopRef.current, textBottomRef.current], {
                opacity: 0.15,
                scale: 1.08,
                ease: "power2.inOut"
            }, 0);

        }, containerRef);

        return () => ctx.revert();
    }, []);

    const baseFontStyle: React.CSSProperties = { 
        fontSize: "clamp(55px, 18.5vw, 350px)",
        letterSpacing: "-0.04em",
        lineHeight: 0.85,
    };

    // Each word: solid half + hatched half. 'stripeSide' controls which half gets diagonal hatching.
    const wordStyles: { text: string; color: string; stripeSide: 'left' | 'right' }[] = [
        { text: 'RITESH', color: '#ffffff',  stripeSide: 'left'  },
        { text: 'KUMAR',  color: '#f97316',  stripeSide: 'right' },
        { text: 'LENKA',  color: '#dc2626',  stripeSide: 'left'  },
    ];

    const renderName = () => (
        <div className="flex flex-col items-center" style={{ gap: 0 }}>
            {wordStyles.map(({ text, color, stripeSide }) => {
                // Clip paths: one for solid half, one for hatched half
                const solidClip = stripeSide === 'left'
                    ? 'inset(0 0 0 50%)'   // solid on RIGHT half
                    : 'inset(0 50% 0 0)';   // solid on LEFT half
                const stripeClip = stripeSide === 'left'
                    ? 'inset(0 50% 0 0)'    // stripes on LEFT half
                    : 'inset(0 0 0 50%)';   // stripes on RIGHT half

                const stripeGradient = `repeating-linear-gradient(
                    -45deg,
                    ${color} 0px,
                    ${color} 4px,
                    transparent 4px,
                    transparent 9px
                )`;

                return (
                    <span key={text} className="relative block font-black uppercase" style={{ ...baseFontStyle }}>
                        {/* Layer 1: SOLID color — clipped to one half */}
                        <span
                            style={{
                                color: color,
                                clipPath: solidClip,
                                WebkitClipPath: solidClip,
                            }}
                        >
                            {text}
                        </span>

                        {/* Layer 2: HATCHED diagonal stripes — clipped to the other half */}
                        <span
                            aria-hidden="true"
                            className="absolute inset-0 font-black uppercase"
                            style={{
                                ...baseFontStyle,
                                background: stripeGradient,
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                clipPath: stripeClip,
                                WebkitClipPath: stripeClip,
                            }}
                        >
                            {text}
                        </span>
                    </span>
                );
            })}
        </div>
    );

    return (
        <div ref={containerRef} data-split-reveal className="relative w-full bg-black">
            
            {/* The Revealed Content */}
            {/* This div flows naturally taking up however much height the children need */}
            <div className="relative w-full z-0">
                {children}
            </div>

            {/* The Doors Container */}
            {/* Since it's absolute top-0 with 100vh, it covers the viewport perfectly during the ScrollTrigger pin */}
            <div ref={doorsRef} className="absolute top-0 left-0 w-full h-screen z-[9000] pointer-events-none overflow-hidden">
                
                {/* Top Door */}
                <div ref={topDoorRef} className="absolute top-0 left-0 w-full h-[50vh] bg-black pointer-events-auto overflow-hidden">
                    <div 
                        ref={textTopRef as React.RefObject<HTMLDivElement>}
                        className="absolute whitespace-nowrap will-change-transform"
                    >
                        {renderName()}
                    </div>
                </div>

                {/* Bottom Door */}
                <div ref={bottomDoorRef} className="absolute bottom-0 left-0 w-full h-[50vh] bg-black pointer-events-auto overflow-hidden">
                    <div 
                        ref={textBottomRef as React.RefObject<HTMLDivElement>}
                        className="absolute whitespace-nowrap will-change-transform"
                    >
                        {renderName()}
                    </div>
                </div>

            </div>
        </div>
    );
};
