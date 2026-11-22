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
    icon: <Sigma className="w-4 h-4 text-[#B45309] dark:text-[#FBBF24]" />,
    text: 'Solving math problems and spotting patterns.',
  },
  {
    id: 'technology',
    title: 'Tech',
    targetInterest: 'technology',
    icon: <Cpu className="w-4 h-4 text-[#0F7655] dark:text-[#34D399]" />,
    text: 'Messing with code and building web projects.',
  },
  {
    id: 'reading',
    title: 'Books',
    targetInterest: 'books',
    icon: <BookOpen className="w-4 h-4 text-[#0F7655] dark:text-[#34D399]" />,
    text: 'Reading fiction and good novels.',
  },
  {
    id: 'creativity',
    title: 'Writing',
    targetInterest: 'creative-writing',
    icon: <Feather className="w-4 h-4 text-[#B45309] dark:text-[#FBBF24]" />,
    text: 'Two older stories I wrote (Bunzo & Ekavir).',
  },
  {
    id: 'beyond',
    title: 'Outside',
    targetInterest: 'cubing',
    icon: <Compass className="w-4 h-4 text-[#0F7655] dark:text-[#34D399]" />,
    text: 'Speedcubing, nature, and Indian food.',
  },
  {
    id: 'mun',
    title: 'Model UN',
    targetInterest: undefined,
    icon: <Globe className="w-4 h-4 text-[#0F7655] dark:text-[#34D399]" />,
    text: 'Debating and learning about global issues.',
  },
];

const INTEREST_META: Record<
  string,
  { icon: React.ReactNode; hint: string }
