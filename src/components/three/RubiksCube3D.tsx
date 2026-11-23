import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, Shuffle } from 'lucide-react';
import { motion } from 'motion/react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

type FaceMove = 'U' | 'D' | 'L' | 'R' | 'F' | 'B';

interface CubieRecord {
  group: THREE.Group;
  gx: number;
  gy: number;
  gz: number;
}

const MOVE_SPECS: Record<
  FaceMove,
  { axis: 'x' | 'y' | 'z'; layer: number; angle: number; label: string }
> = {
  U: { axis: 'y', layer: 1, angle: -Math.PI / 2, label: 'Up' },
  D: { axis: 'y', layer: -1, angle: Math.PI / 2, label: 'Down' },
  R: { axis: 'x', layer: 1, angle: -Math.PI / 2, label: 'Right' },
  L: { axis: 'x', layer: -1, angle: Math.PI / 2, label: 'Left' },
  F: { axis: 'z', layer: 1, angle: -Math.PI / 2, label: 'Front' },
  B: { axis: 'z', layer: -1, angle: Math.PI / 2, label: 'Back' },
};

const STICKER_COLORS = {
  U: 0xf8fafc,
  D: 0xfacc15,
  R: 0xef4444,
  L: 0xf97316,
  F: 0x2563eb,
  B: 0x10b981,
};

