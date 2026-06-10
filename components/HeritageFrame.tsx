import React, { useEffect, useState } from 'react';

export const HeritageFrame: React.FC = () => {
  const [opacity, setOpacity] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setMounted(true);

    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        const scrollY = window.scrollY;
        const viewHeight = window.innerHeight;
        // Fade out logic: starts fading immediately, gone by 80% of the view height
        // This ensures they disappear as the user leaves the "entrance"
        const fadeRate = 0.8;
        const newOpacity = Math.max(0, 1 - (scrollY / (viewHeight * fadeRate)));
        setOpacity(newOpacity);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Common styling for the pillars
  // Uses a gradient to simulate a curved, metallic or polished wood surface
  // Includes subtle vertical banding for texture
  const pillarBaseClass = `
    absolute top-0 h-full w-4 md:w-16 lg:w-24 
    shadow-2xl hidden md:flex items-center overflow-hidden
    glass-crystal
    dark:!bg-gradient-to-b dark:from-antique-100 dark:via-antique-50 dark:to-antique-200
    transition-colors duration-1000
  `;

  // Vertical texture lines (grooves)
  const TextureGrooves = () => (
    <div className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
      style={{
        backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0,0,0,0.2) 11px, transparent 12px)'
      }}>
    </div>
  );

  return (
    <div
      className="fixed inset-0 pointer-events-none z-40 transition-opacity duration-1000 ease-out"
      style={{ opacity: mounted ? opacity : 0 }}
    >
      {/* Left Pillar */}
      <div className={`${pillarBaseClass} left-0 justify-end border-r border-white/30 dark:border-black/50`}>
        {/* Material Texture - hidden in light mode for glass clarity */}
        <div className="absolute inset-0 bg-paper-texture opacity-0 dark:opacity-20 pointer-events-none dark:mix-blend-overlay"></div>
        <TextureGrooves />

        {/* Lighting Effect: Inner Edge Glow (Rim Light) */}
        <div className="absolute right-0 top-0 w-full h-full bg-gradient-to-r from-black/60 via-transparent to-white/15 dark:to-green-500/10"></div>
        <div className="absolute right-0 top-0 w-[1px] h-full bg-gray-300/40 dark:bg-green-500/40 shadow-[0_0_15px_rgba(0,224,90,0.3)]"></div>
      </div>

      {/* Right Pillar */}
      <div className={`${pillarBaseClass} right-0 justify-start border-l border-white/30 dark:border-black/50`}>
        {/* Material Texture - hidden in light mode for glass clarity */}
        <div className="absolute inset-0 bg-paper-texture opacity-0 dark:opacity-20 pointer-events-none dark:mix-blend-overlay"></div>
        <TextureGrooves />

        {/* Lighting Effect: Inner Edge Glow (Rim Light) */}
        <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-l from-black/60 via-transparent to-white/15 dark:to-green-500/10"></div>
        <div className="absolute left-0 top-0 w-[1px] h-full bg-gray-300/40 dark:bg-green-500/40 shadow-[0_0_15px_rgba(0,224,90,0.3)]"></div>
      </div>
    </div>
  );
};
