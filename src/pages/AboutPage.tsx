import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  LayoutGrid,
  Maximize2,
  Rows3,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { MonogramLogo } from '../components/MonogramLogo';
import {
  DoodleIsoCube,
  DoodleLeafSprig,
  DoodleOpenBook,
  DoodlePaperPlane,
  DoodlePencil,
  DoodleTinyFlower,
} from '../components/SketchDoodles';
import { RubiksCube3D } from '../components/three/RubiksCube3D';
import { LowPolyNatureCanvas } from '../components/visuals/LowPolyNatureCanvas';
import { MathInteractiveVisual } from '../components/visuals/MathInteractiveVisual';
import { TechMatrixVisual } from '../components/visuals/TechMatrixVisual';
import { INTERESTS } from '../data/siteData';
import type { PageId } from '../types/site';

interface AboutPageProps {
  onNavigate: (page: PageId) => void;
  initialInterestId?: string;
}

const CALM_EASE = [0.22, 1, 0.36, 1] as const;

const FACETS = [
  {
    id: 'learning',
    title: 'Math',
    targetInterest: 'mathematics',
    doodle: <DoodleIsoCube className="w-6 h-6" />,
    text: 'Solving math problems and spotting patterns.',
  },
  {
    id: 'technology',
    title: 'Tech',
    targetInterest: 'technology',
    doodle: <DoodlePaperPlane className="w-6 h-6" />,
    text: 'Messing with code and building web projects.',
  },
  {
    id: 'reading',
    title: 'Books',
    targetInterest: 'books',
    doodle: <DoodleOpenBook className="w-6 h-6" />,
    text: 'Reading fiction and good novels.',
  },
  {
    id: 'creativity',
    title: 'Writing',
    targetInterest: 'creative-writing',
    doodle: <DoodlePencil className="w-6 h-6" />,
    text: 'Two older stories I wrote (Bunzo & Ekavir).',
  },
  {
    id: 'beyond',
    title: 'Outside',
    targetInterest: 'cubing',
    doodle: <DoodleLeafSprig className="w-6 h-6" />,
    text: 'Speedcubing, nature, and Indian food.',
  },
  {
    id: 'mun',
    title: 'Model UN',
    targetInterest: undefined,
    doodle: <DoodleTinyFlower className="w-6 h-6" />,
    text: 'Debating and learning about global issues.',
  },
];

const INTEREST_META: Record<
  string,
  { doodle: React.ReactNode; hint: string }
