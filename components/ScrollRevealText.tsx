import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealTextProps {
    text: string;
    className?: string;
}

export const ScrollRevealText: React.FC<ScrollRevealTextProps> = ({ 
    text, 
    className = ""
}) => {
    const containerRef = useRef<HTMLSpanElement>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let animationFrameId: number;
        
        const checkScroll = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                
                // Define start and end points for the reveal
                // Starts revealing when element enters the bottom 85% of the viewport
                const startReveal = windowHeight * 0.90; 
                // Fully revealed when element reaches 40% of the viewport
                const endReveal = windowHeight * 0.40;   
                
                // Use the element's top position
                const currentPos = rect.top;
                
                if (currentPos > startReveal) {
                    setProgress(0);
                } else if (currentPos < endReveal) {
                    setProgress(1);
                } else {
                    const currentProgress = (startReveal - currentPos) / (startReveal - endReveal);
                    setProgress(currentProgress);
                }
            }
            animationFrameId = requestAnimationFrame(checkScroll);
        };
        
        animationFrameId = requestAnimationFrame(checkScroll);
        
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    // Split text keeping spaces as separate tokens
    const words = text.split(/(\s+)/);
    const totalWords = words.filter(w => !/\s+/.test(w)).length;

    let wordIndex = 0;

    return (
        <span ref={containerRef} className={className}>
            {words.map((word, i) => {
                if (/\s+/.test(word)) {
                    return <span key={i}>{word}</span>;
                }
                
                const currentWordIndex = wordIndex++;
                
                // Words reveal sequentially
                const wordStart = currentWordIndex / totalWords;
                // Add a small fade window per word so it looks smooth
                const wordEnd = Math.min(1, wordStart + (2 / totalWords)); 
                
                let wordProgress = 0;
                if (progress > wordEnd) {
                    wordProgress = 1;
                } else if (progress > wordStart) {
                    wordProgress = (progress - wordStart) / (wordEnd - wordStart);
                }
                
                // The image shows text turning from gray to highlighted text.
                // We'll transition from a dark gray to bright white.
                return (
                    <span 
                        key={i} 
                        className="inline-block transition-colors duration-100"
                        style={{ 
                            color: wordProgress > 0.1 ? '#ffffff' : '#4b5563', // #4b5563 is Tailwind gray-600
                            opacity: 0.3 + (0.7 * wordProgress),
                            textShadow: wordProgress > 0.8 ? `0 0 12px rgba(255,255,255,0.5)` : 'none',
                        }} 
                    >
                        {word}
                    </span>
                );
            })}
        </span>
    );
};
