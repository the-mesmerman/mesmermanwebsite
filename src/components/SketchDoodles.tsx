import React from 'react';
import { motion } from 'motion/react';

const INK_EASE = [0.22, 1, 0.36, 1] as const;

interface DoodleProps {
  className?: string;
}

/** Colorful 3D-layered botanical leaf sprig with fresh meadow-green fills */
export const DoodleLeafSprig: React.FC<DoodleProps> = ({ className = 'w-8 h-8' }) => (
  <motion.svg
    viewBox="0 0 40 40"
    fill="none"
    aria-hidden="true"
    className={`overflow-visible ${className}`}
    whileHover={{ rotate: -8, y: -1.5 }}
    transition={{ duration: 0.24, ease: INK_EASE }}
  >
    {/* Offset 3D light-mint shadow layer */}
    <g transform="translate(2.5, 2.5)">
      <path
        d="M9 32 C12 22, 18 14, 31 8 C29 20, 22 27, 9 32 Z"
        fill="#BCEEC0"
      />
      <path
        d="M15 21 C12 16, 10 12, 11 8 C15 10, 18 13, 18 18 Z"
        fill="#FFE270"
      />
    </g>
    {/* Bright meadow-green inner leaf fills */}
    <path
      d="M9 32 C12 22, 18 14, 31 8 C29 20, 22 27, 9 32 Z"
      fill="#6CE076"
      fillOpacity="0.82"
    />
    <path
      d="M15 21 C11 16, 10 11, 11 8 C15 10, 18 13, 18 18 Z"
      fill="#9AF0A2"
      fillOpacity="0.9"
    />
    {/* Crisp botanical stem & outlines */}
    <motion.path
      d="M7 34 C12 25, 20 16, 31 8"
      stroke="#236B2C"
      strokeWidth="1.5"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65, ease: INK_EASE }}
    />
    <motion.path
      d="M9 32 C12 22, 18 14, 31 8 C29 20, 22 27, 9 32 Z"
      stroke="#236B2C"
      strokeWidth="1.45"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.1, ease: INK_EASE }}
    />
    <motion.path
      d="M15 21 C11 16, 10 11, 11 8 C15 10, 18 13, 18 18"
      stroke="#236B2C"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: 0.2, ease: INK_EASE }}
    />
  </motion.svg>
);

/** Colorful 3D isometric hand-drawn cube doodle */
export const DoodleIsoCube: React.FC<DoodleProps> = ({ className = 'w-7 h-7' }) => (
  <motion.svg
    viewBox="0 0 36 36"
    fill="none"
    aria-hidden="true"
    className={`overflow-visible ${className}`}
    whileHover={{ y: -2, rotate: 5 }}
    transition={{ duration: 0.22, ease: INK_EASE }}
  >
    <polygon points="18,5 29,11.5 18,18 7,11.5" fill="#7CE585" />
    <polygon points="7,11.5 18,18 18,31 7,24.5" fill="#82C9FA" />
    <polygon points="18,18 29,11.5 29,24.5 18,31" fill="#FFD552" />
    <motion.path
      d="M18 5 L29 11.5 L29 24.5 L18 31 L7 24.5 L7 11.5 Z"
      stroke="#1F3A24"
      strokeWidth="1.4"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: INK_EASE }}
    />
    <motion.path
      d="M7 11.5 L18 18 L29 11.5 M18 18 L18 31"
      stroke="#1F3A24"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: 0.15, ease: INK_EASE }}
    />
  </motion.svg>
);

/** Colorful 3D folded origami paper plane doodle */
export const DoodlePaperPlane: React.FC<DoodleProps> = ({ className = 'w-7 h-7' }) => (
  <motion.svg
    viewBox="0 0 36 36"
    fill="none"
    aria-hidden="true"
    className={`overflow-visible ${className}`}
    whileHover={{ x: 2.5, y: -2 }}
    transition={{ duration: 0.22, ease: INK_EASE }}
  >
    <polygon
      points="6,19 31,8 22,29 16,22"
      transform="translate(2, 2.5)"
      fill="#BCEEC0"
    />
    <polygon points="5,18 30,8 21,29 15.5,21.5" fill="#9ED6FC" />
    <polygon points="15.5,21.5 30,8 19,26" fill="#63B5F0" />
    <motion.path
      d="M5 18 L30 8 L21 29 L15.5 21.5 Z"
      stroke="#1F3A24"
      strokeWidth="1.4"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65, ease: INK_EASE }}
    />
    <motion.path
      d="M30 8 L15.5 21.5"
      stroke="#1F3A24"
      strokeWidth="1.25"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: 0.18, ease: INK_EASE }}
    />
  </motion.svg>
);

