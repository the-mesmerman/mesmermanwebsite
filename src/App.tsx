import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { AmbientNatureCanvas } from './components/AmbientNatureCanvas';
import { Footer } from './components/Footer';
import { LoadingScreen } from './components/LoadingScreen';
import {
  IntroRevealProvider,
  SPRING_SNAPPY,
} from './components/MotionPrimitives';
import { Navbar } from './components/Navbar';
import { AboutPage } from './pages/AboutPage';
import { ArchivePage } from './pages/ArchivePage';
import { HomePage } from './pages/HomePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { StoriesPage } from './pages/StoriesPage';
import type { PageId } from './types/site';

const PAGE_ORDER: PageId[] = ['home', 'about', 'projects', 'stories', 'archive'];

function getInitialPage(): PageId {
  const hash = window.location.hash.replace('#', '') as PageId;
  return PAGE_ORDER.includes(hash) ? hash : 'home';
}

const pageVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir * 24,
    scale: 0.992,
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      x: { type: 'spring' as const, stiffness: 320, damping: 30, mass: 0.8 },
      scale: { type: 'spring' as const, stiffness: 320, damping: 30, mass: 0.8 },
      opacity: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const },
    },
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir * -16,
    scale: 0.994,
    transition: {
      duration: 0.16,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export default function App() {
  const [pageState, setPageState] = useState<{ page: PageId; direction: number }>(() => ({
    page: getInitialPage(),
    direction: 1,
  }));
  const currentPageRef = useRef<PageId>(pageState.page);

  const [selectedInterestId, setSelectedInterestId] = useState<string | undefined>(
    undefined,
  );
  const [selectedStoryId, setSelectedStoryId] = useState<string | undefined>(
    undefined,
  );
  const [showFloatingTop, setShowFloatingTop] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [introSettled, setIntroSettled] = useState(false);

  const [isDark, setIsDark] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark');
  });

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  useEffect(() => {
    if (showIntro || introSettled) return;
    const timer = window.setTimeout(() => {
      setIntroSettled(true);
    }, 1150);
    return () => window.clearTimeout(timer);
  }, [showIntro, introSettled]);

  const applyPageTransition = useCallback((nextPage: PageId) => {
    const prevPage = currentPageRef.current;
    if (nextPage === prevPage) return;
    const prevIdx = PAGE_ORDER.indexOf(prevPage);
    const nextIdx = PAGE_ORDER.indexOf(nextPage);
    const direction = nextIdx >= prevIdx ? 1 : -1;
    currentPageRef.current = nextPage;
    setPageState({ page: nextPage, direction });
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      applyPageTransition(getInitialPage());
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [applyPageTransition]);

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
      setSelectedInterestId(options?.interestId);
      setSelectedStoryId(options?.storyId);
      applyPageTransition(page);

      if (window.location.hash !== `#${page}`) {
        window.history.pushState(null, '', `#${page}`);
      }
      if (!options?.interestId) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [applyPageTransition],
  );

  const { page: currentPage, direction } = pageState;

  return (
    <MotionConfig reducedMotion="user">
      <IntroRevealProvider
        isIntroBlocking={showIntro}
        introRevealDelay={introSettled ? 0 : 0.22}
      >
        <div className="relative min-h-screen flex flex-col overflow-x-clip bg-[#F7F9F3] text-[#223024] dark:bg-[#162018] dark:text-[#EDF3EA] transition-colors duration-200">
          <AmbientNatureCanvas isDark={isDark} />

          <Navbar
            currentPage={currentPage}
            onNavigate={(page) => navigateTo(page)}
            isDark={isDark}
            onToggleTheme={toggleTheme}
          />

          <motion.main
            className="relative z-10 flex-1 overflow-x-hidden origin-top"
            initial={{ opacity: 0, scale: 0.84 }}
            animate={{
              opacity: showIntro ? 0 : 1,
              scale: showIntro ? 0.84 : 1,
            }}
            transition={
              showIntro
                ? { duration: 0 }
                : { duration: 0.88, delay: 0.22, ease: [0.16, 1, 0.3, 1] }
            }
          >
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={currentPage}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
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
              {currentPage === 'projects' && (
                <ProjectsPage onNavigate={(page) => navigateTo(page)} />
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
        </motion.main>

        <Footer />

        <AnimatePresence>
          {showFloatingTop && (
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.92 }}
              transition={SPRING_SNAPPY}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Scroll to top"
              className="square-stamp-btn fixed bottom-6 right-6 z-30 w-10 h-10 rounded-none border border-[#389442] bg-[#7DE386] hover:bg-[#64D66E] text-[#132B16] flex items-center justify-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#389442]"
            >
              <ArrowUp className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>

          <AnimatePresence>
            {showIntro && (
              <LoadingScreen isDark={isDark} onComplete={handleIntroComplete} />
            )}
          </AnimatePresence>
        </div>
      </IntroRevealProvider>
    </MotionConfig>
  );
}
