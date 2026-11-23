import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sun, Sunset, Moon } from 'lucide-react';

type SkyTime = 'morning' | 'golden' | 'twilight';

interface PolyFacet {
  id: string;
  points: string;
  colors: Record<SkyTime, string>;
}

const SKY_GRADIENTS: Record<SkyTime, { top: string; mid: string; horizon: string; sun: string }> = {
  morning: {
    top: '#D1FAE5',
    mid: '#A7F3D0',
    horizon: '#FEF3C7',
    sun: '#FBBF24',
  },
  golden: {
    top: '#FDE68A',
    mid: '#FDBA74',
    horizon: '#FCA5A5',
    sun: '#F97316',
  },
  twilight: {
    top: '#062019',
    mid: '#0B3B2E',
    horizon: '#115E59',
    sun: '#FDE047',
  },
};

const MOUNTAIN_FACETS: PolyFacet[] = [
  // Distant range
  {
    id: 'm1',
    points: '0,210 95,115 190,195',
    colors: { morning: '#34D399', golden: '#10B981', twilight: '#0F766E' },
  },
  {
    id: 'm2',
    points: '95,115 190,195 250,155',
    colors: { morning: '#6EE7B7', golden: '#34D399', twilight: '#14B8A6' },
  },
  {
    id: 'm3',
    points: '190,195 315,92 415,195',
    colors: { morning: '#10B981', golden: '#059669', twilight: '#065F46' },
  },
  {
    id: 'm4',
    points: '315,92 415,195 495,140',
    colors: { morning: '#6EE7B7', golden: '#FBBF24', twilight: '#0D9488' },
  },
  {
    id: 'm5',
    points: '415,195 545,105 640,210',
    colors: { morning: '#059669', golden: '#047857', twilight: '#064E3B' },
  },
  // Sunlit foreground ridges & emerald meadow
  {
    id: 'v1',
    points: '0,210 130,170 220,260 0,260',
    colors: { morning: '#059669', golden: '#047857', twilight: '#064E3B' },
  },
  {
    id: 'v2',
    points: '130,170 280,205 220,260',
    colors: { morning: '#10B981', golden: '#65A30D', twilight: '#047857' },
  },
  {
    id: 'v3',
    points: '280,205 425,180 390,260 220,260',
    colors: { morning: '#14B8A6', golden: '#0D9488', twilight: '#0F766E' },
  },
  {
    id: 'v4',
    points: '425,180 640,210 640,260 390,260',
    colors: { morning: '#047857', golden: '#065F46', twilight: '#022C22' },
  },
];

const POLY_TREES = [
  { x: 74, y: 205, scale: 1.05, c1: '#10B981', c2: '#047857' },
  { x: 112, y: 215, scale: 0.85, c1: '#84CC16', c2: '#4D7C0F' },
  { x: 158, y: 210, scale: 1.15, c1: '#34D399', c2: '#059669' },
  { x: 472, y: 205, scale: 1.1, c1: '#84CC16', c2: '#3F6212' },
  { x: 518, y: 218, scale: 0.9, c1: '#10B981', c2: '#065F46' },
  { x: 565, y: 200, scale: 1.2, c1: '#2DD4BF', c2: '#0F766E' },
];

