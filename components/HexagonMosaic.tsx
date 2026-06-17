import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const HexagonMosaic: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(containerRef.current, 
                { scale: 0.9, opacity: 0, y: 20 },
                { 
                    scale: 1, 
                    opacity: 1, 
                    y: 0,
                    duration: 1.5, 
                    ease: "power3.out",
                }
            );

            gsap.to(containerRef.current, {
                y: "-=12",
                duration: 4,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Exact math for the honeycomb cluster
    const R = 155; // Increased base radius for much larger shapes
    const gap = 3; // Reduced gap for tighter shapes
    const r_border = R; // The outer border polygon radius
    const r_img = R - gap; // The inner image polygon radius

    // Generate flat-topped hexagon points
    const hexPoly = (cx: number, cy: number, r: number) => {
        const h = Math.sqrt(3) * r;
        return `${cx - r/2},${cy - h/2} ${cx + r/2},${cy - h/2} ${cx + r},${cy} ${cx + r/2},${cy + h/2} ${cx - r/2},${cy + h/2} ${cx - r},${cy}`;
    };

    const H_step = Math.sqrt(3) * R; 
    const W_step = 1.5 * R;

    // Exact layout matching the user's reference image
    const centers = [
        { cx: 0, cy: 0 }, // Center (Face)
        { cx: 0, cy: -H_step }, // Top
        { cx: 0, cy: H_step }, // Bottom
        { cx: -W_step, cy: -H_step/2 }, // Top-Left
        { cx: W_step, cy: -H_step/2 }, // Top-Right
        { cx: W_step, cy: H_step/2 }, // Bottom-Right
        // Missing Bottom-Left to match the asymmetrical reference shape perfectly
    ];

    return (
        <div ref={containerRef} className="relative w-full h-[50vh] lg:h-[75vh] min-h-[400px] flex items-center justify-center">
            {/* The SVG viewBox is sized to perfectly contain the cluster with padding for shadows */}
            <svg 
                viewBox="-450 -450 900 900" 
                className="w-full h-full max-h-[80vh] max-w-[600px] xl:max-w-[750px] drop-shadow-2xl"
                style={{ filter: 'drop-shadow(0 25px 35px rgba(0,0,0,0.6))' }}
            >
                <defs>
                    <clipPath id="hex-image-clip">
                        {centers.map((c, i) => (
                            <polygon key={`clip-${i}`} points={hexPoly(c.cx, c.cy, r_img)} />
                        ))}
                    </clipPath>
                    
                    {/* Shadow/Glow effect on the white border itself to pop out from dark background */}
                    <filter id="border-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>

                    {/* Professional Studio Backdrop Gradient */}
                    <radialGradient id="studio-backdrop" cx="50%" cy="40%" r="70%">
                        <stop offset="0%" stopColor="#3a404d" />
                        <stop offset="100%" stopColor="#12151c" />
                    </radialGradient>
                </defs>

                {/* 1. White Background/Borders */}
                <g filter="url(#border-glow)">
                    {centers.map((c, i) => (
                        <polygon 
                            key={`border-${i}`} 
                            points={hexPoly(c.cx, c.cy, r_border)} 
                            className="fill-white"
                        />
                    ))}
                </g>

                {/* 2. The Professional Background Masked by inner hexagons */}
                <rect 
                    x="-450" 
                    y="-450" 
                    width="900" 
                    height="900" 
                    fill="url(#studio-backdrop)" 
                    clipPath="url(#hex-image-clip)" 
                />

                {/* 3. The Photo masked by the same inner hexagons */}
                <image 
                    href="/BackgroundPhoto.png" 
                    x="-450" 
                    // Shifting Y slightly up so the face aligns better in the center hexagon
                    y="-490" 
                    width="900" 
                    height="980" 
                    clipPath="url(#hex-image-clip)" 
                    preserveAspectRatio="xMidYMid slice"
                    // Slight contrast boost to make it pop inside the crisp white borders
                    className="filter contrast-[1.05]"
                />
            </svg>
        </div>
    );
};
