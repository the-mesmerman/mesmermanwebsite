import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Play, Radio } from 'lucide-react';
import { motion } from 'motion/react';

interface GraphNode {
  id: number;
  nx: number; // normalized 0..1
  ny: number; // normalized 0..1
  label: string;
}

interface Packet {
  from: number;
  to: number;
  progress: number;
  speed: number;
  color: string;
}

const NODES: GraphNode[] = [
  { id: 0, nx: 0.5, ny: 0.2, label: 'Input' },
  { id: 1, nx: 0.24, ny: 0.48, label: 'Parse' },
  { id: 2, nx: 0.76, ny: 0.48, label: 'Logic' },
  { id: 3, nx: 0.14, ny: 0.78, label: 'State' },
  { id: 4, nx: 0.39, ny: 0.78, label: 'Render' },
  { id: 5, nx: 0.62, ny: 0.78, label: 'Layout' },
  { id: 6, nx: 0.86, ny: 0.78, label: 'Output' },
];

const EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [1, 4],
  [2, 5],
  [2, 6],
  [1, 2],
  [4, 5],
];

export const TechMatrixVisual: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeNode, setActiveNode] = useState<number>(0);
  const activeNodeRef = useRef(activeNode);
  activeNodeRef.current = activeNode;

  const packetsRef = useRef<Packet[]>([]);
  const nodeGlowRef = useRef<number[]>(NODES.map(() => 0));

  const triggerWave = useCallback((sourceId: number) => {
    setActiveNode(sourceId);
    nodeGlowRef.current[sourceId] = 1;
    const isDark = document.documentElement.classList.contains('dark');
    const neighbors = EDGES.filter(
      ([a, b]) => a === sourceId || b === sourceId,
    ).map(([a, b]) => (a === sourceId ? b : a));

    neighbors.forEach((target, idx) => {
      packetsRef.current.push({
        from: sourceId,
        to: target,
        progress: -idx * 0.08,
        speed: 1.45,
        color: isDark ? '#34D399' : '#059669',
      });
    });
  }, []);

  // Periodic gentle ambient packet pulse so simulation feels alive
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReduced) return;

    const timer = window.setInterval(() => {
      const src = activeNodeRef.current;
      const neighbors = EDGES.filter(([a, b]) => a === src || b === src).map(
        ([a, b]) => (a === src ? b : a),
      );
      if (neighbors.length === 0) return;
      const target = neighbors[Math.floor(Math.random() * neighbors.length)];
      packetsRef.current.push({
        from: src,
        to: target,
        progress: 0,
        speed: 1.25,
        color: '#F59E0B',
      });
    }, 950);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    let rafId = 0;
    let lastTs = performance.now();

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const width = canvas.clientWidth || 440;
      const height = canvas.clientHeight || 280;

      for (const node of NODES) {
        const nx = node.nx * width;
        const ny = node.ny * height;
        if (Math.hypot(px - nx, py - ny) < 26) {
          triggerWave(node.id);
          break;
        }
      }
    };

    canvas.addEventListener('click', handleClick);

    const draw = (now: number) => {
      const dt = Math.min((now - lastTs) / 1000, 0.05);
      lastTs = now;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth || 440;
      const height = canvas.clientHeight || 280;
      if (
        canvas.width !== Math.round(width * dpr) ||
        canvas.height !== Math.round(height * dpr)
      ) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const isDark = document.documentElement.classList.contains('dark');
      ctx.clearRect(0, 0, width, height);

      const selected = activeNodeRef.current;

      // Draw edges
      EDGES.forEach(([a, b]) => {
        const nA = NODES[a];
        const nB = NODES[b];
        const x1 = nA.nx * width;
        const y1 = nA.ny * height;
        const x2 = nB.nx * width;
        const y2 = nB.ny * height;
        const isConnected = a === selected || b === selected;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = isConnected
          ? isDark
            ? 'rgba(52, 211, 153, 0.7)'
            : 'rgba(5, 150, 105, 0.65)'
          : isDark
            ? 'rgba(148, 163, 184, 0.18)'
            : 'rgba(15, 23, 42, 0.14)';
        ctx.lineWidth = isConnected ? 2 : 1.1;
        ctx.setLineDash(isConnected ? [] : [4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Advance & draw data packets
      const nextPackets: Packet[] = [];
      packetsRef.current.forEach((pkt) => {
        pkt.progress += dt * pkt.speed;
        if (pkt.progress < 0) {
          nextPackets.push(pkt);
          return;
        }
        if (pkt.progress >= 1) {
          nodeGlowRef.current[pkt.to] = 1;
          return;
        }
        nextPackets.push(pkt);

        const nFrom = NODES[pkt.from];
        const nTo = NODES[pkt.to];
        const x = (nFrom.nx + (nTo.nx - nFrom.nx) * pkt.progress) * width;
        const y = (nFrom.ny + (nTo.ny - nFrom.ny) * pkt.progress) * height;

        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? 'rgba(52, 211, 153, 0.25)'
          : 'rgba(5, 150, 105, 0.2)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, 3.4, 0, Math.PI * 2);
        ctx.fillStyle = pkt.color;
        ctx.fill();
      });
      packetsRef.current = nextPackets;

      // Decay node glows & draw nodes
      NODES.forEach((node) => {
        nodeGlowRef.current[node.id] = Math.max(
          0,
          nodeGlowRef.current[node.id] - dt * 1.4,
        );
        const glow = nodeGlowRef.current[node.id];
        const x = node.nx * width;
        const y = node.ny * height;
        const isSelected = node.id === selected;
        const isNeighbor = EDGES.some(
          ([a, b]) =>
            (a === selected && b === node.id) ||
            (b === selected && a === node.id),
        );

        // Expanding ripple ring on packet arrival/click
        if (glow > 0.02) {
          ctx.beginPath();
          ctx.arc(x, y, 16 + (1 - glow) * 18, 0, Math.PI * 2);
          ctx.strokeStyle = isDark
            ? `rgba(52, 211, 153, ${glow * 0.55})`
            : `rgba(5, 150, 105, ${glow * 0.45})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        const r = isSelected ? 17 : 14;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        if (isSelected) {
          ctx.fillStyle = '#059669';
          ctx.strokeStyle = isDark ? '#6EE7B7' : '#047857';
        } else if (isNeighbor) {
          ctx.fillStyle = isDark ? '#0F766E' : '#14B8A6';
          ctx.strokeStyle = isDark ? '#5EEAD4' : '#0F766E';
        } else {
          ctx.fillStyle = isDark ? '#0B1B15' : '#FFFFFF';
          ctx.strokeStyle = isDark ? '#33594A' : '#CBD5E1';
        }
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        // Label below node
        ctx.font = '500 11px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = isDark ? '#CBD5E1' : '#334155';
        ctx.fillText(node.label, x, y + r + 15);
      });

      if (!prefersReduced) {
        rafId = requestAnimationFrame(draw);
      }
    };

    triggerWave(0);
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener('click', handleClick);
    };
  }, [triggerWave]);

  return (
    <div className="flex flex-col rounded-xl border border-emerald-950/12 dark:border-emerald-500/20 bg-[#F4FAF6] dark:bg-[#071510] overflow-hidden">
      <div className="relative h-64 sm:h-72 w-full">
        <canvas
          ref={canvasRef}
          className="w-full h-full block cursor-pointer"
          aria-label="Interactive software data-flow simulation — click any node to dispatch signals"
        />
        <div className="pointer-events-none absolute top-3 left-3.5 right-3.5 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
          <span>Click any node to dispatch wave</span>
          <span>Live graph signal</span>
        </div>
      </div>

      <div className="border-t border-emerald-950/10 dark:border-emerald-500/15 bg-white dark:bg-[#0B1B15] px-3.5 py-2.5 flex items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>
            Active node:{' '}
            <strong className="font-mono text-emerald-600 dark:text-emerald-400">
              {NODES[activeNode].label}
            </strong>
          </span>
        </div>

        <motion.button
          type="button"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => triggerWave(activeNode)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors"
        >
          <Play className="w-3 h-3" />
          <span>Pulse Signal</span>
        </motion.button>
      </div>
    </div>
  );
};
