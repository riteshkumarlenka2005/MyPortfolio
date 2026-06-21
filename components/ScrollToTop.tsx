import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // When navigating to home via Home/Archivist click, the __scrollToHero flag
    // is set by GlobalNavbar. HomePage's useLayoutEffect already scrolled to the
    // hero before paint — skip the reset so we don't wipe that position.
    if (pathname === '/' && (window as any).__scrollToHero) {
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
