import React, { useMemo, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  LOADING_DOODLES,
  type DoodleDefinition,
  type DoodlePalette,
} from './LoadingDoodles';
import { MonogramLogo } from './MonogramLogo';

interface LoadingScreenProps {
  isDark: boolean;
  onComplete: () => void;
}

const INK_EASE = [0.22, 1, 0.36, 1] as const;
const ZOOM_EASE = [0.16, 1, 0.3, 1] as const;

interface PlacedDoodle {
  doodle: DoodleDefinition;
  leftPct: number;
  topPct: number;
  size: number;
  tiltBase: number;
  floatY: number;
  floatRot: number;
  floatDuration: number;
  drawDelay: number;
  opacityClass: string;
}

interface PlacedSpark {
  id: string;
  kind: 'text' | 'star';
  label?: string;
  colorKey: 'mutedInk' | 'wheelPrimary' | 'coralFill' | 'yellowFill' | 'greenFill' | 'skyFill';
  leftPct: number;
  topPct: number;
  size: number;
  delay: number;
}

interface PlacedBox {
  cx: number;
  cy: number;
  half: number;
}

function shuffleArray<T>(items: readonly T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function randRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

const MARGINALIA_TEXTS = ['√2', 'Δx', '{ }', 'e^iπ', 'φ', '∑', 'λ', '∞', '01', 'π'] as const;

function generateRandomDoodleLayout(vw: number, vh: number): {
  doodles: PlacedDoodle[];
  sparks: PlacedSpark[];
} {
  const isMobile = vw < 640;
  const isTablet = vw >= 640 && vw < 1024;

  const targetDoodles = isMobile ? 10 : isTablet ? 18 : 27;
  const targetSparks = isMobile ? 4 : isTablet ? 6 : 9;

  const minSize = isMobile ? 64 : isTablet ? 74 : 78;
  const maxSize = isMobile ? 78 : isTablet ? 90 : 98;
  const gap = isMobile ? 12 : isTablet ? 15 : 18;
  const edgePad = isMobile ? 14 : isTablet ? 18 : 24;

  // Center safe rectangle protecting the loading wheel + lockup
  const safeW = isMobile ? Math.min(vw * 0.72, 255) : isTablet ? 305 : 345;
  const safeH = isMobile ? 235 : 265;
  const centerX = vw / 2;
  const centerY = vh / 2;

  const placedBoxes: PlacedBox[] = [];

  const isValidSpot = (cx: number, cy: number, half: number, minGap: number): boolean => {
    if (
      cx < edgePad + half ||
      cx > vw - edgePad - half ||
      cy < edgePad + half ||
      cy > vh - edgePad - half
    ) {
      return false;
    }

    // Must sit completely outside the centered lockup box
    const clearsCenter =
      Math.abs(cx - centerX) >= safeW / 2 + half ||
      Math.abs(cy - centerY) >= safeH / 2 + half;
    if (!clearsCenter) return false;

    // Must not overlap any already placed doodle/spark
    for (const box of placedBoxes) {
      const sep = half + box.half + minGap;
      if (Math.abs(cx - box.cx) < sep && Math.abs(cy - box.cy) < sep) {
        return false;
      }
    }
    return true;
  };

  // Build stratified grid cells across the outer canvas for natural spread
  const cols = isMobile ? 4 : isTablet ? 6 : 7;
  const rows = isMobile ? 6 : 5;
  const usableW = Math.max(120, vw - edgePad * 2);
  const usableH = Math.max(120, vh - edgePad * 2);
  const cellW = usableW / cols;
  const cellH = usableH / rows;

  const cells: Array<{ col: number; row: number }> = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      cells.push({ col: c, row: r });
    }
  }
  const shuffledCells = shuffleArray(cells);
  const pickedDoodles = shuffleArray(LOADING_DOODLES).slice(0, targetDoodles);

  const placedDoodles: PlacedDoodle[] = [];

  for (let i = 0; i < pickedDoodles.length; i += 1) {
    const doodle = pickedDoodles[i];
    const size = Math.round(randRange(minSize, maxSize));
    const half = size / 2;

    let chosenX: number | null = null;
    let chosenY: number | null = null;

    // Pass 1: try stratified shuffled cells with random intra-cell jitter
    for (let cIdx = 0; cIdx < shuffledCells.length && chosenX === null; cIdx += 1) {
      const cell = shuffledCells[(cIdx + i) % shuffledCells.length];
      const cellLeft = edgePad + cell.col * cellW;
      const cellTop = edgePad + cell.row * cellH;
      for (let attempt = 0; attempt < 12; attempt += 1) {
        const cx = randRange(cellLeft + half * 0.4, cellLeft + cellW - half * 0.4);
        const cy = randRange(cellTop + half * 0.4, cellTop + cellH - half * 0.4);
        if (isValidSpot(cx, cy, half, gap)) {
          chosenX = cx;
          chosenY = cy;
          break;
        }
      }
    }

    // Pass 2: pure dart-throwing across the entire viewport
    if (chosenX === null || chosenY === null) {
      for (let attempt = 0; attempt < 160; attempt += 1) {
        const cx = randRange(edgePad + half, vw - edgePad - half);
        const cy = randRange(edgePad + half, vh - edgePad - half);
        if (isValidSpot(cx, cy, half, gap)) {
          chosenX = cx;
          chosenY = cy;
          break;
        }
      }
    }

    // Pass 3: slightly more compact size fallback if viewport is very tight
    let finalSize = size;
    if (chosenX === null || chosenY === null) {
      finalSize = Math.round(size * 0.84);
      const smallHalf = finalSize / 2;
      for (let attempt = 0; attempt < 120; attempt += 1) {
        const cx = randRange(edgePad + smallHalf, vw - edgePad - smallHalf);
        const cy = randRange(edgePad + smallHalf, vh - edgePad - smallHalf);
        if (isValidSpot(cx, cy, smallHalf, Math.max(8, gap - 4))) {
          chosenX = cx;
          chosenY = cy;
          break;
        }
      }
    }

    if (chosenX !== null && chosenY !== null) {
      placedBoxes.push({ cx: chosenX, cy: chosenY, half: finalSize / 2 });
      placedDoodles.push({
        doodle,
        leftPct: (chosenX / vw) * 100,
        topPct: (chosenY / vh) * 100,
        size: finalSize,
        tiltBase: randRange(-7, 7),
        floatY: randRange(3.5, 6.5) * (Math.random() > 0.5 ? 1 : -1),
        floatRot: randRange(1.2, 2.5) * (Math.random() > 0.5 ? 1 : -1),
        floatDuration: randRange(4.8, 6.8),
        drawDelay: randRange(0.06, 0.34),
        opacityClass: Math.random() > 0.4 ? 'opacity-85 dark:opacity-80' : 'opacity-75 dark:opacity-70',
      });
    }
  }

  // Place small twinkling stars & math/code marginalia in the remaining clear pockets
  const shuffledTexts = shuffleArray(MARGINALIA_TEXTS);
  const sparkColors: PlacedSpark['colorKey'][] = [
    'mutedInk',
    'wheelPrimary',
    'coralFill',
    'yellowFill',
    'greenFill',
    'skyFill',
  ];
  const placedSparks: PlacedSpark[] = [];

  for (let s = 0; s < targetSparks; s += 1) {
    const isStar = s % 2 === 1;
    const sparkSize = isStar ? Math.round(randRange(11, 15)) : 26;
    const sparkHalf = isStar ? 10 : 15;

    for (let attempt = 0; attempt < 90; attempt += 1) {
      const cx = randRange(edgePad + sparkHalf, vw - edgePad - sparkHalf);
      const cy = randRange(edgePad + sparkHalf, vh - edgePad - sparkHalf);
      if (isValidSpot(cx, cy, sparkHalf, 10)) {
        placedBoxes.push({ cx, cy, half: sparkHalf });
        placedSparks.push({
          id: `spark-${s}`,
          kind: isStar ? 'star' : 'text',
          label: isStar ? undefined : shuffledTexts[Math.floor(s / 2) % shuffledTexts.length],
          colorKey: sparkColors[(s + Math.floor(Math.random() * 3)) % sparkColors.length],
          leftPct: (cx / vw) * 100,
          topPct: (cy / vh) * 100,
          size: sparkSize,
          delay: randRange(0.1, 1.6),
        });
        break;
      }
    }
  }

  return { doodles: placedDoodles, sparks: placedSparks };
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  isDark,
  onComplete,
}) => {
  const prefersReduced = Boolean(useReducedMotion());

  const layout = useMemo(() => {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
    return generateRandomDoodleLayout(vw, vh);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Random wait between 3 and 6 seconds before starting the zoom-in reveal
    const randomWait = Math.round(3000 + Math.random() * 3000);
    const duration = prefersReduced ? 600 : randomWait;
    const timer = window.setTimeout(() => {
      onComplete();
    }, duration);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
    };
  }, [onComplete, prefersReduced]);

  const palette: DoodlePalette = {
    ink: isDark ? '#DCEAD9' : '#1E3D24',
    mutedInk: isDark ? '#95B599' : '#4E7054',
    greenFill: isDark ? '#429E4D' : '#7DE386',
    softMint: isDark ? '#253D29' : '#DAF4D7',
    skyFill: isDark ? '#24455E' : '#9ED6FC',
    yellowFill: isDark ? '#B8962E' : '#FFD552',
    coralFill: isDark ? '#B35B4E' : '#FF9A8A',
    lavenderFill: isDark ? '#3F3559' : '#DED4FF',
    wheelPrimary: isDark ? '#7EE686' : '#2C913A',
    isDark,
    prefersReduced,
  };

  const gridColor = isDark
    ? 'rgba(126, 230, 134, 0.08)'
    : 'rgba(56, 148, 66, 0.09)';

  const wheelTrack = isDark ? '#2D4732' : '#CFE8CE';
  const wheelPrimary = palette.wheelPrimary;
  const wheelSecondary = isDark ? '#54B861' : '#7DE386';

  return (
    <motion.div
      role="status"
      aria-label="Loading Ishan Ganti website"
      initial={{ opacity: 1, scale: 1 }}
      exit={
        prefersReduced
          ? { opacity: 0, transition: { duration: 0.24 } }
          : {
              opacity: 0,
              scale: 1.45,
              pointerEvents: 'none',
              transition: { duration: 0.86, delay: 0.22, ease: ZOOM_EASE },
            }
      }
      className="fixed inset-0 z-[100] w-screen h-[100dvh] overflow-hidden bg-[#F7F9F3] dark:bg-[#162018] select-none flex items-center justify-center origin-center"
    >
      {/* Architectural Square Notebook Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to right, ${gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)`,
          backgroundSize: '44px 44px',
        }}
      />

      {/* Randomized Non-Overlapping Doodle Collage */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={
          prefersReduced
            ? { opacity: 0, transition: { duration: 0.22 } }
            : {
                opacity: 0,
                scale: 1.85,
                transition: { duration: 0.8, delay: 0.22, ease: ZOOM_EASE },
              }
        }
        transition={{ duration: 0.5, ease: INK_EASE }}
        className="pointer-events-none absolute inset-0 overflow-hidden origin-center"
      >
        {layout.doodles.map((item) => (
          <div
            key={item.doodle.id}
            style={{
              left: `${item.leftPct}%`,
              top: `${item.topPct}%`,
              width: item.size,
              height: item.size,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: item.tiltBase }}
              animate={
                prefersReduced
                  ? { opacity: 1, scale: 1, rotate: item.tiltBase }
                  : {
                      opacity: 1,
                      scale: 1,
                      y: [0, item.floatY, 0],
                      rotate: [
                        item.tiltBase - item.floatRot,
                        item.tiltBase + item.floatRot,
                        item.tiltBase - item.floatRot,
                      ],
                    }
              }
              transition={
                prefersReduced
                  ? { duration: 0.35 }
                  : {
                      opacity: { duration: 0.45, delay: item.drawDelay, ease: INK_EASE },
                      scale: { duration: 0.5, delay: item.drawDelay, ease: INK_EASE },
                      y: {
                        duration: item.floatDuration,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      },
                      rotate: {
                        duration: item.floatDuration * 1.15,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      },
                    }
              }
              className={`w-full h-full ${item.opacityClass}`}
            >
              {item.doodle.render(palette, item.drawDelay)}
            </motion.div>
          </div>
        ))}

        {layout.sparks.map((spark) => (
          <div
            key={spark.id}
            style={{
              left: `${spark.leftPct}%`,
              top: `${spark.topPct}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
          >
            {spark.kind === 'text' ? (
              <motion.span
                animate={
                  prefersReduced
                    ? { opacity: 0.6 }
                    : { opacity: [0.32, 0.85, 0.32], y: [0, -3, 0] }
                }
                transition={{
                  duration: 4.2,
                  delay: spark.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{ color: palette[spark.colorKey] }}
                className="inline-block font-mono text-xs font-medium tracking-tight"
              >
                {spark.label}
              </motion.span>
            ) : (
              <motion.svg
                viewBox="0 0 24 24"
                fill="none"
                style={{ width: spark.size, height: spark.size }}
                animate={
                  prefersReduced
                    ? { opacity: 0.65 }
                    : { scale: [0.82, 1.18, 0.82], opacity: [0.42, 0.9, 0.42] }
                }
                transition={{
                  duration: 3.6,
                  delay: spark.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <path
                  d="M12 2 L14.4 9.6 L22 12 L14.4 14.4 L12 22 L9.6 14.4 L2 12 L9.6 9.6 Z"
                  fill={palette[spark.colorKey]}
                />
              </motion.svg>
            )}
          </div>
        ))}
      </motion.div>

      {/* Soft Radial Clear Zone Behind Center Loader */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: isDark
            ? 'radial-gradient(circle at center, rgba(22, 32, 24, 0.94) 0%, rgba(22, 32, 24, 0.74) 22%, transparent 50%)'
            : 'radial-gradient(circle at center, rgba(247, 249, 243, 0.96) 0%, rgba(247, 249, 243, 0.78) 22%, transparent 50%)',
        }}
      />

      {/* Center Clean Loading Wheel & Minimalist Brand Lockup */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={
          prefersReduced
            ? { opacity: 0, transition: { duration: 0.22 } }
            : {
                opacity: 0,
                scale: 2.15,
                transition: { duration: 0.74, delay: 0.22, ease: ZOOM_EASE },
              }
        }
        transition={{ duration: 0.42, ease: INK_EASE }}
        className="relative z-10 flex flex-col items-center justify-center px-6 text-center origin-center"
      >
        <motion.div
          initial={prefersReduced ? { scale: 1 } : { scale: 0.96 }}
          animate={prefersReduced ? { scale: 1 } : { scale: 1.08 }}
          transition={{ duration: 7, ease: 'linear' }}
          className="flex flex-col items-center justify-center origin-center"
        >
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
            {/* Outer Rotating & Breathing Geometric Wheel */}
            <motion.svg
              viewBox="0 0 96 96"
              fill="none"
              className="absolute inset-0 w-full h-full"
              animate={prefersReduced ? undefined : { rotate: 360 }}
              transition={{ duration: 1.45, repeat: Infinity, ease: 'linear' }}
            >
              <circle
                cx="48"
                cy="48"
                r="42"
                stroke={wheelTrack}
                strokeWidth="1.75"
              />
              <motion.circle
                cx="48"
                cy="48"
                r="42"
                stroke={wheelPrimary}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="264"
                animate={
                  prefersReduced
                    ? { strokeDashoffset: 170 }
                    : { strokeDashoffset: [215, 128, 215] }
                }
                transition={{ duration: 1.45, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.svg>

            {/* Inner Counter-Rotating Precision Ring */}
            <motion.svg
              viewBox="0 0 96 96"
              fill="none"
              className="absolute inset-0 w-full h-full"
              animate={prefersReduced ? undefined : { rotate: -360 }}
              transition={{ duration: 7.5, repeat: Infinity, ease: 'linear' }}
            >
              <circle
                cx="48"
                cy="48"
                r="33"
                stroke={wheelSecondary}
                strokeWidth="1.25"
                strokeOpacity="0.55"
                strokeDasharray="3 8"
                strokeLinecap="round"
              />
            </motion.svg>

            {/* Center Rounded Monogram */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1, ease: INK_EASE }}
              className="relative z-10"
            >
              <MonogramLogo size={36} />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.36, delay: 0.12, ease: INK_EASE }}
            className="mt-5 space-y-1.5"
          >
            <div className="font-display text-xl sm:text-2xl font-normal tracking-tight text-[#223024] dark:text-[#EDF3EA]">
              Ishan Ganti
            </div>
            <div className="font-mono text-xs text-[#536956] dark:text-[#9FB5A1] flex items-center justify-center gap-1.5">
              <span>ishanganti.in</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center">
                <span>Loading</span>
                {!prefersReduced && (
                  <span className="inline-flex w-4 text-left ml-0.5" aria-hidden="true">
                    <motion.span
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
                    >
                      .
                    </motion.span>
                    <motion.span
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                    >
                      .
                    </motion.span>
                    <motion.span
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                    >
                      .
                    </motion.span>
                  </span>
                )}
              </span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
