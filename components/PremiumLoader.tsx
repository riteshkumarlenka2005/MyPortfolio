import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export const PremiumLoader: React.FC = () => {
  const [isAnimating, setIsAnimating] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const lineContainerRef = useRef<HTMLDivElement>(null);
  const lineFillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prevent scrolling while loader is active
    document.body.style.overflow = 'hidden';

    // Ensure we start at the top of the page
    window.scrollTo(0, 0);

    // Initialize main content to be hidden
    gsap.set('#main-content', { opacity: 0 });

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
        setIsAnimating(false);
      }
    });

    // Step 1: Page loads. White fullscreen overlay appears. 
    // ARCHIVIST fades in smoothly.
    tl.to(textRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power3.out',
    }, "+=0.1"); // Small delay after page load

    // Step 2: Loading line container appears, then line fills smoothly
    tl.to(lineContainerRef.current, {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
    }, "-=0.3");

    // Progress moves smoothly from 0% -> 100%
    tl.to(lineFillRef.current, {
      scaleX: 1,
      duration: 0.8,
      ease: 'power2.inOut',
    });

    // Step 3: When progress reaches 100%: Small pause
    // ARCHIVIST fades out, Loading bar fades out
    tl.to([textRef.current, lineContainerRef.current], {
      opacity: 0,
      y: -10,
      duration: 0.4,
      ease: 'power3.inOut',
      stagger: 0.1
    }, "+=0.1");

    // Step 4: Entire white overlay slides upward and disappears.
    tl.to(containerRef.current, {
      yPercent: -100,
      duration: 0.6,
      ease: 'power4.inOut',
    }, "+=0.05");

    // Reveal main website with smooth fade-in
    tl.to('#main-content', {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.inOut',
      clearProps: 'opacity', // clean up inline styles after animation
    }, "<0.1"); // Start slightly after the slide starts

    return () => {
      tl.kill();
      document.body.style.overflow = '';
    };
  }, []);

  // Completely remove from DOM after animation completes
  if (!isAnimating) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-white transform-gpu"
    >
      <div className="flex flex-col items-center">
        <h1
          ref={textRef}
          className="text-black font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-[0.2em] sm:tracking-[0.25em] mb-12 opacity-0 translate-y-4 text-center px-4"
          style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
        >
          ARCHIVIST
        </h1>
        
        <div 
          ref={lineContainerRef}
          className="w-[80vw] max-w-[320px] h-[4px] bg-[#e5e5e5] rounded-full overflow-hidden opacity-0"
        >
          <div 
            ref={lineFillRef}
            className="w-full h-full bg-black origin-left scale-x-0 rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
