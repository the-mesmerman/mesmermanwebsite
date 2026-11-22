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

      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.36, ease: EASE_OUT }}
        className="space-y-5 pb-10 border-b border-emerald-950/10 dark:border-emerald-500/15"
      >
        <div className="space-y-2 max-w-2xl">
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-emerald-50">
            My Stories
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Two stories I wrote and published earlier.
          </p>
        </div>

        <div className="rounded-xl border border-emerald-950/10 dark:border-emerald-500/20 bg-white dark:bg-[#0B1B15] px-4 py-3.5 flex items-center gap-3 max-w-2xl">
          <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <strong className="text-slate-900 dark:text-emerald-50">
              Note:
            </strong>{' '}
            {STORIES_AUTHOR_NOTE}
          </p>
        </div>
      </motion.header>

      {/* Clean Side-by-Side Book Cards */}
      <section className="pt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        {STORIES.map((story, idx) => {
          const isAmber = story.accentTone === 'amber';
          return (
            <motion.article
              key={story.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.08 }}
              transition={{ duration: 0.38, delay: idx * 0.07, ease: EASE_OUT }}
              whileHover={{ y: -4 }}
              className="group rounded-2xl border border-emerald-950/10 dark:border-emerald-500/15 bg-white dark:bg-[#0B1B15] p-6 sm:p-7 flex flex-col sm:flex-row gap-6 items-center sm:items-stretch hover:border-emerald-500/45 transition-colors"
            >
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                onClick={() => setReadingStory(story)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setReadingStory(story);
                  }
                }}
                aria-label={`Read ${story.title}`}
                className="relative w-44 sm:w-44 shrink-0 aspect-[3/4] rounded-r-xl rounded-l-md overflow-hidden border border-emerald-950/15 dark:border-emerald-500/20 shadow-xl shadow-emerald-950/15 dark:shadow-black/50 cursor-pointer bg-emerald-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-3.5 z-10 bg-gradient-to-r from-black/45 via-white/15 to-transparent"
                />
                <ImageWithFallback
                  src={story.coverImage}
                  alt={`Book cover for ${story.title}`}
                  fallbackTitle={story.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-x-0 bottom-0 h-1 ${
                    isAmber ? 'bg-amber-400/85' : 'bg-emerald-500/85'
                  }`}
                />
              </motion.div>

              <div className="flex flex-col justify-between gap-5 flex-1 text-center sm:text-left">
                <div className="space-y-2.5">
                  <div className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                    {story.editionLabel} · {story.status}
                  </div>
                  <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-emerald-50 leading-snug">
                    {story.title}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {story.description}
                  </p>
                </div>

                <div>
                  <motion.button
                    type="button"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setReadingStory(story)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors shadow-sm min-h-[40px]"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Read Story</span>
                  </motion.button>
                </div>
              </div>
            </motion.article>
          );
        })}
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
