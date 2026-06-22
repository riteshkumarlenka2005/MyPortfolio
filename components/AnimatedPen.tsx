import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const AnimatedPen: React.FC = () => {
    const penRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const pen = penRef.current;
        if (!pen) return;

        // Use GSAP to handle all transforms so they don't overwrite each other
        gsap.set(pen, { yPercent: -42, x: "100%", opacity: 0 });

        const ctx = gsap.context(() => {
            gsap.to(pen, {
                x: "50%", // Half of the pen remains off-screen
                opacity: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: pen.parentElement,
                    start: "top 110%", 
                    end: "top 70%",
                    scrub: 0.8,
                }
            });
        }, pen);

        return () => ctx.revert();
    }, []);

    return (
        <img 
            ref={penRef}
            src="/FinalPen.png" 
            alt="3D Luxury Pen" 
            // Removed -translate-y-1/2 because GSAP handles yPercent
            className="absolute top-1/2 w-[400px] md:w-[600px] lg:w-[800px] object-contain pointer-events-none z-0"
            style={{ 
                right: 'calc(-50vw + 50%)'
            }} 
        />
    );
};
