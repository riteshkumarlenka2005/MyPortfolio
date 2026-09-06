import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const toggleVisibility = () => {
      const currentScrollY = window.scrollY;

      // Show the button only when:
      // 1. User is scrolling UP (currentScrollY < lastScrollY)
      // 2. User has scrolled past a minimum threshold (300px)
      if (currentScrollY < lastScrollY && currentScrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [lastScrollY]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-[999] flex h-14 w-14 cursor-pointer items-center justify-center rounded-full shadow-2xl outline-none ring-2 ring-black/10 dark:ring-white/10"
          style={{ backgroundColor: '#3BFE18' }}
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-7 w-7 text-black stroke-[2.5]" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
