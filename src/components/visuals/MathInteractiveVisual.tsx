import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play, Sparkles } from 'lucide-react';

type MathMode = 'phyllotaxis' | 'lissajous';

export const MathInteractiveVisual: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<MathMode>('phyllotaxis');
  const [param, setParam] = useState(137.5);
  const [isPlaying, setIsPlaying] = useState(true);

  const modeRef = useRef(mode);
  const paramRef = useRef(param);
  const isPlayingRef = useRef(isPlaying);
  const pointerRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  modeRef.current = mode;
  paramRef.current = param;
  isPlayingRef.current = isPlaying;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    let rafId = 0;
    let time = 0;
    let lastTs = performance.now();

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handlePointerLeave = () => {
      pointerRef.current.active = false;
    };

    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerleave', handlePointerLeave);

    const draw = (now: number) => {
      const dt = Math.min((now - lastTs) / 1000, 0.05);
      lastTs = now;

      if (isPlayingRef.current && !prefersReduced) {
        time += dt;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth || 440;
      const height = canvas.clientHeight || 290;
      if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const isDark = document.documentElement.classList.contains('dark');
      ctx.clearRect(0, 0, width, height);

      // Subtle coordinate grid
      ctx.strokeStyle = isDark
        ? 'rgba(214, 232, 222, 0.06)'
        : 'rgba(15, 42, 29, 0.06)';
      ctx.lineWidth = 1;
      const step = 28;
      for (let x = width / 2; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let x = width / 2 - step; x > 0; x -= step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = height / 2; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      for (let y = height / 2 - step; y > 0; y -= step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const cx = width / 2;
      const cy = height / 2;
      const currentParam = paramRef.current;

      if (modeRef.current === 'phyllotaxis') {
        const count = 240;
        const breathe = Math.sin(time * 1.1) * 0.14;
        const angleRad = ((currentParam + breathe) * Math.PI) / 180;
        const baseScale = Math.min(width, height) * 0.025;
        const rotationOffset = time * 0.18;

        for (let i = 0; i < count; i++) {
          const t = i / count;
          const wave = Math.sin(time * 2.4 - i * 0.09) * 0.8;
          const r = baseScale * Math.sqrt(i) + wave;
          const theta = i * angleRad + rotationOffset;
          let x = cx + r * Math.cos(theta);
          let y = cy + r * Math.sin(theta);

          // Interactive gentle magnetic push/glow near pointer
          let boost = 0;
          if (pointerRef.current.active) {
            const dx = x - pointerRef.current.x;
            const dy = y - pointerRef.current.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 75 && dist > 0.1) {
              const force = (1 - dist / 75) * 9;
              x += (dx / dist) * force;
              y += (dy / dist) * force;
              boost = 1 - dist / 75;
            }
          }

          const radius = 1.9 + t * 2.1 + boost * 1.6;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);

          if (i % 5 === 0) {
            ctx.fillStyle = isDark
              ? `rgba(251, 191, 36, ${0.45 + t * 0.45 + boost * 0.25})`
              : `rgba(180, 83, 9, ${0.45 + t * 0.45})`;
          } else {
            ctx.fillStyle = isDark
              ? `rgba(52, 211, 153, ${0.35 + t * 0.55 + boost * 0.25})`
              : `rgba(15, 118, 85, ${0.44 + t * 0.48})`;
          }
          ctx.fill();
        }
      } else {
        const freqA = Math.round(currentParam / 25) + 1;
        const freqB = 3;
        const rx = width * 0.36;
        const ry = height * 0.36;
        const phase = time * 0.85 + Math.PI / 4;
        const samples = 520;

        // Ambient full curve
        ctx.beginPath();
        for (let i = 0; i <= samples; i++) {
          const t = (i / samples) * Math.PI * 2;
          const x = cx + rx * Math.sin(freqA * t + phase);
          const y = cy + ry * Math.sin(freqB * t);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = isDark
          ? 'rgba(16, 185, 129, 0.35)'
          : 'rgba(5, 150, 105, 0.25)';
        ctx.lineWidth = 1.75;
        ctx.stroke();

        // Luminous trailing comet segment
        const headT = (time * 0.75) % (Math.PI * 2);
        const trailLen = 1.35;
        const trailSteps = 60;
        for (let s = 0; s < trailSteps; s++) {
          const f0 = s / trailSteps;
          const f1 = (s + 1) / trailSteps;
          const t0 = headT - (1 - f0) * trailLen;
          const t1 = headT - (1 - f1) * trailLen;
          const x0 = cx + rx * Math.sin(freqA * t0 + phase);
          const y0 = cy + ry * Math.sin(freqB * t0);
          const x1 = cx + rx * Math.sin(freqA * t1 + phase);
          const y1 = cy + ry * Math.sin(freqB * t1);

          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y1);
          ctx.strokeStyle = isDark
            ? `rgba(110, 231, 183, ${f1 * 0.95})`
            : `rgba(5, 150, 105, ${f1 * 0.95})`;
          ctx.lineWidth = 1.5 + f1 * 2.2;
          ctx.stroke();
        }

        // Comet head
        const hx = cx + rx * Math.sin(freqA * headT + phase);
        const hy = cy + ry * Math.sin(freqB * headT);
        ctx.beginPath();
        ctx.arc(hx, hy, 5, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? '#FBBF24' : '#D97706';
        ctx.fill();
      }

      if (!prefersReduced) {
        rafId = requestAnimationFrame(draw);
      }
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  return (
    <div className="flex flex-col rounded-xl border border-[#0F2A1D]/12 dark:border-[#D6E8DE]/12 bg-[#EFF4F0] dark:bg-[#0D1813] overflow-hidden">
      <div className="relative h-64 sm:h-72 w-full">
        <canvas
          ref={canvasRef}
          className="w-full h-full block cursor-crosshair"
          aria-label="Interactive animated mathematical geometry simulation"
        />
        <div className="pointer-events-none absolute top-3 left-3.5 right-3.5 flex items-center justify-between text-[11px] font-mono text-[#647A6F] dark:text-[#748B80] tabular-nums">
          <span>
            {mode === 'phyllotaxis'
              ? `Golden Angle: ${param.toFixed(1)}°`
              : `Harmonic Ratio: ${Math.round(param / 25) + 1} : 3`}
          </span>
          <span>
            {mode === 'phyllotaxis' ? 'Move cursor to ripple' : 'Live phase drift'}
          </span>
        </div>
      </div>

      <div className="border-t border-[#0F2A1D]/11 dark:border-[#D6E8DE]/11 bg-white dark:bg-[#111E18] px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#EFF4F0] dark:bg-[#172820]">
          <button
            type="button"
            onClick={() => {
              setMode('phyllotaxis');
              setParam(137.5);
            }}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 ${
              mode === 'phyllotaxis'
                ? 'bg-[#0F7655] text-white'
                : 'text-[#4A6256] dark:text-[#94ABA0] hover:text-[#11221A] dark:hover:text-[#EDF4F0]'
            }`}
          >
            Golden Spiral
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('lissajous');
              setParam(100);
            }}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 ${
              mode === 'lissajous'
                ? 'bg-[#0F7655] text-white'
                : 'text-[#4A6256] dark:text-[#94ABA0] hover:text-[#11221A] dark:hover:text-[#EDF4F0]'
            }`}
          >
            Harmonic Curve
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          <label className="flex items-center gap-2 text-xs text-[#4A6256] dark:text-[#94ABA0]">
            <span className="font-mono text-[11px]">Angle</span>
            <input
              type="range"
              min={90}
              max={180}
              step={0.5}
              value={param}
              onChange={(e) => setParam(Number(e.target.value))}
              className="w-20 sm:w-24 accent-[#0F7655] dark:accent-[#34D399]"
            />
          </label>

          {mode === 'phyllotaxis' && param !== 137.5 && (
            <button
              type="button"
              onClick={() => setParam(137.5)}
              title="Snap to Golden Angle 137.5°"
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-[#0F2A1D]/12 dark:border-[#D6E8DE]/12 text-[11px] font-mono text-[#0F7655] dark:text-[#34D399] hover:border-[#0F7655] dark:hover:border-[#34D399] transition-colors duration-150"
            >
              <Sparkles className="w-3 h-3" />
              <span>137.5°</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            aria-label={isPlaying ? 'Pause simulation' : 'Play simulation'}
            className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-[#0F2A1D]/12 dark:border-[#D6E8DE]/12 bg-[#F4F7F4] dark:bg-[#172820] text-[#4A6256] dark:text-[#94ABA0] hover:border-[#0F7655] dark:hover:border-[#34D399] hover:text-[#11221A] dark:hover:text-[#EDF4F0] transition-colors duration-150"
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5" />
            ) : (
              <Play className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