/** Colorful 3D open sketchbook / book doodle with coral bookmark */
export const DoodleOpenBook: React.FC<DoodleProps> = ({ className = 'w-7 h-7' }) => (
  <motion.svg
    viewBox="0 0 38 36"
    fill="none"
    aria-hidden="true"
    className={`overflow-visible ${className}`}
    whileHover={{ y: -2 }}
    transition={{ duration: 0.22, ease: INK_EASE }}
  >
    <path
      d="M7 10 C12 8, 16 9, 19 12 C22 9, 26 8, 31 10 L31 27 C26 25, 22 26, 19 28 C16 26, 12 25, 7 27 Z"
      transform="translate(2.5, 2.5)"
      fill="#8CE594"
    />
    <path
      d="M6 9.5 C11 7.8, 15.5 8.8, 19 11.5 C22.5 8.8, 27 7.8, 32 9.5 L32 26.5 C27 24.8, 22.5 25.8, 19 28 C15.5 25.8, 11 24.8, 6 26.5 Z"
      fill="#FFFDF5"
    />
    {/* Coral bookmark */}
    <polygon points="24,9 27,8.7 27,18 25.5,16.2 24,18" fill="#FF8C7A" />
    <motion.path
      d="M6 9.5 C11 7.8, 15.5 8.8, 19 11.5 C22.5 8.8, 27 7.8, 32 9.5 L32 26.5 C27 24.8, 22.5 25.8, 19 28 C15.5 25.8, 11 24.8, 6 26.5 Z"
      stroke="#1F3A24"
      strokeWidth="1.4"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: INK_EASE }}
    />
    <motion.path
      d="M19 11.5 L19 28 M10.5 14 L15 14.5 M10.5 18.5 L15 19 M23 20 L27.5 19.5"
      stroke="#389442"
      strokeWidth="1.25"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2, ease: INK_EASE }}
    />
  </motion.svg>
);

/** Colorful sunny-yellow notebook pencil doodle */
export const DoodlePencil: React.FC<DoodleProps> = ({ className = 'w-7 h-7' }) => (
  <motion.svg
    viewBox="0 0 36 36"
    fill="none"
    aria-hidden="true"
    className={`overflow-visible ${className}`}
    whileHover={{ rotate: 8, y: -1.5 }}
    transition={{ duration: 0.22, ease: INK_EASE }}
  >
    <polygon
      points="9,27 11,20 24,7 29,12 16,25"
      transform="translate(2.2, 2.2)"
      fill="#BCEEC0"
    />
    {/* Yellow pencil shaft */}
    <polygon points="10.5,20.5 21,10 26,15 15.5,25.5" fill="#FFD34D" />
    {/* Coral eraser */}
    <polygon points="21,10 24,7 29,12 26,15" fill="#FF8C7A" />
    {/* Wood tip */}
    <polygon points="8,28 10.5,20.5 15.5,25.5" fill="#FFE7B3" />
    <motion.path
      d="M8 28 L10.5 20.5 L24 7 L29 12 L15.5 25.5 Z"
      stroke="#1F3A24"
      strokeWidth="1.4"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65, ease: INK_EASE }}
    />
    <motion.path
      d="M21 10 L26 15 M10.5 20.5 L15.5 25.5"
      stroke="#1F3A24"
      strokeWidth="1.25"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.2, ease: INK_EASE }}
    />
  </motion.svg>
);

/** Colorful layered 3D wildflower doodle */
export const DoodleTinyFlower: React.FC<DoodleProps> = ({ className = 'w-6 h-6' }) => (
  <motion.svg
    viewBox="0 0 32 32"
    fill="none"
    aria-hidden="true"
    className={`overflow-visible ${className}`}
    whileHover={{ rotate: 24, scale: 1.08 }}
    transition={{ duration: 0.25, ease: INK_EASE }}
  >
    <g transform="translate(2, 2)">
      <circle cx="16" cy="9" r="3.4" fill="#BCEEC0" />
      <circle cx="22.5" cy="15.5" r="3.4" fill="#BCEEC0" />
      <circle cx="16" cy="22" r="3.4" fill="#BCEEC0" />
      <circle cx="9.5" cy="15.5" r="3.4" fill="#BCEEC0" />
    </g>
    <circle cx="16" cy="9.5" r="3.3" fill="#FF9D8E" />
    <circle cx="22" cy="15.5" r="3.3" fill="#FF9D8E" />
    <circle cx="16" cy="21.5" r="3.3" fill="#FF9D8E" />
    <circle cx="10" cy="15.5" r="3.3" fill="#FF9D8E" />
    <motion.path
      d="M16 12 C14 7, 18 7, 16 12 C21 10, 21 14, 16 16 C21 18, 18 22, 16 19 C14 22, 11 18, 16 16 C11 14, 11 10, 16 12 Z"
      stroke="#236B2C"
      strokeWidth="1.3"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: INK_EASE }}
    />
    <circle cx="16" cy="15.5" r="2.3" fill="#FFD34D" stroke="#236B2C" strokeWidth="1.05" />
  </motion.svg>
);
