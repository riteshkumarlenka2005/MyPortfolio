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
                setIsVisible(entry.isIntersecting);
            },
            {
                threshold: 0.1, // Lower threshold to ensure it triggers
                rootMargin: '0px 0px -50px 0px',
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
            className={`flex flex-wrap justify-center gap-x-4 md:gap-x-8 text-6xl md:text-8xl font-black uppercase drop-shadow-2xl ${className}`}
        >
            {words.map((word, wordIndex) => (
                <span key={wordIndex} className="inline-flex">
                    {word.split('').map((char, charIndex) => {
                        const previousChars = words.slice(0, wordIndex).reduce((sum, w) => sum + w.length, 0);
                        const delay = (previousChars + charIndex) * 50; 

                        return (
                            <span
                                key={charIndex}
                                className="inline-block"
                                style={{ 
                                    transition: 'all 1500ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                                    transitionDelay: `${delay}ms`,
                                    letterSpacing: isVisible ? '0.1em' : '0.5em',
                                    filter: isVisible ? 'blur(0px)' : 'blur(16px)',
                                    opacity: isVisible ? 1 : 0,
                                    transform: isVisible ? 'scale(1) translateY(0)' : 'scale(1.3) translateY(20px)',
                                    color: isVisible ? 'rgba(255, 255, 255, 0.95)' : 'rgba(34, 197, 94, 1)' // Starts bright green, becomes white
                                }}
                            >
                                {char === ' ' ? '\u00A0' : char}
                            </span>
                        );
                    })}
                </span>
            ))}
        </h2>
    );
};
