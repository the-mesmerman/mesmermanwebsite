import React from 'react';
import { ChevronRight } from 'lucide-react';
import type { PageId } from '../types/site';

interface BreadcrumbsProps {
  items: { label: string; page?: PageId }[];
  onNavigate: (page: PageId) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  onNavigate,
}) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.label}-${idx}`} className="flex items-center gap-1.5">
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
              {item.page && !isLast ? (
                <button
                  type="button"
                  onClick={() => onNavigate(item.page!)}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors rounded px-1 py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  {item.label}
                </button>
              ) : (
                <span className="text-slate-800 dark:text-slate-200 font-medium">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
