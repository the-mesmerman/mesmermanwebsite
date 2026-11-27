import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { NAV_ITEMS } from '../data/siteData';
import type { PageId } from '../types/site';
import { MonogramLogo } from './MonogramLogo';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

interface IndicatorRect {
  left: number;
  right: number;
  top: number;
  direction: 'left' | 'right' | 'none';
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  isDark,
  onToggleTheme,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const labelRefs = useRef<Partial<Record<PageId, HTMLSpanElement | null>>>({});
  const prevLeftRef = useRef<number | null>(null);
  const [indicator, setIndicator] = useState<IndicatorRect | null>(null);

  const measureIndicator = useCallback(
    (animateChange: boolean) => {
      const navEl = navRef.current;
      const labelEl = labelRefs.current[currentPage];
      if (!navEl || !labelEl || navEl.offsetWidth === 0) return;

      const navRect = navEl.getBoundingClientRect();
      const labelRect = labelEl.getBoundingClientRect();
      const nextLeft = labelRect.left - navRect.left;
      const nextRight = navRect.right - labelRect.right;
      const nextTop = labelRect.bottom - navRect.top + 3;

      let direction: IndicatorRect['direction'] = 'none';
      if (animateChange && prevLeftRef.current !== null) {
        if (nextLeft > prevLeftRef.current + 0.5) {
          direction = 'right';
        } else if (nextLeft < prevLeftRef.current - 0.5) {
          direction = 'left';
        }
      }

      prevLeftRef.current = nextLeft;
      setIndicator({
        left: nextLeft,
        right: nextRight,
        top: nextTop,
        direction,
      });
    },
    [currentPage]
  );

  useLayoutEffect(() => {
    measureIndicator(true);
  }, [measureIndicator]);

  useEffect(() => {
    let active = true;
    const handleResize = () => measureIndicator(false);
    window.addEventListener('resize', handleResize);

    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => {
        if (active) measureIndicator(false);
      });
    }

