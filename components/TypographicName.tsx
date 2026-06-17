import React from 'react';

export const TypographicName = () => {
    return (
        <div className="w-full h-full bg-[#030305] relative flex items-center justify-center overflow-hidden font-sans select-none">
            
            {/* Decorative Vertical Lines */}
            <div className="absolute top-[10%] left-[25%] w-2 h-[45%] bg-[repeating-linear-gradient(to_bottom,#fff_0px,#fff_8px,transparent_8px,transparent_16px)] opacity-90" />
            <div className="absolute top-[40%] left-[20%] w-2 h-[35%] bg-[repeating-linear-gradient(to_bottom,#fff_0px,#fff_8px,transparent_8px,transparent_16px)] opacity-90" />
            <div className="absolute top-[45%] left-[45%] w-2 h-[30%] bg-[repeating-linear-gradient(to_bottom,#f97316_0px,#f97316_8px,transparent_8px,transparent_16px)] opacity-90" />
            <div className="absolute top-[60%] left-[62%] w-2 h-[30%] bg-[repeating-linear-gradient(to_bottom,#dc2626_0px,#dc2626_8px,transparent_8px,transparent_16px)] opacity-90" />
            <div className="absolute top-[30%] left-[72%] w-2 h-[25%] bg-[repeating-linear-gradient(to_bottom,#fff_0px,#fff_8px,transparent_8px,transparent_16px)] opacity-90" />

            {/* Small top text */}
            <div className="absolute top-[28%] left-[45%] text-white text-[9px] tracking-[0.2em] font-bold z-10 flex flex-col items-start leading-tight">
                <span className="flex items-center gap-2">CREATE <span className="w-4 h-[1px] bg-white"></span></span>
                <span>YOUR OWN FUTURE</span>
            </div>

            {/* Small bottom text */}
            <div className="absolute top-[72%] left-[48%] text-white text-[9px] tracking-[0.2em] font-bold z-10 flex flex-col items-center leading-tight">
                <span>FOCUS ON WHERE</span>
                <span>YOU WANT</span>
                <span>TO GO</span>
            </div>

            {/* SVG Typography Container */}
            <svg viewBox="0 0 800 800" className="w-full h-full absolute inset-0 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] z-10 pointer-events-none">
                <defs>
                    <pattern id="stripeWhite" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)">
                        <line x1="0" y1="0" x2="0" y2="10" stroke="#ffffff" strokeWidth="3.5" />
                    </pattern>
                    <pattern id="stripeOrange" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)">
                        <line x1="0" y1="0" x2="0" y2="10" stroke="#f97316" strokeWidth="3.5" />
                    </pattern>
                    <pattern id="stripeRed" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)">
                        <line x1="0" y1="0" x2="0" y2="10" stroke="#dc2626" strokeWidth="3.5" />
                    </pattern>
                    
                    <clipPath id="cut-right">
                        <rect x="0" y="-150" width="55%" height="300" />
                    </clipPath>
                    <clipPath id="cut-left">
                        <rect x="55%" y="-150" width="50%" height="300" />
                    </clipPath>
                    <clipPath id="cut-top">
                        <rect x="-50" y="0" width="300" height="100" />
                    </clipPath>
                </defs>

                <style>
                    {`
                        .text-heavy {
                            font-family: 'Inter', 'Helvetica Neue', sans-serif;
                            font-weight: 900;
                            font-size: 150px;
                            letter-spacing: -6px;
                        }
                    `}
                </style>

                {/* Center group */}
                <g transform="translate(400, 400)" className="text-heavy">
                    
                    {/* --- RITESH (White) --- */}
                    <g transform="translate(0, -90)" textAnchor="middle">
                        <text x="0" y="0" fill="#ffffff">RITESH</text>
                        {/* Cut striped layer over it (e.g. half of the letters) */}
                        <text x="0" y="0" fill="url(#stripeWhite)" clipPath="url(#cut-right)">RITESH</text>
                    </g>

                    {/* --- KUMAR (Orange) --- */}
                    <g transform="translate(0, 30)" textAnchor="middle">
                        <text x="0" y="0" fill="#f97316">KUMAR</text>
                        {/* Striped overlay */}
                        <text x="0" y="0" fill="url(#stripeOrange)" clipPath="url(#cut-left)">KUMAR</text>
                    </g>

                    {/* --- LENKA (Red) --- */}
                    <g transform="translate(40, 150)" textAnchor="middle">
                        <text x="0" y="0" fill="#dc2626">LENKA</text>
                        <text x="0" y="0" fill="url(#stripeRed)" clipPath="url(#cut-right)">LENKA</text>
                    </g>

                </g>
            </svg>
        </div>
    );
};
