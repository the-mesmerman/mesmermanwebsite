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

      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.36, ease: EASE_OUT }}
        className="space-y-2 pb-10 border-b border-emerald-950/10 dark:border-emerald-500/15"
      >
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-emerald-50">
          Site Archive
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 max-w-xl">
          Past versions since May 2023.
        </p>
      </motion.header>

      <section className="pt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div
          className="lg:col-span-5 space-y-3"
          role="listbox"
          aria-label="Website versions"
        >
          {ARCHIVE_MILESTONES.map((milestone) => {
            const active = milestone.id === selectedMilestone.id;
            return (
              <motion.button
                key={milestone.id}
                type="button"
                role="option"
                aria-selected={active}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.985 }}
                transition={{ duration: 0.14 }}
                onClick={() => setSelectedId(milestone.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-colors duration-150 flex items-center gap-4 ${
                  active
                    ? 'border-emerald-600 dark:border-emerald-500 bg-white dark:bg-[#0B1B15] shadow-sm'
                    : 'border-emerald-950/10 dark:border-emerald-500/15 bg-white/70 dark:bg-[#0B1B15]/60 hover:border-emerald-500/40'
                }`}
              >
                <div
                  className={`w-12 h-9 rounded-lg flex items-center justify-center font-mono text-xs font-semibold shrink-0 tabular-nums transition-colors ${
                    active
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-50 dark:bg-[#112820] text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {milestone.version}
                </div>

                <div className="space-y-0.5 min-w-0">
                  <div className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                    {milestone.date}
                  </div>
                  <h2 className="font-display text-sm sm:text-base font-bold text-slate-900 dark:text-emerald-50 truncate">
                    {milestone.title}
                  </h2>
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedMilestone.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: EASE_OUT }}
              className="rounded-2xl border border-emerald-950/10 dark:border-emerald-500/15 bg-white dark:bg-[#0B1B15] p-6 sm:p-8 space-y-5"
            >
              <div className="flex items-center justify-between gap-3 pb-4 border-b border-emerald-950/10 dark:border-emerald-500/15">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center">
                    <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <div className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums">
                      {selectedMilestone.version}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 tabular-nums">
                      <Clock className="w-3 h-3" />
                      <span>{selectedMilestone.date}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-emerald-50">
                  {selectedMilestone.title}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedMilestone.summary}
                </p>
              </div>

              <ul className="space-y-2 pt-1">
                {selectedMilestone.highlights.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300"
                  >
                    <span
                      aria-hidden="true"
                      className="text-emerald-600 dark:text-emerald-400 font-mono shrink-0"
                    >
                      —
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};
