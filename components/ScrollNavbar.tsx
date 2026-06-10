import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavItem } from '../types';

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'about', label: 'About', href: '/about' },

  { id: 'projects', label: 'Projects', href: '/projects' },
  { id: 'journey', label: 'Journey', href: '/journey' },
  { id: 'resources', label: 'Resources', href: '/resources' },
  { id: 'contact', label: 'Contact', href: '/contact' },
];

// Constants for scroll behavior
const FULL_HEIGHT = 52; // Fully unrolled parchment height
const ROLLED_HEIGHT = 10; // Minimum visible height when rolled up (shows the roller hint)
const SCROLL_THRESHOLD = 50; // Pixels scrolled before navbar starts rolling
const CURSOR_INTENT_ZONE = 120; // Pixels from top where cursor triggers unroll

export const ScrollNavbar: React.FC = () => {
  const location = useLocation();

  // Initial entrance animation states
  const [hasEntered, setHasEntered] = useState(false);
  const [itemsVisible, setItemsVisible] = useState(false);

  // Mobile drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scroll-aware rolling state (0 = rolled up, 1 = fully unrolled)
  const [rollProgress, setRollProgress] = useState(0);

  // Refs for tracking
  const lastScrollY = useRef(0);
  const lastMouseY = useRef(0);
  const isScrollingDown = useRef(false);
  const cursorInIntentZone = useRef(false);
  const animationFrame = useRef<number | undefined>(undefined);
  const targetProgress = useRef(1); // Target roll state

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  // Reset navbar state when mobile menu closes to prevent it from being "stuck"
  useEffect(() => {
    if (mobileMenuOpen) {
      // Menu opened: ensure we are fully visible and clear intentional holds
      targetProgress.current = 1;
      cursorInIntentZone.current = false;
      isScrollingDown.current = false;
    } else if (hasEntered) {
      // Menu closed: re-evaluate position, reset internal scroll deltas so it can freely move
      targetProgress.current = window.scrollY < SCROLL_THRESHOLD ? 1 : 0;
      lastScrollY.current = window.scrollY;
      cursorInIntentZone.current = false;
      isScrollingDown.current = false;
    }
  }, [mobileMenuOpen, hasEntered]);

  // Initial entrance animation
  useEffect(() => {
    const isReturning = sessionStorage.getItem('hasVisited');
    const enterDelay = isReturning ? 100 : 500;
    const textDelay = isReturning ? 400 : 2000;

    const enterTimer = setTimeout(() => {
      setHasEntered(true);
      targetProgress.current = 1;
    }, enterDelay);

    const textTimer = setTimeout(() => {
      setItemsVisible(true);
    }, textDelay);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(textTimer);
    };
  }, []);

  // Smooth animation loop for rolling
  const animateRoll = useCallback(() => {
    setRollProgress(current => {
      const target = targetProgress.current;
      const diff = target - current;

      if (Math.abs(diff) < 0.005) {
        return target;
      }

      // Fast lerp for premium, responsive feel
      return current + diff * 0.18;
    });

    animationFrame.current = requestAnimationFrame(animateRoll);
  }, []);

  // Start animation loop
  useEffect(() => {
    animationFrame.current = requestAnimationFrame(animateRoll);
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [animateRoll]);

  // Scroll handler - detects scroll direction with idle timeout for stability
  useEffect(() => {
    if (!hasEntered || mobileMenuOpen) return;

    let scrollIdleTimer: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY.current;

      if (currentScrollY < SCROLL_THRESHOLD) {
        targetProgress.current = 1;
        lastScrollY.current = currentScrollY;
        return;
      }

      if (Math.abs(scrollDelta) > 2) {
        isScrollingDown.current = scrollDelta > 0;
      }

      if (isScrollingDown.current && !cursorInIntentZone.current) {
        targetProgress.current = 0;
      } else {
        targetProgress.current = 1;
      }

      lastScrollY.current = currentScrollY;

      // Clear previous idle timer
      if (scrollIdleTimer) clearTimeout(scrollIdleTimer);

      // When scrolling stops, if we were going down, ensure rolled up
      scrollIdleTimer = setTimeout(() => {
        if (isScrollingDown.current && window.scrollY > SCROLL_THRESHOLD && !cursorInIntentZone.current) {
          targetProgress.current = 0;
        }
      }, 150);
    };

    // Touch-based scroll detection for mobile
    let lastTouchY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0].clientY;
      cursorInIntentZone.current = false;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const currentTouchY = e.touches[0].clientY;
      const delta = lastTouchY - currentTouchY;
      if (Math.abs(delta) > 3) {
        isScrollingDown.current = delta > 0;
        if (isScrollingDown.current && window.scrollY > SCROLL_THRESHOLD) {
          targetProgress.current = 0;
        } else if (!isScrollingDown.current) {
          targetProgress.current = 1;
        }
      }
      lastTouchY = currentTouchY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      if (scrollIdleTimer) clearTimeout(scrollIdleTimer);
    };
  }, [hasEntered, mobileMenuOpen]);

  // Mouse movement handler - cursor intent detection
  useEffect(() => {
    if (!hasEntered || mobileMenuOpen) return;

    const handlePointerMove = (e: PointerEvent) => {
      // Completely ignore touch interactions to avoid synthesized stuck states
      if (e.pointerType === 'touch') {
        cursorInIntentZone.current = false;
        return;
      }

      const currentY = e.clientY;
      const movingUp = currentY < lastMouseY.current;

      const inZone = currentY < CURSOR_INTENT_ZONE;
      cursorInIntentZone.current = inZone;

      if (inZone || (movingUp && currentY < CURSOR_INTENT_ZONE * 1.5)) {
        targetProgress.current = 1;
      }

      lastMouseY.current = currentY;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [hasEntered, mobileMenuOpen]);

  // Calculate dynamic heights based on roll progress
  const parchmentHeight = ROLLED_HEIGHT + (FULL_HEIGHT - ROLLED_HEIGHT) * rollProgress;
  const contentOpacity = Math.max(0, (rollProgress - 0.3) / 0.7);
  const bottomRollerOffset = (1 - rollProgress) * -15;

  return (
    <>
      <nav
        className={`
          fixed top-0 left-0 w-full z-[999] flex flex-col items-center pointer-events-none
          transition-opacity duration-300
          ${mobileMenuOpen ? 'opacity-0 !pointer-events-none' : 'opacity-100'}
        `}
        style={{ willChange: 'transform' }}
      >
        {/* Top Roller (Cylinder) - Always visible */}
        <div
          className="relative w-full md:w-[94%] lg:w-[88%] max-w-7xl h-4 md:h-6 z-20 pointer-events-auto"
          style={{
            transform: `translateY(${hasEntered ? 0 : -20}px)`,
            opacity: hasEntered ? 1 : 0,
            transition: 'transform 0.8s ease-out, opacity 0.8s ease-out',
            willChange: 'transform, opacity',
          }}
        >
          <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-6 h-8 md:w-8 md:h-10 glass-roller-cap dark:bg-gradient-to-r dark:from-green-900 dark:to-green-700 rounded-sm shadow-md border-r border-white/30 dark:border-green-950"></div>
          <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-6 h-8 md:w-8 md:h-10 glass-roller-cap dark:bg-gradient-to-l dark:from-green-900 dark:to-green-700 rounded-sm shadow-md border-l border-white/30 dark:border-green-950"></div>

          <div className="w-full h-full glass-roller dark:bg-gradient-to-b dark:from-stone-600 dark:via-stone-700 dark:to-stone-900 rounded-full shadow-inner border-b border-white/20 dark:border-green-900/30"></div>
        </div>

        {/* The Parchment Paper */}
        <div
          className="relative w-[98%] md:w-[92%] lg:w-[86%] max-w-[78rem] glass-crystal glass-shimmer glass-edge-light dark:!bg-antique-100 overflow-visible pointer-events-auto border-x border-white/40 dark:border-antique-200/30 flex items-center justify-between px-4 md:px-12"
          style={{
            height: `${parchmentHeight}px`,
            boxShadow: `0 ${10 * rollProgress}px ${30 * rollProgress}px -10px rgba(0,0,0,${0.1 + 0.1 * rollProgress})`,
            willChange: 'height, box-shadow',
          }}
        >
          <div className="absolute inset-0 opacity-0 dark:opacity-40 bg-paper-texture pointer-events-none dark:mix-blend-overlay"></div>

          <div
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-black/20 to-transparent pointer-events-none"
            style={{ height: `${Math.max(8, 16 * rollProgress)}px` }}
          ></div>
          <div
            className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/20 to-transparent pointer-events-none"
            style={{ height: `${Math.max(8, 16 * rollProgress)}px` }}
          ></div>

          {/* Navigation Content */}
          <div
            style={{
              opacity: contentOpacity,
              transform: `translateY(${(1 - contentOpacity) * 8}px)`,
              willChange: 'opacity, transform',
            }}
            className="w-full flex items-center justify-between"
          >
            {/* Logo */}
            <Link
              to="/"
              className={`
                z-10 font-display font-bold text-xl md:text-2xl tracking-widest text-parchment-900 dark:text-antique-900
                transition-all duration-700 hover:text-green-500 dark:hover:text-green-400
                ${itemsVisible ? 'opacity-100' : 'opacity-0'}
              `}
            >
              ARCHIVIST
            </Link>

            {/* Desktop Menu Items */}
            <ul className="hidden md:flex gap-6 lg:gap-10 z-10">
              {NAV_ITEMS.map((item, index) => (
                <li key={item.id} style={{ transitionDelay: `${index * 100}ms` }}>
                  <Link
                    to={item.href}
                    className={`
                      relative block font-serif text-lg tracking-wide font-medium text-parchment-900 dark:text-antique-800
                      transition-all duration-500 ease-out group
                      ${itemsVisible ? 'opacity-100' : 'opacity-0'}
                    `}
                  >
                    <span className="relative z-10">{item.label}</span>
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-parchment-900 dark:bg-antique-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left"></span>
                    <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gray-400/30 dark:bg-green-500/30 transform scale-x-0 group-hover:scale-x-75 transition-transform duration-700 delay-75 ease-out origin-left blur-[1px]"></span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Mobile Hamburger Button */}
            <button
              className={`
                md:hidden z-10 w-10 h-10 flex flex-col items-center justify-center gap-[5px] 
                transition-all duration-500
                ${itemsVisible ? 'opacity-100' : 'opacity-0'}
              `}
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
            >
              <span className="block w-6 h-[2px] bg-parchment-900 dark:bg-antique-800 transition-all duration-300 rounded-full"></span>
              <span className="block w-4 h-[2px] bg-parchment-900 dark:bg-antique-800 transition-all duration-300 rounded-full"></span>
              <span className="block w-6 h-[2px] bg-parchment-900 dark:bg-antique-800 transition-all duration-300 rounded-full"></span>
            </button>

            {/* Theme Toggle (desktop) - Removed */}
            <div className="z-10 hidden md:flex items-center gap-4">
            </div>
          </div>
        </div>

        {/* Bottom Roller */}
        <div
          className="relative w-full md:w-[94%] lg:w-[88%] max-w-7xl h-5 md:h-7 z-20 pointer-events-auto"
          style={{
            transform: `translateY(${bottomRollerOffset}px)`,
            willChange: 'transform',
          }}
        >
          <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-7 h-9 md:w-9 md:h-12 glass-roller-cap dark:bg-gradient-to-r dark:from-green-900 dark:to-green-700 rounded-full shadow-lg border-r border-white/30 dark:border-green-950 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white/40 dark:bg-green-950/50 shadow-inner"></div>
          </div>
          <div className="absolute right-[-12px] top-1/2 -translate-y-1/2 w-7 h-9 md:w-9 md:h-12 glass-roller-cap dark:bg-gradient-to-l dark:from-green-900 dark:to-green-700 rounded-full shadow-lg border-l border-white/30 dark:border-green-950 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white/40 dark:bg-green-950/50 shadow-inner"></div>
          </div>

          <div className="w-full h-full glass-roller dark:bg-gradient-to-b dark:from-stone-500 dark:via-stone-600 dark:to-stone-800 rounded-full shadow-lg border-t border-white/30 dark:border-green-100/20"></div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* MOBILE FULL-SCREEN DRAWER                                       */}
      {/* ══════════════════════════════════════════════════════════════════ */}

      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm
          transition-opacity duration-500 md:hidden
          ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Drawer Panel */}
      <div
        className={`
          fixed top-0 right-0 z-[1001] h-full w-[85vw] max-w-[360px]
          bg-parchment-100/95 dark:bg-antique-50/95 backdrop-blur-xl
          shadow-2xl border-l border-parchment-400/30 dark:border-antique-200/20
          transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden
          ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Close Button */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <Link 
            to="/"
            className="font-display text-lg font-bold tracking-widest text-parchment-900 dark:text-antique-900 hover:text-green-500 dark:hover:text-green-400 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            ARCHIVIST
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation menu"
            className="w-10 h-10 flex items-center justify-center"
          >
            <div className="relative w-6 h-6">
              <span className="absolute top-1/2 left-0 w-full h-[2px] bg-parchment-900 dark:bg-antique-800 rotate-45 -translate-y-1/2 rounded-full"></span>
              <span className="absolute top-1/2 left-0 w-full h-[2px] bg-parchment-900 dark:bg-antique-800 -rotate-45 -translate-y-1/2 rounded-full"></span>
            </div>
          </button>
        </div>

        {/* Divider */}
        <div className="mx-6 h-px bg-gradient-to-r from-green-500/30 via-parchment-400/20 to-transparent dark:from-green-400/30 dark:via-antique-200/20"></div>

        {/* Nav Items */}
        <nav className="px-6 py-8 flex flex-col gap-1">
          {NAV_ITEMS.map((item, index) => (
            <Link
              key={item.id}
              to={item.href}
              className={`
                group relative block py-4 px-4 font-serif text-xl tracking-wide text-parchment-900 dark:text-antique-800
                transition-all duration-500 ease-out rounded-lg
                hover:bg-green-500/10 dark:hover:bg-green-400/10
                active:bg-green-500/20 dark:active:bg-green-400/20
                ${mobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}
              `}
              style={{
                transitionDelay: mobileMenuOpen ? `${150 + index * 60}ms` : '0ms',
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="flex items-center justify-between">
                <span>{item.label}</span>
                <span className="text-green-500/40 dark:text-green-400/40 text-sm transform group-hover:translate-x-1 transition-transform duration-300">→</span>
              </span>
            </Link>
          ))}
        </nav>

        {/* Bottom section: Social Links (mobile only) */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-8">
          <div className="h-px bg-gradient-to-r from-green-500/30 via-parchment-400/20 to-transparent dark:from-green-400/30 dark:via-antique-200/20 mb-6" />
          <p className="font-serif text-xs tracking-[0.15em] uppercase text-parchment-700/50 dark:text-antique-800/60 mb-4">Connect</p>
          <div className="flex items-center gap-5">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="group relative w-11 h-11 flex items-center justify-center border border-parchment-400/40 dark:border-antique-400/30 rounded-full hover:border-green-500 dark:hover:border-green-400 hover:bg-green-500/10 dark:hover:bg-green-400/10 transition-all duration-400 hover:scale-110 hover:-translate-y-1" aria-label="GitHub">
              <svg className="w-5 h-5 fill-parchment-700 dark:fill-antique-600 group-hover:fill-green-500 dark:group-hover:fill-green-400 transition-colors duration-300" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="group relative w-11 h-11 flex items-center justify-center border border-parchment-400/40 dark:border-antique-400/30 rounded-full hover:border-green-500 dark:hover:border-green-400 hover:bg-green-500/10 dark:hover:bg-green-400/10 transition-all duration-400 hover:scale-110 hover:-translate-y-1" aria-label="LinkedIn">
              <svg className="w-5 h-5 fill-parchment-700 dark:fill-antique-600 group-hover:fill-green-500 dark:group-hover:fill-green-400 transition-colors duration-300" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
            </a>
            <a href="mailto:hello@example.com" className="group relative w-11 h-11 flex items-center justify-center border border-parchment-400/40 dark:border-antique-400/30 rounded-full hover:border-green-500 dark:hover:border-green-400 hover:bg-green-500/10 dark:hover:bg-green-400/10 transition-all duration-400 hover:scale-110 hover:-translate-y-1" aria-label="Email">
              <svg className="w-5 h-5 fill-none stroke-parchment-700 dark:stroke-antique-600 group-hover:stroke-green-500 dark:group-hover:stroke-green-400 transition-colors duration-300" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="group relative w-11 h-11 flex items-center justify-center border border-parchment-400/40 dark:border-antique-400/30 rounded-full hover:border-green-500 dark:hover:border-green-400 hover:bg-green-500/10 dark:hover:bg-green-400/10 transition-all duration-400 hover:scale-110 hover:-translate-y-1" aria-label="Twitter">
              <svg className="w-5 h-5 fill-parchment-700 dark:fill-antique-600 group-hover:fill-green-500 dark:group-hover:fill-green-400 transition-colors duration-300" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
