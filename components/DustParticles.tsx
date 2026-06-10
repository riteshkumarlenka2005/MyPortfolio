import React, { useMemo } from 'react';

// Dust particle component
export const DustParticles: React.FC = () => {
    const particles = useMemo(() =>
        Array.from({ length: 25 }, (_, i) => ({
            id: i,
            left: `${35 + Math.random() * 50}%`,
            bottom: `${10 + Math.random() * 30}%`,
            size: `${1 + Math.random() * 2}px`,
            duration: `${3 + Math.random() * 5}s`,
            delay: `${Math.random() * 6}s`,
            opacity: 0.3 + Math.random() * 0.5,
        }))
        , []);

    return (
        <>
            {particles.map(p => (
                <div
                    key={p.id}
                    className="dust-particle"
                    style={{
                        left: p.left,
                        bottom: p.bottom,
                        width: p.size,
                        height: p.size,
                        animationDuration: p.duration,
                        animationDelay: p.delay,
                        opacity: p.opacity,
                    }}
                />
            ))}
        </>
    );
};
