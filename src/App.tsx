import { useCallback, useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { Navbar } from './components/Navbar';
import { AboutPage } from './pages/AboutPage';
import { ArchivePage } from './pages/ArchivePage';
import { HomePage } from './pages/HomePage';
import { StoriesPage } from './pages/StoriesPage';
import type { PageId } from './types/site';

const PAGE_ORDER: PageId[] = ['home', 'about', 'stories', 'archive'];

function getInitialPage(): PageId {
  const hash = window.location.hash.replace('#', '') as PageId;
  return PAGE_ORDER.includes(hash) ? hash : 'home';
}

const pageVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    scale: 0.968,
    y: 10,
    x: direction >= 0 ? 22 : -22,
  }),
  center: {
    opacity: 1,
    scale: 1,
    y: 0,
    x: 0,
  },
  exit: (direction: number) => ({
    opacity: 0,
    scale: 0.978,
    y: -6,
    x: direction >= 0 ? -18 : 18,
  }),
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>(getInitialPage);
  const [direction, setDirection] = useState<number>(1);
  const [selectedInterestId, setSelectedInterestId] = useState<string | undefined>(
    undefined,
  );
  const [selectedStoryId, setSelectedStoryId] = useState<string | undefined>(
    undefined,
  );
  const [showFloatingTop, setShowFloatingTop] = useState(false);

  const [isDark, setIsDark] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    const onHashChange = () => {
      const next = getInitialPage();
      setCurrentPage((prev) => {
        const prevIdx = PAGE_ORDER.indexOf(prev);
        const nextIdx = PAGE_ORDER.indexOf(next);
        setDirection(nextIdx >= prevIdx ? 1 : -1);
        return next;
      });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setShowFloatingTop(window.scrollY > 420);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        try {
          localStorage.setItem('ig-theme', 'dark');
        } catch {
          // ignore storage errors
        }
      } else {
        document.documentElement.classList.remove('dark');
        try {
          localStorage.setItem('ig-theme', 'light');
        } catch {
          // ignore storage errors
        }
      }
      return next;
    });
  }, []);

  const navigateTo = useCallback(
    (page: PageId, options?: { interestId?: string; storyId?: string }) => {
      const prevIdx = PAGE_ORDER.indexOf(currentPage);
      const nextIdx = PAGE_ORDER.indexOf(page);
      setDirection(nextIdx >= prevIdx ? 1 : -1);

      setSelectedInterestId(options?.interestId);
      setSelectedStoryId(options?.storyId);
      setCurrentPage(page);

      if (window.location.hash !== `#${page}`) {
        window.history.pushState(null, '', `#${page}`);
      }
      if (!options?.interestId) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [currentPage],
  );

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col bg-[#F4F7F4] text-[#11221A] dark:bg-[#0B1410] dark:text-[#EDF4F0] transition-colors duration-200">
        <Navbar
          currentPage={currentPage}
          onNavigate={(page) => navigateTo(page)}
          isDark={isDark}
          onToggleTheme={toggleTheme}
        />

        <main className="flex-1 overflow-x-hidden">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={currentPage}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              {currentPage === 'home' && (
                <HomePage isDark={isDark} onNavigate={navigateTo} />
              )}
              {currentPage === 'about' && (
                <AboutPage
                  onNavigate={(page) => navigateTo(page)}
                  initialInterestId={selectedInterestId}
                />
              )}
              {currentPage === 'stories' && (
                <StoriesPage
                  onNavigate={(page) => navigateTo(page)}
                  initialStoryId={selectedStoryId}
                />
              )}
              {currentPage === 'archive' && (
                <ArchivePage onNavigate={(page) => navigateTo(page)} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        <AnimatePresence>
          {showFloatingTop && (
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Scroll to top"
              className="fixed bottom-6 right-6 z-30 w-10 h-10 rounded-lg border border-[#0F2A1D]/15 dark:border-[#D6E8DE]/15 bg-white dark:bg-[#111E18] text-[#11221A] dark:text-[#EDF4F0] shadow-sm hover:border-[#0F7655] dark:hover:border-[#34D399] transition-colors duration-150 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F7655]"
            >
              <ArrowUp className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
