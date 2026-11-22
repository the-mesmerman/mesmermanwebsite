import React, { useEffect, useRef } from 'react';

interface AmbientBackgroundProps {
  isDark: boolean;
}

interface PolyMote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  angle: number;
  spin: number;
  paletteIndex: number;
  phase: number;
  isPoly: boolean;
}

const DARK_POLY_COLORS = [
  'rgba(52, 211, 153, ALPHA)', // emerald
  'rgba(45, 212, 191, ALPHA)', // teal
  'rgba(163, 230, 53, ALPHA)', // lime leaf
  'rgba(251, 191, 36, ALPHA)', // sunlit amber
  'rgba(251, 113, 133, ALPHA)', // wildflower coral
];

const LIGHT_POLY_COLORS = [
  'rgba(5, 150, 105, ALPHA)', // emerald
  'rgba(13, 148, 136, ALPHA)', // teal
  'rgba(101, 163, 13, ALPHA)', // moss lime
  'rgba(217, 119, 6, ALPHA)', // warm amber
  'rgba(225, 29, 72, ALPHA)', // blossom coral
];

export const AmbientBackground: React.FC<AmbientBackgroundProps> = ({ isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDarkRef = useRef(isDark);
  isDarkRef.current = isDark;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let scrollY = window.scrollY;

    const createMotes = (w: number, h: number): PolyMote[] => {
      const count = Math.min(48, Math.max(22, Math.floor((w * h) / 30000)));
      const result: PolyMote[] = [];
      for (let i = 0; i < count; i++) {
        result.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 14,
          vy: (Math.random() - 0.5) * 14,
          size: 3 + Math.random() * 4.5,
          angle: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.6,
          paletteIndex: i % DARK_POLY_COLORS.length,
          phase: Math.random() * Math.PI * 2,
          isPoly: i % 3 === 0,
        });
      }
      return result;
    };

    let motes = createMotes(width, height);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      motes = createMotes(width, height);
    };

    resize();

    const onScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('scroll', onScroll, { passive: true });

    let rafId = 0;
    let lastTs = performance.now();
    let elapsed = 0;

    const render = (now: number) => {
      const dt = Math.min((now - lastTs) / 1000, 0.05);
      lastTs = now;
      if (!prefersReduced) {
        elapsed += dt;
      }

      const dark = isDarkRef.current;
      const palette = dark ? DARK_POLY_COLORS : LIGHT_POLY_COLORS;
      ctx.clearRect(0, 0, width, height);

      const parallaxOffset = (scrollY * 0.07) % height;

      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];
        if (!prefersReduced) {
          m.x += m.vx * dt;
          m.y += m.vy * dt;
          m.angle += m.spin * dt;

          if (m.x < -24) m.x = width + 24;
          if (m.x > width + 24) m.x = -24;
          if (m.y < -24) m.y = height + 24;
          if (m.y > height + 24) m.y = -24;
        }

        const drawX = m.x;
        const drawY = ((m.y - parallaxOffset) % height + height) % height;

        // Delicate botanical constellation threads
        for (let j = i + 1; j < motes.length; j++) {
          const other = motes[j];
          const ox = other.x;
          const oy = ((other.y - parallaxOffset) % height + height) % height;
          const dist = Math.hypot(drawX - ox, drawY - oy);
          const maxDist = 115;
          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * (dark ? 0.13 : 0.1);
            ctx.beginPath();
            ctx.moveTo(drawX, drawY);
            ctx.lineTo(ox, oy);
            ctx.strokeStyle = dark
              ? `rgba(52, 211, 153, ${lineAlpha})`
              : `rgba(5, 150, 105, ${lineAlpha})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }

        const twinkle = 0.65 + Math.sin(elapsed * 1.2 + m.phase) * 0.35;
        const alpha = (dark ? 0.34 : 0.25) * twinkle;
        const colorTemplate = palette[m.paletteIndex];

        if (m.isPoly) {
          // Low-poly diamond / leaf facet
          ctx.save();
          ctx.translate(drawX, drawY);
          ctx.rotate(m.angle);
          ctx.beginPath();
          ctx.moveTo(0, -m.size);
          ctx.lineTo(m.size * 0.72, 0);
          ctx.lineTo(0, m.size);
          ctx.lineTo(-m.size * 0.72, 0);
          ctx.closePath();
          ctx.fillStyle = colorTemplate.replace('ALPHA', (alpha * 0.85).toFixed(3));
          ctx.fill();
          ctx.strokeStyle = colorTemplate.replace('ALPHA', Math.min(0.6, alpha * 1.4).toFixed(3));
          ctx.lineWidth = 0.75;
          ctx.stroke();
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(drawX, drawY, m.size * 0.32, 0, Math.PI * 2);
          ctx.fillStyle = colorTemplate.replace('ALPHA', alpha.toFixed(3));
          ctx.fill();
        }
      }

      if (!prefersReduced) {
        rafId = requestAnimationFrame(render);
      }
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Subtle architectural botanical grid */}
      <div
        className="absolute inset-0 opacity-[0.4] dark:opacity-[0.3]"
        style={{
          backgroundImage: isDark
            ? 'linear-gradient(to right, rgba(110, 231, 183, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(110, 231, 183, 0.05) 1px, transparent 1px)'
            : 'linear-gradient(to right, rgba(5, 150, 105, 0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(5, 150, 105, 0.045) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage:
            'radial-gradient(ellipse 90% 80% at 50% 30%, black 30%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 90% 80% at 50% 30%, black 30%, transparent 100%)',
        }}
      />

      {/* Evenly spread nature-inspired atmospheric washes (emerald, teal, sunlit amber, soft coral) */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: isDark
            ? [
                'radial-gradient(ellipse 65% 55% at 15% 18%, rgba(16, 185, 129, 0.16), transparent 70%)',
                'radial-gradient(ellipse 55% 48% at 86% 20%, rgba(245, 158, 11, 0.11), transparent 70%)',
                'radial-gradient(ellipse 65% 55% at 52% 52%, rgba(20, 184, 166, 0.12), transparent 72%)',
                'radial-gradient(ellipse 55% 45% at 18% 84%, rgba(132, 204, 22, 0.1), transparent 70%)',
                'radial-gradient(ellipse 55% 45% at 84% 82%, rgba(251, 113, 133, 0.08), transparent 70%)',
              ].join(', ')
            : [
                'radial-gradient(ellipse 65% 55% at 15% 18%, rgba(16, 185, 129, 0.11), transparent 70%)',
                'radial-gradient(ellipse 55% 48% at 86% 20%, rgba(245, 158, 11, 0.09), transparent 70%)',
                'radial-gradient(ellipse 65% 55% at 52% 52%, rgba(20, 184, 166, 0.08), transparent 72%)',
                'radial-gradient(ellipse 55% 45% at 18% 84%, rgba(132, 204, 22, 0.08), transparent 70%)',
                'radial-gradient(ellipse 55% 45% at 84% 82%, rgba(249, 115, 22, 0.06), transparent 70%)',
              ].join(', '),
        }}
      />

      {/* Subtle Low-Poly Ridge Silhouette anchored at bottom */}
      <svg
        viewBox="0 0 1440 260"
        preserveAspectRatio="none"
        className="absolute bottom-0 inset-x-0 w-full h-36 sm:h-48 opacity-35 dark:opacity-30"
      >
        <polygon points="0,260 0,180 160,120 310,200 0,260" fill={isDark ? '#0D3B2E' : '#A7F3D0'} />
        <polygon points="160,120 310,200 470,110 160,120" fill={isDark ? '#115E59' : '#6EE7B7'} />
        <polygon points="310,200 470,110 640,210 310,200" fill={isDark ? '#064E3B' : '#99F6E4'} />
        <polygon points="470,110 640,210 820,95 470,110" fill={isDark ? '#0F766E' : '#5EEAD4'} />
        <polygon points="640,210 820,95 990,195 640,210" fill={isDark ? '#065F46' : '#A7F3D0'} />
        <polygon points="820,95 990,195 1170,115 820,95" fill={isDark ? '#047857' : '#BEF264'} />
        <polygon points="990,195 1170,115 1320,185 990,195" fill={isDark ? '#115E59' : '#6EE7B7'} />
        <polygon points="1170,115 1320,185 1440,130 1440,260 990,195" fill={isDark ? '#064E3B' : '#99F6E4'} />
        <polygon points="0,260 310,200 640,210 990,195 1440,260" fill={isDark ? '#06110D' : '#F6FAF7'} opacity="0.55" />
      </svg>

      {/* Drifting Low-Poly Botanical Shards & Firefly Motes */}
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
