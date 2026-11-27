import React from 'react';
import { DoodleLeafSprig } from './SketchDoodles';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 border-t border-[#BFE2BD] dark:border-[#314735] bg-[#E2F6DF]/88 dark:bg-[#19261C]/88 transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-7 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <DoodleLeafSprig className="w-7 h-7" />
          <span className="font-display text-sm font-medium text-[#223024] dark:text-[#EDF3EA]">
            Ishan Ganti
          </span>
        </div>

        <div className="font-mono text-xs text-[#3F6343] dark:text-[#9FB5A1]">
          ishanganti.in
        </div>
      </div>
    </footer>
  );
};
