import React, { useEffect, useRef } from 'react';

interface AmbientNatureCanvasProps {
  isDark: boolean;
}

type MotifKind = 'leaf' | 'square' | 'flower' | 'kite' | 'star';

interface FloatingMotif {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  angle: number;
  spin: number;
  swayPhase: number;
  swaySpeed: number;
  depth: number; // 0.35..1.0 parallax factor
  kind: MotifKind;
  fillLight: string;
  fillDark: string;
  accentLight: string;
  accentDark: string;
}

interface SquareRipple {
  x: number;
  y: number;
  age: number;
  duration: number;
}

const PALETTE = [
  {
    fillLight: '#6CE076',
    fillDark: '#47B553',
    accentLight: '#BCEEC0',
    accentDark: '#2A5C32',
  },
  {
    fillLight: '#9AF0A2',
    fillDark: '#63CE6C',
    accentLight: '#D8F6DA',
    accentDark: '#2A4F31',
  },
  {
    fillLight: '#FFD44D',
    fillDark: '#E6B635',
    accentLight: '#FFF0A8',
    accentDark: '#5B491C',
  },
  {
    fillLight: '#7BC5FA',
    fillDark: '#4B9EE0',
    accentLight: '#CDE9FE',
    accentDark: '#224563',
  },
  {
    fillLight: '#FF9282',
    fillDark: '#D97263',
    accentLight: '#FFD3CC',
    accentDark: '#592D27',
  },
];

const MOTIF_KINDS: MotifKind[] = ['leaf', 'square', 'leaf', 'flower', 'kite', 'square', 'star'];

function createMotif(width: number, height: number, randomY = true): FloatingMotif {
  const palette = PALETTE[Math.floor(Math.random() * PALETTE.length)];
  const kind = MOTIF_KINDS[Math.floor(Math.random() * MOTIF_KINDS.length)];
  const depth = 0.4 + Math.random() * 0.6;
  return {
    x: Math.random() * width,
    y: randomY ? Math.random() * height : height + 30 + Math.random() * 40,
    vx: (Math.random() - 0.35) * 14 * depth,
    vy: -(7 + Math.random() * 11) * depth,
    size: 8 + Math.random() * 9,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.36,
    swayPhase: Math.random() * Math.PI * 2,
    swaySpeed: 0.7 + Math.random() * 0.9,
    depth,
    kind,
    ...palette,
  };
}

