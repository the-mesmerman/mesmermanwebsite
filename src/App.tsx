import { useCallback, useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { AmbientNatureCanvas } from './components/AmbientNatureCanvas';
import { Footer } from './components/Footer';
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

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>(getInitialPage);
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
      setCurrentPage(getInitialPage());
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
    [],
  );

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen flex flex-col bg-[#F7F9F3] text-[#223024] dark:bg-[#162018] dark:text-[#EDF3EA] transition-colors duration-200">
        <AmbientNatureCanvas isDark={isDark} />

        <Navbar
          currentPage={currentPage}
          onNavigate={(page) => navigateTo(page)}
          isDark={isDark}
          onToggleTheme={toggleTheme}
        />

        <main className="relative z-10 flex-1 overflow-x-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
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
        </main>

        <Footer onNavigate={(page) => navigateTo(page)} />

        <AnimatePresence>
          {showFloatingTop && (
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Scroll to top"
              className="square-stamp-btn fixed bottom-6 right-6 z-30 w-10 h-10 rounded-none border border-[#389442] bg-[#7DE386] hover:bg-[#64D66E] text-[#132B16] flex items-center justify-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#389442]"
            >
              <ArrowUp className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
