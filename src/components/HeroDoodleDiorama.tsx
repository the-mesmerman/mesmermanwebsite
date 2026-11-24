import React, { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

const INK_EASE = [0.22, 1, 0.36, 1] as const;

interface HeroDoodleDioramaProps {
  isDark: boolean;
}

export const HeroDoodleDiorama: React.FC<HeroDoodleDioramaProps> = ({ isDark }) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, nx: 0, ny: 0 });
  const [planeFlight, setPlaneFlight] = useState(0);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReduced || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rx: -ny * 18,
      ry: nx * 20,
      nx,
      ny,
    });
  };

  const handlePointerLeave = () => {
    setTilt({ rx: 0, ry: 0, nx: 0, ny: 0 });
  };

  const handleLaunchPlane = () => {
    setPlaneFlight((n) => n + 1);
  };

  const mintBlock = isDark ? '#26422B' : '#CEF2CE';
  const skyBlock = isDark ? '#223D52' : '#D0EBFF';
  const leafMid = isDark ? '#54C261' : '#6CE076';
  const leafLight = isDark ? '#7CE687' : '#9BF0A1';
  const inkStroke = isDark ? '#E4EFE3' : '#1E3D24';
  const mutedInk = isDark ? '#97B49A' : '#4E7054';
  const gridLine = isDark ? 'rgba(125, 227, 134, 0.16)' : 'rgba(56, 148, 66, 0.14)';

  return (
    <div className="border border-[#C9E1C7] dark:border-[#314735] bg-[#FCFDF9] dark:bg-[#1D2A20] rounded-none">
      <div
        ref={stageRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={handleLaunchPlane}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleLaunchPlane();
          }
        }}
        aria-label="Interactive 3D botanical sketchbook doodle — move pointer to tilt or click to fly the paper plane"
        className="relative aspect-[4/3] w-full overflow-hidden cursor-pointer select-none [perspective:800px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4F9D58]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-3 border border-dashed border-[#C9E1C7] dark:border-[#314735]"
        />

        <div
          className="relative w-full h-full transition-transform duration-200 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          }}
        >
          {/* Layer 1 (Back depth plane): Grid, pastel mint & sky blocks, puffy sky cloud */}
          <svg
            viewBox="0 0 440 330"
            fill="none"
            className="absolute inset-0 w-full h-full pointer-events-none transition-transform duration-200 ease-out"
            style={{
              transform: `translate3d(${tilt.nx * -10}px, ${tilt.ny * -8}px, -28px) scale(1.04)`,
            }}
          >
            {[80, 140, 200, 260, 320, 380].map((x) => (
              <line key={`vx-${x}`} x1={x} y1="24" x2={x} y2="306" stroke={gridLine} strokeWidth="1" />
            ))}
            {[75, 135, 195, 255].map((y) => (
              <line key={`hy-${y}`} x1="24" y1={y} x2="416" y2={y} stroke={gridLine} strokeWidth="1" />
            ))}

            {/* Light green & sky color-block backdrop patches */}
            <rect x="44" y="48" width="166" height="198" fill={mintBlock} opacity="0.85" />
            <rect x="234" y="138" width="154" height="134" fill={skyBlock} opacity="0.72" />

            {/* Sun circle accent behind blossom */}
            <circle cx="174" cy="56" r="25" fill="#FFDC62" opacity={isDark ? 0.36 : 0.85} />

            {/* Soft 3D offset cloud */}
            <path
              d="M92 92 C92 78, 114 75, 122 86 C132 78, 152 84, 150 97 C157 99, 158 110, 147 111 L89 111 C79 111, 79 95, 92 92 Z"
              fill="#9ED6FC"
              transform="translate(4, 4)"
            />
            <path
              d="M92 92 C92 78, 114 75, 122 86 C132 78, 152 84, 150 97 C157 99, 158 110, 147 111 L89 111 C79 111, 79 95, 92 92 Z"
              fill={isDark ? '#2A3F4F' : '#FFFFFF'}
            />
            <motion.path
              d="M92 92 C92 78, 114 75, 122 86 C132 78, 152 84, 150 97 C157 99, 158 110, 147 111 L89 111 C79 111, 79 95, 92 92 Z"
              stroke={mutedInk}
              strokeWidth="1.3"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9, delay: 0.1, ease: INK_EASE }}
            />
          </svg>

          {/* Layer 2 (Mid depth plane): Vibrant green botanical branch + blossom, 3D colored cube, open sketchbook & yellow pencil */}
          <svg
            viewBox="0 0 440 330"
            fill="none"
            className="absolute inset-0 w-full h-full pointer-events-none transition-transform duration-200 ease-out"
            style={{
              transform: `translate3d(${tilt.nx * 8}px, ${tilt.ny * 6}px, 22px)`,
            }}
          >
            {/* Colorful 3D Isometric Cube */}
            <g transform="translate(278, 162)">
              <polygon points="48,14 86,34 48,54 10,34" fill="#7DE586" />
              <polygon points="10,34 48,54 48,98 10,78" fill="#82C9FA" />
              <polygon points="48,54 86,34 86,78 48,98" fill="#FFD552" />
              <motion.path
                d="M48 14 L86 34 L86 78 L48 98 L10 78 L10 34 Z"
                stroke={inkStroke}
                strokeWidth="1.45"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.85, delay: 0.15, ease: INK_EASE }}
              />
              <motion.path
                d="M10 34 L48 54 L86 34 M48 54 L48 98 M29 24 L67 44 M67 24 L29 44"
                stroke={inkStroke}
                strokeWidth="1.15"
                strokeLinecap="round"
                opacity="0.72"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.7, delay: 0.35, ease: INK_EASE }}
              />
            </g>

            {/* Open Notebook + Coral Bookmark + Sunny Pencil */}
            <g transform="translate(178, 222)">
              <rect x="6" y="6" width="84" height="54" fill="#84E38E" opacity="0.75" />
              <rect
                x="0"
                y="0"
                width="84"
                height="54"
                fill={isDark ? '#1D2A20' : '#FFFDF5'}
                stroke={inkStroke}
                strokeWidth="1.35"
              />
              <polygon points="60,0 67,0 67,18 63.5,14 60,18" fill="#FF8C7A" />
              <line x1="42" y1="0" x2="42" y2="54" stroke={inkStroke} strokeWidth="1.2" />
              <motion.path
                d="M10 15 H34 M10 24 H31 M10 33 H28 M50 24 H70 M50 33 H64"
                stroke={mutedInk}
                strokeWidth="1.2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.75, delay: 0.3, ease: INK_EASE }}
              />
              {/* Tiny yellow pencil resting beside notebook */}
              <g transform="translate(-28, 34) rotate(-20)">
                <polygon points="0,8 28,8 34,11 28,14 0,14" fill="#FFD34D" stroke={inkStroke} strokeWidth="1.2" strokeLinejoin="round" />
                <rect x="-5" y="8" width="5" height="6" fill="#FF8C7A" stroke={inkStroke} strokeWidth="1.2" />
              </g>
            </g>

            {/* Main Botanical Branch with Vibrant Meadow-Green Leaves & Coral Blossom */}
            <motion.g
              animate={prefersReduced ? undefined : { rotate: [0, 1.4, 0, -1, 0] }}
              transition={{ duration: 6.8, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: '108px 282px' }}
            >
              <g transform="translate(4, 4)">
                <path
                  d="M108 195 C80 184, 70 158, 92 146 C108 158, 114 176, 108 195 Z"
                  fill="#B7EAB9"
                />
                <path
                  d="M124 156 C142 132, 174 132, 180 154 C162 168, 140 168, 124 156 Z"
                  fill="#A2D6F5"
                  opacity="0.7"
                />
                <path
                  d="M126 118 C108 92, 126 68, 148 76 C148 98, 140 112, 126 118 Z"
                  fill="#FCE292"
                  opacity="0.85"
                />
              </g>

              {/* Leaves filled with cheerful light greens */}
              <path
                d="M108 195 C80 184, 70 158, 92 146 C108 158, 114 176, 108 195 Z"
                fill={leafMid}
              />
              <path
                d="M124 156 C142 132, 174 132, 180 154 C162 168, 140 168, 124 156 Z"
                fill={leafLight}
              />
              <path
                d="M126 118 C108 92, 126 68, 148 76 C148 98, 140 112, 126 118 Z"
                fill={leafMid}
              />

              {/* Ink outlines */}
              <motion.path
                d="M108 282 C104 232, 114 176, 134 110 C142 86, 158 70, 172 58"
                stroke={inkStroke}
                strokeWidth="1.65"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, ease: INK_EASE }}
              />
              <motion.path
                d="M108 195 C80 184, 70 158, 92 146 C108 158, 114 176, 108 195 Z"
                stroke={inkStroke}
                strokeWidth="1.4"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.65, delay: 0.22, ease: INK_EASE }}
              />
              <path d="M106 190 C98 175, 95 162, 92 150" stroke={inkStroke} strokeWidth="1.05" strokeLinecap="round" />

              <motion.path
                d="M124 156 C142 132, 174 132, 180 154 C162 168, 140 168, 124 156 Z"
                stroke={inkStroke}
                strokeWidth="1.4"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.65, delay: 0.34, ease: INK_EASE }}
              />
              <path d="M128 155 C145 151, 160 151, 174 153" stroke={inkStroke} strokeWidth="1.05" strokeLinecap="round" />

              <motion.path
                d="M126 118 C108 92, 126 68, 148 76 C148 98, 140 112, 126 118 Z"
                stroke={inkStroke}
                strokeWidth="1.4"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.65, delay: 0.45, ease: INK_EASE }}
              />

              {/* Coral & sunny yellow botanical blossom */}
              <g transform="translate(174, 56)">
                <circle cx="0" cy="-7" r="4.8" fill="#FF9282" stroke={inkStroke} strokeWidth="1.2" />
                <circle cx="7" cy="0" r="4.8" fill="#FF9282" stroke={inkStroke} strokeWidth="1.2" />
                <circle cx="0" cy="7" r="4.8" fill="#FF9282" stroke={inkStroke} strokeWidth="1.2" />
                <circle cx="-7" cy="0" r="4.8" fill="#FF9282" stroke={inkStroke} strokeWidth="1.2" />
                <circle cx="0" cy="0" r="3.4" fill="#FFD34D" stroke={inkStroke} strokeWidth="1.2" />
              </g>
            </motion.g>
          </svg>

          {/* Layer 3 (Foreground depth plane): Sky-blue 3D Origami Paper Plane + Sunny Gold Stars */}
          <svg
            viewBox="0 0 440 330"
            fill="none"
            className="absolute inset-0 w-full h-full pointer-events-none transition-transform duration-200 ease-out"
            style={{
              transform: `translate3d(${tilt.nx * 20}px, ${tilt.ny * 16}px, 52px)`,
            }}
          >
            <motion.path
              d="M214 148 C242 132, 266 106, 294 84"
              stroke="#FF8675"
              strokeWidth="1.65"
              strokeDasharray="4 5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.35, ease: INK_EASE }}
            />

            <motion.g
              key={planeFlight}
              initial={planeFlight > 0 ? { x: -24, y: 18, rotate: -10 } : false}
              animate={{
                x: 0,
                y: prefersReduced ? 0 : [0, -3.5, 0],
                rotate: 0,
              }}
              transition={
                planeFlight > 0
                  ? { duration: 0.75, ease: INK_EASE }
                  : { duration: 4.8, repeat: Infinity, ease: 'easeInOut' }
              }
              style={{ transformOrigin: '318px 72px' }}
            >
              <polygon
                points="286,74 344,50 322,98 308,82"
                transform="translate(4, 5)"
                fill="#8CE594"
                opacity="0.8"
              />
              <polygon
                points="286,74 344,50 322,98 308,82"
                fill="#A3D8FC"
                stroke={inkStroke}
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <polygon
                points="308,82 344,50 315,90"
                fill="#63B5F0"
                stroke={inkStroke}
                strokeWidth="1.15"
                strokeLinejoin="round"
              />
            </motion.g>

            {/* Golden 4-point stars */}
            <motion.path
              d="M238 66 L240 73 L247 75 L240 77 L238 84 L236 77 L229 75 L236 73 Z"
              stroke={inkStroke}
              strokeWidth="1.2"
              strokeLinejoin="round"
              fill="#FFD34D"
              animate={prefersReduced ? undefined : { scale: [1, 1.14, 1] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: '238px 75px' }}
            />
            <path
              d="M366 132 L367.5 136.5 L372 138 L367.5 139.5 L366 144 L364.5 139.5 L360 138 L364.5 136.5 Z"
              fill="#FF9282"
              stroke={inkStroke}
              strokeWidth="1.1"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Subtle Caption Strip */}
      <div className="border-t border-[#BFE2BD] dark:border-[#314735] px-4 py-2.5 flex items-center justify-between gap-3 bg-[#E2F6DF] dark:bg-[#19261C]">
        <span className="font-mono text-[11px] text-[#3F6343] dark:text-[#9FB5A1]">
          Sketchbook · 3D Doodle Study
        </span>
      </div>
    </div>
  );
};
