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
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-[#5B6E5D] dark:text-[#9FB5A1]">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.label}-${idx}`} className="flex items-center gap-1.5">
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
              {item.page && !isLast ? (
                <button
                  type="button"
                  onClick={() => onNavigate(item.page!)}
                  className="hover:text-[#2E6B37] dark:hover:text-[#8CD892] transition-colors duration-150 px-1 py-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4F9D58]"
                >
                  {item.label}
                </button>
              ) : (
                <span className="text-[#223024] dark:text-[#EDF3EA] font-medium">
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
