import React, { useState } from 'react';
import { Clock, Layers } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ARCHIVE_MILESTONES } from '../data/siteData';
import type { PageId } from '../types/site';

interface ArchivePageProps {
  onNavigate: (page: PageId) => void;
}

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export const ArchivePage: React.FC<ArchivePageProps> = ({ onNavigate }) => {
  const [selectedId, setSelectedId] = useState<string>(
    ARCHIVE_MILESTONES[0].id,
  );

  const selectedMilestone =
    ARCHIVE_MILESTONES.find((m) => m.id === selectedId) ||
    ARCHIVE_MILESTONES[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-24">
      <Breadcrumbs
        items={[{ label: 'Home', page: 'home' }, { label: 'Archive' }]}
        onNavigate={onNavigate}
      />

      <header className="space-y-2 pb-10 border-b border-[#0F2A1D]/11 dark:border-[#D6E8DE]/11">
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{ duration: 0.38, ease: EASE_OUT }}
            className="font-display text-4xl sm:text-5xl font-semibold tracking-tight text-[#11221A] dark:text-[#EDF4F0]"
          >
            Site{' '}
            <span className="font-serif-editorial italic font-medium text-[#0F7655] dark:text-[#34D399]">
              Archive
            </span>
          </motion.h1>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, delay: 0.08, ease: EASE_OUT }}
          className="text-base text-[#4A6256] dark:text-[#94ABA0] max-w-xl"
        >
          Past versions since May 2023.
        </motion.p>
      </header>

      <section className="pt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div
          className="lg:col-span-5 rounded-xl border border-[#0F2A1D]/12 dark:border-[#D6E8DE]/12 bg-white dark:bg-[#111E18] divide-y divide-[#0F2A1D]/10 dark:divide-[#D6E8DE]/10 overflow-hidden"
          role="listbox"
          aria-label="Website versions"
        >
          {ARCHIVE_MILESTONES.map((milestone) => {
            const active = milestone.id === selectedMilestone.id;
            return (
              <button
                key={milestone.id}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => setSelectedId(milestone.id)}
                className="relative w-full text-left p-4 transition-colors duration-150 flex items-center gap-4 bg-white dark:bg-[#111E18] hover:bg-[#F7FAF7] dark:hover:bg-[#15241D]"
              >
                {active && (
                  <motion.span
                    layoutId="archive-active-row"
                    transition={{ type: 'spring', stiffness: 360, damping: 32 }}
                    aria-hidden="true"
                    className="absolute inset-0 bg-[#EFF4F0] dark:bg-[#172820]"
                  />
                )}

                <div
                  className={`relative z-10 w-12 h-8 rounded-md flex items-center justify-center font-mono text-xs font-semibold shrink-0 tabular-nums transition-colors duration-150 ${
                    active
                      ? 'bg-[#0F7655] text-white'
                      : 'bg-[#EFF4F0] dark:bg-[#172820] text-[#4A6256] dark:text-[#94ABA0]'
                  }`}
                >
                  {milestone.version}
                </div>

                <div className="relative z-10 space-y-0.5 min-w-0">
                  <div className="text-xs text-[#647A6F] dark:text-[#748B80] tabular-nums">
                    {milestone.date}
                  </div>
                  <h2 className="font-display text-sm sm:text-base font-semibold text-[#11221A] dark:text-[#EDF4F0] truncate">
                    {milestone.title}
                  </h2>
                </div>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedMilestone.id}
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.985, y: -6 }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
              className="rounded-xl border border-[#0F2A1D]/12 dark:border-[#D6E8DE]/12 bg-white dark:bg-[#111E18] p-6 sm:p-8 space-y-5"
            >
              <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#0F2A1D]/11 dark:border-[#D6E8DE]/11">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#EFF4F0] dark:bg-[#172820] border border-[#0F2A1D]/12 dark:border-[#D6E8DE]/12 flex items-center justify-center">
                    <Layers className="w-4 h-4 text-[#0F7655] dark:text-[#34D399]" />
                  </div>
                  <div>
                    <div className="font-mono text-xs text-[#0F7655] dark:text-[#34D399] font-semibold tabular-nums">
                      {selectedMilestone.version}
                    </div>
                    <div className="text-xs text-[#647A6F] dark:text-[#748B80] flex items-center gap-1.5 tabular-nums">
                      <Clock className="w-3 h-3" />
                      <span>{selectedMilestone.date}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <h2 className="font-display text-2xl font-semibold text-[#11221A] dark:text-[#EDF4F0]">
                  {selectedMilestone.title}
                </h2>
                <p className="text-sm sm:text-base text-[#4A6256] dark:text-[#94ABA0] leading-relaxed">
                  {selectedMilestone.summary}
                </p>
              </div>

              <ul className="space-y-2 pt-1">
                {selectedMilestone.highlights.map((item, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.2,
                      delay: 0.04 + idx * 0.045,
                      ease: EASE_OUT,
                    }}
                    className="flex items-start gap-2.5 text-sm text-[#4A6256] dark:text-[#94ABA0]"
                  >
                    <span
                      aria-hidden="true"
                      className="text-[#0F7655] dark:text-[#34D399] font-mono shrink-0"
                    >
                      —
                    </span>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};
