import React, { useEffect, useRef, useState } from 'react';

interface BlurRevealProps {
    children: React.ReactNode;
    delay?: number;
    blurAmount?: string;
    duration?: number;
}

export const BlurReveal: React.FC<BlurRevealProps> = ({ 
    children, 
    delay = 0, 
    blurAmount = '12px',
    duration = 1200
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                // Small additional delay to ensure smooth rendering on scroll
                setTimeout(() => setIsVisible(true), 50);
            } else {
                setIsVisible(false);
            }
        }, { threshold: 0.2 }); // Trigger when 20% visible

        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => observer.disconnect();
    }, []);

    return (
        <div 
            ref={ref}
            style={{
                filter: isVisible ? 'blur(0px)' : `blur(${blurAmount})`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.98)',
                transition: `
                    filter ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, 
                    opacity ${duration * 0.8}ms ease-out ${delay}ms, 
                    transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms
                `,
                willChange: 'filter, opacity, transform'
            }}
        >
            {children}
        </div>
    );
};