export const LowPolyNatureCanvas: React.FC = () => {
  const [skyTime, setSkyTime] = useState<SkyTime>('morning');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [rippledIds, setRippledIds] = useState<string[]>([]);
  const [hoveredTree, setHoveredTree] = useState<number | null>(null);

  const sky = SKY_GRADIENTS[skyTime];

  const triggerFacetWave = (facetId: string) => {
    const idx = MOUNTAIN_FACETS.findIndex((f) => f.id === facetId);
    const neighborIds = [
      MOUNTAIN_FACETS[idx - 1]?.id,
      MOUNTAIN_FACETS[idx + 1]?.id,
    ].filter(Boolean) as string[];

    setRippledIds([facetId]);
    window.setTimeout(() => {
      setRippledIds(neighborIds);
    }, 95);
    window.setTimeout(() => {
      setRippledIds([]);
    }, 380);
  };

  return (
    <div className="rounded-none border border-[#C9E1C7] dark:border-[#314735] bg-[#FCFDF9] dark:bg-[#1D2A20] overflow-hidden">
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <svg
          viewBox="0 0 640 260"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full block select-none"
          role="img"
          aria-label="Interactive low-poly nature mountain and forest landscape"
        >
          <defs>
            <linearGradient id="polySkyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={sky.top} />
              <stop offset="60%" stopColor={sky.mid} />
              <stop offset="100%" stopColor={sky.horizon} />
            </linearGradient>
          </defs>

          {/* Sky Facet Backdrop */}
          <rect width="640" height="260" fill="url(#polySkyGrad)" />

          {/* Subtle Sky Geometric Facets */}
          <polygon points="0,0 240,0 140,105 0,90" fill="#FFFFFF" opacity={skyTime === 'twilight' ? 0.04 : 0.14} />
          <polygon points="240,0 480,0 370,95 140,105" fill="#FFFFFF" opacity={skyTime === 'twilight' ? 0.02 : 0.08} />
          <polygon points="480,0 640,0 640,115 370,95" fill="#FDE68A" opacity={skyTime === 'twilight' ? 0.05 : 0.18} />

          {/* Low-Poly Sun / Moon */}
          <motion.g
            animate={{
              y: skyTime === 'golden' ? 22 : skyTime === 'twilight' ? -8 : 0,
              rotate: skyTime === 'golden' ? 30 : skyTime === 'twilight' ? 60 : 0,
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: '515px 72px' }}
          >
            <polygon
              points="515,44 539,58 539,86 515,100 491,86 491,58"
              fill={sky.sun}
              opacity="0.95"
            />
            <polygon
              points="515,34 547,53 547,91 515,110 483,91 483,53"
              fill={sky.sun}
              opacity="0.22"
            />
          </motion.g>

          {/* Low-Poly Floating Clouds / Mist Shards */}
          <motion.g
            animate={{ x: [0, 14, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            opacity={skyTime === 'twilight' ? 0.18 : 0.55}
          >
            <polygon points="90,52 145,42 185,58 115,64" fill="#FFFFFF" />
            <polygon points="285,36 335,28 368,42 305,46" fill="#FFFFFF" />
          </motion.g>

          {/* Interactive Mountain & Valley Low-Poly Facets */}
          {MOUNTAIN_FACETS.map((facet) => {
            const isHovered = hoveredId === facet.id;
            const isRippled = rippledIds.includes(facet.id);
            return (
              <polygon
                key={facet.id}
                points={facet.points}
                fill={facet.colors[skyTime]}
                stroke={skyTime === 'twilight' ? '#8CD892' : '#FFFFFF'}
                strokeOpacity={isHovered || isRippled ? 0.72 : 0.18}
                strokeWidth={isHovered || isRippled ? 1.5 : 0.75}
                style={{
                  filter: isHovered || isRippled ? 'brightness(1.2)' : 'brightness(1)',
                  transition: 'fill 0.45s ease, filter 0.18s ease, stroke-opacity 0.18s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={() => setHoveredId(facet.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => triggerFacetWave(facet.id)}
              />
            );
          })}

          {/* Low-Poly Pine Canopy Trees */}
          {POLY_TREES.map((t, i) => {
            const isTreeHovered = hoveredTree === i;
            return (
              <g
                key={i}
                transform={`translate(${t.x}, ${t.y}) scale(${t.scale})`}
                onMouseEnter={() => setHoveredTree(i)}
                onMouseLeave={() => setHoveredTree(null)}
                style={{ cursor: 'pointer' }}
              >
                <rect x="-18" y="-26" width="36" height="50" fill="transparent" />
                <motion.g
                  initial={false}
                  animate={{
                    scale: isTreeHovered ? 1.14 : 1,
                    y: isTreeHovered ? -4 : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 340, damping: 18 }}
                  style={{ transformOrigin: '0px 12px' }}
                >
                  <rect x="-2" y="10" width="4" height="12" fill="#78350F" />
                  <polygon points="0,-24 -13,2 0,2" fill={t.c1} />
                  <polygon points="0,-24 13,2 0,2" fill={t.c2} />
                  <polygon points="0,-10 -16,13 0,13" fill={t.c1} />
                  <polygon points="0,-10 16,13 0,13" fill={t.c2} />
                </motion.g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Square Controls Strip */}
      <div className="px-4 py-2.5 border-t border-[#C9E1C7] dark:border-[#314735] bg-[#FCFDF9] dark:bg-[#1D2A20] flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-mono text-[11px] text-[#5B6E5D] dark:text-[#9FB5A1]">
          Interactive Nature · Hover facets
        </span>

        <div className="inline-flex items-center gap-1 p-0.5 rounded-none border border-[#C9E1C7] dark:border-[#314735] bg-[#F7F9F3] dark:bg-[#162018]">
          {(
            [
              { id: 'morning', label: 'Morning', icon: <Sun className="w-3 h-3" /> },
              { id: 'golden', label: 'Golden', icon: <Sunset className="w-3 h-3" /> },
              { id: 'twilight', label: 'Night', icon: <Moon className="w-3 h-3" /> },
            ] as { id: SkyTime; label: string; icon: React.ReactNode }[]
          ).map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setSkyTime(mode.id)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-none text-[11px] font-medium transition-colors duration-150 whitespace-nowrap shrink-0 ${
                skyTime === mode.id
                  ? 'bg-[#8CD892] text-[#172B1A]'
                  : 'text-[#5B6E5D] dark:text-[#9FB5A1] hover:text-[#223024] dark:hover:text-[#EDF3EA]'
              }`}
            >
              {mode.icon}
              <span>{mode.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
