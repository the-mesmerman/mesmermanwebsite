import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Maximize2, Minimize2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import {
  RevealBlock,
  ZOOM_SETTLE_EASE,
  useIntroReveal,
} from '../components/MotionPrimitives';
import { DoodleIsoCube } from '../components/SketchDoodles';
import type { PageId } from '../types/site';

interface ProjectsPageProps {
  onNavigate: (page: PageId) => void;
}

const PADLET_EMBED_URL = 'https://padlet.com/embed/s025qhyo939js96n5mrg';

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onNavigate }) => {
  const { isIntroBlocking, introRevealDelay, slideDistance } = useIntroReveal();
  const [loaded, setLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const frameWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen && !document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', onFsChange);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isFullscreen]);

  const toggleFullscreen = async () => {
    if (!frameWrapperRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await frameWrapperRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      setIsFullscreen((prev) => !prev);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-3 sm:px-6 pt-5 pb-8 flex flex-col gap-4 overflow-x-clip">
      <RevealBlock immediate direction="left" delay={0.02}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="[&_nav]:mb-1.5">
              <Breadcrumbs
                items={[{ label: 'Home', page: 'home' }, { label: 'Projects' }]}
                onNavigate={onNavigate}
              />
            </div>
            <div className="flex items-center gap-2.5">
              <DoodleIsoCube className="w-6 h-6 shrink-0" />
              <h1 className="font-display text-2xl sm:text-3xl font-normal tracking-tight text-[#223024] dark:text-[#EDF3EA]">
                My{' '}
                <span className="italic text-[#2C913A] dark:text-[#7EE686]">
                  Projects
                </span>
              </h1>
              <span className="hidden md:inline text-xs text-[#536956] dark:text-[#9FB5A1] pl-1">
                · Things I build &amp; attach here
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href={PADLET_EMBED_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="square-stamp-mint inline-flex items-center gap-1.5 px-3 py-2 rounded-none border border-[#BFE2BD] dark:border-[#314735] bg-[#FCFDF9] dark:bg-[#1D2A20] hover:border-[#389442] dark:hover:border-[#7DE386] text-xs font-medium text-[#223024] dark:text-[#EDF3EA] min-h-[38px] whitespace-nowrap shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#2C913A] dark:text-[#7EE686]" />
              <span>Open Board</span>
            </a>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="square-stamp-btn inline-flex items-center gap-1.5 px-3.5 py-2 rounded-none border border-[#389442] bg-[#7DE386] hover:bg-[#64D66E] text-[#132B16] text-xs font-medium min-h-[38px] whitespace-nowrap shrink-0"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>Exit Full Screen</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Full Screen</span>
                </>
              )}
            </button>
          </div>
        </div>
      </RevealBlock>

      <motion.div
        ref={frameWrapperRef}
        initial={{ opacity: 0, x: slideDistance * 0.65, scale: 0.96 }}
        animate={
          isIntroBlocking
            ? { opacity: 0, x: slideDistance * 0.65, scale: 0.96 }
            : { opacity: 1, x: 0, scale: 1 }
        }
        transition={
          isIntroBlocking
            ? { duration: 0 }
            : {
                duration: 0.84,
                delay: introRevealDelay + 0.08,
                ease: ZOOM_SETTLE_EASE,
              }
        }
        className={
          isFullscreen && !document.fullscreenElement
            ? 'fixed inset-0 z-50 bg-[#F7F9F3] dark:bg-[#162018] p-3 flex flex-col gap-2'
            : 'border border-[#BFE2BD] dark:border-[#314735] bg-[#FCFDF9] dark:bg-[#1D2A20] p-1.5 sm:p-2 rounded-none'
        }
      >
        {isFullscreen && !document.fullscreenElement && (
          <div className="flex items-center justify-between px-1 shrink-0">
            <span className="font-display text-sm font-medium text-[#223024] dark:text-[#EDF3EA]">
              Projects Board
            </span>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="square-stamp-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none border border-[#389442] bg-[#7DE386] hover:bg-[#64D66E] text-[#132B16] text-xs font-medium"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Exit Full Screen</span>
            </button>
          </div>
        )}

        <div
          className={`relative w-full overflow-hidden rounded-none border border-[#BFE2BD]/70 dark:border-[#314735] bg-[#F7F9F3] dark:bg-[#162018] ${
            isFullscreen
              ? 'flex-1 h-full'
              : 'h-[calc(100dvh-11.25rem)] min-h-[560px]'
          }`}
        >
          {!loaded && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 text-xs font-mono text-[#536956] dark:text-[#9FB5A1] pointer-events-none">
              <span>Loading Padlet board…</span>
            </div>
          )}
          <iframe
            title="Ishan Ganti Projects — Padlet Board"
            src={PADLET_EMBED_URL}
            allow="camera;microphone;geolocation;display-capture;clipboard-write"
            loading="eager"
            onLoad={() => setLoaded(true)}
            className={`absolute top-0 left-0 w-[calc(100%+20px)] h-[calc(100%+20px)] block border-0 transition-opacity duration-200 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>
      </motion.div>
    </div>
  );
};
