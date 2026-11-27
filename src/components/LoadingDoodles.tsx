import React from 'react';
import { motion } from 'motion/react';

export const DOODLE_INK_EASE = [0.22, 1, 0.36, 1] as const;

export interface DoodlePalette {
  ink: string;
  mutedInk: string;
  greenFill: string;
  softMint: string;
  skyFill: string;
  yellowFill: string;
  coralFill: string;
  lavenderFill: string;
  wheelPrimary: string;
  isDark: boolean;
  prefersReduced: boolean;
}

export interface DoodleDefinition {
  id: string;
  render: (p: DoodlePalette, delay: number) => React.ReactNode;
}

export const LOADING_DOODLES: DoodleDefinition[] = [
  {
    id: 'set-square',
    render: (p, delay) => (
      <svg viewBox="0 0 110 110" fill="none" className="w-full h-full overflow-visible">
        <polygon points="18,90 18,22 86,90" fill={p.softMint} transform="translate(3,3)" />
        <motion.path
          d="M16 88 L16 20 L84 88 Z"
          fill={p.yellowFill}
          fillOpacity={p.isDark ? 0.28 : 0.48}
          stroke={p.ink}
          strokeWidth="1.6"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.75, delay, ease: DOODLE_INK_EASE }}
        />
        <polygon points="30,74 30,48 56,74" fill={p.isDark ? '#162018' : '#F7F9F3'} stroke={p.mutedInk} strokeWidth="1.2" />
        {[28, 40, 52, 64, 76].map((x) => (
          <line key={x} x1={x} y1="88" x2={x} y2="83" stroke={p.mutedInk} strokeWidth="1.2" />
        ))}
        <g transform="translate(54, 16) rotate(32)">
          <rect x="0" y="0" width="38" height="9" fill={p.yellowFill} stroke={p.ink} strokeWidth="1.35" />
          <rect x="-7" y="0" width="7" height="9" fill={p.coralFill} stroke={p.ink} strokeWidth="1.35" />
          <polygon points="38,0 47,4.5 38,9" fill={p.softMint} stroke={p.ink} strokeWidth="1.35" />
        </g>
      </svg>
    ),
  },
  {
    id: 'sine-wave',
    render: (p, delay) => (
      <svg viewBox="0 0 110 100" fill="none" className="w-full h-full overflow-visible">
        <rect x="12" y="16" width="86" height="68" fill={p.skyFill} fillOpacity={p.isDark ? 0.2 : 0.35} />
        <motion.path
          d="M18 76 L18 16 M14 70 L96 70"
          stroke={p.mutedInk}
          strokeWidth="1.4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.7, delay, ease: DOODLE_INK_EASE }}
        />
        <motion.path
          d="M20 58 C32 24, 48 24, 58 50 C68 74, 82 68, 92 30"
          stroke={p.wheelPrimary}
          strokeWidth="2.1"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.85, delay: delay + 0.06, ease: DOODLE_INK_EASE }}
        />
        <path
          d="M70 22 L88 22 M75 22 L74 36 M83 22 L83 34 C83 36, 85 37, 87 36"
          stroke={p.ink}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: 'compass',
    render: (p, delay) => (
      <svg viewBox="0 0 90 90" fill="none" className="w-full h-full overflow-visible">
        <path d="M18 68 A32 32 0 0 0 72 68" stroke={p.mutedInk} strokeWidth="1.3" strokeDasharray="3 4" />
        <circle cx="45" cy="18" r="5" fill={p.yellowFill} stroke={p.ink} strokeWidth="1.5" />
        <motion.path
          d="M45 10 V13 M42 22 L27 72 M48 22 L63 72 M33 50 H57"
          stroke={p.ink}
          strokeWidth="1.65"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.75, delay, ease: DOODLE_INK_EASE }}
        />
      </svg>
    ),
  },
  {
    id: 'atom',
    render: (p, delay) => (
      <svg viewBox="0 0 100 100" fill="none" className="w-full h-full overflow-visible">
        <circle cx="50" cy="50" r="32" fill={p.softMint} fillOpacity="0.55" />
        <motion.ellipse
          cx="50"
          cy="50"
          rx="34"
          ry="13"
          transform="rotate(28 50 50)"
          stroke={p.ink}
          strokeWidth="1.45"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay, ease: DOODLE_INK_EASE }}
        />
        <motion.ellipse
          cx="50"
          cy="50"
          rx="34"
          ry="13"
          transform="rotate(-32 50 50)"
          stroke={p.mutedInk}
          strokeWidth="1.45"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: delay + 0.06, ease: DOODLE_INK_EASE }}
        />
        <circle cx="50" cy="50" r="6" fill={p.greenFill} stroke={p.ink} strokeWidth="1.4" />
        <circle cx="77" cy="36" r="3" fill={p.yellowFill} stroke={p.ink} strokeWidth="1.1" />
      </svg>
    ),
  },
  {
    id: 'paper-plane',
    render: (p, delay) => (
      <svg viewBox="0 0 110 100" fill="none" className="w-full h-full overflow-visible">
        <motion.path
          d="M12 78 C32 74, 44 54, 62 48"
          stroke={p.mutedInk}
          strokeWidth="1.5"
          strokeDasharray="4 4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay, ease: DOODLE_INK_EASE }}
        />
        <polygon points="52,36 96,16 78,62 66,46" transform="translate(3,3)" fill={p.softMint} />
        <polygon points="50,34 94,14 76,60 64,44" fill={p.skyFill} />
        <motion.path
          d="M50 34 L94 14 L76 60 L64 44 Z M94 14 L64 44"
          stroke={p.ink}
          strokeWidth="1.55"
          strokeLinejoin="round"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.75, delay, ease: DOODLE_INK_EASE }}
        />
      </svg>
    ),
  },
  {
    id: 'code-card',
    render: (p, delay) => (
      <svg viewBox="0 0 100 84" fill="none" className="w-full h-full overflow-visible">
        <rect x="14" y="18" width="72" height="48" transform="translate(3,3)" fill={p.softMint} />
        <motion.rect
          x="12"
          y="16"
          width="72"
          height="48"
          fill={p.lavenderFill}
          fillOpacity={p.isDark ? 0.55 : 0.75}
          stroke={p.ink}
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.7, delay, ease: DOODLE_INK_EASE }}
        />
        <path
          d="M34 33 L24 40 L34 47 M62 33 L72 40 L62 47 M52 30 L44 50"
          stroke={p.ink}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'planet',
    render: (p, delay) => (
      <svg viewBox="0 0 100 90" fill="none" className="w-full h-full overflow-visible">
        <circle cx="50" cy="46" r="18" fill={p.coralFill} fillOpacity="0.85" stroke={p.ink} strokeWidth="1.5" />
        <motion.ellipse
          cx="50"
          cy="46"
          rx="34"
          ry="10"
          transform="rotate(-18 50 46)"
          stroke={p.ink}
          strokeWidth="1.55"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.75, delay, ease: DOODLE_INK_EASE }}
        />
        <path d="M20 20 L22 25 L27 27 L22 29 L20 34 L18 29 L13 27 L18 25 Z" fill={p.yellowFill} />
        <circle cx="82" cy="24" r="2.2" fill={p.greenFill} />
      </svg>
    ),
  },
  {
    id: 'open-book',
    render: (p, delay) => (
      <svg viewBox="0 0 110 92" fill="none" className="w-full h-full overflow-visible">
        <path
          d="M16 24 C30 18, 44 21, 55 28 C66 21, 80 18, 94 24 L94 72 C80 66, 66 69, 55 76 C44 69, 30 66, 16 72 Z"
          transform="translate(3.5, 3.5)"
          fill={p.softMint}
        />
        <path
          d="M14 22 C28 16, 43 19, 55 26 C67 19, 82 16, 96 22 L96 70 C82 64, 67 67, 55 74 C43 67, 28 64, 14 70 Z"
          fill={p.isDark ? '#223326' : '#FFFDF6'}
        />
        <polygon points="72,21 79,20 79,44 75.5,39 72,44" fill={p.coralFill} />
        <motion.path
          d="M14 22 C28 16, 43 19, 55 26 C67 19, 82 16, 96 22 L96 70 C82 64, 67 67, 55 74 C43 67, 28 64, 14 70 Z M55 26 L55 74"
          stroke={p.ink}
          strokeWidth="1.55"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay, ease: DOODLE_INK_EASE }}
        />
        <path
          d="M24 35 L44 37 M24 45 L44 47 M24 55 L42 56 M65 50 L85 48 M65 58 L83 56"
          stroke={p.mutedInk}
          strokeWidth="1.35"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: 'sigma-infinity',
    render: (p, delay) => (
      <svg viewBox="0 0 90 80" fill="none" className="w-full h-full overflow-visible">
        <rect x="12" y="14" width="66" height="52" fill={p.softMint} transform="translate(2.5,2.5)" />
        <rect x="10" y="12" width="66" height="52" fill={p.isDark ? '#1D2A20' : '#FCFDF9'} stroke={p.mutedInk} strokeWidth="1.3" />
        <motion.path
          d="M36 26 H22 L31 38 L22 50 H36"
          stroke={p.ink}
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.7, delay, ease: DOODLE_INK_EASE }}
        />
        <path
          d="M49 38 C49 33, 55 33, 58 38 C61 43, 67 43, 67 38 C67 33, 61 33, 58 38 C55 43, 49 43, 49 38 Z"
          stroke={p.wheelPrimary}
          strokeWidth="1.8"
        />
      </svg>
    ),
  },
  {
    id: 'study-mug',
    render: (p, delay) => (
      <svg viewBox="0 0 90 90" fill="none" className="w-full h-full overflow-visible">
        <rect x="24" y="38" width="34" height="32" rx="4" transform="translate(3,3)" fill={p.softMint} />
        <rect x="22" y="36" width="34" height="32" rx="4" fill={p.yellowFill} fillOpacity="0.85" stroke={p.ink} strokeWidth="1.55" />
        <path d="M56 44 C66 44, 66 58, 56 58" stroke={p.ink} strokeWidth="1.65" strokeLinecap="round" />
        <motion.path
          d="M32 28 C30 23, 35 20, 33 15 M42 28 C40 23, 45 20, 43 15"
          stroke={p.mutedInk}
          strokeWidth="1.45"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.75, delay, ease: DOODLE_INK_EASE }}
        />
      </svg>
    ),
  },
  {
    id: 'rubiks-cube',
    render: (p, delay) => (
      <svg viewBox="0 0 100 100" fill="none" className="w-full h-full overflow-visible">
        <polygon points="50,14 82,32 50,50 18,32" fill={p.greenFill} />
        <polygon points="18,32 50,50 50,86 18,68" fill={p.skyFill} />
        <polygon points="50,50 82,32 82,68 50,86" fill={p.yellowFill} />
        <motion.path
          d="M50 14 L82 32 L82 68 L50 86 L18 68 L18 32 Z M18 32 L50 50 L82 32 M50 50 L50 86"
          stroke={p.ink}
          strokeWidth="1.6"
          strokeLinejoin="round"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay, ease: DOODLE_INK_EASE }}
        />
        <path
          d="M34 23 L66 41 M66 23 L34 41 M34 41 L34 77 M66 41 L66 77"
          stroke={p.ink}
          strokeWidth="1.05"
          strokeOpacity="0.45"
        />
      </svg>
    ),
  },
  {
    id: 'rocket',
    render: (p) => (
      <svg viewBox="0 0 90 90" fill="none" className="w-full h-full overflow-visible">
        <g transform="rotate(35 45 45)">
          <path d="M45 14 C56 26, 58 46, 54 60 H36 C32 46, 34 26, 45 14 Z" fill={p.skyFill} stroke={p.ink} strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M35 48 L26 60 L36 58 Z M55 48 L64 60 L54 58 Z" fill={p.coralFill} stroke={p.ink} strokeWidth="1.4" strokeLinejoin="round" />
          <circle cx="45" cy="36" r="5" fill={p.yellowFill} stroke={p.ink} strokeWidth="1.3" />
          <path d="M41 64 L45 74 L49 64" stroke={p.coralFill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    ),
  },
  {
    id: 'chess-knight',
    render: (p, delay) => (
      <svg viewBox="0 0 90 90" fill="none" className="w-full h-full overflow-visible">
        <path
          d="M30 72 H62 V66 H30 Z M34 66 C34 54, 44 48, 42 40 C37 42, 30 42, 28 38 C26 34, 34 24, 40 20 L42 15 L48 20 C58 22, 62 34, 58 66 Z"
          transform="translate(3,3)"
          fill={p.softMint}
        />
        <motion.path
          d="M30 72 H62 V66 H30 Z M34 66 C34 54, 44 48, 42 40 C37 42, 30 42, 28 38 C26 34, 34 24, 40 20 L42 15 L48 20 C58 22, 62 34, 58 66 Z"
          fill={p.lavenderFill}
          fillOpacity={p.isDark ? 0.6 : 0.85}
          stroke={p.ink}
          strokeWidth="1.5"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay, ease: DOODLE_INK_EASE }}
        />
        <circle cx="38" cy="29" r="1.7" fill={p.ink} />
      </svg>
    ),
  },
  {
    id: 'headphones',
    render: (p, delay) => (
      <svg viewBox="0 0 110 100" fill="none" className="w-full h-full overflow-visible">
        <circle cx="52" cy="54" r="32" fill={p.softMint} fillOpacity="0.65" />
        <motion.path
          d="M26 56 C26 32, 74 32, 74 56"
          stroke={p.ink}
          strokeWidth="2.2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.75, delay, ease: DOODLE_INK_EASE }}
        />
        <rect x="20" y="52" width="12" height="22" rx="4" fill={p.coralFill} stroke={p.ink} strokeWidth="1.5" />
        <rect x="68" y="52" width="12" height="22" rx="4" fill={p.coralFill} stroke={p.ink} strokeWidth="1.5" />
        <path d="M88 34 L88 18 L99 15 L99 31" stroke={p.ink} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="85" cy="35" r="3.5" fill={p.yellowFill} stroke={p.ink} strokeWidth="1.3" />
        <circle cx="96" cy="32" r="3.5" fill={p.yellowFill} stroke={p.ink} strokeWidth="1.3" />
      </svg>
    ),
  },
  {
    id: 'leaf-flower',
    render: (p, delay) => (
      <svg viewBox="0 0 96 96" fill="none" className="w-full h-full overflow-visible">
        <path d="M24 76 C30 52, 46 32, 74 18 C70 46, 54 64, 24 76 Z" fill={p.greenFill} fillOpacity="0.8" />
        <motion.path
          d="M20 80 C30 56, 48 36, 74 18 M24 76 C30 52, 46 32, 74 18 C70 46, 54 64, 24 76 Z"
          stroke={p.ink}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.78, delay, ease: DOODLE_INK_EASE }}
        />
        <circle cx="24" cy="30" r="4.5" fill={p.coralFill} />
        <circle cx="33" cy="30" r="4.5" fill={p.coralFill} />
        <circle cx="28.5" cy="25.5" r="4.5" fill={p.coralFill} />
        <circle cx="28.5" cy="34.5" r="4.5" fill={p.coralFill} />
        <circle cx="28.5" cy="30" r="3" fill={p.yellowFill} stroke={p.ink} strokeWidth="1.1" />
      </svg>
    ),
  },
  {
    id: 'camera',
    render: (p) => (
      <svg viewBox="0 0 96 76" fill="none" className="w-full h-full overflow-visible">
        <rect x="16" y="24" width="64" height="40" rx="5" transform="translate(2.5,2.5)" fill={p.softMint} />
        <path d="M34 22 L38 14 H58 L62 22" fill={p.yellowFill} stroke={p.ink} strokeWidth="1.4" strokeLinejoin="round" />
        <rect x="14" y="22" width="64" height="40" rx="5" fill={p.isDark ? '#1D2A20' : '#FCFDF9'} stroke={p.ink} strokeWidth="1.5" />
        <circle cx="46" cy="42" r="11" fill={p.skyFill} stroke={p.ink} strokeWidth="1.5" />
        <circle cx="46" cy="42" r="5" fill={p.greenFill} stroke={p.ink} strokeWidth="1.2" />
        <circle cx="67" cy="31" r="2.2" fill={p.coralFill} />
      </svg>
    ),
  },
  {
    id: 'gamepad',
    render: (p, delay) => (
      <svg viewBox="0 0 110 90" fill="none" className="w-full h-full overflow-visible">
        <rect x="20" y="26" width="70" height="40" rx="12" transform="translate(3,3)" fill={p.softMint} />
        <motion.rect
          x="18"
          y="24"
          width="70"
          height="40"
          rx="12"
          fill={p.skyFill}
          stroke={p.ink}
          strokeWidth="1.6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.78, delay, ease: DOODLE_INK_EASE }}
        />
        <path d="M36 37 V51 M29 44 H43" stroke={p.ink} strokeWidth="3" strokeLinecap="round" />
        <circle cx="67" cy="48" r="3.5" fill={p.coralFill} stroke={p.ink} strokeWidth="1.2" />
        <circle cx="76" cy="40" r="3.5" fill={p.yellowFill} stroke={p.ink} strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    id: 'lightbulb',
    render: (p, delay) => (
      <svg viewBox="0 0 110 100" fill="none" className="w-full h-full overflow-visible">
        <path
          d="M52 24 C38 24, 30 34, 30 45 C30 53, 36 59, 41 64 L41 72 L63 72 L63 64 C68 59, 74 53, 74 45 C74 34, 66 24, 52 24 Z"
          transform="translate(3,3)"
          fill={p.softMint}
        />
        <motion.path
          d="M52 24 C38 24, 30 34, 30 45 C30 53, 36 59, 41 64 L41 72 L63 72 L63 64 C68 59, 74 53, 74 45 C74 34, 66 24, 52 24 Z"
          fill={p.yellowFill}
          fillOpacity={p.isDark ? 0.55 : 0.8}
          stroke={p.ink}
          strokeWidth="1.6"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.78, delay, ease: DOODLE_INK_EASE }}
        />
        <path d="M44 77 H60 M46 82 H58" stroke={p.ink} strokeWidth="1.6" strokeLinecap="round" />
        <path d="M47 52 L52 44 L57 52" stroke={p.ink} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M52 12 V18 M24 30 L29 34 M80 30 L75 34 M19 46 H24 M85 46 H80"
          stroke={p.mutedInk}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: 'fibonacci',
    render: (p, delay) => (
      <svg viewBox="0 0 100 76" fill="none" className="w-full h-full overflow-visible">
        <rect x="12" y="14" width="76" height="48" transform="translate(2.5,2.5)" fill={p.softMint} />
        <rect x="10" y="12" width="76" height="48" fill={p.isDark ? '#1D2A20' : '#FCFDF9'} stroke={p.mutedInk} strokeWidth="1.25" />
        <rect x="10" y="12" width="48" height="48" fill={p.yellowFill} fillOpacity={p.isDark ? 0.2 : 0.35} stroke={p.mutedInk} strokeWidth="1.05" />
        <line x1="58" y1="40" x2="86" y2="40" stroke={p.mutedInk} strokeWidth="1.05" />
        <line x1="70" y1="40" x2="70" y2="60" stroke={p.mutedInk} strokeWidth="1.05" />
        <motion.path
          d="M10 60 A48 48 0 0 1 58 12 A28 28 0 0 1 86 40 A20 20 0 0 1 70 60 A12 12 0 0 1 58 48"
          stroke={p.wheelPrimary}
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.95, delay, ease: DOODLE_INK_EASE }}
        />
      </svg>
    ),
  },
  {
    id: 'protractor',
    render: (p, delay) => (
      <svg viewBox="0 0 110 76" fill="none" className="w-full h-full overflow-visible">
        <motion.path
          d="M14 60 A41 41 0 0 1 96 60 Z"
          fill={p.skyFill}
          fillOpacity={p.isDark ? 0.35 : 0.65}
          stroke={p.ink}
          strokeWidth="1.5"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay, ease: DOODLE_INK_EASE }}
        />
        <path d="M35 60 A20 20 0 0 1 75 60 Z" fill={p.isDark ? '#162018' : '#F7F9F3'} stroke={p.mutedInk} strokeWidth="1.15" />
        <path d="M55 19 V25 M30 28 L34 33 M80 28 L76 33 M19 44 L25 47 M91 44 L85 47" stroke={p.ink} strokeWidth="1.2" strokeLinecap="round" />
        <motion.line
          x1="55"
          y1="60"
          x2="78"
          y2="32"
          stroke={p.coralFill}
          strokeWidth="1.7"
          strokeLinecap="round"
          animate={p.prefersReduced ? undefined : { rotate: [-6, 8, -6] }}
          style={{ transformOrigin: '55px 60px' }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
    ),
  },
  {
    id: 'dna-helix',
    render: (p, delay) => (
      <svg viewBox="0 0 80 100" fill="none" className="w-full h-full overflow-visible">
        <path d="M28 20 H52 M26 35 H54 M30 50 H50 M26 65 H54 M28 80 H52" stroke={p.mutedInk} strokeWidth="1.35" strokeLinecap="round" />
        <motion.path
          d="M26 10 C56 25, 24 42, 54 58 C26 72, 54 84, 26 92"
          stroke={p.wheelPrimary}
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, delay, ease: DOODLE_INK_EASE }}
        />
        <motion.path
          d="M54 10 C24 25, 56 42, 26 58 C54 72, 26 84, 54 92"
          stroke={p.coralFill}
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, delay: delay + 0.08, ease: DOODLE_INK_EASE }}
        />
      </svg>
    ),
  },
  {
    id: 'chemistry-flask',
    render: (p, delay) => (
      <svg viewBox="0 0 90 100" fill="none" className="w-full h-full overflow-visible">
        <path d="M36 24 H54 V40 L74 76 C76 80, 73 84, 68 84 H22 C17 84, 14 80, 16 76 L36 40 Z" transform="translate(3,3)" fill={p.softMint} />
        <path d="M22 62 L68 62 L73 75 C75 79, 72 82, 67 82 H23 C18 82, 15 79, 17 75 Z" fill={p.greenFill} fillOpacity="0.82" />
        <motion.path
          d="M34 22 H56 M38 22 V40 L17 75 C15 79, 18 82, 23 82 H67 C72 82, 75 79, 73 75 L52 40 V22"
          stroke={p.ink}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay, ease: DOODLE_INK_EASE }}
        />
        <motion.circle
          cx="45"
          cy="15"
          r="3"
          fill={p.yellowFill}
          stroke={p.ink}
          strokeWidth="1.1"
          animate={p.prefersReduced ? undefined : { y: [4, -8], opacity: [0.2, 0.95, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
        />
        <motion.circle
          cx="53"
          cy="19"
          r="2.2"
          fill={p.skyFill}
          stroke={p.ink}
          strokeWidth="1"
          animate={p.prefersReduced ? undefined : { y: [4, -10], opacity: [0.2, 0.9, 0] }}
          transition={{ duration: 2.8, delay: 0.9, repeat: Infinity, ease: 'easeOut' }}
        />
      </svg>
    ),
  },
  {
    id: 'vinyl-turntable',
    render: (p) => (
      <svg viewBox="0 0 96 96" fill="none" className="w-full h-full overflow-visible">
        <rect x="14" y="14" width="68" height="68" rx="6" transform="translate(3,3)" fill={p.softMint} />
        <rect x="12" y="12" width="68" height="68" rx="6" fill={p.isDark ? '#1D2A20' : '#FCFDF9'} stroke={p.ink} strokeWidth="1.5" />
        <motion.g
          animate={p.prefersReduced ? undefined : { rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '43px 46px' }}
        >
          <circle cx="43" cy="46" r="22" fill={p.ink} fillOpacity={p.isDark ? 0.35 : 0.85} stroke={p.ink} strokeWidth="1.4" />
          <circle cx="43" cy="46" r="15" stroke={p.mutedInk} strokeWidth="0.9" strokeDasharray="12 6" />
          <circle cx="43" cy="46" r="7.5" fill={p.greenFill} stroke={p.ink} strokeWidth="1.2" />
          <circle cx="43" cy="46" r="2" fill={p.yellowFill} />
        </motion.g>
        <path d="M72 22 V50 L62 60" stroke={p.coralFill} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="72" cy="22" r="3.5" fill={p.yellowFill} stroke={p.ink} strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    id: 'magnifying-ladybug',
    render: (p) => (
      <svg viewBox="0 0 96 96" fill="none" className="w-full h-full overflow-visible">
        <circle cx="42" cy="42" r="22" fill={p.skyFill} fillOpacity={p.isDark ? 0.3 : 0.45} stroke={p.ink} strokeWidth="2" />
        <line x1="58" y1="58" x2="78" y2="78" stroke={p.ink} strokeWidth="4" strokeLinecap="round" />
        <line x1="58" y1="58" x2="78" y2="78" stroke={p.yellowFill} strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="42" cy="44" r="7.5" fill={p.coralFill} stroke={p.ink} strokeWidth="1.3" />
        <path d="M42 36.5 V51.5" stroke={p.ink} strokeWidth="1.2" />
        <circle cx="42" cy="36" r="3" fill={p.ink} />
        <circle cx="38.5" cy="43" r="1.2" fill={p.ink} />
        <circle cx="45.5" cy="46" r="1.2" fill={p.ink} />
      </svg>
    ),
  },
  {
    id: 'origami-crane',
    render: (p, delay) => (
      <svg viewBox="0 0 100 88" fill="none" className="w-full h-full overflow-visible">
        <polygon points="18,48 48,34 42,60" fill={p.lavenderFill} stroke={p.ink} strokeWidth="1.4" strokeLinejoin="round" />
        <polygon points="48,34 62,14 58,48" fill={p.skyFill} stroke={p.ink} strokeWidth="1.4" strokeLinejoin="round" />
        <polygon points="42,60 58,48 76,56" fill={p.softMint} stroke={p.ink} strokeWidth="1.4" strokeLinejoin="round" />
        <motion.path
          d="M18 48 L10 38 L24 44 M76 56 L86 24 L92 27 L83 32"
          stroke={p.ink}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.75, delay, ease: DOODLE_INK_EASE }}
        />
      </svg>
    ),
  },
  {
    id: 'integral-note',
    render: (p, delay) => (
      <svg viewBox="0 0 96 84" fill="none" className="w-full h-full overflow-visible">
        <polygon points="14,14 82,14 82,58 68,72 14,72" transform="translate(3,3)" fill={p.softMint} />
        <polygon points="12,12 80,12 80,56 66,70 12,70" fill={p.yellowFill} fillOpacity={p.isDark ? 0.35 : 0.55} stroke={p.ink} strokeWidth="1.45" strokeLinejoin="round" />
        <polygon points="66,70 66,56 80,56" fill={p.softMint} stroke={p.ink} strokeWidth="1.3" strokeLinejoin="round" />
        <motion.path
          d="M34 25 C29 25, 29 57, 24 57 M42 52 C48 34, 60 32, 68 46"
          stroke={p.ink}
          strokeWidth="1.75"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay, ease: DOODLE_INK_EASE }}
        />
        <path d="M44 52 H68" stroke={p.mutedInk} strokeWidth="1.2" strokeDasharray="3 3" />
      </svg>
    ),
  },
  {
    id: 'telescope',
    render: (p) => (
      <svg viewBox="0 0 96 80" fill="none" className="w-full h-full overflow-visible">
        <path d="M44 46 L30 70 M44 46 L58 70 M44 46 V68" stroke={p.mutedInk} strokeWidth="1.6" strokeLinecap="round" />
        <g transform="rotate(-24 44 42)">
          <rect x="20" y="34" width="48" height="12" rx="2" fill={p.skyFill} stroke={p.ink} strokeWidth="1.5" />
          <rect x="64" y="31" width="10" height="18" rx="1.5" fill={p.yellowFill} stroke={p.ink} strokeWidth="1.4" />
        </g>
        <path d="M80 14 L81.5 18 L85.5 19.5 L81.5 21 L80 25 L78.5 21 L74.5 19.5 L78.5 18 Z" fill={p.yellowFill} />
      </svg>
    ),
  },
  {
    id: 'binary-matrix',
    render: (p) => (
      <svg viewBox="0 0 96 80" fill="none" className="w-full h-full overflow-visible">
        <rect x="16" y="16" width="64" height="48" transform="translate(2.5,2.5)" fill={p.softMint} />
        <rect x="14" y="14" width="64" height="48" fill={p.isDark ? '#1D2A20' : '#FCFDF9'} stroke={p.ink} strokeWidth="1.4" />
        <circle cx="29" cy="29" r="5" stroke={p.wheelPrimary} strokeWidth="1.6" />
        <path d="M46 24 V34 M61 24 V34 M29 44 V54" stroke={p.ink} strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="46" cy="49" r="5" stroke={p.coralFill} strokeWidth="1.6" />
        <circle cx="61" cy="49" r="5" stroke={p.wheelPrimary} strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    id: 'moon-constellation',
    render: (p) => (
      <svg viewBox="0 0 100 76" fill="none" className="w-full h-full overflow-visible">
        <path
          d="M36 20 C26 24, 22 38, 30 48 C38 58, 52 56, 58 48 C47 50, 37 42, 36 30 C36 26, 37 23, 36 20 Z"
          fill={p.yellowFill}
          stroke={p.ink}
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path d="M58 28 L72 22 L84 34 L70 42" stroke={p.mutedInk} strokeWidth="1.15" strokeDasharray="3 3" />
        <circle cx="58" cy="28" r="2.3" fill={p.greenFill} />
        <circle cx="72" cy="22" r="2.6" fill={p.coralFill} />
        <circle cx="84" cy="34" r="2.2" fill={p.skyFill} />
      </svg>
    ),
  },
  {
    id: 'abacus',
    render: (p, delay) => (
      <svg viewBox="0 0 100 84" fill="none" className="w-full h-full overflow-visible">
        <rect x="16" y="18" width="68" height="50" rx="4" transform="translate(2.5,2.5)" fill={p.softMint} />
        <motion.rect
          x="14"
          y="16"
          width="68"
          height="50"
          rx="4"
          fill={p.isDark ? '#1D2A20' : '#FCFDF9'}
          stroke={p.ink}
          strokeWidth="1.6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.75, delay, ease: DOODLE_INK_EASE }}
        />
        <line x1="14" y1="29" x2="82" y2="29" stroke={p.mutedInk} strokeWidth="1.4" />
        <line x1="14" y1="41" x2="82" y2="41" stroke={p.mutedInk} strokeWidth="1.4" />
        <line x1="14" y1="53" x2="82" y2="53" stroke={p.mutedInk} strokeWidth="1.4" />
        <circle cx="28" cy="29" r="4" fill={p.coralFill} stroke={p.ink} strokeWidth="1.2" />
        <circle cx="38" cy="29" r="4" fill={p.coralFill} stroke={p.ink} strokeWidth="1.2" />
        <circle cx="66" cy="29" r="4" fill={p.yellowFill} stroke={p.ink} strokeWidth="1.2" />
        <circle cx="34" cy="41" r="4" fill={p.greenFill} stroke={p.ink} strokeWidth="1.2" />
        <circle cx="58" cy="41" r="4" fill={p.skyFill} stroke={p.ink} strokeWidth="1.2" />
        <circle cx="68" cy="41" r="4" fill={p.skyFill} stroke={p.ink} strokeWidth="1.2" />
        <circle cx="26" cy="53" r="4" fill={p.yellowFill} stroke={p.ink} strokeWidth="1.2" />
        <circle cx="48" cy="53" r="4" fill={p.greenFill} stroke={p.ink} strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    id: 'microscope',
    render: (p, delay) => (
      <svg viewBox="0 0 96 100" fill="none" className="w-full h-full overflow-visible">
        <path d="M24 80 H72" stroke={p.ink} strokeWidth="2.4" strokeLinecap="round" />
        <motion.path
          d="M52 38 C70 40, 72 68, 52 78"
          stroke={p.ink}
          strokeWidth="2.2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.78, delay, ease: DOODLE_INK_EASE }}
        />
        <g transform="rotate(-24 44 36)">
          <rect x="37" y="16" width="14" height="36" rx="2" fill={p.skyFill} stroke={p.ink} strokeWidth="1.5" />
          <rect x="39" y="11" width="10" height="6" fill={p.yellowFill} stroke={p.ink} strokeWidth="1.3" />
        </g>
        <line x1="28" y1="62" x2="54" y2="62" stroke={p.wheelPrimary} strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="56" cy="44" r="3.5" fill={p.coralFill} stroke={p.ink} strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    id: 'dice-pair',
    render: (p) => (
      <svg viewBox="0 0 100 90" fill="none" className="w-full h-full overflow-visible">
        <g transform="rotate(-10 34 44)">
          <rect x="16" y="26" width="36" height="36" rx="6" transform="translate(2.5,2.5)" fill={p.softMint} />
          <rect x="14" y="24" width="36" height="36" rx="6" fill={p.isDark ? '#223326' : '#FFFDF6'} stroke={p.ink} strokeWidth="1.5" />
          <circle cx="24" cy="34" r="2.2" fill={p.ink} />
          <circle cx="32" cy="42" r="2.2" fill={p.coralFill} />
          <circle cx="40" cy="50" r="2.2" fill={p.ink} />
        </g>
        <g transform="rotate(12 66 50)">
          <rect x="48" y="32" width="36" height="36" rx="6" transform="translate(2.5,2.5)" fill={p.softMint} />
          <rect x="46" y="30" width="36" height="36" rx="6" fill={p.yellowFill} fillOpacity={p.isDark ? 0.55 : 0.78} stroke={p.ink} strokeWidth="1.5" />
          <circle cx="56" cy="40" r="2.2" fill={p.ink} />
          <circle cx="72" cy="40" r="2.2" fill={p.ink} />
          <circle cx="56" cy="56" r="2.2" fill={p.ink} />
          <circle cx="72" cy="56" r="2.2" fill={p.ink} />
        </g>
      </svg>
    ),
  },
  {
    id: 'terminal',
    render: (p, delay) => (
      <svg viewBox="0 0 100 84" fill="none" className="w-full h-full overflow-visible">
        <rect x="14" y="18" width="72" height="50" rx="4" transform="translate(3,3)" fill={p.softMint} />
        <rect x="12" y="16" width="72" height="50" rx="4" fill={p.isDark ? '#1D2A20' : '#223024'} stroke={p.ink} strokeWidth="1.5" />
        <line x1="12" y1="27" x2="84" y2="27" stroke={p.mutedInk} strokeWidth="1.1" />
        <circle cx="20" cy="21.5" r="1.8" fill={p.coralFill} />
        <circle cx="26" cy="21.5" r="1.8" fill={p.yellowFill} />
        <circle cx="32" cy="21.5" r="1.8" fill={p.greenFill} />
        <motion.path
          d="M24 38 L34 45 L24 52"
          stroke={p.greenFill}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.65, delay, ease: DOODLE_INK_EASE }}
        />
        <motion.line
          x1="40"
          y1="52"
          x2="54"
          y2="52"
          stroke={p.yellowFill}
          strokeWidth="2.2"
          strokeLinecap="round"
          animate={p.prefersReduced ? undefined : { opacity: [1, 0.15, 1] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
    ),
  },
  {
    id: 'microchip',
    render: (p, delay) => (
      <svg viewBox="0 0 96 96" fill="none" className="w-full h-full overflow-visible">
        <path
          d="M36 16 V26 M48 16 V26 M60 16 V26 M36 70 V80 M48 70 V80 M60 70 V80 M16 36 H26 M16 48 H26 M16 60 H26 M70 36 H80 M70 48 H80 M70 60 H80"
          stroke={p.mutedInk}
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <rect x="26" y="26" width="44" height="44" rx="4" fill={p.softMint} stroke={p.ink} strokeWidth="1.6" />
        <motion.rect
          x="35"
          y="35"
          width="26"
          height="26"
          rx="2"
          fill={p.greenFill}
          fillOpacity="0.8"
          stroke={p.ink}
          strokeWidth="1.35"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.75, delay, ease: DOODLE_INK_EASE }}
        />
        <circle cx="48" cy="48" r="4" fill={p.yellowFill} stroke={p.ink} strokeWidth="1.1" />
      </svg>
    ),
  },
  {
    id: 'potted-sprout',
    render: (p, delay) => (
      <svg viewBox="0 0 90 96" fill="none" className="w-full h-full overflow-visible">
        <polygon points="30,54 60,54 55,82 35,82" fill={p.coralFill} stroke={p.ink} strokeWidth="1.5" strokeLinejoin="round" />
        <rect x="27" y="48" width="36" height="8" rx="2" fill={p.yellowFill} stroke={p.ink} strokeWidth="1.4" />
        <motion.path
          d="M45 48 V26"
          stroke={p.ink}
          strokeWidth="1.8"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay, ease: DOODLE_INK_EASE }}
        />
        <path d="M45 34 C32 32, 24 22, 26 16 C35 16, 43 24, 45 34 Z" fill={p.greenFill} stroke={p.ink} strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M45 28 C58 26, 66 16, 64 10 C55 10, 47 18, 45 28 Z" fill={p.greenFill} stroke={p.ink} strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'fountain-pen',
    render: (p, delay) => (
      <svg viewBox="0 0 96 96" fill="none" className="w-full h-full overflow-visible">
        <g transform="rotate(35 48 48)">
          <rect x="40" y="12" width="16" height="22" rx="2" fill={p.lavenderFill} stroke={p.ink} strokeWidth="1.5" />
          <motion.path
            d="M40 34 L34 58 L48 80 L62 58 L56 34 Z"
            fill={p.yellowFill}
            fillOpacity={p.isDark ? 0.6 : 0.85}
            stroke={p.ink}
            strokeWidth="1.55"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.78, delay, ease: DOODLE_INK_EASE }}
          />
          <line x1="48" y1="80" x2="48" y2="54" stroke={p.ink} strokeWidth="1.4" />
          <circle cx="48" cy="52" r="2.6" fill={p.ink} />
        </g>
        <path d="M24 78 Q44 70 68 82" stroke={p.wheelPrimary} strokeWidth="1.7" strokeDasharray="3 4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'magnet',
    render: (p, delay) => (
      <svg viewBox="0 0 96 96" fill="none" className="w-full h-full overflow-visible">
        <motion.path
          d="M28 24 V52 C28 65, 37 74, 48 74 C59 74, 68 65, 68 52 V24 H56 V52 C56 58, 52.5 62, 48 62 C43.5 62, 40 58, 40 52 V24 Z"
          fill={p.coralFill}
          stroke={p.ink}
          strokeWidth="1.55"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay, ease: DOODLE_INK_EASE }}
        />
        <rect x="28" y="24" width="12" height="10" fill={p.softMint} stroke={p.ink} strokeWidth="1.4" />
        <rect x="56" y="24" width="12" height="10" fill={p.softMint} stroke={p.ink} strokeWidth="1.4" />
        <path d="M22 14 L25 18 M34 11 V17 M62 11 V17 M74 14 L71 18" stroke={p.wheelPrimary} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'stopwatch',
    render: (p) => (
      <svg viewBox="0 0 96 100" fill="none" className="w-full h-full overflow-visible">
        <rect x="42" y="14" width="12" height="8" rx="2" fill={p.yellowFill} stroke={p.ink} strokeWidth="1.4" />
        <line x1="68" y1="26" x2="74" y2="20" stroke={p.ink} strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="50" cy="56" r="28" transform="translate(2.5,2.5)" fill={p.softMint} />
        <circle cx="48" cy="54" r="28" fill={p.isDark ? '#1D2A20' : '#FCFDF9'} stroke={p.ink} strokeWidth="1.7" />
        <circle cx="48" cy="54" r="21" stroke={p.mutedInk} strokeWidth="1" strokeDasharray="2 5" />
        <motion.line
          x1="48"
          y1="54"
          x2="48"
          y2="37"
          stroke={p.coralFill}
          strokeWidth="2"
          strokeLinecap="round"
          animate={p.prefersReduced ? undefined : { rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '48px 54px' }}
        />
        <circle cx="48" cy="54" r="3" fill={p.greenFill} stroke={p.ink} strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    id: 'paper-boat',
    render: (p, delay) => (
      <svg viewBox="0 0 110 84" fill="none" className="w-full h-full overflow-visible">
        <polygon points="18,46 92,46 78,64 32,64" fill={p.skyFill} stroke={p.ink} strokeWidth="1.5" strokeLinejoin="round" />
        <polygon points="34,46 55,18 55,46" fill={p.softMint} stroke={p.ink} strokeWidth="1.5" strokeLinejoin="round" />
        <polygon points="55,18 76,46 55,46" fill={p.yellowFill} fillOpacity="0.8" stroke={p.ink} strokeWidth="1.5" strokeLinejoin="round" />
        <motion.path
          d="M12 72 Q26 67 40 72 T68 72 T96 72"
          stroke={p.wheelPrimary}
          strokeWidth="1.6"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay, ease: DOODLE_INK_EASE }}
        />
      </svg>
    ),
  },
  {
    id: 'hourglass',
    render: (p, delay) => (
      <svg viewBox="0 0 84 100" fill="none" className="w-full h-full overflow-visible">
        <path d="M22 16 H62 M22 84 H62" stroke={p.ink} strokeWidth="2.4" strokeLinecap="round" />
        <polygon points="28,20 56,20 42,48" fill={p.skyFill} fillOpacity="0.45" />
        <polygon points="42,52 28,80 56,80" fill={p.yellowFill} fillOpacity="0.7" />
        <motion.path
          d="M27 18 H57 L44 48 L57 82 H27 L40 48 Z"
          stroke={p.ink}
          strokeWidth="1.6"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay, ease: DOODLE_INK_EASE }}
        />
        <line x1="42" y1="50" x2="42" y2="70" stroke={p.yellowFill} strokeWidth="1.6" strokeDasharray="2 3" />
      </svg>
    ),
  },
  {
    id: 'prism-light',
    render: (p, delay) => (
      <svg viewBox="0 0 110 88" fill="none" className="w-full h-full overflow-visible">
        <line x1="8" y1="52" x2="41" y2="42" stroke={p.ink} strokeWidth="1.8" strokeLinecap="round" />
        <motion.polygon
          points="52,18 76,66 28,66"
          fill={p.skyFill}
          fillOpacity={p.isDark ? 0.35 : 0.6}
          stroke={p.ink}
          strokeWidth="1.6"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.78, delay, ease: DOODLE_INK_EASE }}
        />
        <path d="M64 42 L98 34" stroke={p.coralFill} strokeWidth="2" strokeLinecap="round" />
        <path d="M66 46 L98 46" stroke={p.yellowFill} strokeWidth="2" strokeLinecap="round" />
        <path d="M68 50 L98 58" stroke={p.greenFill} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'tangram',
    render: (p, delay) => (
      <svg viewBox="0 0 96 96" fill="none" className="w-full h-full overflow-visible">
        <polygon points="18,18 78,18 48,48" fill={p.greenFill} fillOpacity="0.82" stroke={p.ink} strokeWidth="1.4" strokeLinejoin="round" />
        <polygon points="18,18 48,48 18,78" fill={p.skyFill} stroke={p.ink} strokeWidth="1.4" strokeLinejoin="round" />
        <polygon points="48,48 63,33 78,48 63,63" fill={p.yellowFill} stroke={p.ink} strokeWidth="1.4" strokeLinejoin="round" />
        <polygon points="18,78 48,48 63,63 48,78" fill={p.coralFill} fillOpacity="0.85" stroke={p.ink} strokeWidth="1.4" strokeLinejoin="round" />
        <motion.rect
          x="18"
          y="18"
          width="60"
          height="60"
          stroke={p.ink}
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.75, delay, ease: DOODLE_INK_EASE }}
        />
      </svg>
    ),
  },
  {
    id: 'venn-diagram',
    render: (p, delay) => (
      <svg viewBox="0 0 110 80" fill="none" className="w-full h-full overflow-visible">
        <motion.circle
          cx="40"
          cy="40"
          r="24"
          fill={p.skyFill}
          fillOpacity="0.45"
          stroke={p.ink}
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.75, delay, ease: DOODLE_INK_EASE }}
        />
        <motion.circle
          cx="68"
          cy="40"
          r="24"
          fill={p.greenFill}
          fillOpacity="0.45"
          stroke={p.ink}
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.75, delay: delay + 0.08, ease: DOODLE_INK_EASE }}
        />
        <circle cx="54" cy="40" r="3" fill={p.yellowFill} stroke={p.ink} strokeWidth="1.1" />
      </svg>
    ),
  },
  {
    id: 'polyhedron',
    render: (p, delay) => (
      <svg viewBox="0 0 96 96" fill="none" className="w-full h-full overflow-visible">
        <polygon points="48,14 80,46 48,82 16,46" fill={p.softMint} />
        <polygon points="48,14 80,46 48,54" fill={p.greenFill} fillOpacity="0.7" />
        <polygon points="48,14 16,46 48,54" fill={p.skyFill} fillOpacity="0.7" />
        <motion.path
          d="M48 14 L80 46 L48 82 L16 46 Z M48 14 V82 M16 46 L48 54 L80 46"
          stroke={p.ink}
          strokeWidth="1.55"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay, ease: DOODLE_INK_EASE }}
        />
      </svg>
    ),
  },
  {
    id: 'glasses-bookmark',
    render: (p, delay) => (
      <svg viewBox="0 0 110 72" fill="none" className="w-full h-full overflow-visible">
        <motion.circle
          cx="32"
          cy="38"
          r="15"
          fill={p.skyFill}
          fillOpacity="0.3"
          stroke={p.ink}
          strokeWidth="1.75"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.7, delay, ease: DOODLE_INK_EASE }}
        />
        <motion.circle
          cx="78"
          cy="38"
          r="15"
          fill={p.skyFill}
          fillOpacity="0.3"
          stroke={p.ink}
          strokeWidth="1.75"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.7, delay: delay + 0.06, ease: DOODLE_INK_EASE }}
        />
        <path d="M47 36 C51 31, 59 31, 63 36 M17 36 L10 30 M93 36 L100 30" stroke={p.ink} strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'balloon',
    render: (p, delay) => (
      <svg viewBox="0 0 90 106" fill="none" className="w-full h-full overflow-visible">
        <motion.path
          d="M45 14 C62 14, 72 28, 68 44 C64 56, 54 64, 51 70 H39 C36 64, 26 56, 22 44 C18 28, 28 14, 45 14 Z"
          fill={p.coralFill}
          fillOpacity="0.85"
          stroke={p.ink}
          strokeWidth="1.55"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay, ease: DOODLE_INK_EASE }}
        />
        <path d="M45 14 C36 28, 36 52, 41 70 M45 14 C54 28, 54 52, 49 70" stroke={p.yellowFill} strokeWidth="1.4" />
        <line x1="40" y1="70" x2="41" y2="79" stroke={p.mutedInk} strokeWidth="1.2" />
        <line x1="50" y1="70" x2="49" y2="79" stroke={p.mutedInk} strokeWidth="1.2" />
        <rect x="38" y="79" width="14" height="10" rx="2" fill={p.yellowFill} stroke={p.ink} strokeWidth="1.35" />
      </svg>
    ),
  },
  {
    id: 'guitar-pick',
    render: (p, delay) => (
      <svg viewBox="0 0 96 96" fill="none" className="w-full h-full overflow-visible">
        <path
          d="M48 16 C68 16, 78 30, 72 50 C66 68, 54 80, 48 82 C42 80, 30 68, 24 50 C18 30, 28 16, 48 16 Z"
          transform="translate(3,3)"
          fill={p.softMint}
        />
        <motion.path
          d="M48 14 C68 14, 78 28, 72 48 C66 66, 54 78, 48 80 C42 78, 30 66, 24 48 C18 28, 28 14, 48 14 Z"
          fill={p.lavenderFill}
          fillOpacity={p.isDark ? 0.6 : 0.85}
          stroke={p.ink}
          strokeWidth="1.55"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.78, delay, ease: DOODLE_INK_EASE }}
        />
        <path d="M42 52 V34 L56 31 V49" stroke={p.ink} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="39" cy="53" r="3.4" fill={p.greenFill} stroke={p.ink} strokeWidth="1.2" />
        <circle cx="53" cy="50" r="3.4" fill={p.greenFill} stroke={p.ink} strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    id: 'spiral-notebook',
    render: (p, delay) => (
      <svg viewBox="0 0 90 96" fill="none" className="w-full h-full overflow-visible">
        <rect x="22" y="16" width="54" height="66" rx="3" transform="translate(3,3)" fill={p.softMint} />
        <motion.rect
          x="20"
          y="14"
          width="54"
          height="66"
          rx="3"
          fill={p.isDark ? '#223326' : '#FFFDF6'}
          stroke={p.ink}
          strokeWidth="1.55"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.75, delay, ease: DOODLE_INK_EASE }}
        />
        {[24, 34, 44, 54, 64, 72].map((y) => (
          <path key={y} d={`M14 ${y} C14 ${y - 3}, 24 ${y - 3}, 24 ${y}`} stroke={p.ink} strokeWidth="1.45" strokeLinecap="round" />
        ))}
        <path d="M32 30 H62 M32 42 H60 M32 54 H54" stroke={p.mutedInk} strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="58" cy="64" r="5" fill={p.greenFill} stroke={p.ink} strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    id: 'orbit-eclipse',
    render: (p, delay) => (
      <svg viewBox="0 0 96 96" fill="none" className="w-full h-full overflow-visible">
        <circle cx="48" cy="48" r="30" stroke={p.mutedInk} strokeWidth="1.2" strokeDasharray="3 5" />
        <circle cx="48" cy="48" r="14" fill={p.yellowFill} stroke={p.ink} strokeWidth="1.5" />
        <circle cx="54" cy="44" r="12" fill={p.isDark ? '#162018' : '#F7F9F3'} />
        <motion.circle
          cx="78"
          cy="48"
          r="4.5"
          fill={p.skyFill}
          stroke={p.ink}
          strokeWidth="1.2"
          initial={{ scale: 0.6 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay, ease: DOODLE_INK_EASE }}
        />
      </svg>
    ),
  },
];