export const AmbientNatureCanvas: React.FC<AmbientNatureCanvasProps> = ({ isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDarkRef = useRef(isDark);

  useEffect(() => {
    isDarkRef.current = isDark;
  }, [isDark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const pointer = { x: -9999, y: -9999, active: false };
    const ripples: SquareRipple[] = [];
    let motifs: FloatingMotif[] = [];

    const rebuildSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const targetCount = Math.max(12, Math.min(26, Math.round((width * height) / 56000)));
      if (motifs.length === 0) {
        motifs = Array.from({ length: targetCount }, () => createMotif(width, height, true));
      } else if (motifs.length < targetCount) {
        while (motifs.length < targetCount) {
          motifs.push(createMotif(width, height, true));
        }
      } else if (motifs.length > targetCount) {
        motifs = motifs.slice(0, targetCount);
      }
    };

    rebuildSize();

    const onPointerMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };

    const onPointerLeave = () => {
      pointer.active = false;
    };

    const onPointerDown = (e: PointerEvent) => {
      if (prefersReducedMotion) return;
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        age: 0,
        duration: 0.65,
      });
      if (ripples.length > 6) ripples.shift();
    };

    window.addEventListener('resize', rebuildSize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('pointerdown', onPointerDown, { passive: true });

    const drawGrid = (scrollY: number, dark: boolean) => {
      const cell = 56;
      const offsetY = -((scrollY * 0.14) % cell);
      const offsetX = -((scrollY * 0.04) % cell);

      const baseGridColor = dark ? 'rgba(140, 216, 146, 0.055)' : 'rgba(79, 157, 88, 0.08)';
      ctx.lineWidth = 1;

      // Subtle square crosshair lattice
      for (let gx = offsetX; gx < width + cell; gx += cell) {
        for (let gy = offsetY; gy < height + cell; gy += cell) {
          let highlight = 0;
          if (pointer.active) {
            const dx = gx - pointer.x;
            const dy = gy - pointer.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 185) {
              highlight = Math.pow(1 - dist / 185, 1.8);
            }
          }

          if (highlight > 0.04) {
            ctx.strokeStyle = dark
              ? `rgba(125, 227, 134, ${0.08 + highlight * 0.28})`
              : `rgba(56, 148, 66, ${0.09 + highlight * 0.34})`;
            const arm = 3.5 + highlight * 3.5;
            ctx.beginPath();
            ctx.moveTo(gx - arm, gy);
            ctx.lineTo(gx + arm, gy);
            ctx.moveTo(gx, gy - arm);
            ctx.lineTo(gx, gy + arm);
            ctx.stroke();

            // Faint square frame highlight right around cursor
            if (highlight > 0.32) {
              ctx.strokeStyle = dark
                ? `rgba(255, 212, 77, ${(highlight - 0.32) * 0.28})`
                : `rgba(108, 224, 118, ${(highlight - 0.32) * 0.48})`;
              ctx.strokeRect(gx + 0.5, gy + 0.5, cell - 1, cell - 1);
            }
          } else {
            ctx.strokeStyle = baseGridColor;
            ctx.beginPath();
            ctx.moveTo(gx - 2.5, gy);
            ctx.lineTo(gx + 2.5, gy);
            ctx.moveTo(gx, gy - 2.5);
            ctx.lineTo(gx, gy + 2.5);
            ctx.stroke();
          }
        }
      }
    };

    const drawBreezeLines = (time: number, scrollY: number, dark: boolean) => {
      const ribbons = [
        { baseY: height * 0.22, amp: 24, freq: 0.0042, speed: 0.35, color: dark ? 'rgba(125,227,134,0.12)' : 'rgba(56,148,66,0.16)' },
        { baseY: height * 0.55, amp: 32, freq: 0.0034, speed: -0.26, color: dark ? 'rgba(123,197,250,0.1)' : 'rgba(72,163,232,0.16)' },
        { baseY: height * 0.82, amp: 20, freq: 0.0048, speed: 0.28, color: dark ? 'rgba(255,212,77,0.1)' : 'rgba(235,178,34,0.16)' },
      ];

      ctx.save();
      ctx.lineWidth = 1.35;
      ctx.setLineDash([6, 8]);
      ctx.lineDashOffset = -time * 18;

      for (const r of ribbons) {
        const yShift = (scrollY * 0.08) % (height * 0.35);
        ctx.strokeStyle = r.color;
        ctx.beginPath();
        for (let x = -20; x <= width + 20; x += 28) {
          const y =
            r.baseY -
            yShift * 0.3 +
            Math.sin(x * r.freq + time * r.speed) * r.amp +
            Math.cos(x * r.freq * 0.55 - time * 0.2) * (r.amp * 0.45);
          if (x === -20) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawMotif = (m: FloatingMotif, scrollY: number, dark: boolean) => {
      const drawY = ((m.y - scrollY * (0.08 * m.depth)) % (height + 80) + (height + 80)) % (height + 80) - 40;
      const fill = dark ? m.fillDark : m.fillLight;
      const accent = dark ? m.accentDark : m.accentLight;
      const stroke = dark ? '#9FD3A4' : '#236B2C';

      ctx.save();
      ctx.translate(m.x, drawY);
      ctx.rotate(m.angle);
      ctx.globalAlpha = dark ? 0.32 * m.depth + 0.12 : 0.44 * m.depth + 0.18;
      ctx.lineWidth = 1.25;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      const s = m.size;

      if (m.kind === 'square') {
        // 3D-offset crisp geometric sketchbook square
        ctx.fillStyle = accent;
        ctx.fillRect(-s * 0.48 + 2.5, -s * 0.48 + 2.5, s * 0.96, s * 0.96);
        ctx.fillStyle = fill;
        ctx.fillRect(-s * 0.48, -s * 0.48, s * 0.96, s * 0.96);
        ctx.strokeStyle = stroke;
        ctx.strokeRect(-s * 0.48, -s * 0.48, s * 0.96, s * 0.96);
      } else if (m.kind === 'leaf') {
        // Offset shadow
        ctx.save();
        ctx.translate(2, 2);
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.moveTo(-s * 0.7, s * 0.4);
        ctx.quadraticCurveTo(-s * 0.1, -s * 0.65, s * 0.75, -s * 0.45);
        ctx.quadraticCurveTo(s * 0.25, s * 0.55, -s * 0.7, s * 0.4);
        ctx.fill();
        ctx.restore();

        ctx.fillStyle = fill;
        ctx.strokeStyle = stroke;
        ctx.beginPath();
        ctx.moveTo(-s * 0.7, s * 0.4);
        ctx.quadraticCurveTo(-s * 0.1, -s * 0.65, s * 0.75, -s * 0.45);
        ctx.quadraticCurveTo(s * 0.25, s * 0.55, -s * 0.7, s * 0.4);
        ctx.fill();
        ctx.stroke();

        // Midrib vein
        ctx.beginPath();
        ctx.moveTo(-s * 0.7, s * 0.4);
        ctx.lineTo(s * 0.55, -s * 0.32);
        ctx.stroke();
      } else if (m.kind === 'kite') {
        // Origami diamond/kite
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.moveTo(2, -s * 0.75 + 2);
        ctx.lineTo(s * 0.55 + 2, 2);
        ctx.lineTo(2, s * 0.75 + 2);
        ctx.lineTo(-s * 0.55 + 2, 2);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = fill;
        ctx.strokeStyle = stroke;
        ctx.beginPath();
        ctx.moveTo(0, -s * 0.75);
        ctx.lineTo(s * 0.55, 0);
        ctx.lineTo(0, s * 0.75);
        ctx.lineTo(-s * 0.55, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, -s * 0.75);
        ctx.lineTo(0, s * 0.75);
        ctx.stroke();
      } else if (m.kind === 'flower') {
        const r = s * 0.26;
        ctx.fillStyle = fill;
        ctx.strokeStyle = stroke;
        const petals = [
          [0, -s * 0.38],
          [s * 0.38, 0],
          [0, s * 0.38],
          [-s * 0.38, 0],
        ];
        for (const [px, py] of petals) {
          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
        ctx.fillStyle = dark ? '#F7D15C' : '#F8D26A';
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else {
        // 4-point notebook star
        ctx.fillStyle = fill;
        ctx.strokeStyle = stroke;
        ctx.beginPath();
        const outer = s * 0.68;
        const inner = s * 0.2;
        for (let i = 0; i < 8; i++) {
          const rad = i % 2 === 0 ? outer : inner;
          const a = (i * Math.PI) / 4;
          const px = Math.cos(a) * rad;
          const py = Math.sin(a) * rad;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      ctx.restore();
    };

    const drawRipples = (dt: number, dark: boolean) => {
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.age += dt;
        const t = r.age / r.duration;
        if (t >= 1) {
          ripples.splice(i, 1);
          continue;
        }
        const eased = 1 - Math.pow(1 - t, 3);
        const halfSize = 6 + eased * 26;
        const alpha = (1 - t) * (dark ? 0.34 : 0.4);

        ctx.save();
        ctx.translate(r.x, r.y);
        ctx.strokeStyle = dark
          ? `rgba(140, 216, 146, ${alpha})`
          : `rgba(77, 153, 85, ${alpha})`;
        ctx.lineWidth = 1.25;
        ctx.strokeRect(-halfSize, -halfSize, halfSize * 2, halfSize * 2);
        ctx.restore();
      }
    };

    let rafId = 0;
    let lastTime = performance.now();
    let elapsed = 0;

    const renderFrame = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;
      elapsed += dt;

      const dark = isDarkRef.current;
      const scrollY = window.scrollY;

      ctx.clearRect(0, 0, width, height);

      drawGrid(scrollY, dark);
      drawBreezeLines(elapsed, scrollY, dark);

      for (const m of motifs) {
        if (!prefersReducedMotion) {
          m.swayPhase += dt * m.swaySpeed;
          const swayX = Math.sin(m.swayPhase) * 14 * m.depth;

          // Gentle breeze repulsion near pointer
          if (pointer.active) {
            const drawY = ((m.y - scrollY * (0.08 * m.depth)) % (height + 80) + (height + 80)) % (height + 80) - 40;
            const dx = m.x - pointer.x;
            const dy = drawY - pointer.y;
            const dist = Math.hypot(dx, dy);
            if (dist > 1 && dist < 130) {
              const push = ((130 - dist) / 130) * 55 * dt;
              m.x += (dx / dist) * push;
              m.y += (dy / dist) * push;
            }
          }

          m.x += (m.vx + swayX) * dt;
          m.y += m.vy * dt;
          m.angle += m.spin * dt;

          if (m.y < -45) {
            m.y = height + 40;
            m.x = Math.random() * width;
          }
          if (m.x < -45) m.x = width + 40;
          if (m.x > width + 45) m.x = -40;
        }

        drawMotif(m, scrollY, dark);
      }

      if (!prefersReducedMotion) {
        drawRipples(dt, dark);
      }

      if (!prefersReducedMotion && !document.hidden) {
        rafId = requestAnimationFrame(renderFrame);
      }
    };

    const onVisibilityChange = () => {
      if (!document.hidden && !prefersReducedMotion) {
        lastTime = performance.now();
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(renderFrame);
      } else if (document.hidden) {
        cancelAnimationFrame(rafId);
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    rafId = requestAnimationFrame(renderFrame);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('resize', rebuildSize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none select-none"
    />
  );
};
