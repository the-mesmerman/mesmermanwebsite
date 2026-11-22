import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Box,
  Compass,
  Cpu,
  Feather,
  Globe,
  LayoutGrid,
  Leaf,
  Maximize2,
  Rows3,
  Sigma,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { MonogramLogo } from '../components/MonogramLogo';
import { RubiksCube3D } from '../components/three/RubiksCube3D';
import { MathInteractiveVisual } from '../components/visuals/MathInteractiveVisual';
import { TechMatrixVisual } from '../components/visuals/TechMatrixVisual';
import { INTERESTS } from '../data/siteData';
import type { PageId } from '../types/site';

interface AboutPageProps {
  onNavigate: (page: PageId) => void;
  initialInterestId?: string;
}

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const FACETS = [
  {
    id: 'learning',
    title: 'Math',
    targetInterest: 'mathematics',
    icon: <Sigma className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
    text: 'Solving math problems and spotting patterns.',
  },
  {
    id: 'technology',
    title: 'Tech',
    targetInterest: 'technology',
    icon: <Cpu className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
    text: 'Messing with code and building web projects.',
  },
  {
    id: 'reading',
    title: 'Books',
    targetInterest: 'books',
    icon: <BookOpen className="w-4 h-4 text-teal-600 dark:text-teal-400" />,
    text: 'Reading fiction and good novels.',
  },
  {
    id: 'creativity',
    title: 'Writing',
    targetInterest: 'creative-writing',
    icon: <Feather className="w-4 h-4 text-rose-500 dark:text-rose-400" />,
    text: 'Two older stories I wrote (Bunzo & Ekavir).',
  },
  {
    id: 'beyond',
    title: 'Outside',
    targetInterest: 'cubing',
    icon: <Compass className="w-4 h-4 text-lime-600 dark:text-lime-400" />,
    text: 'Speedcubing, nature, and Indian food.',
  },
  {
    id: 'mun',
    title: 'Model UN',
    targetInterest: undefined,
    icon: <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
    text: 'Debating and learning about global issues.',
  },
];

const INTEREST_META: Record<
  string,
  { icon: React.ReactNode; accentBg: string; accentText: string; hint: string }
