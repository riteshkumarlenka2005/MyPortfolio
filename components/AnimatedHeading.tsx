import React, { useEffect, useRef, useState } from 'react';

interface AnimatedHeadingProps {
    text: string;
    className?: string;
}

export const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({ text, className = "" }) => {
    const headingRef = useRef<HTMLHeadingElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Re-animate every time — no disconnect
                setIsVisible(entry.isIntersecting);
            },
            {
                threshold: 0.2,
                rootMargin: '0px 0px -40px 0px',
            }
        );

        if (headingRef.current) {
            observer.observe(headingRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const words = text.split(' ');

    return (
        <h2
            ref={headingRef}
            className={`flex flex-wrap justify-center gap-x-5 md:gap-x-10 text-6xl md:text-8xl font-black uppercase tracking-tight overflow-hidden ${className}`}
        >
            {words.map((word, wordIndex) => (
                <span
                    key={wordIndex}
                    className="overflow-hidden inline-block"
                    aria-label={word}
                >
                    <span
                        className="inline-block"
                        style={{
                            transform: isVisible ? 'translateY(0)' : 'translateY(110%)',
                            opacity: isVisible ? 1 : 0,
                            transition: `transform 0.75s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease`,
                            transitionDelay: `${wordIndex * 100}ms`,
                            color: 'rgba(255, 255, 255, 0.95)',
                            willChange: 'transform',
                        }}
                    >
                        {word}
                    </span>
                </span>
            ))}
        </h2>
    );
};
