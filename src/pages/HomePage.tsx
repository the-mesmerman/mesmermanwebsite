import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Compass,
  Sparkles,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  INTERESTS,
  STORIES,
  STORIES_AUTHOR_NOTE,
} from '../data/siteData';
import type { PageId } from '../types/site';
import { Hero3DScene } from '../components/three/Hero3DScene';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { AmbientBackground } from '../components/visuals/AmbientBackground';
import { LowPolyNatureCanvas } from '../components/visuals/LowPolyNatureCanvas';

interface HomePageProps {
  isDark: boolean;
  onNavigate: (
    page: PageId,
    options?: { interestId?: string; storyId?: string },
  ) => void;
}

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  as?: 'div' | 'button' | 'article';
  delay?: number;
}

const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  className = '',
  onClick,
  as = 'div',
  delay = 0,
}) => {
  const Component =
    as === 'button'
      ? motion.button
      : as === 'article'
        ? motion.article
        : motion.div;

  return (
    <Component
      type={as === 'button' ? 'button' : undefined}
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.36, delay, ease: EASE_OUT }}
      whileHover={onClick || as === 'article' ? { y: -4 } : undefined}
      whileTap={as === 'button' ? { scale: 0.985 } : undefined}
      className={`relative overflow-hidden ${className}`}
    >
      <div className="relative z-10 h-full">{children}</div>
    </Component>
  );
};

/* Colorful nature-inspired hover-animated micro-illustrations for the 6 Explore cards */
const ExploreMicroVisual: React.FC<{ id: string }> = ({ id }) => {
  switch (id) {
    case 'technology':
      return (
        <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-500/25 flex items-center justify-center shrink-0 overflow-hidden">
          <svg viewBox="0 0 32 32" className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none">
            <line
              x1="8"
              y1="10"
              x2="24"
              y2="10"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              className="opacity-45 group-hover:opacity-100 transition-opacity duration-300"
            />
            <line
              x1="8"
              y1="22"
              x2="24"
              y2="22"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              className="opacity-45 group-hover:opacity-100 transition-opacity duration-300"
            />
            <line
              x1="10"
              y1="10"
              x2="22"
              y2="22"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              className="opacity-60 group-hover:opacity-100 transition-opacity duration-300"
            />
            <circle
              cx="9"
              cy="10"
              r="3"
              fill="currentColor"
              className="transition-transform duration-300 origin-[9px_10px] group-hover:scale-125"
            />
            <circle
              cx="23"
              cy="10"
              r="2.5"
              stroke="currentColor"
              strokeWidth="1.75"
              className="fill-white dark:fill-[#0B1B15] transition-transform duration-300 origin-[23px_10px] group-hover:scale-110"
            />
            <circle
              cx="9"
              cy="22"
              r="2.5"
              stroke="currentColor"
              strokeWidth="1.75"
              className="fill-white dark:fill-[#0B1B15]"
            />
            <circle
              cx="23"
              cy="22"
              r="3"
              fill="currentColor"
              className="text-amber-500 transition-transform duration-300 origin-[23px_22px] group-hover:scale-125"
            />
          </svg>
        </div>
      );
    case 'mathematics':
      return (
        <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-500/25 flex items-center justify-center shrink-0 overflow-hidden">
          <svg
            viewBox="0 0 32 32"
            className="w-6 h-6 text-amber-600 dark:text-amber-400 transition-transform duration-500 ease-out group-hover:rotate-90"
            fill="none"
          >
            <circle
              cx="16"
              cy="16"
              r="10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              className="opacity-65"
            />
            <polygon
              points="16,7 24,21 8,21"
              stroke="currentColor"
              strokeWidth="1.65"
              strokeLinejoin="round"
            />
            <circle cx="16" cy="16" r="2.2" fill="currentColor" />
          </svg>
        </div>
      );
    case 'cubing':
      return (
        <div className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200/80 dark:border-teal-500/25 flex items-center justify-center shrink-0 overflow-hidden">
          <div className="grid grid-cols-3 gap-[2px] w-6 h-6 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
            <span className="rounded-[2px] bg-emerald-500" />
            <span className="rounded-[2px] bg-amber-400 transition-colors duration-300 group-hover:bg-rose-400" />
            <span className="rounded-[2px] bg-teal-500" />
            <span className="rounded-[2px] bg-slate-200 dark:bg-emerald-900 transition-colors duration-300 group-hover:bg-lime-400" />
            <span className="rounded-[2px] bg-emerald-600" />
            <span className="rounded-[2px] bg-orange-400" />
            <span className="rounded-[2px] bg-amber-400" />
            <span className="rounded-[2px] bg-teal-400 transition-colors duration-300 group-hover:bg-emerald-400" />
            <span className="rounded-[2px] bg-rose-400" />
          </div>
        </div>
      );
    case 'books':
      return (
        <div className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200/80 dark:border-teal-500/25 flex items-center justify-center shrink-0 overflow-hidden">
          <svg
            viewBox="0 0 32 32"
            className="w-6 h-6 text-teal-600 dark:text-teal-400 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105"
            fill="none"
          >
            <path
              d="M16 9C13 7.5 8.5 7.5 5.5 9V23C8.5 21.5 13 21.5 16 23"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 9C19 7.5 23.5 7.5 26.5 9V23C23.5 21.5 19 21.5 16 23"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              x1="16"
              y1="9"
              x2="16"
              y2="23"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        </div>
      );
    case 'creative-writing':
      return (
        <div className="w-11 h-11 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-500/25 flex items-center justify-center shrink-0 overflow-hidden">
          <svg
            viewBox="0 0 32 32"
            className="w-6 h-6 text-rose-500 dark:text-rose-400"
            fill="none"
          >
            <path
              d="M6 25C10 21 15 24 25 21"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              className="opacity-50 group-hover:opacity-100 transition-opacity duration-300"
            />
            <path
              d="M21 7L25 11L13 23H9V19L21 7Z"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinejoin="round"
              className="transition-transform duration-300 origin-bottom-left group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </svg>
        </div>
      );
    default:
      return (
        <div className="w-11 h-11 rounded-xl bg-lime-50 dark:bg-lime-950/40 border border-lime-200/80 dark:border-lime-500/25 flex items-center justify-center shrink-0 overflow-hidden">
          <svg
            viewBox="0 0 32 32"
            className="w-6 h-6 text-lime-600 dark:text-lime-400 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105"
            fill="none"
          >
            <path
              d="M24 8C15 8 9 13.5 9 23C18.5 23 24 17 24 8Z"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinejoin="round"
            />
            <path
              d="M8 24C11.5 20.5 15.5 16.5 20 12"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </div>
      );
  }
};

