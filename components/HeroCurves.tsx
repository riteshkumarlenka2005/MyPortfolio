import React from 'react';

/**
 * Two premium animated SVG curves for the hero section background.
 * - Curve 1: Sweeping arc from lower-left toward upper-center
 * - Curve 2: Elegant descending arc from center toward bottom-right
 *
 * Each curve draws itself on load, a glowing dot travels along the path,
 * then the line settles into an ultra-slow floating drift.
 */
export const HeroCurves: React.FC = () => {
  // Generous overestimate path lengths for dash animation
  const curve1Length = 1000;
  const curve2Length = 1000;

  // Exact curves matching the user's sketch coordinates
  const curve1Path = 'M -50 350 C 80 250, 180 120, 280 -50';
  const curve2Path = 'M 930 920 C 950 680, 1150 560, 1460 520';

  return (
    <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden select-none">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Definitions for the glow dot filter and motion paths */}
        <defs>
          {/* Soft radial glow for the traveling dot */}
          <radialGradient id="dotGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
            <stop offset="40%" stopColor="rgba(255,255,255,0.3)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>

          {/* Motion paths for the dots */}
          <path id="curvePath1" d={curve1Path} />
          <path id="curvePath2" d={curve2Path} />
        </defs>

        {/* ═══ Curve 1 — Top-Left sweeping arc ═══ */}
        <path
          d={curve1Path}
          stroke="rgba(220, 220, 220, 0.4)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#curveBlur)"
          className="hero-curve hero-curve-1"
          style={{
            strokeDasharray: curve1Length,
            strokeDashoffset: curve1Length,
          }}
        />

        {/* Glow dot traveling along Curve 1 */}
        <circle r="6" fill="url(#dotGlow)" className="hero-dot hero-dot-1" opacity="0">
          <animateMotion
            dur="2.5s"
            begin="0s"
            fill="freeze"
            keyTimes="0;1"
            keySplines="0.42 0 0.58 1"
            calcMode="spline"
          >
            <mpath href="#curvePath1" />
          </animateMotion>
          {/* Fade in quickly, stay, fade out at end */}
          <animate attributeName="opacity" values="0;0.8;0.8;0" keyTimes="0;0.05;0.85;1" dur="2.5s" begin="0s" fill="freeze" />
        </circle>

        {/* ═══ Curve 2 — Bottom-Right descending arc ═══ */}
        <path
          d={curve2Path}
          stroke="rgba(220, 220, 220, 0.4)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#curveBlur)"
          className="hero-curve hero-curve-2"
          style={{
            strokeDasharray: curve2Length,
            strokeDashoffset: curve2Length,
          }}
        />

        {/* Glow dot traveling along Curve 2 */}
        <circle r="6" fill="url(#dotGlow)" className="hero-dot hero-dot-2" opacity="0">
          <animateMotion
            dur="2.5s"
            begin="0.4s"
            fill="freeze"
            keyTimes="0;1"
            keySplines="0.42 0 0.58 1"
            calcMode="spline"
          >
            <mpath href="#curvePath2" />
          </animateMotion>
          <animate attributeName="opacity" values="0;0.8;0.8;0" keyTimes="0;0.05;0.85;1" dur="2.5s" begin="0.4s" fill="freeze" />
        </circle>

        {/* Subtle blur filter for the lines */}
        <filter id="curveBlur">
          <feGaussianBlur stdDeviation="0.3" />
        </filter>
      </svg>
    </div>
  );
};
