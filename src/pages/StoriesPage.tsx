import React, { useEffect, useState } from 'react';
import { BookOpen, Info } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { StoryReaderModal } from '../components/StoryReaderModal';
import { STORIES, STORIES_AUTHOR_NOTE } from '../data/siteData';
import type { PageId, StoryItem } from '../types/site';

interface StoriesPageProps {
  onNavigate: (page: PageId) => void;
  initialStoryId?: string;
}

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const StoryMonographCard: React.FC<{
  story: StoryItem;
  idx: number;
  onOpen: () => void;
}> = ({ story, idx, onOpen }) => {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, sx: 50, sy: 50, hovered: false });
  const isAmber = story.accentTone === 'amber';

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({
      rx: (0.5 - py) * 10,
      ry: (px - 0.5) * 13,
      sx: px * 100,
      sy: py * 100,
      hovered: true,
    });
  };

  const handleLeave = () => {
    setTilt({ rx: 0, ry: 0, sx: 50, sy: 50, hovered: false });
  };

  return (
    <motion.article
      initial={{ opacity: 0, scale: 1.035, y: 12 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.34, delay: idx * 0.07, ease: EASE_OUT }}
      className="group rounded-xl border border-[#0F2A1D]/12 dark:border-[#D6E8DE]/12 bg-white dark:bg-[#111E18] hover:border-[#0F7655]/45 dark:hover:border-[#34D399]/45 p-6 sm:p-7 flex flex-col sm:flex-row gap-6 items-center sm:items-stretch transition-colors duration-150"
    >
      <div
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        onClick={onOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpen();
          }
        }}
        aria-label={`Read ${story.title}`}
        className="w-44 sm:w-44 shrink-0 aspect-[3/4] cursor-pointer [perspective:700px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F7655] rounded-r-lg"
      >
        <div
          className="relative w-full h-full rounded-r-lg rounded-l-sm overflow-hidden border border-[#0F2A1D]/15 dark:border-[#D6E8DE]/15 shadow-lg shadow-[#0F2A1D]/12 dark:shadow-black/40 bg-[#11221A] transition-transform duration-150 ease-out will-change-transform"
          style={{
            transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${tilt.hovered ? 1.025 : 1})`,
          }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-3.5 z-10 bg-gradient-to-r from-black/45 via-white/15 to-transparent"
          />
          <ImageWithFallback
            src={story.coverImage}
            alt={`Book cover for ${story.title}`}
            fallbackTitle={story.title}
            className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-300 ease-out"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 transition-opacity duration-150"
            style={{
              opacity: tilt.hovered ? 0.45 : 0,
              background: `radial-gradient(circle at ${tilt.sx}% ${tilt.sy}%, rgba(255,255,255,0.3), transparent 60%)`,
            }}
          />
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-x-0 bottom-0 h-[3px] ${
              isAmber ? 'bg-[#D97706]' : 'bg-[#0F7655]'
            }`}
          />
        </div>
      </div>

      <div className="flex flex-col justify-between gap-5 flex-1 text-center sm:text-left">
        <div className="space-y-2.5">
          <div className="font-mono text-xs text-[#647A6F] dark:text-[#748B80] tabular-nums">
            {story.editionLabel} · {story.status}
          </div>
          <h2 className="font-display text-2xl font-semibold text-[#11221A] dark:text-[#EDF4F0] leading-snug">
            {story.title}
          </h2>
          <p className="text-sm text-[#4A6256] dark:text-[#94ABA0] leading-relaxed">
            {story.description}
          </p>
        </div>

        <div>
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={onOpen}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0F7655] hover:bg-[#0D6448] text-white text-xs font-medium transition-colors duration-150 min-h-[40px] whitespace-nowrap shrink-0"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Read Story</span>
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
};

export const StoriesPage: React.FC<StoriesPageProps> = ({
  onNavigate,
  initialStoryId,
}) => {
  const [readingStory, setReadingStory] = useState<StoryItem | null>(null);

  useEffect(() => {
    if (initialStoryId) {
      const found = STORIES.find((s) => s.id === initialStoryId);
      if (found) {
        setReadingStory(found);
      }
    }
  }, [initialStoryId]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-24">
      <Breadcrumbs
        items={[{ label: 'Home', page: 'home' }, { label: 'Stories' }]}
        onNavigate={onNavigate}
      />

      <header className="space-y-4 pb-10 border-b border-[#0F2A1D]/11 dark:border-[#D6E8DE]/11">
        <div className="space-y-2 max-w-2xl">
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ duration: 0.38, ease: EASE_OUT }}
              className="font-display text-4xl sm:text-5xl font-semibold tracking-tight text-[#11221A] dark:text-[#EDF4F0]"
            >
              My{' '}
              <span className="font-serif-editorial italic font-medium text-[#0F7655] dark:text-[#34D399]">
                Stories
              </span>
            </motion.h1>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, delay: 0.08, ease: EASE_OUT }}
            className="text-base sm:text-lg text-[#4A6256] dark:text-[#94ABA0] leading-relaxed"
          >
            Two stories I wrote and published earlier.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, delay: 0.14, ease: EASE_OUT }}
          className="flex items-center gap-2.5 text-xs sm:text-sm text-[#647A6F] dark:text-[#748B80] pt-1"
        >
          <Info className="w-4 h-4 text-[#0F7655] dark:text-[#34D399] shrink-0" />
          <p>
            <strong className="font-semibold text-[#11221A] dark:text-[#EDF4F0]">
              Note:
            </strong>{' '}
            {STORIES_AUTHOR_NOTE}
          </p>
        </motion.div>
      </header>

      {/* Clean Monograph Story Spreads */}
      <section className="pt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {STORIES.map((story, idx) => (
          <StoryMonographCard
            key={story.id}
            story={story}
            idx={idx}
            onOpen={() => setReadingStory(story)}
          />
        ))}
      </section>

      <AnimatePresence>
        {readingStory && (
          <StoryReaderModal
            story={readingStory}
            onClose={() => setReadingStory(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