export const RubiksCube3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [moveCount, setMoveCount] = useState(0);
  const [isTurning, setIsTurning] = useState(false);
  const [autoOrbit, setAutoOrbit] = useState(true);
  const autoOrbitRef = useRef(autoOrbit);
  autoOrbitRef.current = autoOrbit;

  const enqueueMoveRef = useRef<(moves: FaceMove[]) => void>(() => {});
  const resetCubeRef = useRef<() => void>(() => {});
  const toggleOrbitSyncRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    toggleOrbitSyncRef.current?.();
  }, [autoOrbit]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const isSoftwareGl = (() => {
      try {
        const probe = document.createElement('canvas');
        const gl = probe.getContext('webgl2') || probe.getContext('webgl');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    const width = container.clientWidth || 440;
    const height = container.clientHeight || 340;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(4.5, 3.8, 5.1);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2),
    );
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    const hemi = new THREE.HemisphereLight(0xd6e8de, 0x0b1410, 0.92);
    scene.add(hemi);

    const key = new THREE.DirectionalLight(0xfff4e6, 2.0);
    key.position.set(6, 8, 6);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0x34d399, 0.72);
    fill.position.set(-5, -3, -4);
    scene.add(fill);

    const cubeRoot = new THREE.Group();
    scene.add(cubeRoot);

    const cubieBodyGeo = new THREE.BoxGeometry(0.92, 0.92, 0.92);
    const stickerGeo = new THREE.PlaneGeometry(0.76, 0.76);
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: 0x101815,
      roughness: 0.34,
      metalness: 0.16,
      clearcoat: 0.4,
      clearcoatRoughness: 0.24,
    });

    const stickerMats = {
      U: new THREE.MeshStandardMaterial({ color: STICKER_COLORS.U, roughness: 0.2, metalness: 0.05 }),
      D: new THREE.MeshStandardMaterial({ color: STICKER_COLORS.D, roughness: 0.2, metalness: 0.05 }),
      R: new THREE.MeshStandardMaterial({ color: STICKER_COLORS.R, roughness: 0.2, metalness: 0.05 }),
      L: new THREE.MeshStandardMaterial({ color: STICKER_COLORS.L, roughness: 0.2, metalness: 0.05 }),
      F: new THREE.MeshStandardMaterial({ color: STICKER_COLORS.F, roughness: 0.2, metalness: 0.05 }),
      B: new THREE.MeshStandardMaterial({ color: STICKER_COLORS.B, roughness: 0.2, metalness: 0.05 }),
    };

    const cubies: CubieRecord[] = [];
    const spacing = 0.98;

    const addSticker = (
      parent: THREE.Group,
      mat: THREE.Material,
      pos: [number, number, number],
      rot: [number, number, number],
    ) => {
      const mesh = new THREE.Mesh(stickerGeo, mat);
      mesh.position.set(pos[0], pos[1], pos[2]);
      mesh.rotation.set(rot[0], rot[1], rot[2]);
      parent.add(mesh);
    };

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          if (x === 0 && y === 0 && z === 0) continue;
          const group = new THREE.Group();
          const body = new THREE.Mesh(cubieBodyGeo, bodyMat);
          group.add(body);

          const offset = 0.465;
          if (y === 1) addSticker(group, stickerMats.U, [0, offset, 0], [-Math.PI / 2, 0, 0]);
          if (y === -1) addSticker(group, stickerMats.D, [0, -offset, 0], [Math.PI / 2, 0, 0]);
          if (x === 1) addSticker(group, stickerMats.R, [offset, 0, 0], [0, Math.PI / 2, 0]);
          if (x === -1) addSticker(group, stickerMats.L, [-offset, 0, 0], [0, -Math.PI / 2, 0]);
          if (z === 1) addSticker(group, stickerMats.F, [0, 0, offset], [0, 0, 0]);
          if (z === -1) addSticker(group, stickerMats.B, [0, 0, -offset], [0, Math.PI, 0]);

          group.position.set(x * spacing, y * spacing, z * spacing);
          group.userData.initialGrid = { x, y, z };
          cubeRoot.add(group);
          cubies.push({ group, gx: x, gy: y, gz: z });
        }
      }
    }

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.autoRotate = !isSoftwareGl && !prefersReducedMotion && autoOrbitRef.current;
    controls.autoRotateSpeed = 1.25;

    const moveQueue: FaceMove[] = [];
    let activeTurn: {
      move: FaceMove;
      pivot: THREE.Group;
      affected: CubieRecord[];
      progress: number;
      targetAngle: number;
      axis: 'x' | 'y' | 'z';
    } | null = null;

    let disposed = false;
    let frameId = 0;
    let renderBusy = false;
    let renderDirty = false;
    const clock = new THREE.Clock();

    const startNextTurn = () => {
      if (activeTurn || moveQueue.length === 0) {
        if (!activeTurn && moveQueue.length === 0) {
          setIsTurning(false);
        }
        return;
      }
      setIsTurning(true);
      const move = moveQueue.shift()!;
      const spec = MOVE_SPECS[move];
      const pivot = new THREE.Group();
      cubeRoot.add(pivot);

      const affected = cubies.filter((c) => {
        if (spec.axis === 'x') return c.gx === spec.layer;
        if (spec.axis === 'y') return c.gy === spec.layer;
        return c.gz === spec.layer;
      });

      affected.forEach((c) => {
        pivot.attach(c.group);
      });

      activeTurn = {
        move,
        pivot,
        affected,
        progress: 0,
        targetAngle: spec.angle,
        axis: spec.axis,
      };
    };

    const finishTurn = () => {
      if (!activeTurn) return;
      const { pivot, affected, targetAngle, axis } = activeTurn;
      pivot.rotation[axis] = targetAngle;
      pivot.updateMatrixWorld(true);

      affected.forEach((c) => {
        cubeRoot.attach(c.group);
        c.gx = Math.round(c.group.position.x / spacing);
        c.gy = Math.round(c.group.position.y / spacing);
        c.gz = Math.round(c.group.position.z / spacing);
        c.group.position.set(c.gx * spacing, c.gy * spacing, c.gz * spacing);
      });

      cubeRoot.remove(pivot);
      activeTurn = null;
      setMoveCount((n) => n + 1);
      startNextTurn();
    };

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) {
          if (sync) gl.deleteSync(sync);
          return;
        }
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function requestRender() {
      if (disposed) return;
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame(() => {
        if (disposed) return;
        renderDirty = false;
        const dt = Math.min(clock.getDelta(), 0.05);
        const elapsed = clock.getElapsedTime();

        if (!prefersReducedMotion && !isSoftwareGl && autoOrbitRef.current) {
          cubeRoot.position.y = Math.sin(elapsed * 1.4) * 0.07;
        }

        if (activeTurn) {
          const speed = moveQueue.length > 2 ? 9.5 : 5.4;
          activeTurn.progress = Math.min(1, activeTurn.progress + dt * speed);
          const eased = 1 - Math.pow(1 - activeTurn.progress, 3);
          activeTurn.pivot.rotation[activeTurn.axis] =
            activeTurn.targetAngle * eased;
          if (activeTurn.progress >= 1) {
            finishTurn();
          }
          renderDirty = true;
        }

        const controlsMoving = controls.update();
        if (
          (controlsMoving || controls.autoRotate) &&
          !isSoftwareGl &&
          !prefersReducedMotion
        ) {
          renderDirty = true;
        }

        renderer.render(scene, camera);
        const done = () => {
          renderBusy = false;
          if (renderDirty && !disposed) requestRender();
        };
        if (isSoftwareGl) afterDraw(done);
        else done();
      });
    }

    controls.addEventListener('change', requestRender);
    controls.addEventListener('start', () => {
      controls.autoRotate = false;
    });

    toggleOrbitSyncRef.current = () => {
      controls.autoRotate =
        !isSoftwareGl && !prefersReducedMotion && autoOrbitRef.current;
      requestRender();
    };

    enqueueMoveRef.current = (moves: FaceMove[]) => {
      if (disposed) return;
      moveQueue.push(...moves);
      if (!activeTurn) {
        clock.getDelta();
        startNextTurn();
      }
      requestRender();
    };

    resetCubeRef.current = () => {
      if (disposed) return;
      moveQueue.length = 0;
      if (activeTurn) {
        activeTurn.affected.forEach((c) => cubeRoot.attach(c.group));
        cubeRoot.remove(activeTurn.pivot);
        activeTurn = null;
      }
      cubies.forEach((c) => {
        const init = c.group.userData.initialGrid as { x: number; y: number; z: number };
        c.gx = init.x;
        c.gy = init.y;
        c.gz = init.z;
        c.group.position.set(init.x * spacing, init.y * spacing, init.z * spacing);
        c.group.rotation.set(0, 0, 0);
      });
      setIsTurning(false);
      setMoveCount(0);
      requestRender();
    };

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w <= 0 || h <= 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRender();
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }
    requestRender();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      controls.removeEventListener('change', requestRender);
      controls.dispose();
      cubieBodyGeo.dispose();
      stickerGeo.dispose();
      bodyMat.dispose();
      Object.values(stickerMats).forEach((m) => m.dispose());
      envTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleTurn = useCallback((move: FaceMove) => {
    enqueueMoveRef.current([move]);
  }, []);

  const handleScramble = useCallback(() => {
    const faces: FaceMove[] = ['U', 'D', 'L', 'R', 'F', 'B'];
    const seq: FaceMove[] = [];
    for (let i = 0; i < 8; i++) {
      const candidates = faces.filter((f) => f !== seq[seq.length - 1]);
      seq.push(candidates[Math.floor(Math.random() * candidates.length)]);
    }
    enqueueMoveRef.current(seq);
  }, []);

  const handleReset = useCallback(() => {
    resetCubeRef.current();
  }, []);

  return (
    <div className="flex flex-col rounded-none border border-[#C9E1C7] dark:border-[#314735] bg-[#F7F9F3] dark:bg-[#162018] overflow-hidden">
      <div className="relative h-72 sm:h-80 w-full">
        <div
          ref={mountRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          aria-label="Interactive 3D Rubik's Cube — drag to inspect"
        />
        <div className="pointer-events-none absolute top-3 left-3.5 right-3.5 flex items-center justify-between text-[11px] font-mono text-[#5B6E5D] dark:text-[#9FB5A1]">
          <span>Drag to rotate view</span>
          <span className="tabular-nums">Moves: {moveCount}</span>
        </div>
      </div>

      <div className="border-t border-[#C9E1C7] dark:border-[#314735] bg-[#FCFDF9] dark:bg-[#1D2A20] px-3 py-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Cube face turns">
          {(Object.keys(MOVE_SPECS) as FaceMove[]).map((move) => (
            <button
              key={move}
              type="button"
              onClick={() => handleTurn(move)}
              title={`Turn ${MOVE_SPECS[move].label} face`}
              className="square-stamp-mint px-2.5 py-1.5 rounded-none border border-[#C9E1C7] dark:border-[#314735] bg-[#F7F9F3] dark:bg-[#162018] hover:border-[#4F9D58] dark:hover:border-[#8CD892] text-xs font-mono font-medium text-[#223024] dark:text-[#EDF3EA] min-h-[36px] min-w-[36px]"
            >
              {move}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAutoOrbit((o) => !o)}
            title={autoOrbit ? 'Pause ambient orbit' : 'Resume ambient orbit'}
            aria-label={autoOrbit ? 'Pause ambient orbit' : 'Resume ambient orbit'}
            className="square-stamp-mint inline-flex items-center justify-center w-9 h-9 rounded-none border border-[#C9E1C7] dark:border-[#314735] bg-[#F7F9F3] dark:bg-[#162018] text-[#5B6E5D] dark:text-[#9FB5A1] hover:border-[#4F9D58] dark:hover:border-[#8CD892] hover:text-[#223024] dark:hover:text-[#EDF3EA]"
          >
            {autoOrbit ? (
              <Pause className="w-3.5 h-3.5" />
            ) : (
              <Play className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            type="button"
            onClick={handleScramble}
            disabled={isTurning}
            className="square-stamp-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none border border-[#4D9955] bg-[#8CD892] hover:bg-[#7CCF83] disabled:opacity-60 text-[#172B1A] text-xs font-medium min-h-[36px] whitespace-nowrap shrink-0"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Scramble</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="square-stamp-mint inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none border border-[#C9E1C7] dark:border-[#314735] bg-[#F7F9F3] dark:bg-[#162018] hover:border-[#4F9D58] dark:hover:border-[#8CD892] text-[#223024] dark:text-[#EDF3EA] text-xs font-medium min-h-[36px] whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
