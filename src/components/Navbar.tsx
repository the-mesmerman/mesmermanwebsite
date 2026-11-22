import React, { useEffect, useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';
import { NAV_ITEMS } from '../data/siteData';
import type { PageId } from '../types/site';
import { MonogramLogo } from './MonogramLogo';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  isDark,
  onToggleTheme,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 240,
    damping: 32,
    restDelta: 0.001,
  });

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
      <header className="sticky top-0 z-40 border-b border-[#0F2A1D]/11 dark:border-[#D6E8DE]/11 bg-[#F4F7F4]/95 dark:bg-[#0B1410]/95 transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Mark */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => handleSelectPage('home')}
            className="flex items-center gap-3 text-left whitespace-nowrap shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F7655] rounded-lg py-1 pr-2"
            aria-label="Ishan Ganti Home"
          >
            <motion.div
              whileHover={{ rotate: [0, -7, 6, 0], scale: 1.07 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <MonogramLogo size={32} />
            </motion.div>
            <span className="font-display text-sm sm:text-base font-semibold tracking-tight text-[#11221A] dark:text-[#EDF4F0] whitespace-nowrap shrink-0">
              Ishan Ganti
            </span>
          </motion.button>

          {/* Zone 2: Clean Single-Line Tabs */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium"
          >
            {NAV_ITEMS.map((item) => {
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectPage(item.id)}
                  className={`relative py-2 whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F7655] rounded px-1 ${
                    active
                      ? 'text-[#0F7655] dark:text-[#34D399] font-semibold'
                      : 'text-[#4A6256] dark:text-[#94ABA0] hover:text-[#11221A] dark:hover:text-[#EDF4F0]'
                  }`}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active-underline"
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      aria-hidden="true"
                      className="absolute inset-x-1 -bottom-[1px] h-[2px] bg-[#0F7655] dark:bg-[#34D399]"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Theme Toggle + Mobile Menu */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#0F2A1D]/12 dark:border-[#D6E8DE]/12 bg-white dark:bg-[#111E18] text-[#11221A] dark:text-[#EDF4F0] hover:border-[#0F7655]/50 dark:hover:border-[#34D399]/50 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F7655]"
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#FBBF24]" />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-[#0F7655]" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#0F2A1D]/12 dark:border-[#D6E8DE]/12 bg-white dark:bg-[#111E18] text-[#11221A] dark:text-[#EDF4F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F7655]"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
        <motion.div
          aria-hidden="true"
          style={{ scaleX: smoothProgress }}
          className="h-[2px] bg-[#0F7655] dark:bg-[#34D399] origin-left"
        />
      </header>

      {/* Mobile Navigation Drawer */}
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
              transition={{ duration: 0.18 }}
              className="fixed inset-0 bg-[#0B1410]/65"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-xs h-full bg-[#F4F7F4] dark:bg-[#0B1410] border-l border-[#0F2A1D]/12 dark:border-[#D6E8DE]/12 p-6 flex flex-col justify-between overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-[#0F2A1D]/11 dark:border-[#D6E8DE]/11">
                  <div className="flex items-center gap-3">
                    <MonogramLogo size={32} />
                    <span className="font-display text-sm font-semibold tracking-tight text-[#11221A] dark:text-[#EDF4F0]">
                      Ishan Ganti
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close navigation menu"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#0F2A1D]/12 dark:border-[#D6E8DE]/12 text-[#4A6256] dark:text-[#94ABA0]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="mt-6 flex flex-col gap-1" aria-label="Mobile pages">
                  {NAV_ITEMS.map((item) => {
                    const active = currentPage === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectPage(item.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-150 min-h-[44px] flex items-center justify-between ${
                          active
                            ? 'bg-[#0F7655] text-white'
                            : 'text-[#11221A] dark:text-[#EDF4F0] hover:bg-[#E9EFEA] dark:hover:bg-[#172820]'
                        }`}
                      >
                        <span className="text-sm font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-6 border-t border-[#0F2A1D]/11 dark:border-[#D6E8DE]/11 flex items-center justify-between">
                <span className="text-xs text-[#647A6F] dark:text-[#748B80]">
                  Theme
                </span>
                <button
                  type="button"
                  onClick={onToggleTheme}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#0F2A1D]/12 dark:border-[#D6E8DE]/12 bg-white dark:bg-[#111E18] text-sm font-medium text-[#11221A] dark:text-[#EDF4F0] min-h-[44px]"
                >
                  {isDark ? (
                    <>
                      <Sun className="w-4 h-4 text-[#FBBF24]" />
                      <span>Light</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 text-[#0F7655]" />
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
