import React from 'react';
import { NAV_ITEMS } from '../data/siteData';
import type { PageId } from '../types/site';
import { DoodleLeafSprig } from './SketchDoodles';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="relative z-10 border-t border-[#BFE2BD] dark:border-[#314735] bg-[#E2F6DF]/88 dark:bg-[#19261C]/88 transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <DoodleLeafSprig className="w-8 h-8" />
          <div className="space-y-0.5">
            <div className="font-display text-sm font-medium text-[#223024] dark:text-[#EDF3EA]">
              Ishan Ganti
            </div>
            <div className="font-mono text-xs text-[#3F6343] dark:text-[#9FB5A1]">
              ishanganti.in
            </div>
          </div>
        </div>

        <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className="px-3 py-1.5 rounded-none border border-transparent hover:border-[#7DE386] dark:hover:border-[#497A50] hover:bg-[#FCFDF9] dark:hover:bg-[#1D2A20] text-xs font-medium text-[#3F6343] dark:text-[#9FB5A1] hover:text-[#223024] dark:hover:text-[#EDF3EA] transition-colors duration-150 whitespace-nowrap"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </footer>
  );
};
