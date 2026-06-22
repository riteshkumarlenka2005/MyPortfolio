import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface DeepRevealTextProps {
    text: string;
}

export const DeepRevealText: React.FC<DeepRevealTextProps> = ({ text }) => {
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = textRef.current;
        if (!el) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(el, 
                {
                    opacity: 0,
                    scale: 0.6,
                    filter: 'blur(16px)',
                    y: 40
                },
                {
                    opacity: 1,
                    scale: 1,
                    filter: 'blur(0px)',
                    y: 0,
                    duration: 1.6,
                    ease: "expo.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                        toggleActions: "play reverse play reverse",
                    }
                }
            );
        }, el);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={textRef} className="will-change-[transform,opacity,filter] transform-gpu origin-center">
            {text}
        </div>
    );
};
