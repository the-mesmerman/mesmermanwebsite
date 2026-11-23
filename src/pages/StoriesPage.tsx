import React, { useEffect, useState } from 'react';
import { BookOpen, ExternalLink } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { DoodleOpenBook, DoodleTinyFlower } from '../components/SketchDoodles';
import { StoryReaderModal } from '../components/StoryReaderModal';
import { STORIES, STORIES_AUTHOR_NOTE } from '../data/siteData';
import type { PageId, StoryItem } from '../types/site';

interface StoriesPageProps {
  onNavigate: (page: PageId) => void;
  initialStoryId?: string;
}

const CALM_EASE = [0.22, 1, 0.36, 1] as const;

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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-20">
      <Breadcrumbs
        items={[{ label: 'Home', page: 'home' }, { label: 'Stories' }]}
        onNavigate={onNavigate}
      />

      <header className="space-y-4 pb-10 border-b border-[#C9E1C7] dark:border-[#314735]">
        <div className="space-y-2.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <DoodleOpenBook className="w-6 h-6" />
            <span className="font-mono text-xs text-[#5B6E5D] dark:text-[#9FB5A1]">
              Stories Library
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-normal tracking-tight text-[#223024] dark:text-[#EDF3EA]">
            My{' '}
            <span className="italic text-[#2C913A] dark:text-[#7EE686]">
              Stories
            </span>
          </h1>

          <p className="text-base text-[#536956] dark:text-[#9FB5A1] leading-[1.7] max-w-[52ch]">
            Two stories I wrote and published earlier.
          </p>
        </div>

        <div className="inline-flex items-start gap-2.5 px-4 py-3 border border-[#BFE2BD] dark:border-[#314735] bg-[#E2F6DF]/90 dark:bg-[#1D2A20] text-xs sm:text-sm text-[#3F6343] dark:text-[#9FB5A1] rounded-none">
          <DoodleTinyFlower className="w-5 h-5 shrink-0" />
          <p>
            <strong className="font-medium text-[#223024] dark:text-[#EDF3EA]">
              Note:
            </strong>{' '}
            {STORIES_AUTHOR_NOTE}
          </p>
        </div>
      </header>

      {/* Square-Framed Editorial Story Spreads (Untouched Original Covers) */}
      <section className="pt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {STORIES.map((story, idx) => (
          <motion.article
            key={story.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.3, delay: idx * 0.06, ease: CALM_EASE }}
            className="border border-[#C9E1C7] dark:border-[#314735] bg-[#FCFDF9] dark:bg-[#1D2A20] p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-stretch rounded-none"
          >
            <div
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
              className="w-44 shrink-0 aspect-[3/4] border border-[#C9E1C7] dark:border-[#314735] bg-[#F7F9F3] dark:bg-[#162018] overflow-hidden cursor-pointer rounded-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4F9D58]"
            >
              <ImageWithFallback
                src={story.coverImage}
                alt={`Book cover for ${story.title}`}
                fallbackTitle={story.title}
                className={`w-full h-full object-cover ${
                  story.id === 'bunzo-the-rabbit' ? 'scale-[1.08]' : ''
                }`}
              />
            </div>

            <div className="flex flex-col justify-between gap-5 flex-1 text-center sm:text-left">
              <div className="space-y-2.5">
                <div className="font-mono text-xs text-[#2C913A] dark:text-[#7EE686] tabular-nums">
                  {story.editionLabel} · {story.status}
                </div>
                <h2 className="font-display text-2xl font-medium text-[#223024] dark:text-[#EDF3EA] leading-snug">
                  {story.title}
                </h2>
                <p className="text-sm text-[#536956] dark:text-[#9FB5A1] leading-[1.7]">
                  {story.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <button
                  type="button"
                  onClick={() => setReadingStory(story)}
                  className="square-stamp-btn inline-flex items-center gap-2 px-4 py-2.5 rounded-none border border-[#389442] bg-[#7DE386] hover:bg-[#64D66E] text-[#132B16] text-xs font-medium min-h-[40px] whitespace-nowrap shrink-0"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Read Story</span>
                </button>

                {story.driveViewUrl && (
                  <a
                    href={story.driveViewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="square-stamp-mint inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-none border border-[#BFE2BD] dark:border-[#314735] bg-[#F7F9F3] dark:bg-[#162018] text-[#223024] dark:text-[#EDF3EA] text-xs font-medium min-h-[40px] whitespace-nowrap shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#2C913A] dark:text-[#7EE686]" />
                    <span>Open PDF</span>
                  </a>
                )}
              </div>
            </div>
          </motion.article>
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
