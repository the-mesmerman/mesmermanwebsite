import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, BookOpen } from 'lucide-react';
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import {
  INTERESTS,
  STORIES,
  STORIES_AUTHOR_NOTE,
} from '../data/siteData';
import type { PageId } from '../types/site';
import { Hero3DScene } from '../components/three/Hero3DScene';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { LowPolyNatureCanvas } from '../components/visuals/LowPolyNatureCanvas';

interface HomePageProps {
  isDark: boolean;
  onNavigate: (
    page: PageId,
    options?: { interestId?: string; storyId?: string },
  ) => void;
}

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/* Scroll-driven subtle zoom-out container for silky physical depth */
const ZoomOutBand: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start 0.4'],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    restDelta: 0.001,
  });
  const scale = useTransform(smooth, [0, 1], [1.032, 1]);
  const opacity = useTransform(smooth, [0, 1], [0.8, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
};

/* Hairline Directory Cell with pointer spotlight & smooth sliding accent rule */
const InterestDirectoryCell: React.FC<{
  item: (typeof INTERESTS)[number];
  idx: number;
  onClick: () => void;
}> = ({ item, idx, onClick }) => {
  const [spot, setSpot] = useState({ x: 50, y: 50, active: false });
  const num = `0${idx + 1}`;

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpot({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
      active: true,
    });
  };

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, scale: 1.04, y: 10 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.34, delay: idx * 0.045, ease: EASE_OUT }}
      whileTap={{ scale: 0.985 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setSpot((s) => ({ ...s, active: false }))}
      onClick={onClick}
      className="group relative text-left p-6 bg-white dark:bg-[#111E18] hover:bg-[#F7FAF7] dark:hover:bg-[#15241D] transition-colors duration-150 flex flex-col justify-between gap-5 overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-200"
        style={{
          opacity: spot.active ? 1 : 0,
          background: `radial-gradient(240px circle at ${spot.x}% ${spot.y}%, rgba(15, 118, 85, 0.09), transparent 70%)`,
        }}
      />

      <div className="relative z-10 flex items-center justify-between gap-2 w-full">
        <span className="font-mono text-xs text-[#647A6F] dark:text-[#748B80] tabular-nums transition-transform duration-150 group-hover:translate-x-0.5">
          {num}
        </span>
        <ArrowUpRight className="w-4 h-4 text-[#647A6F] dark:text-[#748B80] group-hover:text-[#0F7655] dark:group-hover:text-[#34D399] transition-all duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
      </div>

      <div className="relative z-10 space-y-1.5">
        <h3 className="font-display text-lg font-semibold text-[#11221A] dark:text-[#EDF4F0] group-hover:text-[#0F7655] dark:group-hover:text-[#34D399] transition-colors duration-150">
          {item.shortLabel}
        </h3>
        <p className="text-sm text-[#4A6256] dark:text-[#94ABA0] leading-relaxed">
          {item.tagline}
        </p>
      </div>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-[#0F7655] dark:bg-[#34D399] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out"
      />
    </motion.button>
  );
};

