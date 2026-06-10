import React, { useState, useRef, useEffect, useCallback } from 'react';

interface Certificate {
  id: number;
  title: string;
  issuer: string;
  image: string;
}

const CERTIFICATES: Certificate[] = [
  { id: 1, title: 'Data Science Course', issuer: 'CodeWithHarry', image: '/certificates/DataScienceCourse.png' },
  { id: 2, title: 'EduSkills', issuer: 'EduSkills Foundation', image: '/certificates/EduSkills.png' },
  { id: 3, title: 'NPTEL Course', issuer: 'NPTEL', image: '/certificates/NPTEL.png' },
  { id: 4, title: 'CMMC MacLead', issuer: 'Leadership Program', image: '/certificates/CMMC_MacLead.png' },
  { id: 5, title: 'Hackathon', issuer: 'Competition', image: '/certificates/Hakathon.png' },
  { id: 6, title: 'Internship', issuer: 'Python with MySQL', image: '/certificates/Internship.png' },
  { id: 7, title: 'Hacknovation 2.0', issuer: 'Hackathon', image: '/certificates/Hacknovation2.0.png' },
  { id: 8, title: 'AI Workshop', issuer: 'Workshop Certificate', image: '/certificates/AI_Workshop.png' },
  { id: 9, title: 'IoT Workshop', issuer: 'Workshop Certificate', image: '/certificates/IoT_workshop.png' },
  { id: 10, title: 'NPTEL IoT', issuer: 'NPTEL', image: '/certificates/NptelIoT.jpeg' },
];

