import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Play, Radio } from 'lucide-react';

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
        color: isDark ? '#8CD892' : '#3D8B47',
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
        color: '#F5B841',
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
            ? 'rgba(140, 216, 146, 0.78)'
            : 'rgba(79, 157, 88, 0.72)'
          : isDark
            ? 'rgba(159, 181, 161, 0.24)'
            : 'rgba(79, 157, 88, 0.2)';
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
        ctx.arc(x, y, 6.5, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? 'rgba(140, 216, 146, 0.32)'
          : 'rgba(140, 216, 146, 0.45)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, 3.4, 0, Math.PI * 2);
        ctx.fillStyle = pkt.color;
        ctx.fill();
      });
      packetsRef.current = nextPackets;

      // Decay node glows & draw square nodes
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

        if (glow > 0.02) {
          const ringSize = 18 + (1 - glow) * 16;
          ctx.strokeStyle = isDark
            ? `rgba(140, 216, 146, ${glow * 0.55})`
            : `rgba(79, 157, 88, ${glow * 0.48})`;
          ctx.lineWidth = 1.5;
          ctx.strokeRect(x - ringSize / 2, y - ringSize / 2, ringSize, ringSize);
        }

        const half = isSelected ? 14 : 11;
        if (isSelected) {
          ctx.fillStyle = '#8CD892';
          ctx.strokeStyle = isDark ? '#EDF3EA' : '#2E6B37';
        } else if (isNeighbor) {
          ctx.fillStyle = isDark ? '#273A2B' : '#CFEECF';
          ctx.strokeStyle = isDark ? '#8CD892' : '#4F9D58';
        } else {
          ctx.fillStyle = isDark ? '#1D2A20' : '#FCFDF9';
          ctx.strokeStyle = isDark ? '#314735' : '#C9E1C7';
        }
        ctx.lineWidth = 1.8;
        ctx.fillRect(x - half, y - half, half * 2, half * 2);
        ctx.strokeRect(x - half, y - half, half * 2, half * 2);

        // Label below node
        ctx.font = '500 11px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = isDark ? '#9FB5A1' : '#5B6E5D';
        ctx.fillText(node.label, x, y + half + 15);
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
    <div className="flex flex-col rounded-none border border-[#C9E1C7] dark:border-[#314735] bg-[#F7F9F3] dark:bg-[#162018] overflow-hidden">
      <div className="relative h-64 sm:h-72 w-full">
        <canvas
          ref={canvasRef}
          className="w-full h-full block cursor-pointer"
          aria-label="Interactive software data-flow simulation — click any node to dispatch signals"
        />
        <div className="pointer-events-none absolute top-3 left-3.5 right-3.5 flex items-center justify-between text-[11px] font-mono text-[#5B6E5D] dark:text-[#9FB5A1]">
          <span>Click any node to dispatch wave</span>
          <span>Live graph signal</span>
        </div>
      </div>

      <div className="border-t border-[#C9E1C7] dark:border-[#314735] bg-[#FCFDF9] dark:bg-[#1D2A20] px-3.5 py-2.5 flex items-center justify-between gap-2 text-xs text-[#5B6E5D] dark:text-[#9FB5A1]">
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-[#3D8B47] dark:text-[#8CD892]" />
          <span>
            Active node:{' '}
            <strong className="font-mono text-[#2E6B37] dark:text-[#8CD892]">
              {NODES[activeNode].label}
            </strong>
          </span>
        </div>

        <button
          type="button"
          onClick={() => triggerWave(activeNode)}
          className="square-stamp-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none border border-[#4D9955] bg-[#8CD892] hover:bg-[#7CCF83] text-[#172B1A] text-xs font-medium whitespace-nowrap shrink-0"
        >
          <Play className="w-3 h-3" />
          <span>Pulse Signal</span>
        </button>
      </div>
    </div>
  );
};
