import React from 'react';
import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
} from 'motion/react';

export const CALM_EASE = [0.22, 1, 0.36, 1] as const;

export const SPRING_FLUID = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 28,
  mass: 0.85,
};

export const SPRING_SNAPPY = {
  type: 'spring' as const,
  stiffness: 420,
  damping: 32,
  mass: 0.72,
};

interface ReactiveSurfaceProps {
  as?: 'div' | 'article' | 'section' | 'button';
  children: React.ReactNode;
  className?: string;
  id?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: React.MouseEventHandler<HTMLElement>;
  initial?: HTMLMotionProps<'div'>['initial'];
  animate?: HTMLMotionProps<'div'>['animate'];
  whileInView?: HTMLMotionProps<'div'>['whileInView'];
  exit?: HTMLMotionProps<'div'>['exit'];
  viewport?: HTMLMotionProps<'div'>['viewport'];
  transition?: HTMLMotionProps<'div'>['transition'];
  layout?: boolean | 'position' | 'size' | 'preserve-aspect';
  hoverLift?: boolean;
}

/**
 * Clean minimalist card/tile surface with crisp border/lift hover physics
 * and no cursor-glow or radial sheen effects.
 */
export const ReactiveSurface: React.FC<ReactiveSurfaceProps> = ({
  as = 'div',
  children,
  className = '',
  id,
  type = 'button',
  onClick,
  initial,
  animate,
  whileInView,
  exit,
  viewport,
  transition,
  layout,
  hoverLift = false,
}) => {
  const prefersReduced = useReducedMotion();

  const sharedProps = {
    id,
    onClick,
    initial,
    animate,
    whileInView,
    exit,
    viewport,
    transition,
    layout,
    whileHover:
      hoverLift && !prefersReduced
        ? {
            y: -2,
            transition: { duration: 0.16, ease: CALM_EASE },
          }
        : undefined,
    className: `relative ${className}`,
  };

  if (as === 'button') {
    return (
      <motion.button type={type} {...sharedProps}>
        {children}
      </motion.button>
    );
  }

  if (as === 'article') {
    return <motion.article {...sharedProps}>{children}</motion.article>;
  }

  if (as === 'section') {
    return <motion.section {...sharedProps}>{children}</motion.section>;
  }

  return <motion.div {...sharedProps}>{children}</motion.div>;
};

interface RevealBlockProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  immediate?: boolean;
}

/** Scroll-triggered (or immediate hero) depth & spring entrance for headings/sections */
export const RevealBlock: React.FC<RevealBlockProps> = ({
  children,
  className = '',
  delay = 0,
  y = 14,
  immediate = false,
}) => {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  if (immediate) {
    return (
      <motion.div
        initial={{ opacity: 0, y, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ ...SPRING_FLUID, delay }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y, scale: 0.99 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ ...SPRING_FLUID, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