/* 3D Perspective Tilt Book Card */
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
      rx: (0.5 - py) * 11,
      ry: (px - 0.5) * 14,
      sx: px * 100,
      sy: py * 100,
      hovered: true,
    });
  };

  const handleLeave = () => {
    setTilt({ rx: 0, ry: 0, sx: 50, sy: 50, hovered: false });
  };

  return (
    <InteractiveCard
      as="article"
      delay={idx * 0.07}
      className="group rounded-2xl border border-emerald-950/10 dark:border-emerald-500/20 bg-white/90 dark:bg-[#0B1B15]/90 backdrop-blur-sm hover:border-emerald-500/50 p-5 transition-colors duration-200"
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
            className="relative w-full h-full rounded-xl overflow-hidden border border-emerald-950/15 dark:border-emerald-500/20 bg-emerald-950 shadow-md transition-transform duration-200 ease-out will-change-transform"
            style={{
              transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${tilt.hovered ? 1.03 : 1})`,
            }}
          >
            <ImageWithFallback
              src={story.coverImage}
              alt={`Cover artwork for ${story.title}`}
              fallbackTitle={story.title}
              className="w-full h-full object-cover"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 transition-opacity duration-200"
              style={{
                opacity: tilt.hovered ? 0.55 : 0,
                background: `radial-gradient(circle at ${tilt.sx}% ${tilt.sy}%, rgba(255,255,255,0.35), transparent 60%)`,
              }}
            />
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 flex-1">
          <div className="space-y-2">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {story.editionLabel} · {story.status}
            </div>
            <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-emerald-50 leading-snug">
              {story.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {story.description}
            </p>
          </div>

          <div className="flex items-center justify-between gap-3">
            <motion.button
              type="button"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.96 }}
              onClick={onRead}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors min-h-[38px]"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Read Story</span>
            </motion.button>
          </div>
        </div>
      </div>
    </InteractiveCard>
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

export const HomePage: React.FC<HomePageProps> = ({ isDark, onNavigate }) => {
  const [activeCueIndex, setActiveCueIndex] = useState(0);
  const [activeFacetId, setActiveFacetId] = useState(ABOUT_FACETS[0].id);

  const activeCue = HERO_CUES[activeCueIndex];
  const activeFacet =
    ABOUT_FACETS.find((f) => f.id === activeFacetId) ?? ABOUT_FACETS[0];

  return (
    <div className="relative min-h-screen">
      {/* Nature Low-Poly Ambient Backdrop */}
      <AmbientBackground isDark={isDark} />

      <div className="relative z-10 space-y-20 pb-20">
        {/* Hero Section */}
        <section className="pt-10 md:pt-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              <div className="lg:col-span-6 space-y-5">
                <motion.h1
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.38, delay: 0.04, ease: EASE_OUT }}
                  className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.08] text-slate-900 dark:text-emerald-50"
                >
                  Hey, I’m{' '}
                  <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-500 dark:from-emerald-400 dark:via-teal-300 dark:to-amber-300 bg-clip-text text-transparent">
                    Ishan.
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.38, delay: 0.1, ease: EASE_OUT }}
                  className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg"
                >
                  Student into math, coding, cubing, books, and nature.
                </motion.p>

                {/* Interactive Hero Curiosity Switcher */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.38, delay: 0.16, ease: EASE_OUT }}
                  className="rounded-xl border border-emerald-950/12 dark:border-emerald-500/20 bg-white/85 dark:bg-[#0B1B15]/85 backdrop-blur-md p-3.5 space-y-2.5 max-w-lg"
                >
                  <div className="flex flex-wrap items-center gap-1">
                    {HERO_CUES.map((cue, idx) => (
                      <button
                        key={cue.id}
                        type="button"
                        onClick={() => setActiveCueIndex(idx)}
                        className={`relative px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                          activeCueIndex === idx
                            ? 'text-white'
                            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {activeCueIndex === idx && (
                          <motion.span
                            layoutId="hero-cue-bg"
                            transition={{
                              type: 'spring',
                              stiffness: 420,
                              damping: 32,
                            }}
                            className="absolute inset-0 rounded-lg bg-emerald-600"
                          />
                        )}
                        <span className="relative z-10">{cue.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-0.5 min-h-[28px]">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={activeCue.id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.16 }}
                        className="text-xs sm:text-sm text-slate-600 dark:text-slate-300"
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
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 shrink-0 whitespace-nowrap"
                    >
                      <span>Open</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.38, delay: 0.2, ease: EASE_OUT }}
                  className="flex flex-wrap items-center gap-3 pt-1"
                >
                  <motion.button
                    type="button"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ duration: 0.14 }}
                    onClick={() => onNavigate('about', { interestId: 'technology' })}
                    className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors shadow-sm min-h-[44px] whitespace-nowrap"
                  >
                    <Compass className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
                    <span>About Me</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ duration: 0.14 }}
                    onClick={() => onNavigate('stories')}
                    className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-emerald-950/15 dark:border-emerald-500/25 bg-white/90 dark:bg-[#0B1B15]/90 backdrop-blur-sm hover:border-emerald-500/60 text-slate-800 dark:text-emerald-50 text-sm font-semibold transition-colors min-h-[44px] whitespace-nowrap"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>My Stories</span>
                  </motion.button>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.48, ease: EASE_OUT, delay: 0.08 }}
                className="lg:col-span-6"
              >
                <Hero3DScene isDark={isDark} />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Introduction + Interactive Low-Poly Nature Scene */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
          className="border-y border-emerald-950/10 dark:border-emerald-500/15 bg-white/70 dark:bg-[#0B1B15]/60 backdrop-blur-md"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-5">
                <div className="space-y-3">
                  <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-emerald-50">
                    About Me
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                    I’m a student who likes figuring out how things work—from
                    math and code to cubing and books.
                  </p>
                </div>

                {/* Segmented Facet Selector */}
                <div className="flex flex-wrap gap-1.5">
                  {ABOUT_FACETS.map((facet) => (
                    <button
                      key={facet.id}
                      type="button"
                      onClick={() => setActiveFacetId(facet.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap border ${
                        activeFacetId === facet.id
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                          : 'bg-white/85 dark:bg-[#112820]/85 border-emerald-950/12 dark:border-emerald-500/20 text-slate-700 dark:text-slate-300 hover:border-emerald-500/50'
                      }`}
                    >
                      {facet.label}
                    </button>
                  ))}
                </div>

                <InteractiveCard className="rounded-2xl border border-emerald-950/10 dark:border-emerald-500/20 bg-white/90 dark:bg-[#081510]/90 p-5 sm:p-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeFacet.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2, ease: EASE_OUT }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">
                          {activeFacet.label}
                        </span>
                        <Sparkles className="w-4 h-4 text-amber-500" />
                      </div>
                      <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-emerald-50">
                        {activeFacet.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {activeFacet.summary}
                      </p>
                      <div className="pt-1">
                        <motion.button
                          type="button"
                          whileHover={{ x: 3 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() =>
                            onNavigate(activeFacet.targetPage, {
                              interestId: activeFacet.interestId,
                            })
                          }
                          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors"
                        >
                          <span>{activeFacet.actionLabel}</span>
                          <ArrowRight className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </InteractiveCard>
              </div>

              <div className="lg:col-span-6">
                <LowPolyNatureCanvas />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Explore Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.08 }}
            transition={{ duration: 0.36, ease: EASE_OUT }}
            className="flex items-end justify-between gap-4 mb-8"
          >
            <div className="space-y-1">
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-emerald-50">
                Interests
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Click any card to open its demo or page.
              </p>
            </div>
            <motion.button
              type="button"
              whileHover={{ x: 2 }}
              onClick={() => onNavigate('about', { interestId: 'technology' })}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors whitespace-nowrap"
            >
              <span>See All</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {INTERESTS.map((item, idx) => (
              <InteractiveCard
                key={item.id}
                as="button"
                delay={idx * 0.04}
                onClick={() => onNavigate('about', { interestId: item.id })}
                className="group text-left p-5 rounded-2xl border border-emerald-950/10 dark:border-emerald-500/20 bg-white/90 dark:bg-[#0B1B15]/90 backdrop-blur-sm hover:border-emerald-500/50 transition-colors duration-200"
              >
                <div className="flex items-start gap-4 h-full">
                  <ExploreMicroVisual id={item.id} />
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-display text-base font-semibold text-slate-900 dark:text-emerald-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {item.shortLabel}
                      </h3>
                      <ArrowUpRight className="w-4 h-4 text-slate-400 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-emerald-500 transition-all duration-200 shrink-0" />
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.tagline}
                    </p>
                  </div>
                </div>
              </InteractiveCard>
            ))}
          </div>
        </section>

        {/* Featured Stories with 3D Perspective Tilt Covers */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.08 }}
            transition={{ duration: 0.36, ease: EASE_OUT }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
          >
            <div className="space-y-1.5 max-w-xl">
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-emerald-50">
                Stories
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {STORIES_AUTHOR_NOTE}
              </p>
            </div>
            <motion.button
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onNavigate('stories')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-950/15 dark:border-emerald-500/25 bg-white/90 dark:bg-[#0B1B15]/90 backdrop-blur-sm hover:border-emerald-500/60 text-xs font-semibold text-slate-800 dark:text-emerald-50 transition-colors whitespace-nowrap min-h-[40px] shrink-0"
            >
              <span>All Stories</span>
              <ArrowRight className="w-3.5 h-3.5" />
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
    </div>
  );
};