export const CertificationsCarousel: React.FC = () => {
  const [scrollIndex, setScrollIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Touch state
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Intersection observer for fade-in
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const visibleCount = isMobile ? 1 : 5;
  const maxIndex = Math.max(0, CERTIFICATES.length - visibleCount);

  const scrollLeft = useCallback(() => {
    setScrollIndex(prev => Math.max(0, prev - 1));
  }, []);

  const scrollRight = useCallback(() => {
    setScrollIndex(prev => Math.min(maxIndex, prev + 1));
  }, [maxIndex]);

  // Touch handlers for mobile swipe
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const threshold = 40;
    if (Math.abs(touchDeltaX.current) > threshold) {
      if (touchDeltaX.current < 0) {
        scrollRight();
      } else {
        scrollLeft();
      }
    }
    touchDeltaX.current = 0;
  }, [scrollLeft, scrollRight]);

  // Trackpad scrolling (Wheel) — imperative listener with passive:false to block browser back/forward
  const wheelDeltaRef = useRef(0);
  const wheelTimeoutRef = useRef<number | null>(null);
  const scrollLeftRef = useRef(scrollLeft);
  const scrollRightRef = useRef(scrollRight);
  scrollLeftRef.current = scrollLeft;
  scrollRightRef.current = scrollRight;

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault(); // Block browser back/forward navigation

        wheelDeltaRef.current += e.deltaX;

        if (wheelDeltaRef.current > 40) {
          scrollRightRef.current();
          wheelDeltaRef.current = 0;
        } else if (wheelDeltaRef.current < -40) {
          scrollLeftRef.current();
          wheelDeltaRef.current = 0;
        }

        if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
        wheelTimeoutRef.current = window.setTimeout(() => {
          wheelDeltaRef.current = 0;
        }, 100);
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  // Close lightbox on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedCert(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Percentage per card (gap-inclusive)
  const gapPx = isMobile ? 12 : 16;
  const cardPercent = 100 / visibleCount;

  return (
    <>
      <section
        ref={sectionRef}
        className={`
          relative py-16 md:py-24 px-6 md:px-12 overflow-hidden
          bg-parchment-200/30 dark:bg-antique-100/20
          transition-all duration-1000 ease-out
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
        `}
      >
        {/* Section Header */}
        <div className="max-w-6xl mx-auto mb-10 md:mb-14">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-8 md:w-12 bg-amber-700/30 dark:bg-amber-600/30" />
              <span className="font-serif italic text-xs tracking-[0.2em] uppercase text-parchment-600 dark:text-antique-500">
                Credentials
              </span>
              <div className="h-px w-8 md:w-12 bg-amber-700/30 dark:bg-amber-600/30" />
            </div>
            <h2 className="font-display text-2xl md:text-4xl font-semibold tracking-wide text-parchment-900 dark:text-antique-900">
              Certifications
            </h2>
            <p className="font-serif text-sm max-w-md mx-auto">
              Professional credentials and completed training programs.
            </p>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="max-w-6xl mx-auto relative">
          {/* Left Arrow — Desktop Only */}
          {!isMobile && (
            <button
              onClick={scrollLeft}
              disabled={scrollIndex === 0}
              className={`
                absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-20
                w-11 h-11 flex items-center justify-center rounded-full
                border border-parchment-400/40 dark:border-antique-400/30
                bg-parchment-100/90 dark:bg-antique-50/90 backdrop-blur-sm
                shadow-lg hover:shadow-xl
                transition-all duration-300
                hover:border-amber-700 dark:hover:border-amber-500
                hover:bg-amber-700/10 dark:hover:bg-amber-500/10
                disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-parchment-400/40
              `}
              aria-label="Previous certificates"
            >
              <svg className="w-5 h-5 text-parchment-700 dark:text-antique-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Right Arrow — Desktop Only */}
          {!isMobile && (
            <button
              onClick={scrollRight}
              disabled={scrollIndex >= maxIndex}
              className={`
                absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-20
                w-11 h-11 flex items-center justify-center rounded-full
                border border-parchment-400/40 dark:border-antique-400/30
                bg-parchment-100/90 dark:bg-antique-50/90 backdrop-blur-sm
                shadow-lg hover:shadow-xl
                transition-all duration-300
                hover:border-amber-700 dark:hover:border-amber-500
                hover:bg-amber-700/10 dark:hover:bg-amber-500/10
                disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-parchment-400/40
              `}
              aria-label="Next certificates"
            >
              <svg className="w-5 h-5 text-parchment-700 dark:text-antique-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Track */}
          <div
            ref={trackRef}
            className="overflow-hidden mx-6 md:mx-14"
            onTouchStart={isMobile ? handleTouchStart : undefined}
            onTouchMove={isMobile ? handleTouchMove : undefined}
            onTouchEnd={isMobile ? handleTouchEnd : undefined}
          >
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                gap: `${gapPx}px`,
                transform: `translateX(calc(-${scrollIndex * cardPercent}% - ${scrollIndex * gapPx}px))`,
              }}
            >
              {CERTIFICATES.map((cert) => (
                <div
                  key={cert.id}
                  className="flex-shrink-0 cursor-pointer group"
                  style={{
                    width: `calc(${cardPercent}% - ${gapPx * (visibleCount - 1) / visibleCount}px)`,
                  }}
                  onClick={() => setSelectedCert(cert)}
                >
                  {/* Card */}
                  <div className="relative overflow-hidden rounded-xl border border-parchment-400/30 dark:border-antique-300/20 bg-parchment-100 dark:bg-antique-50 shadow-md hover-extreme-scale hover:border-amber-700/40 dark:hover:border-amber-500/30">
                    {/* Image */}
                    <div className="relative w-full aspect-[4/3] overflow-hidden bg-parchment-200/50 dark:bg-antique-100/50">
                      <img
                        src={cert.image}
                        alt={cert.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent && !parent.querySelector('.placeholder')) {
                            const placeholder = document.createElement('div');
                            placeholder.className = 'placeholder absolute inset-0 flex flex-col items-center justify-center text-parchment-500 dark:text-antique-400';
                            placeholder.innerHTML = `
                              <svg class="w-10 h-10 mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                              </svg>
                              <span class="text-xs font-serif opacity-50">Certificate</span>
                            `;
                            parent.appendChild(placeholder);
                          }
                        }}
                      />
                    </div>

                    {/* Info Bar */}
                    <div className="px-3 py-2.5 md:px-4 md:py-3">
                      <h3 className="font-display text-xs md:text-sm font-semibold text-parchment-900 dark:text-antique-900 leading-tight truncate">
                        {cert.title}
                      </h3>
                      <p className="font-serif text-[10px] md:text-xs text-parchment-800 dark:text-antique-800 mt-0.5 truncate">
                        {cert.issuer}
                      </p>
                    </div>

                    {/* Hover overlay icon */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-all duration-300 pointer-events-none">
                      <div className="w-10 h-10 rounded-full bg-white/90 dark:bg-stone-900/90 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 shadow-lg">
                        <svg className="w-5 h-5 text-amber-700 dark:text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-1.5 mt-6 md:mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setScrollIndex(i)}
                className={`
                  h-1.5 rounded-full transition-all duration-400 cursor-pointer
                  ${i === scrollIndex
                    ? 'w-6 bg-amber-700 dark:bg-amber-500'
                    : 'w-1.5 bg-parchment-400/40 dark:bg-antique-400/40 hover:bg-parchment-400/70'
                  }
                `}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ LIGHTBOX MODAL ═══ */}
      {selectedCert && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
          onClick={() => setSelectedCert(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

          {/* Modal Content */}
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center z-10 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute -top-2 -right-2 md:top-0 md:right-0 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 dark:bg-stone-800/90 text-stone-700 dark:text-stone-300 hover:bg-white dark:hover:bg-stone-700 shadow-xl transition-all z-20 text-lg font-bold"
            >
              ✕
            </button>

            {/* Certificate Image */}
            <div className="w-full overflow-hidden rounded-2xl shadow-2xl border border-white/10">
              <img
                src={selectedCert.image}
                alt={selectedCert.title}
                className="w-full h-auto object-contain bg-white dark:bg-stone-900 max-h-[75vh]"
              />
            </div>

            {/* Info below image */}
            <div className="mt-4 text-center">
              <h3 className="font-display text-lg md:text-xl font-semibold text-white">
                {selectedCert.title}
              </h3>
              <p className="font-serif text-sm text-white/60 mt-1">
                {selectedCert.issuer}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