/* 3D Perspective Tilt Book Card with Cover Zoom-Out */
const TiltStoryCard: React.FC<{
  story: (typeof STORIES)[number];
  idx: number;
  onRead: () => void;
}> = ({ story, idx, onRead }) => {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, sx: 50, sy: 50, hovered: false });

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

  const isAmber = story.accentTone === 'amber';

  return (
    <motion.article
      initial={{ opacity: 0, scale: 1.035, y: 12 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.34, delay: idx * 0.06, ease: EASE_OUT }}
      className="group rounded-xl border border-[#0F2A1D]/12 dark:border-[#D6E8DE]/12 bg-white dark:bg-[#111E18] hover:border-[#0F7655]/45 dark:hover:border-[#34D399]/45 p-5 sm:p-6 transition-colors duration-150"
    >
      <div className="flex flex-col sm:flex-row gap-5 items-stretch h-full">
        <div
          onPointerMove={handleMove}
          onPointerLeave={handleLeave}
          onClick={onRead}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onRead();
            }
          }}
          aria-label={`Open ${story.title}`}
          className="w-full sm:w-36 shrink-0 aspect-[3/4] cursor-pointer [perspective:700px]"
        >
          <div
            className="relative w-full h-full rounded-r-lg rounded-l-sm overflow-hidden border border-[#0F2A1D]/15 dark:border-[#D6E8DE]/15 bg-[#11221A] shadow-md transition-transform duration-150 ease-out will-change-transform"
            style={{
              transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${tilt.hovered ? 1.025 : 1})`,
            }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-3 z-10 bg-gradient-to-r from-black/40 via-white/10 to-transparent"
            />
            <ImageWithFallback
              src={story.coverImage}
              alt={`Cover artwork for ${story.title}`}
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

        <div className="flex flex-col justify-between gap-4 flex-1">
          <div className="space-y-2">
            <div className="font-mono text-xs text-[#647A6F] dark:text-[#748B80] tabular-nums">
              {story.editionLabel} · {story.status}
            </div>
            <h3 className="font-display text-lg sm:text-xl font-semibold text-[#11221A] dark:text-[#EDF4F0] leading-snug">
              {story.title}
            </h3>
            <p className="text-sm text-[#4A6256] dark:text-[#94ABA0] leading-relaxed">
              {story.description}
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={onRead}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0F7655] hover:bg-[#0D6448] text-white text-xs font-medium transition-colors duration-150 min-h-[38px] whitespace-nowrap shrink-0"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Read Story</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

interface AboutFacet {
  id: string;
  label: string;
  title: string;
  summary: string;
  actionLabel: string;
  targetPage: PageId;
  interestId?: string;
}

const ABOUT_FACETS: AboutFacet[] = [
  {
    id: 'learning',
    label: 'Math',
    title: 'Math & Logic',
    summary: 'I enjoy figuring out math puzzles and spotting patterns.',
    actionLabel: 'Math Demo',
    targetPage: 'about',
    interestId: 'mathematics',
  },
  {
    id: 'technology',
    label: 'Tech',
    title: 'Computers & Coding',
    summary: 'I like coding and building interactive stuff for the web.',
    actionLabel: 'Node Graph',
    targetPage: 'about',
    interestId: 'technology',
  },
  {
    id: 'cubing',
    label: 'Cubing',
    title: 'Rubik’s Cubes',
    summary: 'Practicing speedsolves and learning faster algorithms.',
    actionLabel: '3D Cube',
    targetPage: 'about',
    interestId: 'cubing',
  },
  {
    id: 'books',
    label: 'Books',
    title: 'Reading & Stories',
    summary: 'I read novels and wrote two short stories a while back.',
    actionLabel: 'Read Stories',
    targetPage: 'stories',
  },
  {
    id: 'beyond',
    label: 'Other',
    title: 'Nature, MUN & Food',
    summary: 'Off-screen, I like being outdoors, Model UN, and Indian food.',
    actionLabel: 'More About Me',
    targetPage: 'about',
  },
];

const HERO_CUES = [
  {
    id: 'math',
    label: 'Math',
    note: 'Puzzles, patterns, and problem-solving.',
    interestId: 'mathematics',
  },
  {
    id: 'tech',
    label: 'Tech',
    note: 'Coding, computers, and building things.',
    interestId: 'technology',
  },
  {
    id: 'cubing',
    label: 'Cubing',
    note: 'Solving Rubik’s Cubes.',
    interestId: 'cubing',
  },
  {
    id: 'books',
    label: 'Books',
    note: 'Reading novels and my two older stories.',
    interestId: 'books',
  },
  {
    id: 'nature',
    label: 'More',
    note: 'Nature, Indian food, and Model UN.',
    interestId: 'nature',
  },
];

let hasCompletedInitialHomeOpen = false;

export const HomePage: React.FC<HomePageProps> = ({ isDark, onNavigate }) => {
  const [isInitialOpen] = useState(() => !hasCompletedInitialHomeOpen);
  const [activeCueIndex, setActiveCueIndex] = useState(0);
  const [activeFacetId, setActiveFacetId] = useState(ABOUT_FACETS[0].id);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      hasCompletedInitialHomeOpen = true;
    }, 60);
    return () => window.clearTimeout(timer);
  }, []);

  const activeCue = HERO_CUES[activeCueIndex];
  const activeFacet =
    ABOUT_FACETS.find((f) => f.id === activeFacetId) ?? ABOUT_FACETS[0];

  return (
    <div className="min-h-screen space-y-20 pb-20 overflow-x-clip">
      {/* Hero Section with First-Open Cinematic Zoom-Out */}
      <section className="pt-10 md:pt-14">
        <motion.div
          initial={
            isInitialOpen
              ? { opacity: 0, scale: 1.15 }
              : { opacity: 0, y: 10 }
          }
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={
            isInitialOpen
              ? { duration: 0.92, ease: EASE_OUT }
              : { duration: 0.28, ease: EASE_OUT }
          }
          style={{ transformOrigin: '50% 36%' }}
          className="max-w-6xl mx-auto px-4 sm:px-6 will-change-transform"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-4">
                <div className="overflow-hidden">
                  <motion.h1
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    transition={{ duration: 0.42, ease: EASE_OUT }}
                    className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold tracking-tight leading-[1.08] text-[#11221A] dark:text-[#EDF4F0]"
                  >
                    Hey, I’m{' '}
                    <motion.span
                      whileHover={{ rotate: -2, scale: 1.04 }}
                      transition={{ type: 'spring', stiffness: 420, damping: 18 }}
                      className="inline-block font-serif-editorial italic font-medium text-[#0F7655] dark:text-[#34D399] cursor-default origin-bottom"
                    >
                      Ishan.
                    </motion.span>
                  </motion.h1>
                </div>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.34, delay: 0.08, ease: EASE_OUT }}
                  className="text-base sm:text-lg text-[#4A6256] dark:text-[#94ABA0] leading-relaxed max-w-lg"
                >
                  Student into math, coding, cubing, books, and nature.
                </motion.p>
              </div>

              {/* Hairline Editorial Topic Index */}
              <motion.div
                initial={{ opacity: 0, scale: 1.02, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.36, delay: 0.14, ease: EASE_OUT }}
                className="border-y border-[#0F2A1D]/11 dark:border-[#D6E8DE]/11 py-3.5 space-y-2.5 max-w-lg"
              >
                <div className="flex flex-wrap items-center gap-4 border-b border-[#0F2A1D]/8 dark:border-[#D6E8DE]/8 pb-2">
                  {HERO_CUES.map((cue, idx) => {
                    const active = activeCueIndex === idx;
                    return (
                      <button
                        key={cue.id}
                        type="button"
                        onClick={() => setActiveCueIndex(idx)}
                        className={`relative pb-1.5 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 ${
                          active
                            ? 'text-[#0F7655] dark:text-[#34D399] font-semibold'
                            : 'text-[#647A6F] dark:text-[#748B80] hover:text-[#11221A] dark:hover:text-[#EDF4F0]'
                        }`}
                      >
                        {cue.label}
                        {active && (
                          <motion.span
                            layoutId="hero-cue-underline"
                            transition={{
                              type: 'spring',
                              stiffness: 420,
                              damping: 34,
                            }}
                            aria-hidden="true"
                            className="absolute inset-x-0 -bottom-[9px] h-[2px] bg-[#0F7655] dark:bg-[#34D399]"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between gap-4 pt-0.5 min-h-[26px]">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={activeCue.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.16, ease: EASE_OUT }}
                      className="text-xs sm:text-sm text-[#4A6256] dark:text-[#94ABA0]"
                    >
                      {activeCue.note}
                    </motion.p>
                  </AnimatePresence>
                  <button
                    type="button"
                    onClick={() =>
                      onNavigate('about', { interestId: activeCue.interestId })
                    }
                    aria-label={`Open ${activeCue.label}`}
                    className="group inline-flex items-center gap-1 text-xs font-semibold text-[#0F7655] dark:text-[#34D399] hover:opacity-80 transition-opacity duration-150 shrink-0 whitespace-nowrap"
                  >
                    <span>Open</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.34, delay: 0.2, ease: EASE_OUT }}
                className="flex flex-wrap items-center gap-3 pt-1"
              >
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onNavigate('about', { interestId: 'technology' })}
                  className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0F7655] hover:bg-[#0D6448] text-white text-sm font-medium transition-colors duration-150 min-h-[44px] whitespace-nowrap shrink-0"
                >
                  <span>About Me</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1" />
                </motion.button>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onNavigate('stories')}
                  className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#0F2A1D]/15 dark:border-[#D6E8DE]/15 bg-white dark:bg-[#111E18] hover:border-[#0F7655]/60 dark:hover:border-[#34D399]/60 text-[#11221A] dark:text-[#EDF4F0] text-sm font-medium transition-colors duration-150 min-h-[44px] whitespace-nowrap shrink-0"
                >
                  <BookOpen className="w-4 h-4 text-[#0F7655] dark:text-[#34D399] transition-transform duration-150 group-hover:-rotate-6" />
                  <span>My Stories</span>
                </motion.button>
              </motion.div>
            </div>

            {/* 3D Stage with Smooth Zoom-Out Framing Reveal */}
            <motion.div
              initial={
                isInitialOpen
                  ? { opacity: 0, scale: 1.07 }
                  : { opacity: 0, scale: 1.02 }
              }
              animate={{ opacity: 1, scale: 1 }}
              transition={
                isInitialOpen
                  ? { duration: 0.96, delay: 0.04, ease: EASE_OUT }
                  : { duration: 0.36, ease: EASE_OUT }
              }
              className="lg:col-span-6"
            >
              <Hero3DScene isDark={isDark} isInitialOpen={isInitialOpen} />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Introduction + Interactive Low-Poly Nature Scene (Scroll-Linked Zoom-Out) */}
      <section className="border-y border-[#0F2A1D]/11 dark:border-[#D6E8DE]/11 bg-[#EBF0EC]/80 dark:bg-[#0E1A15] overflow-hidden">
        <ZoomOutBand className="max-w-6xl mx-auto px-4 sm:px-6 py-14 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2.5">
                <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#11221A] dark:text-[#EDF4F0]">
                  About{' '}
                  <span className="font-serif-editorial italic font-medium text-[#0F7655] dark:text-[#34D399]">
                    Me
                  </span>
                </h2>
                <p className="text-sm sm:text-base text-[#4A6256] dark:text-[#94ABA0] leading-relaxed max-w-md">
                  I’m a student who likes figuring out how things work—from math
                  and code to cubing and books.
                </p>
              </div>

              {/* Clean Segmented Facet Selector with Sliding Active Pill */}
              <div className="flex flex-wrap gap-1.5 pb-4 border-b border-[#0F2A1D]/11 dark:border-[#D6E8DE]/11">
                {ABOUT_FACETS.map((facet) => {
                  const active = activeFacetId === facet.id;
                  return (
                    <button
                      key={facet.id}
                      type="button"
                      onClick={() => setActiveFacetId(facet.id)}
                      className={`relative px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 border ${
                        active
                          ? 'border-[#0F7655] text-white'
                          : 'bg-white dark:bg-[#111E18] border-[#0F2A1D]/12 dark:border-[#D6E8DE]/12 text-[#4A6256] dark:text-[#94ABA0] hover:text-[#11221A] dark:hover:text-[#EDF4F0] hover:border-[#0F7655]/45 dark:hover:border-[#34D399]/45'
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="about-facet-bg"
                          transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 32,
                          }}
                          aria-hidden="true"
                          className="absolute inset-0 rounded-[5px] bg-[#0F7655]"
                        />
                      )}
                      <span className="relative z-10">{facet.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Unboxed Editorial Readout */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFacet.id}
                  initial={{ opacity: 0, scale: 1.02, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.985, y: -6 }}
                  transition={{ duration: 0.18, ease: EASE_OUT }}
                  className="space-y-3 min-h-[112px]"
                >
                  <div className="font-mono text-xs text-[#0F7655] dark:text-[#34D399]">
                    {activeFacet.label}
                  </div>
                  <h3 className="font-display text-xl font-semibold text-[#11221A] dark:text-[#EDF4F0]">
                    {activeFacet.title}
                  </h3>
                  <p className="text-sm text-[#4A6256] dark:text-[#94ABA0] leading-relaxed max-w-md">
                    {activeFacet.summary}
                  </p>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        onNavigate(activeFacet.targetPage, {
                          interestId: activeFacet.interestId,
                        })
                      }
                      className="group inline-flex items-center gap-2 text-sm font-semibold text-[#0F7655] dark:text-[#34D399] hover:opacity-80 transition-opacity duration-150"
                    >
                      <span>{activeFacet.actionLabel}</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1" />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="lg:col-span-6">
              <LowPolyNatureCanvas />
            </div>
          </div>
        </ZoomOutBand>
      </section>

      {/* Hairline-Ruled Interests Directory */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.28, ease: EASE_OUT }}
          className="flex items-end justify-between gap-4 mb-6"
        >
          <div className="space-y-1">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#11221A] dark:text-[#EDF4F0]">
              Interests
            </h2>
            <p className="text-xs sm:text-sm text-[#647A6F] dark:text-[#748B80]">
              Select any topic to open its interactive demo or section.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('about', { interestId: 'technology' })}
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F7655] dark:text-[#34D399] hover:opacity-80 transition-opacity duration-150 whitespace-nowrap shrink-0"
          >
            <span>See All</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1" />
          </button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#0F2A1D]/11 dark:bg-[#D6E8DE]/11 border border-[#0F2A1D]/12 dark:border-[#D6E8DE]/12 rounded-xl overflow-hidden">
          {INTERESTS.map((item, idx) => (
            <InterestDirectoryCell
              key={item.id}
              item={item}
              idx={idx}
              onClick={() => onNavigate('about', { interestId: item.id })}
            />
          ))}
        </div>
      </section>

      {/* Featured Stories */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.28, ease: EASE_OUT }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6"
        >
          <div className="space-y-1.5 max-w-xl">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#11221A] dark:text-[#EDF4F0]">
              Stories
            </h2>
            <p className="text-sm text-[#4A6256] dark:text-[#94ABA0]">
              {STORIES_AUTHOR_NOTE}
            </p>
          </div>
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => onNavigate('stories')}
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#0F2A1D]/12 dark:border-[#D6E8DE]/12 bg-white dark:bg-[#111E18] hover:border-[#0F7655]/60 dark:hover:border-[#34D399]/60 text-xs font-medium text-[#11221A] dark:text-[#EDF4F0] transition-colors duration-150 whitespace-nowrap min-h-[40px] shrink-0"
          >
            <span>All Stories</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {STORIES.map((story, idx) => (
            <TiltStoryCard
              key={story.id}
              story={story}
              idx={idx}
              onRead={() => onNavigate('stories', { storyId: story.id })}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
