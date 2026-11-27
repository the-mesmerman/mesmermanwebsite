import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
} from 'motion/react';

export const CALM_EASE = [0.22, 1, 0.36, 1] as const;
export const ZOOM_SETTLE_EASE = [0.16, 1, 0.3, 1] as const;

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

interface IntroRevealContextValue {
  isIntroBlocking: boolean;
  introRevealDelay: number;
  slideDistance: number;
}

const IntroRevealContext = createContext<IntroRevealContextValue>({
  isIntroBlocking: false,
  introRevealDelay: 0,
  slideDistance: 64,
});

function getResponsiveSlideDistance(width: number): number {
  if (width < 640) return 28;
  if (width < 1024) return 48;
  return 68;
}

export const IntroRevealProvider: React.FC<{
  isIntroBlocking: boolean;
  introRevealDelay: number;
  children: React.ReactNode;
}> = ({ isIntroBlocking, introRevealDelay, children }) => {
  const prefersReduced = useReducedMotion();
  const [rawSlide, setRawSlide] = useState<number>(() =>
    typeof window !== 'undefined'
      ? getResponsiveSlideDistance(window.innerWidth)
      : 64,
  );

  useEffect(() => {
    const onResize = () => {
      setRawSlide(getResponsiveSlideDistance(window.innerWidth));
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const slideDistance = prefersReduced ? 0 : rawSlide;

  return (
    <IntroRevealContext.Provider
      value={{ isIntroBlocking, introRevealDelay, slideDistance }}
    >
      {children}
    </IntroRevealContext.Provider>
  );
};

export function useIntroReveal(): IntroRevealContextValue {
  return useContext(IntroRevealContext);
}

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
  direction?: 'up' | 'left' | 'right';
  immediate?: boolean;
}

/** Directional/scroll-triggered entrance synced with the intro zoom-in reveal */
export const RevealBlock: React.FC<RevealBlockProps> = ({
  children,
  className = '',
  delay = 0,
  y = 14,
  direction = 'up',
  immediate = false,
}) => {
  const prefersReduced = useReducedMotion();
  const { isIntroBlocking, introRevealDelay, slideDistance } = useIntroReveal();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  const initialX =
    direction === 'left'
      ? -slideDistance
      : direction === 'right'
        ? slideDistance
        : 0;
  const initialY = direction === 'up' ? y : 0;
  const totalDelay = introRevealDelay + delay;

  const activeTransition =
    direction === 'up'
      ? { ...SPRING_FLUID, delay: totalDelay }
      : { duration: 0.82, delay: totalDelay, ease: ZOOM_SETTLE_EASE };

  if (immediate) {
    return (
      <motion.div
        initial={{ opacity: 0, x: initialX, y: initialY, scale: 0.97 }}
        animate={
          isIntroBlocking
            ? { opacity: 0, x: initialX, y: initialY, scale: 0.97 }
            : { opacity: 1, x: 0, y: 0, scale: 1 }
        }
        transition={isIntroBlocking ? { duration: 0 } : activeTransition}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: initialX, y: initialY, scale: 0.985 }}
      whileInView={
        isIntroBlocking ? undefined : { opacity: 1, x: 0, y: 0, scale: 1 }
      }
      viewport={{ once: true, amount: 0.15 }}
      transition={activeTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
};
