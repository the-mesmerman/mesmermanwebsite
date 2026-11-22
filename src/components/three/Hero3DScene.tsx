import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RotateCcw, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface Hero3DSceneProps {
  isDark: boolean;
}

type ScenePreset = 'crystal' | 'canopy' | 'orbit';

const MATH_SYMBOLS = ['∑', 'π', 'φ', '∫', 'Δ', '√'];

function createSymbolTexture(symbol: string, isDark: boolean): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, 128, 128);

  ctx.beginPath();
  ctx.arc(64, 64, 46, 0, Math.PI * 2);
  ctx.fillStyle = isDark ? 'rgba(11, 27, 21, 0.86)' : 'rgba(255, 255, 255, 0.92)';
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = isDark ? 'rgba(52, 211, 153, 0.62)' : 'rgba(5, 150, 105, 0.5)';
  ctx.stroke();

  ctx.font = '600 48px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = isDark ? '#6EE7B7' : '#047857';
  ctx.fillText(symbol, 64, 66);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export const Hero3DScene: React.FC<Hero3DSceneProps> = ({ isDark }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const isDarkRef = useRef(isDark);
  isDarkRef.current = isDark;

  const [preset, setPreset] = useState<ScenePreset>('crystal');
  const presetRef = useRef<ScenePreset>(preset);
  presetRef.current = preset;

  const sceneThemeSyncRef = useRef<((dark: boolean) => void) | null>(null);
  const pulseTriggerRef = useRef<(() => void) | null>(null);
  const resetCameraRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    sceneThemeSyncRef.current?.(isDark);
  }, [isDark]);

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

    const width = container.clientWidth || 520;
    const height = container.clientHeight || 460;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.35, 7.6);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.16;
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

    // Warm Sunlit + Botanical Emerald Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xa7f3d0, 0x064e3b, 0.95);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff7e6, 2.25);
    keyLight.position.set(5, 6, 5);
    scene.add(keyLight);

    const emeraldRim = new THREE.PointLight(0x10b981, 18, 22, 2);
    emeraldRim.position.set(-4.5, -2.5, 3.5);
    scene.add(emeraldRim);

    const amberRim = new THREE.PointLight(0xf59e0b, 14, 20, 2);
    amberRim.position.set(4.5, 3.5, -3);
    scene.add(amberRim);

    const heroGroup = new THREE.Group();
    scene.add(heroGroup);

    // 1. Inner Low-Poly Emerald Core Crystal
    const coreGeo = new THREE.DodecahedronGeometry(0.98, 0);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x10b981,
      metalness: 0.25,
      roughness: 0.16,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      emissive: 0x059669,
      emissiveIntensity: 0.28,
      flatShading: true,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    heroGroup.add(coreMesh);

    // 2. Mid Translucent Mint-Jade Geodesic Shell
    const shellGeo = new THREE.IcosahedronGeometry(1.48, 0);
    const shellMat = new THREE.MeshPhysicalMaterial({
      color: 0x6ee7b7,
      metalness: 0.08,
      roughness: 0.18,
      transparent: true,
      opacity: 0.24,
      depthWrite: false,
      clearcoat: 1.0,
      flatShading: true,
    });
    const shellMesh = new THREE.Mesh(shellGeo, shellMat);
    heroGroup.add(shellMesh);

    // 3. Outer Botanical Wireframe Lattice
    const cageGeo = new THREE.IcosahedronGeometry(1.88, 1);
    const cageEdges = new THREE.EdgesGeometry(cageGeo);
    const cageMat = new THREE.LineBasicMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0.52,
    });
    const cageLines = new THREE.LineSegments(cageEdges, cageMat);
    heroGroup.add(cageLines);

    // 4. Expanding Kinetic Pulse Ring
    const pulseGeo = new THREE.TorusGeometry(1.5, 0.018, 12, 96);
    const pulseMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0,
    });
    const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
    pulseMesh.rotation.x = Math.PI / 2.4;
    heroGroup.add(pulseMesh);

    // 5. Three Tilted Orbital Precision Rings (Sage Silver + Warm Sunlit Amber)
    const ringGeo1 = new THREE.TorusGeometry(2.38, 0.022, 16, 120);
    const ringGeo2 = new THREE.TorusGeometry(2.68, 0.016, 16, 120);
    const ringGeo3 = new THREE.TorusGeometry(2.12, 0.015, 16, 100);

    const ringMatPrimary = new THREE.MeshStandardMaterial({
      color: 0x6ee7b7,
      metalness: 0.72,
      roughness: 0.24,
    });
    const ringMatAccent = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.76,
      roughness: 0.24,
    });

    const ring1 = new THREE.Mesh(ringGeo1, ringMatPrimary);
    ring1.rotation.set(Math.PI / 3.2, Math.PI / 6, 0);
    heroGroup.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo2, ringMatAccent);
    ring2.rotation.set(-Math.PI / 4, Math.PI / 3.5, Math.PI / 7);
    heroGroup.add(ring2);

    const ring3 = new THREE.Mesh(ringGeo3, ringMatPrimary);
    ring3.rotation.set(Math.PI / 2.2, -Math.PI / 4.5, 0);
    heroGroup.add(ring3);

    // 6. Colorful Low-Poly Polyhedral Satellites (Emerald, Teal, Lime, Amber, Coral)
    const satGroup = new THREE.Group();
    heroGroup.add(satGroup);
    const satGeoOcta = new THREE.OctahedronGeometry(0.19, 0);
    const satGeoTetra = new THREE.TetrahedronGeometry(0.2, 0);
    const satPalette = [0x10b981, 0x14b8a6, 0x84cc16, 0xf59e0b, 0xfb7185, 0x34d399];
    const satMaterials = satPalette.map(
      (hex) =>
        new THREE.MeshStandardMaterial({
          color: hex,
          metalness: 0.35,
          roughness: 0.25,
          flatShading: true,
        }),
    );

    const satellites: {
      mesh: THREE.Mesh;
      radius: number;
      speed: number;
      offset: number;
      yTilt: number;
    }[] = [];

    for (let i = 0; i < 6; i++) {
      const sat = new THREE.Mesh(
        i % 2 === 0 ? satGeoOcta : satGeoTetra,
        satMaterials[i],
      );
      const angle = (i / 6) * Math.PI * 2;
      const radius = 2.35 + (i % 3) * 0.22;
      sat.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * 0.65,
        Math.sin(angle) * radius,
      );
      satGroup.add(sat);
      satellites.push({
        mesh: sat,
        radius,
        speed: 0.35 + (i % 3) * 0.12,
        offset: angle,
        yTilt: (i % 2 === 0 ? 1 : -1) * 0.65,
      });
    }

    // 7. Floating Mathematical Symbol Sprites
    const symbolSprites: {
      sprite: THREE.Sprite;
      basePos: THREE.Vector3;
      phase: number;
      tex: THREE.CanvasTexture;
    }[] = [];
    const symbolCoords = [
      new THREE.Vector3(-2.65, 1.55, 0.7),
      new THREE.Vector3(2.7, 1.35, -0.4),
      new THREE.Vector3(-2.4, -1.65, -0.6),
      new THREE.Vector3(2.55, -1.45, 0.8),
      new THREE.Vector3(0.15, 2.55, -0.7),
      new THREE.Vector3(-0.25, -2.55, 0.5),
    ];

    MATH_SYMBOLS.forEach((sym, idx) => {
      const tex = createSymbolTexture(sym, isDarkRef.current);
      const spMat = new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        opacity: 0.92,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(spMat);
      sprite.scale.set(0.62, 0.62, 0.62);
      sprite.position.copy(symbolCoords[idx]);
      scene.add(sprite);
      symbolSprites.push({
        sprite,
        basePos: symbolCoords[idx].clone(),
        phase: idx * 1.1,
        tex,
      });
    });

    sceneThemeSyncRef.current = (dark: boolean) => {
      cageMat.color.setHex(dark ? 0x34d399 : 0x059669);
      cageMat.opacity = dark ? 0.52 : 0.42;
      ringMatPrimary.color.setHex(dark ? 0x6ee7b7 : 0x0f766e);
      symbolSprites.forEach((entry, i) => {
        const nextTex = createSymbolTexture(MATH_SYMBOLS[i], dark);
        entry.tex.dispose();
        entry.tex = nextTex;
        (entry.sprite.material as THREE.SpriteMaterial).map = nextTex;
        (entry.sprite.material as THREE.SpriteMaterial).needsUpdate = true;
      });
    };

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.rotateSpeed = 0.68;

    let burstStrength = 0;
    let pulseProgress = 1;

    pulseTriggerRef.current = () => {
      burstStrength = 1;
      pulseProgress = 0;
    };

    resetCameraRef.current = () => {
      camera.position.set(0, 0.35, 7.6);
      controls.target.set(0, 0, 0);
      controls.update();
      burstStrength = 0.45;
    };

    let pointerDownPos = { x: 0, y: 0 };
    const handlePointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };
    const handlePointerUp = (e: PointerEvent) => {
      const moved = Math.hypot(
        e.clientX - pointerDownPos.x,
        e.clientY - pointerDownPos.y,
      );
      if (moved < 6) {
        pulseTriggerRef.current?.();
      }
    };

    let pointerX = 0;
    let pointerY = 0;
    const handlePointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointerX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointerY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointerup', handlePointerUp);
    renderer.domElement.addEventListener('pointermove', handlePointerMove);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w <= 0 || h <= 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    let disposed = false;
    let frameId = 0;
    const clock = new THREE.Clock();

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

    function tick() {
      if (disposed) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();

      const activePreset = presetRef.current;
      burstStrength = Math.max(0, burstStrength - dt * 1.45);
      const speedMult =
        (activePreset === 'orbit' ? 1.85 : 1) + burstStrength * 2.8;

      if (pulseProgress < 1) {
        pulseProgress = Math.min(1, pulseProgress + dt * 1.6);
        const s = 0.8 + pulseProgress * 1.6;
        pulseMesh.scale.set(s, s, s);
        pulseMat.opacity = (1 - pulseProgress) * 0.72;
      } else {
        pulseMat.opacity = 0;
      }

      const targetCageScale =
        activePreset === 'canopy' ? 1.24 : activePreset === 'orbit' ? 0.92 : 1.0;
      const targetRingScale =
        activePreset === 'orbit' ? 1.12 : activePreset === 'canopy' ? 0.94 : 1.0;
      const targetShellOpacity =
        activePreset === 'canopy' ? 0.14 : activePreset === 'orbit' ? 0.2 : 0.26;

      const curCageScale = THREE.MathUtils.damp(
        cageLines.scale.x,
        targetCageScale + burstStrength * 0.08,
        6,
        dt,
      );
      cageLines.scale.setScalar(curCageScale);

      const curRingScale = THREE.MathUtils.damp(
        ring1.scale.x,
        targetRingScale,
        6,
        dt,
      );
      ring1.scale.setScalar(curRingScale);
      ring2.scale.setScalar(curRingScale);
      ring3.scale.setScalar(curRingScale);
      shellMat.opacity = THREE.MathUtils.damp(
        shellMat.opacity,
        targetShellOpacity,
        6,
        dt,
      );
      coreMat.emissiveIntensity = 0.28 + burstStrength * 0.65;

      if (!prefersReducedMotion) {
        coreMesh.rotation.y += dt * 0.45 * speedMult;
        coreMesh.rotation.x += dt * 0.25 * speedMult;
        shellMesh.rotation.y -= dt * 0.22 * speedMult;
        cageLines.rotation.y += dt * 0.14 * speedMult;
        cageLines.rotation.z += dt * 0.08 * speedMult;

        ring1.rotation.z += dt * 0.28 * speedMult;
        ring2.rotation.z -= dt * 0.21 * speedMult;
        ring3.rotation.x += dt * 0.18 * speedMult;

        const orbitSpread = activePreset === 'orbit' ? 1.14 : 1.0;
        satellites.forEach((s) => {
          const a =
            s.offset + elapsed * s.speed * (activePreset === 'orbit' ? 1.55 : 1);
          s.mesh.position.set(
            Math.cos(a) * s.radius * orbitSpread,
            Math.sin(a * 1.3) * s.yTilt,
            Math.sin(a) * s.radius * orbitSpread,
          );
          s.mesh.rotation.x += dt * 1.2;
          s.mesh.rotation.y += dt * 0.9;
        });

        symbolSprites.forEach((s) => {
          s.sprite.position.y =
            s.basePos.y + Math.sin(elapsed * 1.15 + s.phase) * 0.16;
        });

        heroGroup.rotation.x = THREE.MathUtils.damp(
          heroGroup.rotation.x,
          pointerY * 0.2,
          4,
          dt,
        );
        heroGroup.rotation.y = THREE.MathUtils.damp(
          heroGroup.rotation.y,
          pointerX * 0.26,
          4,
          dt,
        );
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      controls.dispose();

      coreGeo.dispose();
      coreMat.dispose();
      shellGeo.dispose();
      shellMat.dispose();
      cageGeo.dispose();
      cageEdges.dispose();
      cageMat.dispose();
      pulseGeo.dispose();
      pulseMat.dispose();
      ringGeo1.dispose();
      ringGeo2.dispose();
      ringGeo3.dispose();
      ringMatPrimary.dispose();
      ringMatAccent.dispose();
      satGeoOcta.dispose();
      satGeoTetra.dispose();
      satMaterials.forEach((m) => m.dispose());
      symbolSprites.forEach((s) => {
        s.tex.dispose();
        (s.sprite.material as THREE.SpriteMaterial).dispose();
      });
      envTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[380px] sm:h-[440px] lg:h-[500px] rounded-2xl border border-emerald-950/12 dark:border-emerald-500/20 bg-gradient-to-br from-emerald-50/85 via-white/90 to-amber-50/60 dark:from-[#0A1E17]/90 dark:via-[#06110D]/90 dark:to-[#0E241C]/90 backdrop-blur-sm overflow-hidden select-none shadow-sm">
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        aria-label="Interactive 3D low-poly botanical crystal — drag to rotate or click to pulse"
      />

      {/* Top hint line */}
      <div className="pointer-events-none absolute top-3.5 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
        <span>Drag to orbit · Click to pulse</span>
        <span className="tabular-nums">Interactive 3D</span>
      </div>

      {/* Bottom Interactive Control Bar */}
      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex items-center gap-1 p-1 rounded-xl border border-emerald-950/12 dark:border-emerald-500/25 bg-white/85 dark:bg-[#0B1B15]/85 backdrop-blur-md">
          {(
            [
              { id: 'crystal', label: 'Crystal' },
              { id: 'canopy', label: 'Canopy' },
              { id: 'orbit', label: 'Orbit' },
            ] as { id: ScenePreset; label: string }[]
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setPreset(item.id);
                pulseTriggerRef.current?.();
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors whitespace-nowrap ${
                preset === item.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="inline-flex items-center gap-1.5">
          <motion.button
            type="button"
            whileTap={{ scale: 0.94 }}
            onClick={() => pulseTriggerRef.current?.()}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-emerald-950/12 dark:border-emerald-500/25 bg-white/85 dark:bg-[#0B1B15]/85 backdrop-blur-md text-[11px] font-medium text-emerald-700 dark:text-emerald-400 hover:border-emerald-500/60 transition-colors"
          >
            <Sparkles className="w-3 h-3" />
            <span>Pulse</span>
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.94 }}
            onClick={() => resetCameraRef.current?.()}
            aria-label="Reset 3D view"
            title="Reset 3D view"
            className="inline-flex items-center justify-center w-8 h-8 rounded-xl border border-emerald-950/12 dark:border-emerald-500/25 bg-white/85 dark:bg-[#0B1B15]/85 backdrop-blur-md text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-emerald-500/60 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};
