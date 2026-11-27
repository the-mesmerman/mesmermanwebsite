import React, { useMemo, useState } from 'react';
import { ArrowDownUp, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import {
  ReactiveSurface,
  RevealBlock,
  SPRING_FLUID,
  SPRING_SNAPPY,
  useIntroReveal,
} from '../components/MotionPrimitives';
import { DoodlePencil } from '../components/SketchDoodles';
import { ARCHIVE_MILESTONES } from '../data/siteData';
import type { PageId } from '../types/site';

interface ArchivePageProps {
  onNavigate: (page: PageId) => void;
}

type EraFilter = 'all' | 'v3' | 'v2' | 'v1';

const ERA_TABS: { id: EraFilter; label: string }[] = [
  { id: 'all', label: `All (${ARCHIVE_MILESTONES.length})` },
  { id: 'v3', label: 'V3.x Custom' },
  { id: 'v2', label: 'V2.x Sites' },
  { id: 'v1', label: 'V1.x Early' },
];

export const ArchivePage: React.FC<ArchivePageProps> = ({ onNavigate }) => {
  const { isIntroBlocking, introRevealDelay } = useIntroReveal();
  const [era, setEra] = useState<EraFilter>('all');
  const [newestFirst, setNewestFirst] = useState(true);

  const visibleMilestones = useMemo(() => {
    const filtered = ARCHIVE_MILESTONES.filter((m) => {
      if (era === 'all') return true;
      if (era === 'v3') return m.version.startsWith('V3');
      if (era === 'v2') return m.version.startsWith('V2');
      return m.version.startsWith('V1');
    });
    return newestFirst ? filtered : [...filtered].reverse();
  }, [era, newestFirst]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-20 overflow-x-clip">
      <Breadcrumbs
        items={[{ label: 'Home', page: 'home' }, { label: 'Archive' }]}
        onNavigate={onNavigate}
      />

      <header className="space-y-4 pb-8 border-b border-[#BFE2BD] dark:border-[#314735]">
        <RevealBlock immediate direction="left" delay={0.02}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <DoodlePencil className="w-6 h-6" />
                <span className="font-mono text-xs text-[#536956] dark:text-[#9FB5A1]">
                  Version Records · May 2023 – Present
                </span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-normal tracking-tight text-[#223024] dark:text-[#EDF3EA]">
                Site{' '}
                <span className="italic text-[#2C913A] dark:text-[#7EE686]">
                  Archive
                </span>
              </h1>
              <p className="text-base text-[#536956] dark:text-[#9FB5A1] max-w-xl leading-[1.7]">
                Every version from the early Google Sites builds in 2023 to the
                current custom site.
              </p>
            </div>

            <div className="font-mono text-xs text-[#2C913A] dark:text-[#7EE686] tabular-nums shrink-0">
              Current: V3.2
            </div>
          </div>
        </RevealBlock>

        {/* Efficient Era Filter & Sort Bar */}
        <RevealBlock immediate direction="right" delay={0.08}>
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <div
              className="inline-flex flex-wrap items-center gap-1 p-1 rounded-none bg-[#FCFDF9] dark:bg-[#1D2A20] border border-[#BFE2BD] dark:border-[#314735]"
              role="tablist"
              aria-label="Filter archive versions by era"
            >
              {ERA_TABS.map((tab) => {
                const active = era === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setEra(tab.id)}
                    className={`relative px-3 py-1.5 rounded-none text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 ${
                      active
                        ? 'text-[#132B16]'
                        : 'text-[#536956] dark:text-[#9FB5A1] hover:text-[#223024] dark:hover:text-[#EDF3EA]'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="archive-era-highlight"
                        transition={SPRING_SNAPPY}
                        className="absolute inset-0 bg-[#7DE386] rounded-none"
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setNewestFirst((prev) => !prev)}
              className="square-stamp-mint inline-flex items-center gap-1.5 px-3 py-2 rounded-none border border-[#BFE2BD] dark:border-[#314735] bg-[#FCFDF9] dark:bg-[#1D2A20] hover:border-[#389442] dark:hover:border-[#7DE386] text-xs font-medium text-[#223024] dark:text-[#EDF3EA] whitespace-nowrap shrink-0"
            >
              <ArrowDownUp className="w-3.5 h-3.5 text-[#2C913A] dark:text-[#7EE686]" />
              <span>{newestFirst ? 'Newest First' : 'Oldest First'}</span>
            </button>
          </div>
        </RevealBlock>
      </header>

      {/* Compact Square Editorial Changelog Ledger */}
      <section className="pt-8">
        <div className="border border-[#BFE2BD] dark:border-[#314735] bg-[#FCFDF9]/95 dark:bg-[#1D2A20]/95 divide-y divide-[#BFE2BD] dark:divide-[#314735] rounded-none">
          {visibleMilestones.map((milestone, idx) => {
            const isCurrent = milestone.version === 'V3.2';
            const isV3 = milestone.version.startsWith('V3');
            return (
              <ReactiveSurface
                as="article"
                key={milestone.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={isIntroBlocking ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.08 }}
                transition={{
                  ...SPRING_FLUID,
                  delay: (idx < 4 ? introRevealDelay : 0) + Math.min(idx * 0.025, 0.16),
                }}
                className={`p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 items-start transition-colors duration-150 ${
                  isCurrent
                    ? 'bg-[#E2F6DF]/55 dark:bg-[#253D29]/55 hover:bg-[#DAF4D7]/80 dark:hover:bg-[#2A472F]/75'
                    : 'hover:bg-[#EFF8EE]/75 dark:hover:bg-[#223426]/70'
                }`}
              >
                {/* Left Column: Version Stamp + Date */}
                <div className="md:col-span-3 flex md:flex-col items-center md:items-start justify-between md:justify-start gap-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`inline-flex items-center justify-center min-w-[3.25rem] h-7 px-2 rounded-none border font-mono text-xs font-medium tabular-nums ${
                        isCurrent
                          ? 'border-[#389442] bg-[#7DE386] text-[#132B16]'
                          : isV3
                            ? 'border-[#A6E8AA] dark:border-[#3A6340] bg-[#DAF4D7] dark:bg-[#253D29] text-[#21632A] dark:text-[#9AF0A2]'
                            : 'border-[#BFE2BD] dark:border-[#314735] bg-[#F7F9F3] dark:bg-[#162018] text-[#223024] dark:text-[#EDF3EA]'
                      }`}
                    >
                      {milestone.version}
                    </span>
                    {isCurrent && (
                      <span className="font-mono text-[11px] text-[#2C913A] dark:text-[#7EE686]">
                        Current
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-[#536956] dark:text-[#9FB5A1] flex items-center gap-1.5 tabular-nums">
                    <Clock className="w-3 h-3 shrink-0 opacity-75" />
                    <span>{milestone.date}</span>
                  </div>
                </div>

                {/* Right Column: Verbatim Notes & Highlights */}
                <div className="md:col-span-9 space-y-2">
                  {milestone.title && (
                    <h2 className="font-display text-lg font-medium text-[#223024] dark:text-[#EDF3EA] leading-snug">
                      {milestone.title}
                    </h2>
                  )}

                  <p className="text-sm text-[#223024]/90 dark:text-[#EDF3EA]/90 leading-[1.68] max-w-[70ch]">
                    {milestone.summary}
                  </p>

                  {milestone.highlights.length > 0 && (
                    <ul className="space-y-1.5 pt-1">
                      {milestone.highlights.map((item, hIdx) => (
                        <li
                          key={hIdx}
                          className="flex items-start gap-2 text-xs sm:text-sm text-[#536956] dark:text-[#9FB5A1] leading-[1.6]"
                        >
                          <span
                            aria-hidden="true"
                            className="text-[#2C913A] dark:text-[#7EE686] font-mono shrink-0"
                          >
                            —
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </ReactiveSurface>
            );
          })}
        </div>
      </section>
    </div>
  );
};