> = {
  technology: {
    icon: <Cpu className="w-4 h-4" />,
    accentBg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/80 dark:border-emerald-500/25',
    accentText: 'text-emerald-600 dark:text-emerald-400',
    hint: 'Click any node to send pulses.',
  },
  mathematics: {
    icon: <Sigma className="w-4 h-4" />,
    accentBg: 'bg-amber-50 dark:bg-amber-950/45 border-amber-200/80 dark:border-amber-500/25',
    accentText: 'text-amber-600 dark:text-amber-400',
    hint: 'Move the slider or hover over the spiral.',
  },
  cubing: {
    icon: <Box className="w-4 h-4" />,
    accentBg: 'bg-teal-50 dark:bg-teal-950/50 border-teal-200/80 dark:border-teal-500/25',
    accentText: 'text-teal-600 dark:text-teal-400',
    hint: 'Turn faces, scramble, or drag to rotate.',
  },
  books: {
    icon: <BookOpen className="w-4 h-4" />,
    accentBg: 'bg-teal-50 dark:bg-teal-950/50 border-teal-200/80 dark:border-teal-500/25',
    accentText: 'text-teal-600 dark:text-teal-400',
    hint: 'Novels I like reading.',
  },
  'creative-writing': {
    icon: <Feather className="w-4 h-4" />,
    accentBg: 'bg-rose-50 dark:bg-rose-950/45 border-rose-200/80 dark:border-rose-500/25',
    accentText: 'text-rose-500 dark:text-rose-400',
    hint: 'Both stories are on the Stories page.',
  },
  nature: {
    icon: <Leaf className="w-4 h-4" />,
    accentBg: 'bg-lime-50 dark:bg-lime-950/45 border-lime-200/80 dark:border-lime-500/25',
    accentText: 'text-lime-600 dark:text-lime-400',
    hint: 'Good to step away from screens.',
  },
};

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigate,
  initialInterestId,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'showcase' | 'grid'>('showcase');

  useEffect(() => {
    if (initialInterestId) {
      setViewMode('showcase');
      setSelectedFilter('all');
      const timer = setTimeout(() => {
        const el = document.getElementById(`interest-${initialInterestId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [initialInterestId]);

  const visibleInterests =
    selectedFilter === 'all'
      ? INTERESTS
      : INTERESTS.filter((i) => i.id === selectedFilter);

  const scrollToInterests = () => {
    const el = document.getElementById('interests-explorer');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const jumpToInterest = (interestId: string) => {
    setViewMode('showcase');
    setSelectedFilter('all');
    setTimeout(() => {
      const el = document.getElementById(`interest-${interestId}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 60);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-24">
      <Breadcrumbs
        items={[{ label: 'Home', page: 'home' }, { label: 'About' }]}
        onNavigate={onNavigate}
      />

      {/* Editorial Opening */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pb-14 border-b border-emerald-950/10 dark:border-emerald-500/15">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
          className="lg:col-span-7 space-y-5"
        >
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-emerald-50">
            Hi, I’m Ishan.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-[56ch]">
            I’m a student who likes math, coding, cubing, reading, and spending
            time outside.
          </p>

          <div className="pt-1 flex flex-wrap gap-3">
            <motion.button
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={scrollToInterests}
              className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors min-h-[42px]"
            >
              <span>Interests</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onNavigate('stories')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-950/15 dark:border-emerald-500/20 bg-white dark:bg-[#0B1B15] hover:border-emerald-500/60 text-slate-800 dark:text-slate-100 text-sm font-semibold transition-colors min-h-[42px]"
            >
              <span>My Stories</span>
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.42, delay: 0.06, ease: EASE_OUT }}
          whileHover={{ y: -4 }}
          className="lg:col-span-5"
        >
          <div className="rounded-2xl border border-emerald-950/15 dark:border-emerald-500/25 bg-white dark:bg-[#0B1B15] p-3 shadow-sm max-w-[310px] w-full mx-auto">
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-emerald-950/10 dark:bg-emerald-950">
              <img
                src={`${import.meta.env.BASE_URL}assets/aistudio/image_e3d72e20.png`}
                alt="Portrait of Ishan Ganti"
                className="absolute max-w-none pointer-events-none select-none"
                style={{
                  width: '425.5%',
                  height: 'auto',
                  left: '-226.4%',
                  top: '-89%',
                }}
              />
            </div>
            <div className="pt-3 pb-1 px-1 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <MonogramLogo size={20} />
                <span className="font-display text-xs font-bold tracking-tight text-slate-900 dark:text-emerald-50">
                  Ishan Ganti
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Interactive Overview Grid with Scroll Reveal */}
      <section className="py-12 border-b border-emerald-950/10 dark:border-emerald-500/15">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FACETS.map((facet, idx) => {
            const isClickable = Boolean(facet.targetInterest);
            return (
              <motion.div
                key={facet.id}
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: 0.36, delay: idx * 0.04, ease: EASE_OUT }}
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={isClickable ? { scale: 0.985 } : undefined}
                onClick={() => {
                  if (facet.targetInterest) jumpToInterest(facet.targetInterest);
                }}
                role={isClickable ? 'button' : undefined}
                tabIndex={isClickable ? 0 : undefined}
                onKeyDown={(e) => {
                  if (
                    isClickable &&
                    facet.targetInterest &&
                    (e.key === 'Enter' || e.key === ' ')
                  ) {
                    e.preventDefault();
                    jumpToInterest(facet.targetInterest);
                  }
                }}
                className={`group rounded-2xl border border-emerald-950/10 dark:border-emerald-500/15 bg-white dark:bg-[#0B1B15] p-5 space-y-2.5 transition-colors hover:border-emerald-500/45 ${
                  isClickable ? 'cursor-pointer' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-[#112820] flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3">
                      {facet.icon}
                    </div>
                    <h2 className="font-display text-base font-bold text-slate-900 dark:text-emerald-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {facet.title}
                    </h2>
                  </div>
                  {isClickable && (
                    <ArrowUpRight className="w-4 h-4 text-slate-400 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-emerald-500 transition-all duration-200 shrink-0" />
                  )}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {facet.text}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Interactive Interests Section */}
      <section id="interests-explorer" className="pt-14">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.38, ease: EASE_OUT }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8"
        >
          <div className="space-y-2">
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-emerald-50">
              Interests
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
              Play with the demos or switch to Overview.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Showcase vs Compact Grid Switcher */}
            <div
              className="inline-flex items-center gap-1 p-1 rounded-xl bg-emerald-50/90 dark:bg-[#0B1B15] border border-emerald-950/10 dark:border-emerald-500/20"
              role="group"
              aria-label="Layout view"
            >
              <button
                type="button"
                onClick={() => setViewMode('showcase')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  viewMode === 'showcase'
                    ? 'bg-white dark:bg-[#112820] text-emerald-700 dark:text-emerald-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Rows3 className="w-3.5 h-3.5" />
                <span>Showcase</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewMode('grid');
                  setSelectedFilter('all');
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-[#112820] text-emerald-700 dark:text-emerald-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Overview</span>
              </button>
            </div>

            {/* Category Filter Bar */}
            {viewMode === 'showcase' && (
              <div
                className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-emerald-50/90 dark:bg-[#0B1B15] border border-emerald-950/10 dark:border-emerald-500/20"
                role="tablist"
                aria-label="Filter interests"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={selectedFilter === 'all'}
                  onClick={() => setSelectedFilter('all')}
                  className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                    selectedFilter === 'all'
                      ? 'text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {selectedFilter === 'all' && (
                    <motion.span
                      layoutId="interest-filter-pill"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className="absolute inset-0 rounded-lg bg-emerald-600"
                    />
                  )}
                  <span className="relative z-10">All</span>
                </button>

                {INTERESTS.map((interest) => {
                  const active = selectedFilter === interest.id;
                  return (
                    <button
                      key={interest.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setSelectedFilter(interest.id)}
                      className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                        active
                          ? 'text-white'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="interest-filter-pill"
                          transition={{
                            type: 'spring',
                            stiffness: 420,
                            damping: 32,
                          }}
                          className="absolute inset-0 rounded-lg bg-emerald-600"
                        />
                      )}
                      <span className="relative z-10">{interest.title}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {INTERESTS.map((interest, idx) => {
              const meta = INTEREST_META[interest.id] ?? INTEREST_META.technology;
              const num = `0${idx + 1}`;
              return (
                <motion.button
                  key={interest.id}
                  type="button"
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.12 }}
                  transition={{
                    duration: 0.38,
                    delay: idx * 0.05,
                    ease: EASE_OUT,
                  }}
                  whileHover={{ y: -6, scale: 1.015 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedFilter(interest.id);
                    setViewMode('showcase');
                  }}
                  className="group text-left rounded-2xl border border-emerald-950/10 dark:border-emerald-500/20 bg-white dark:bg-[#0B1B15] hover:border-emerald-500/50 p-6 flex flex-col justify-between gap-5 transition-colors shadow-xs"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div
                        className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3 ${meta.accentBg} ${meta.accentText}`}
                      >
                        {meta.icon}
                      </div>
                      <span className="font-mono text-xs text-slate-400 tabular-nums">
                        {num}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="font-display text-lg font-bold text-slate-900 dark:text-emerald-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {interest.shortLabel}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {interest.summary}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-emerald-950/10 dark:border-emerald-500/15 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <span>
                      {interest.visualType === 'image' ? 'View' : 'Open Demo'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </motion.button>
              );
            })}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="space-y-8">
              {visibleInterests.map((interest, idx) => {
                const isReversed = idx % 2 === 1;
                const indexNum = INTERESTS.findIndex((i) => i.id === interest.id);
                const meta =
                  INTEREST_META[interest.id] ?? INTEREST_META.technology;
                const isFocused = selectedFilter === interest.id;

                return (
                  <motion.section
                    key={interest.id}
                    id={`interest-${interest.id}`}
                    layout
                    initial={{ opacity: 0, y: 28, scale: 0.985 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -12, scale: 0.98 }}
                    viewport={{ once: true, amount: 0.14 }}
                    transition={{ duration: 0.44, ease: EASE_OUT }}
                    whileHover={{ y: -4 }}
                    className="group rounded-2xl border border-emerald-950/10 dark:border-emerald-500/15 bg-white dark:bg-[#0B1B15] hover:border-emerald-500/45 p-6 sm:p-7 transition-colors shadow-xs"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                      <motion.div
                        initial={{ opacity: 0, x: isReversed ? 16 : -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.42, delay: 0.06, ease: EASE_OUT }}
                        className={`lg:col-span-5 space-y-4 ${
                          isReversed ? 'lg:order-2' : 'lg:order-1'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <motion.div
                            whileHover={{ scale: 1.12, rotate: 6 }}
                            transition={{
                              type: 'spring',
                              stiffness: 380,
                              damping: 20,
                            }}
                            className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${meta.accentBg} ${meta.accentText}`}
                          >
                            {meta.icon}
                          </motion.div>
                          <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                            0{indexNum + 1} · {interest.title}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-emerald-50">
                            {interest.shortLabel}
                          </h3>
                          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                            {interest.summary}
                          </p>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {meta.hint}
                        </p>

                        <div className="pt-1 flex flex-wrap items-center gap-2.5">
                          <motion.button
                            type="button"
                            whileHover={{ y: -1 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() =>
                              setSelectedFilter(isFocused ? 'all' : interest.id)
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-950/15 dark:border-emerald-500/25 bg-[#F6FAF7] dark:bg-[#112820] hover:border-emerald-500/60 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                          >
                            <Maximize2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>
                              {isFocused ? 'Show All Interests' : 'Focus Card'}
                            </span>
                          </motion.button>

                          {interest.id === 'creative-writing' && (
                            <motion.button
                              type="button"
                              whileHover={{ y: -1 }}
                              whileTap={{ scale: 0.96 }}
                              onClick={() => onNavigate('stories')}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>My Stories</span>
                            </motion.button>
                          )}
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: isReversed ? -16 : 16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.16 }}
                        transition={{ duration: 0.44, delay: 0.1, ease: EASE_OUT }}
                        className={`lg:col-span-7 ${
                          isReversed ? 'lg:order-1' : 'lg:order-2'
                        }`}
                      >
                        {interest.visualType === 'three-cube' && (
                          <RubiksCube3D />
                        )}
                        {interest.visualType === 'math-canvas' && (
                          <MathInteractiveVisual />
                        )}
                        {interest.visualType === 'tech-matrix' && (
                          <TechMatrixVisual />
                        )}
                        {interest.visualType === 'image' && interest.imageUrl && (
                          <motion.div
                            whileHover={{ y: -3, scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                            className="rounded-xl overflow-hidden border border-emerald-950/12 dark:border-emerald-500/20 aspect-[16/10] bg-emerald-950 group/img"
                          >
                            <ImageWithFallback
                              src={interest.imageUrl}
                              alt={interest.imageAlt || interest.title}
                              fallbackTitle={interest.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-[1.05]"
                            />
                          </motion.div>
                        )}
                      </motion.div>
                    </div>
                  </motion.section>
                );
              })}
            </div>
          </AnimatePresence>
        )}
      </section>
    </div>
  );
};