> = {
  technology: {
    doodle: <DoodlePaperPlane className="w-6 h-6" />,
    hint: 'Click any node to send pulses.',
  },
  mathematics: {
    doodle: <DoodleIsoCube className="w-6 h-6" />,
    hint: 'Move the slider or hover over the spiral.',
  },
  cubing: {
    doodle: <DoodleIsoCube className="w-6 h-6" />,
    hint: 'Turn faces, scramble, or drag to rotate.',
  },
  books: {
    doodle: <DoodleOpenBook className="w-6 h-6" />,
    hint: 'Novels I like reading.',
  },
  'creative-writing': {
    doodle: <DoodlePencil className="w-6 h-6" />,
    hint: 'Both stories are on the Stories page.',
  },
  nature: {
    doodle: <DoodleLeafSprig className="w-6 h-6" />,
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
      }, 240);
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-20">
      <Breadcrumbs
        items={[{ label: 'Home', page: 'home' }, { label: 'About' }]}
        onNavigate={onNavigate}
      />

      {/* Minimalist Two-Column Opening with Preserved Portrait */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pb-14 border-b border-[#C9E1C7] dark:border-[#314735]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.34, ease: CALM_EASE }}
          className="lg:col-span-7 space-y-5"
        >
          <div className="flex items-center gap-2">
            <DoodlePencil className="w-6 h-6" />
            <span className="font-mono text-xs text-[#5B6E5D] dark:text-[#9FB5A1]">
              About Me
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-normal tracking-tight text-[#223024] dark:text-[#EDF3EA]">
            A bit more{' '}
            <span className="italic text-[#2C913A] dark:text-[#7EE686]">
              about me.
            </span>
          </h1>

          <p className="text-base text-[#536956] dark:text-[#9FB5A1] leading-[1.7] max-w-[54ch]">
            I’m a student who likes math, coding, cubing, reading, and spending
            time outside. Below is a closer look at my interests along with a few
            interactive demos I keep here.
          </p>

          <div className="pt-1 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={scrollToInterests}
              className="square-stamp-btn group inline-flex items-center gap-2 px-4 py-2.5 rounded-none border border-[#389442] bg-[#7DE386] hover:bg-[#64D66E] text-[#132B16] text-sm font-medium min-h-[42px] whitespace-nowrap shrink-0"
            >
              <span>Interests &amp; Demos</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('stories')}
              className="square-stamp-mint inline-flex items-center gap-2 px-4 py-2.5 rounded-none border border-[#BFE2BD] dark:border-[#314735] bg-[#FCFDF9] dark:bg-[#1D2A20] hover:border-[#389442] dark:hover:border-[#7DE386] text-[#223024] dark:text-[#EDF3EA] text-sm font-medium min-h-[42px] whitespace-nowrap shrink-0"
            >
              <span>My Stories</span>
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.36, delay: 0.08, ease: CALM_EASE }}
          className="lg:col-span-5"
        >
          <div className="border border-[#C9E1C7] dark:border-[#314735] bg-[#FCFDF9] dark:bg-[#1D2A20] p-3 max-w-[290px] w-full mx-auto rounded-none">
            <div className="relative aspect-square w-full overflow-hidden bg-[#F7F9F3] dark:bg-[#162018] border border-[#C9E1C7] dark:border-[#314735] rounded-none">
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
            <div className="pt-3 pb-0.5 px-1 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <MonogramLogo size={20} />
                <span className="font-display text-xs font-medium tracking-tight text-[#223024] dark:text-[#EDF3EA]">
                  Ishan Ganti
                </span>
              </div>
              <DoodleTinyFlower className="w-5 h-5" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Square Hairline Overview Grid */}
      <section className="py-12 border-b border-[#C9E1C7] dark:border-[#314735]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#C9E1C7] dark:bg-[#314735] border border-[#C9E1C7] dark:border-[#314735]">
          {FACETS.map((facet, idx) => {
            const isClickable = Boolean(facet.targetInterest);
            const num = `0${idx + 1}`;
            const inner = (
              <>
                <div className="flex items-center justify-between gap-3 w-full">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs text-[#5B6E5D] dark:text-[#9FB5A1] tabular-nums">
                      {num}
                    </span>
                    <span className="transition-transform duration-150 group-hover:-translate-y-0.5">
                      {facet.doodle}
                    </span>
                  </div>
                  {isClickable && (
                    <ArrowUpRight className="w-4 h-4 text-[#5B6E5D] dark:text-[#9FB5A1] group-hover:text-[#3D8B47] dark:group-hover:text-[#8CD892] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
                  )}
                </div>
                <div className="space-y-1.5">
                  <h2 className="font-display text-base font-medium text-[#223024] dark:text-[#EDF3EA]">
                    {facet.title}
                  </h2>
                  <p className="text-sm text-[#5B6E5D] dark:text-[#9FB5A1] leading-[1.65]">
                    {facet.text}
                  </p>
                </div>
              </>
            );

            if (isClickable && facet.targetInterest) {
              return (
                <button
                  key={facet.id}
                  type="button"
                  onClick={() => jumpToInterest(facet.targetInterest!)}
                  className="group text-left bg-[#FCFDF9] dark:bg-[#1D2A20] hover:bg-[#DAF4D7] dark:hover:bg-[#253D29] p-5 sm:p-6 flex flex-col justify-between gap-4 transition-colors duration-150 rounded-none"
                >
                  {inner}
                </button>
              );
            }

            return (
              <div
                key={facet.id}
                className="bg-[#FCFDF9] dark:bg-[#1D2A20] p-5 sm:p-6 flex flex-col justify-between gap-4 rounded-none"
              >
                {inner}
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Interests & Preserved Photography */}
      <section id="interests-explorer" className="pt-14 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-1.5">
            <h2 className="font-display text-2xl sm:text-3xl font-normal tracking-tight text-[#223024] dark:text-[#EDF3EA]">
              Interests &amp; Demos
            </h2>
            <p className="text-sm text-[#5B6E5D] dark:text-[#9FB5A1]">
              Explore the interactive Cube, Math, and Code visuals or switch to
              Overview.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Square View Mode Switcher */}
            <div
              className="inline-flex items-center gap-1 p-1 rounded-none bg-[#FCFDF9] dark:bg-[#1D2A20] border border-[#C9E1C7] dark:border-[#314735]"
              role="group"
              aria-label="Layout view"
            >
              <button
                type="button"
                onClick={() => setViewMode('showcase')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-none text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 ${
                  viewMode === 'showcase'
                    ? 'bg-[#7DE386] text-[#132B16]'
                    : 'text-[#536956] dark:text-[#9FB5A1] hover:text-[#223024] dark:hover:text-[#EDF3EA]'
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
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-none text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 ${
                  viewMode === 'grid'
                    ? 'bg-[#7DE386] text-[#132B16]'
                    : 'text-[#536956] dark:text-[#9FB5A1] hover:text-[#223024] dark:hover:text-[#EDF3EA]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Overview</span>
              </button>
            </div>

            {/* Rectangular Category Filter Tabs */}
            {viewMode === 'showcase' && (
              <div
                className="inline-flex flex-wrap items-center gap-1 p-1 rounded-none bg-[#FCFDF9] dark:bg-[#1D2A20] border border-[#BFE2BD] dark:border-[#314735]"
                role="tablist"
                aria-label="Filter interests"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={selectedFilter === 'all'}
                  onClick={() => setSelectedFilter('all')}
                  className={`px-3 py-1.5 rounded-none text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 ${
                    selectedFilter === 'all'
                      ? 'bg-[#7DE386] text-[#132B16]'
                      : 'text-[#536956] dark:text-[#9FB5A1] hover:text-[#223024] dark:hover:text-[#EDF3EA]'
                  }`}
                >
                  All
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
                      className={`px-3 py-1.5 rounded-none text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 ${
                        active
                          ? 'bg-[#7DE386] text-[#132B16]'
                          : 'text-[#536956] dark:text-[#9FB5A1] hover:text-[#223024] dark:hover:text-[#EDF3EA]'
                      }`}
                    >
                      {interest.title}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#BFE2BD] dark:bg-[#314735] border border-[#BFE2BD] dark:border-[#314735]">
            {INTERESTS.map((interest, idx) => {
              const meta = INTEREST_META[interest.id] ?? INTEREST_META.technology;
              const num = `0${idx + 1}`;
              return (
                <button
                  key={interest.id}
                  type="button"
                  onClick={() => {
                    setSelectedFilter(interest.id);
                    setViewMode('showcase');
                  }}
                  className="group text-left bg-[#FCFDF9] dark:bg-[#1D2A20] hover:bg-[#DAF4D7] dark:hover:bg-[#253D29] p-6 flex flex-col justify-between gap-6 transition-colors duration-150 rounded-none"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs text-[#536956] dark:text-[#9FB5A1] tabular-nums">
                        {num}
                      </span>
                      <span className="transition-transform duration-150 group-hover:-translate-y-0.5">
                        {meta.doodle}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="font-display text-lg font-medium text-[#223024] dark:text-[#EDF3EA]">
                        {interest.shortLabel}
                      </h3>
                      <p className="text-sm text-[#536956] dark:text-[#9FB5A1] leading-[1.65]">
                        {interest.summary}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#BFE2BD] dark:border-[#314735] flex items-center justify-between text-xs font-medium text-[#2C913A] dark:text-[#7EE686]">
                    <span>
                      {interest.visualType === 'image' ? 'View' : 'Open Demo'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-1" />
                  </div>
                </button>
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
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.28, ease: CALM_EASE }}
                    className="rounded-none border border-[#C9E1C7] dark:border-[#314735] bg-[#FCFDF9] dark:bg-[#1D2A20] p-6 sm:p-8"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                      <div
                        className={`lg:col-span-5 space-y-4 ${
                          isReversed ? 'lg:order-2' : 'lg:order-1'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span>{meta.doodle}</span>
                          <span className="text-xs font-mono text-[#3D8B47] dark:text-[#8CD892] tabular-nums">
                            0{indexNum + 1} · {interest.title}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <h3 className="font-display text-2xl font-medium text-[#223024] dark:text-[#EDF3EA]">
                            {interest.shortLabel}
                          </h3>
                          <p className="text-sm text-[#5B6E5D] dark:text-[#9FB5A1] leading-[1.7] max-w-[46ch]">
                            {interest.summary}
                          </p>
                        </div>

                        <p className="text-xs font-mono text-[#5B6E5D] dark:text-[#9FB5A1]">
                          {meta.hint}
                        </p>

                        <div className="pt-1 flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedFilter(isFocused ? 'all' : interest.id)
                            }
                            className="square-stamp-mint inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none border border-[#C9E1C7] dark:border-[#314735] bg-[#F7F9F3] dark:bg-[#162018] hover:border-[#4F9D58] dark:hover:border-[#8CD892] text-xs font-medium text-[#223024] dark:text-[#EDF3EA] whitespace-nowrap shrink-0"
                          >
                            <Maximize2 className="w-3.5 h-3.5 text-[#3D8B47] dark:text-[#8CD892]" />
                            <span>
                              {isFocused ? 'Show All Interests' : 'Focus Card'}
                            </span>
                          </button>

                          {interest.id === 'creative-writing' && (
                            <button
                              type="button"
                              onClick={() => onNavigate('stories')}
                              className="square-stamp-btn inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-none border border-[#389442] bg-[#7DE386] hover:bg-[#64D66E] text-[#132B16] text-xs font-medium whitespace-nowrap shrink-0"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>My Stories</span>
                            </button>
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
                          <div className="rounded-none overflow-hidden border border-[#C9E1C7] dark:border-[#314735] aspect-[16/10] bg-[#F7F9F3] dark:bg-[#162018]">
                            <ImageWithFallback
                              src={interest.imageUrl}
                              alt={interest.imageAlt || interest.title}
                              fallbackTitle={interest.title}
                              className="w-full h-full object-cover"
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

        {/* Interactive Low-Poly Nature Scene */}
        <div className="pt-6 space-y-4">
          <div className="flex items-center gap-2">
            <DoodleLeafSprig className="w-6 h-6" />
            <span className="font-mono text-xs text-[#5B6E5D] dark:text-[#9FB5A1]">
              Nature Sketch · Interactive Canvas
            </span>
          </div>
          <LowPolyNatureCanvas />
        </div>
      </section>
    </div>
  );
};