    return () => {
      active = false;
      window.removeEventListener('resize', handleResize);
    };
  }, [measureIndicator]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelectPage = (page: PageId) => {
    setMobileOpen(false);
    onNavigate(page);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#C9E1C7] dark:border-[#314735] bg-[#F7F9F3]/96 dark:bg-[#162018]/96 transition-colors duration-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
          {/* Brand Mark with Rounded Logo */}
          <button
            type="button"
            onClick={() => handleSelectPage('home')}
            className="flex items-center gap-3 text-left whitespace-nowrap shrink-0 group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4F9D58] rounded-none py-1 pr-2"
            aria-label="Ishan Ganti Home"
          >
            <span className="transition-transform duration-150 group-hover:-translate-y-0.5">
              <MonogramLogo size={32} />
            </span>
            <span className="font-display text-base font-medium tracking-tight text-[#223024] dark:text-[#EDF3EA] whitespace-nowrap shrink-0">
              Ishan Ganti
            </span>
          </button>

          {/* Simple Rectangular Text Navigation */}
          <nav
            ref={navRef}
            aria-label="Primary navigation"
            className="hidden md:flex relative items-center gap-2 text-sm"
          >
            {NAV_ITEMS.map((item) => {
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectPage(item.id)}
                  className={`relative px-3 py-2 rounded-none whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#389442] ${
                    active
                      ? 'text-[#236B2C] dark:text-[#7EE686] font-medium'
                      : 'text-[#536956] dark:text-[#9FB5A1] hover:text-[#223024] dark:hover:text-[#EDF3EA]'
                  }`}
                >
                  <span
                    ref={(el) => {
                      labelRefs.current[item.id] = el;
                    }}
                    className="inline-block"
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}

            {indicator && (
              <motion.span
                aria-hidden="true"
                initial={false}
                animate={{
                  left: indicator.left,
                  right: indicator.right,
                  top: indicator.top,
                }}
                transition={{
                  left:
                    indicator.direction === 'none'
                      ? { duration: 0 }
                      : indicator.direction === 'left'
                        ? { duration: 0.22, delay: 0, ease: [0.16, 1, 0.3, 1] }
                        : { duration: 0.24, delay: 0.085, ease: [0.22, 1, 0.36, 1] },
                  right:
                    indicator.direction === 'none'
                      ? { duration: 0 }
                      : indicator.direction === 'right'
                        ? { duration: 0.22, delay: 0, ease: [0.16, 1, 0.3, 1] }
                        : { duration: 0.24, delay: 0.085, ease: [0.22, 1, 0.36, 1] },
                  top: { duration: 0 },
                }}
                className="pointer-events-none absolute h-[2px] rounded-none bg-[#2C913A] dark:bg-[#7EE686]"
              />
            )}
          </nav>

          {/* Square Theme Toggle + Mobile Menu */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              className="square-stamp-mint inline-flex items-center gap-2 px-3 py-2 rounded-none border border-[#C9E1C7] dark:border-[#314735] bg-[#FCFDF9] dark:bg-[#1D2A20] text-[#223024] dark:text-[#EDF3EA] hover:border-[#4F9D58] dark:hover:border-[#8CD892] text-xs font-medium whitespace-nowrap shrink-0 min-h-[38px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4F9D58]"
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#F7D15C]" />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-[#4F9D58]" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-none border border-[#C9E1C7] dark:border-[#314735] bg-[#FCFDF9] dark:bg-[#1D2A20] text-[#223024] dark:text-[#EDF3EA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4F9D58]"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Square Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div
            className="fixed inset-0 z-50 md:hidden flex justify-end"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16 }}
              className="fixed inset-0 bg-[#223024]/40 dark:bg-black/65"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-xs h-full bg-[#F7F9F3] dark:bg-[#162018] border-l border-[#C9E1C7] dark:border-[#314735] p-6 flex flex-col justify-between overflow-y-auto rounded-none"
            >
              <div>
                <div className="flex items-center justify-between pb-5 border-b border-[#C9E1C7] dark:border-[#314735]">
                  <div className="flex items-center gap-3">
                    <MonogramLogo size={30} />
                    <span className="font-display text-sm font-medium text-[#223024] dark:text-[#EDF3EA]">
                      Ishan Ganti
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close navigation menu"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-none border border-[#C9E1C7] dark:border-[#314735] bg-[#FCFDF9] dark:bg-[#1D2A20] text-[#5B6E5D] dark:text-[#9FB5A1]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <nav className="mt-6 flex flex-col gap-1.5" aria-label="Mobile pages">
                  {NAV_ITEMS.map((item) => {
                    const active = currentPage === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectPage(item.id)}
                        className={`w-full text-left px-4 py-3 rounded-none border transition-colors duration-150 min-h-[44px] flex items-center justify-between ${
                          active
                            ? 'bg-[#7DE386] border-[#389442] text-[#132B16] font-medium'
                            : 'border-transparent text-[#223024] dark:text-[#EDF3EA] hover:border-[#BFE2BD] dark:hover:border-[#314735] hover:bg-[#DAF4D7]/70 dark:hover:bg-[#1D2A20]'
                        }`}
                      >
                        <span className="text-sm">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-5 border-t border-[#C9E1C7] dark:border-[#314735] flex items-center justify-between">
                <span className="text-xs text-[#5B6E5D] dark:text-[#9FB5A1]">
                  Theme
                </span>
                <button
                  type="button"
                  onClick={onToggleTheme}
                  className="square-stamp-mint inline-flex items-center gap-2 px-4 py-2 rounded-none border border-[#C9E1C7] dark:border-[#314735] bg-[#FCFDF9] dark:bg-[#1D2A20] text-xs font-medium text-[#223024] dark:text-[#EDF3EA] min-h-[40px]"
                >
                  {isDark ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-[#F7D15C]" />
                      <span>Light</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-[#4F9D58]" />
                      <span>Dark</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
