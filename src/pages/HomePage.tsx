import React from 'react';
import { ArrowRight, BookOpen, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { INTERESTS, STORIES, STORIES_AUTHOR_NOTE } from '../data/siteData';
import type { PageId } from '../types/site';
import { HeroDoodleDiorama } from '../components/HeroDoodleDiorama';
import { ImageWithFallback } from '../components/ImageWithFallback';
import {
  ReactiveSurface,
  RevealBlock,
  SPRING_FLUID,
} from '../components/MotionPrimitives';
import {
  DoodleIsoCube,
  DoodleLeafSprig,
  DoodleOpenBook,
  DoodlePaperPlane,
  DoodlePencil,
  DoodleTinyFlower,
} from '../components/SketchDoodles';

interface HomePageProps {
  isDark: boolean;
  onNavigate: (
    page: PageId,
    options?: { interestId?: string; storyId?: string },
  ) => void;
}

const INTEREST_DOODLE_MAP: Record<string, React.ReactNode> = {
  technology: <DoodlePaperPlane className="w-7 h-7" />,
  mathematics: <DoodleIsoCube className="w-7 h-7" />,
  cubing: <DoodleIsoCube className="w-7 h-7" />,
  books: <DoodleOpenBook className="w-7 h-7" />,
  'creative-writing': <DoodlePencil className="w-7 h-7" />,
  nature: <DoodleLeafSprig className="w-7 h-7" />,
};

export const HomePage: React.FC<HomePageProps> = ({ isDark, onNavigate }) => {
  return (
    <div className="space-y-20 pb-20">
      {/* Minimalist Two-Column Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 md:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <RevealBlock immediate delay={0.02} y={10}>
              <div className="flex items-center gap-2.5">
                <DoodleLeafSprig className="w-7 h-7" />
                <span className="font-mono text-xs tracking-wide px-2 py-0.5 border border-[#A6E8AA] dark:border-[#314735] bg-[#DAF4D7] dark:bg-[#253D29] text-[#21632A] dark:text-[#9AF0A2]">
                  ishanganti.in
                </span>
              </div>
            </RevealBlock>

            <RevealBlock immediate delay={0.07} y={12}>
              <div className="space-y-4">
                <h1 className="font-display text-4xl sm:text-5xl font-normal tracking-tight leading-[1.12] text-[#223024] dark:text-[#EDF3EA]">
                  Hey, I’m{' '}
                  <span className="italic text-[#2C913A] dark:text-[#7EE686]">
                    Ishan.
                  </span>
                </h1>

                <p className="text-base text-[#536956] dark:text-[#9FB5A1] leading-[1.7] max-w-[48ch]">
                  Student into math, coding, cubing, books, and nature. I enjoy
                  figuring out how things work, solving puzzles, and keeping my
                  projects and older stories here.
                </p>
              </div>
            </RevealBlock>

            <RevealBlock immediate delay={0.13} y={10}>
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <button
                  type="button"
                  onClick={() => onNavigate('stories')}
                  className="square-stamp-btn group inline-flex items-center gap-2 px-5 py-2.5 rounded-none border border-[#389442] bg-[#7DE386] hover:bg-[#64D66E] text-[#132B16] text-sm font-medium min-h-[44px] whitespace-nowrap shrink-0"
                >
                  <BookOpen className="w-4 h-4 transition-transform duration-150 group-hover:-rotate-6" />
                  <span>Read Stories</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('about', { interestId: 'cubing' })}
                  className="square-stamp-mint group inline-flex items-center gap-2 px-5 py-2.5 rounded-none border border-[#BFE2BD] dark:border-[#314735] bg-[#FCFDF9] dark:bg-[#1D2A20] hover:border-[#389442] dark:hover:border-[#7DE386] text-[#223024] dark:text-[#EDF3EA] text-sm font-medium min-h-[44px] whitespace-nowrap shrink-0"
                >
                  <span>About &amp; Demos</span>
                  <ArrowRight className="w-4 h-4 text-[#2C913A] dark:text-[#7EE686] transition-transform duration-150 group-hover:translate-x-1" />
                </button>
              </div>
            </RevealBlock>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ...SPRING_FLUID, delay: 0.1 }}
            className="lg:col-span-6"
          >
            <HeroDoodleDiorama isDark={isDark} />
          </motion.div>
        </div>
      </section>

      {/* Brief About & Square Interests Grid */}
      <section className="border-y border-[#BFE2BD] dark:border-[#314735] bg-[#E2F6DF]/78 dark:bg-[#19261C]/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 space-y-8">
          <RevealBlock className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2 max-w-[54ch]">
              <div className="flex items-center gap-2">
                <DoodleTinyFlower className="w-6 h-6" />
                <span className="font-mono text-xs text-[#3F6343] dark:text-[#9FB5A1]">
                  Things I explore
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-normal tracking-tight text-[#223024] dark:text-[#EDF3EA]">
                Interests &amp; Interactive Experiments
              </h2>
              <p className="text-sm text-[#3F6343] dark:text-[#9FB5A1] leading-[1.7]">
                From speedcubing and mathematical spirals to novels and spending
                time outdoors—pick any square to explore it on the About page.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('about', { interestId: 'technology' })}
              className="square-stamp-mint group inline-flex items-center gap-2 px-4 py-2 rounded-none border border-[#BFE2BD] dark:border-[#314735] bg-[#FCFDF9] dark:bg-[#1D2A20] hover:border-[#389442] dark:hover:border-[#7DE386] text-xs font-medium text-[#223024] dark:text-[#EDF3EA] min-h-[38px] whitespace-nowrap shrink-0 self-start sm:self-auto"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#2C913A] dark:text-[#7EE686] transition-transform duration-150 group-hover:translate-x-0.5" />
            </button>
          </RevealBlock>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#BFE2BD] dark:bg-[#314735] border border-[#BFE2BD] dark:border-[#314735]">
            {INTERESTS.map((item, idx) => (
              <ReactiveSurface
                as="button"
                key={item.id}
                initial={{ opacity: 0, y: 12, scale: 0.99 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ ...SPRING_FLUID, delay: idx * 0.04 }}
                onClick={() => onNavigate('about', { interestId: item.id })}
                className="group text-left p-6 bg-[#FCFDF9] dark:bg-[#1D2A20] hover:bg-[#DAF4D7]/90 dark:hover:bg-[#253D29]/90 transition-colors duration-150 flex flex-col justify-between gap-6 rounded-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#389442]"
              >
                <div className="flex items-center justify-between gap-3 w-full">
                  <span className="font-mono text-xs text-[#5B6E5D] dark:text-[#9FB5A1] tabular-nums">
                    0{idx + 1}
                  </span>
                  <span className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-105">
                    {INTEREST_DOODLE_MAP[item.id] ?? <DoodleTinyFlower className="w-6 h-6" />}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-display text-lg font-medium text-[#223024] dark:text-[#EDF3EA]">
                    {item.shortLabel}
                  </h3>
                  <p className="text-sm text-[#5B6E5D] dark:text-[#9FB5A1] leading-[1.65]">
                    {item.tagline}
                  </p>
                </div>
              </ReactiveSurface>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Stories — Preserved Covers in Clean Rectangular Frames */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        <RevealBlock className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-[54ch]">
            <div className="flex items-center gap-2">
              <DoodleOpenBook className="w-6 h-6" />
              <span className="font-mono text-xs text-[#5B6E5D] dark:text-[#9FB5A1]">
                Written works
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-normal tracking-tight text-[#223024] dark:text-[#EDF3EA]">
              My Stories
            </h2>
            <p className="text-sm text-[#5B6E5D] dark:text-[#9FB5A1] leading-[1.7]">
              {STORIES_AUTHOR_NOTE}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('stories')}
            className="square-stamp-mint group inline-flex items-center gap-2 px-4 py-2 rounded-none border border-[#C9E1C7] dark:border-[#314735] bg-[#FCFDF9] dark:bg-[#1D2A20] hover:border-[#4F9D58] dark:hover:border-[#8CD892] text-xs font-medium text-[#223024] dark:text-[#EDF3EA] min-h-[38px] whitespace-nowrap shrink-0 self-start sm:self-auto"
          >
            <span>Stories Page</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#3D8B47] dark:text-[#8CD892] transition-transform duration-150 group-hover:translate-x-0.5" />
          </button>
        </RevealBlock>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {STORIES.map((story, idx) => (
            <ReactiveSurface
              as="article"
              key={story.id}
              hoverLift
              initial={{ opacity: 0, y: 14, scale: 0.99 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ ...SPRING_FLUID, delay: idx * 0.06 }}
              className="group border border-[#C9E1C7] dark:border-[#314735] hover:border-[#389442] dark:hover:border-[#7DE386] hover:shadow-[4px_4px_0px_#C9E9C8] dark:hover:shadow-[4px_4px_0px_#2A482F] bg-[#FCFDF9]/95 dark:bg-[#1D2A20]/95 p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-stretch rounded-none transition-[border-color,box-shadow,background-color] duration-150"
            >
              {/* Untouched Original Cover Artwork in Clean Rectangular Frame */}
              <div
                onClick={() => onNavigate('stories', { storyId: story.id })}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onNavigate('stories', { storyId: story.id });
                  }
                }}
                aria-label={`Read ${story.title}`}
                className="w-full sm:w-36 shrink-0 aspect-[3/4] border border-[#C9E1C7] dark:border-[#314735] bg-[#F7F9F3] dark:bg-[#162018] overflow-hidden cursor-pointer rounded-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4F9D58]"
              >
                <div className="w-full h-full transition-transform duration-300 ease-out group-hover:scale-[1.03]">
                  <ImageWithFallback
                    src={story.coverImage}
                    alt={`Cover artwork for ${story.title}`}
                    fallbackTitle={story.title}
                    className={`w-full h-full object-cover ${
                      story.id === 'bunzo-the-rabbit' ? 'scale-[1.08]' : ''
                    }`}
                  />
                </div>
              </div>

              <div className="flex flex-col justify-between gap-4 flex-1">
                <div className="space-y-2">
                  <div className="font-mono text-xs text-[#2C913A] dark:text-[#7EE686] tabular-nums">
                    {story.editionLabel} · {story.status}
                  </div>
                  <h3 className="font-display text-xl font-medium text-[#223024] dark:text-[#EDF3EA] leading-snug">
                    {story.title}
                  </h3>
                  <p className="text-sm text-[#536956] dark:text-[#9FB5A1] leading-[1.65]">
                    {story.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => onNavigate('stories', { storyId: story.id })}
                    className="square-stamp-btn inline-flex items-center gap-2 px-4 py-2 rounded-none border border-[#389442] bg-[#7DE386] hover:bg-[#64D66E] text-[#132B16] text-xs font-medium min-h-[38px] whitespace-nowrap shrink-0"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Read Story</span>
                  </button>

                  {story.driveViewUrl && (
                    <a
                      href={story.driveViewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="square-stamp-mint inline-flex items-center gap-1.5 px-3 py-2 rounded-none border border-[#BFE2BD] dark:border-[#314735] bg-[#F7F9F3] dark:bg-[#162018] text-[#223024] dark:text-[#EDF3EA] text-xs font-medium min-h-[38px] whitespace-nowrap shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#2C913A] dark:text-[#7EE686]" />
                      <span>Drive PDF</span>
                    </a>
                  )}
                </div>
              </div>
            </ReactiveSurface>
          ))}
        </div>
      </section>
    </div>
  );
};