> = {
  technology: {
    icon: <Cpu className="w-4 h-4 text-[#0F7655] dark:text-[#34D399]" />,
    hint: 'Click any node to send pulses.',
  },
  mathematics: {
    icon: <Sigma className="w-4 h-4 text-[#B45309] dark:text-[#FBBF24]" />,
    hint: 'Move the slider or hover over the spiral.',
  },
  cubing: {
    icon: <Box className="w-4 h-4 text-[#0F7655] dark:text-[#34D399]" />,
    hint: 'Turn faces, scramble, or drag to rotate.',
  },
  books: {
    icon: <BookOpen className="w-4 h-4 text-[#0F7655] dark:text-[#34D399]" />,
    hint: 'Novels I like reading.',
  },
  'creative-writing': {
    icon: <Feather className="w-4 h-4 text-[#B45309] dark:text-[#FBBF24]" />,
    hint: 'Both stories are on the Stories page.',
  },
  nature: {
    icon: <Leaf className="w-4 h-4 text-[#0F7655] dark:text-[#34D399]" />,
    hint: 'Good to step away from screens.',
  },
};

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigate,
  initialInterestId,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'showcase' | 'grid'>('showcase');
  const [portraitTilt, setPortraitTilt] = useState({
    rx: 0,
    ry: 0,
    hovered: false,
  });

  useEffect(() => {
    if (initialInterestId) {
      setViewMode('showcase');
      setSelectedFilter('all');
      const timer = setTimeout(() => {
        const el = document.getElementById(`interest-${initialInterestId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 280);
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

  const handlePortraitMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setPortraitTilt({
      rx: (0.5 - py) * 7,
      ry: (px - 0.5) * 9,
      hovered: true,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-24">
      <Breadcrumbs
        items={[{ label: 'Home', page: 'home' }, { label: 'About' }]}
        onNavigate={onNavigate}
      />

      {/* Editorial Opening */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pb-14 border-b border-[#0F2A1D]/11 dark:border-[#D6E8DE]/11">
        <div className="lg:col-span-7 space-y-5">
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
              className="font-display text-4xl sm:text-5xl font-semibold tracking-tight text-[#11221A] dark:text-[#EDF4F0]"
            >
              Hi, I’m{' '}
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
            className="text-base sm:text-lg text-[#4A6256] dark:text-[#94ABA0] leading-relaxed max-w-[56ch]"
          >
            I’m a student who likes math, coding, cubing, reading, and spending
            time outside.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.34, delay: 0.14, ease: EASE_OUT }}
            className="pt-1 flex flex-wrap gap-3"
          >
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={scrollToInterests}
              className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0F7655] hover:bg-[#0D6448] text-white text-sm font-medium transition-colors duration-150 min-h-[42px] whitespace-nowrap shrink-0"
            >
              <span>Interests</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1" />
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => onNavigate('stories')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#0F2A1D]/15 dark:border-[#D6E8DE]/15 bg-white dark:bg-[#111E18] hover:border-[#0F7655]/60 dark:hover:border-[#34D399]/60 text-[#11221A] dark:text-[#EDF4F0] text-sm font-medium transition-colors duration-150 min-h-[42px] whitespace-nowrap shrink-0"
            >
              <span>My Stories</span>
            </motion.button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.06, ease: EASE_OUT }}
          className="lg:col-span-5 [perspective:800px]"
        >
          <div
            onPointerMove={handlePortraitMove}
            onPointerLeave={() =>
              setPortraitTilt({ rx: 0, ry: 0, hovered: false })
            }
            className="rounded-xl border border-[#0F2A1D]/12 dark:border-[#D6E8DE]/12 bg-white dark:bg-[#111E18] p-2.5 max-w-[300px] w-full mx-auto transition-transform duration-150 ease-out will-change-transform"
            style={{
              transform: `rotateX(${portraitTilt.rx}deg) rotateY(${portraitTilt.ry}deg) scale(${portraitTilt.hovered ? 1.015 : 1})`,
            }}
          >
            <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-[#EFF4F0] dark:bg-[#0D1813]">
              <motion.img
                initial={{ scale: 1.08 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.75, ease: EASE_OUT }}
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
            <div className="pt-2.5 pb-0.5 px-1 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <MonogramLogo size={20} />
                <span className="font-display text-xs font-semibold tracking-tight text-[#11221A] dark:text-[#EDF4F0]">
                  Ishan Ganti
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Architectural Hairline Overview Grid */}
      <section className="py-12 border-b border-[#0F2A1D]/11 dark:border-[#D6E8DE]/11">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#0F2A1D]/11 dark:bg-[#D6E8DE]/11 border border-[#0F2A1D]/12 dark:border-[#D6E8DE]/12 rounded-xl overflow-hidden">
          {FACETS.map((facet, idx) => {
            const isClickable = Boolean(facet.targetInterest);
            const num = `0${idx + 1}`;
            const inner = (
              <>
                <div className="flex items-center justify-between gap-3 w-full">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs text-[#647A6F] dark:text-[#748B80] tabular-nums">
                      {num}
                    </span>
                    <span className="opacity-85 transition-transform duration-150 group-hover:scale-110">
                      {facet.icon}
                    </span>
                  </div>
                  {isClickable && (
                    <ArrowUpRight className="w-4 h-4 text-[#647A6F] dark:text-[#748B80] group-hover:text-[#0F7655] dark:group-hover:text-[#34D399] transition-all duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
                  )}
                </div>
                <div className="space-y-1.5">
                  <h2 className="font-display text-base font-semibold text-[#11221A] dark:text-[#EDF4F0] group-hover:text-[#0F7655] dark:group-hover:text-[#34D399] transition-colors duration-150">
                    {facet.title}
                  </h2>
                  <p className="text-sm text-[#4A6256] dark:text-[#94ABA0] leading-relaxed">
                    {facet.text}
                  </p>
                </div>
                {isClickable && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-[#0F7655] dark:bg-[#34D399] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out"
                  />
                )}
              </>
            );

            if (isClickable && facet.targetInterest) {
              return (
                <motion.button
                  key={facet.id}
                  type="button"
                  initial={{ opacity: 0, scale: 1.035 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.3, delay: idx * 0.04, ease: EASE_OUT }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => jumpToInterest(facet.targetInterest!)}
                  className="group relative text-left bg-white dark:bg-[#111E18] hover:bg-[#F7FAF7] dark:hover:bg-[#15241D] p-5 sm:p-6 flex flex-col justify-between gap-4 transition-colors duration-150 overflow-hidden"
                >
                  {inner}
                </motion.button>
              );
            }

            return (
              <motion.div
                key={facet.id}
                initial={{ opacity: 0, scale: 1.035 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.3, delay: idx * 0.04, ease: EASE_OUT }}
                className="bg-white dark:bg-[#111E18] p-5 sm:p-6 flex flex-col justify-between gap-4"
              >
                {inner}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Interactive Interests Section */}
      <section id="interests-explorer" className="pt-14">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8">
          <div className="space-y-1.5">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-[#11221A] dark:text-[#EDF4F0]">
              Interests
            </h2>
            <p className="text-sm sm:text-base text-[#4A6256] dark:text-[#94ABA0]">
              Play with the demos or switch to Overview.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Showcase vs Overview Switcher */}
            <div
              className="inline-flex items-center gap-1 p-1 rounded-lg bg-[#EFF4F0] dark:bg-[#172820] border border-[#0F2A1D]/11 dark:border-[#D6E8DE]/11"
              role="group"
              aria-label="Layout view"
            >
              <button
                type="button"
                onClick={() => setViewMode('showcase')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 ${
                  viewMode === 'showcase'
                    ? 'bg-white dark:bg-[#111E18] text-[#0F7655] dark:text-[#34D399]'
                    : 'text-[#4A6256] dark:text-[#94ABA0] hover:text-[#11221A] dark:hover:text-[#EDF4F0]'
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
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-[#111E18] text-[#0F7655] dark:text-[#34D399]'
                    : 'text-[#4A6256] dark:text-[#94ABA0] hover:text-[#11221A] dark:hover:text-[#EDF4F0]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Overview</span>
              </button>
            </div>

            {/* Category Filter Bar */}
            {viewMode === 'showcase' && (
              <div
                className="inline-flex flex-wrap items-center gap-1 p-1 rounded-lg bg-[#EFF4F0] dark:bg-[#172820] border border-[#0F2A1D]/11 dark:border-[#D6E8DE]/11"
                role="tablist"
                aria-label="Filter interests"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={selectedFilter === 'all'}
                  onClick={() => setSelectedFilter('all')}
                  className={`relative px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 ${
                    selectedFilter === 'all'
                      ? 'text-white'
                      : 'text-[#4A6256] dark:text-[#94ABA0] hover:text-[#11221A] dark:hover:text-[#EDF4F0]'
                  }`}
                >
                  {selectedFilter === 'all' && (
                    <motion.span
                      layoutId="interest-filter-tab"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className="absolute inset-0 rounded-md bg-[#0F7655]"
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
                      className={`relative px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 ${
                        active
                          ? 'text-white'
                          : 'text-[#4A6256] dark:text-[#94ABA0] hover:text-[#11221A] dark:hover:text-[#EDF4F0]'
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="interest-filter-tab"
                          transition={{
                            type: 'spring',
                            stiffness: 420,
                            damping: 32,
                          }}
                          className="absolute inset-0 rounded-md bg-[#0F7655]"
                        />
                      )}
                      <span className="relative z-10">{interest.title}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#0F2A1D]/11 dark:bg-[#D6E8DE]/11 border border-[#0F2A1D]/12 dark:border-[#D6E8DE]/12 rounded-xl overflow-hidden">
            {INTERESTS.map((interest, idx) => {
              const meta = INTEREST_META[interest.id] ?? INTEREST_META.technology;
              const num = `0${idx + 1}`;
              return (
                <motion.button
                  key={interest.id}
                  type="button"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.28, delay: idx * 0.04, ease: EASE_OUT }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => {
                    setSelectedFilter(interest.id);
                    setViewMode('showcase');
                  }}
                  className="group relative text-left bg-white dark:bg-[#111E18] hover:bg-[#F7FAF7] dark:hover:bg-[#15241D] p-6 flex flex-col justify-between gap-6 transition-colors duration-150 overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs text-[#647A6F] dark:text-[#748B80] tabular-nums">
                        {num}
                      </span>
                      <span className="opacity-85 transition-transform duration-150 group-hover:scale-110">
                        {meta.icon}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="font-display text-lg font-semibold text-[#11221A] dark:text-[#EDF4F0] group-hover:text-[#0F7655] dark:group-hover:text-[#34D399] transition-colors duration-150">
                        {interest.shortLabel}
                      </h3>
                      <p className="text-sm text-[#4A6256] dark:text-[#94ABA0] leading-relaxed">
                        {interest.summary}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#0F2A1D]/9 dark:border-[#D6E8DE]/9 flex items-center justify-between text-xs font-semibold text-[#0F7655] dark:text-[#34D399]">
                    <span>
                      {interest.visualType === 'image' ? 'View' : 'Open Demo'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-1" />
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
                    initial={{ opacity: 0, scale: 1.03, y: 14 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97, y: -8 }}
                    viewport={{ once: true, amount: 0.12 }}
                    transition={{ duration: 0.34, ease: EASE_OUT }}
                    className="rounded-xl border border-[#0F2A1D]/12 dark:border-[#D6E8DE]/12 bg-white dark:bg-[#111E18] p-6 sm:p-8"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                      <div
                        className={`lg:col-span-5 space-y-4 ${
                          isReversed ? 'lg:order-2' : 'lg:order-1'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="opacity-85">{meta.icon}</span>
                          <span className="text-xs font-mono text-[#0F7655] dark:text-[#34D399] tabular-nums">
                            0{indexNum + 1} · {interest.title}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <h3 className="font-display text-2xl font-semibold text-[#11221A] dark:text-[#EDF4F0]">
                            {interest.shortLabel}
                          </h3>
                          <p className="text-sm sm:text-base text-[#4A6256] dark:text-[#94ABA0] leading-relaxed">
                            {interest.summary}
                          </p>
                        </div>

                        <p className="text-xs text-[#647A6F] dark:text-[#748B80]">
                          {meta.hint}
                        </p>

                        <div className="pt-1 flex flex-wrap items-center gap-2.5">
                          <motion.button
                            type="button"
                            whileTap={{ scale: 0.96 }}
                            onClick={() =>
                              setSelectedFilter(isFocused ? 'all' : interest.id)
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#0F2A1D]/12 dark:border-[#D6E8DE]/12 bg-[#F4F7F4] dark:bg-[#172820] hover:border-[#0F7655]/60 dark:hover:border-[#34D399]/60 text-xs font-medium text-[#11221A] dark:text-[#EDF4F0] transition-colors duration-150 whitespace-nowrap shrink-0"
                          >
                            <Maximize2 className="w-3.5 h-3.5 text-[#0F7655] dark:text-[#34D399]" />
                            <span>
                              {isFocused ? 'Show All Interests' : 'Focus Card'}
                            </span>
                          </motion.button>

                          {interest.id === 'creative-writing' && (
                            <motion.button
                              type="button"
                              whileTap={{ scale: 0.96 }}
                              onClick={() => onNavigate('stories')}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F7655] hover:bg-[#0D6448] text-white text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>My Stories</span>
                            </motion.button>
                          )}
                        </div>
                      </div>

                      <div
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
                          <div className="rounded-xl overflow-hidden border border-[#0F2A1D]/12 dark:border-[#D6E8DE]/12 aspect-[16/10] bg-[#11221A] group">
                            <ImageWithFallback
                              src={interest.imageUrl}
                              alt={interest.imageAlt || interest.title}
                              fallbackTitle={interest.title}
                              className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-500 ease-out"
                            />
                          </div>
                        )}
                      </div>
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
