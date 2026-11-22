import React, { useEffect, useState } from 'react';
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

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  isDark,
  onToggleTheme,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

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
      <header className="sticky top-0 z-40 border-b border-emerald-950/10 dark:border-emerald-500/15 bg-[#F6FAF7]/90 dark:bg-[#06110D]/90 backdrop-blur-md transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Mark */}
          <motion.button
            type="button"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.14 }}
            onClick={() => handleSelectPage('home')}
            className="flex items-center gap-3 text-left whitespace-nowrap shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg py-1 pr-2"
            aria-label="Ishan Ganti Home"
          >
            <MonogramLogo
              size={32}
              className="transition-transform duration-200 group-hover:scale-105"
            />
            <span className="font-display text-sm sm:text-base font-bold tracking-tight text-slate-900 dark:text-emerald-50 whitespace-nowrap shrink-0">
              Ishan Ganti
            </span>
          </motion.button>

          {/* Zone 2: Clean Single-Line Tabs */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-6 text-sm font-medium"
          >
            {NAV_ITEMS.map((item) => {
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectPage(item.id)}
                  className={`relative py-2 whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-1 ${
                    active
                      ? 'text-emerald-700 dark:text-emerald-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active-underline"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      aria-hidden="true"
                      className="absolute inset-x-1 -bottom-[1px] h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Theme Toggle + Mobile Menu */}
          <div className="flex items-center gap-2 shrink-0">
            <motion.button
              type="button"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.14 }}
              onClick={onToggleTheme}
              aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-emerald-950/12 dark:border-emerald-500/20 bg-white dark:bg-[#0B1B15] text-slate-700 dark:text-slate-200 hover:border-emerald-500/50 text-xs font-medium transition-colors whitespace-nowrap shrink-0 min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-emerald-700" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </motion.button>

            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-emerald-950/12 dark:border-emerald-500/20 bg-white dark:bg-[#0B1B15] text-slate-700 dark:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <Menu className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
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
              className="fixed inset-0 bg-emerald-950/60 backdrop-blur-xs"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-xs h-full bg-[#F6FAF7] dark:bg-[#06110D] border-l border-emerald-950/10 dark:border-emerald-500/20 p-6 flex flex-col justify-between overflow-y-auto shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-emerald-950/10 dark:border-emerald-500/15">
                  <div className="flex items-center gap-3">
                    <MonogramLogo size={32} />
                    <span className="font-display text-sm font-bold tracking-tight text-slate-900 dark:text-emerald-50">
                      Ishan Ganti
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close navigation menu"
                    className="inline-flex items-center justify-center w-11 h-11 rounded-lg border border-emerald-950/12 dark:border-emerald-500/20 text-slate-700 dark:text-slate-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="mt-6 flex flex-col gap-1.5" aria-label="Mobile pages">
                  {NAV_ITEMS.map((item) => {
                    const active = currentPage === item.id;
                    return (
                      <motion.button
                        key={item.id}
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelectPage(item.id)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-colors min-h-[44px] flex items-center justify-between ${
                          active
                            ? 'bg-emerald-600 text-white'
                            : 'text-slate-800 dark:text-slate-200 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/30'
                        }`}
                      >
                        <span className="text-sm font-semibold">{item.label}</span>
                      </motion.button>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-6 border-t border-emerald-950/10 dark:border-emerald-500/15 flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Theme
                </span>
                <button
                  type="button"
                  onClick={onToggleTheme}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-emerald-950/12 dark:border-emerald-500/20 bg-white dark:bg-[#0B1B15] text-sm font-medium text-slate-800 dark:text-slate-200 min-h-[44px]"
                >
                  {isDark ? (
                    <>
                      <Sun className="w-4 h-4 text-amber-400" />
                      <span>Light</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 text-emerald-700" />
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
