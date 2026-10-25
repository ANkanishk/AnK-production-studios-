import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { Volume2, VolumeX, ArrowRight, Sparkles } from 'lucide-react';
import { sound } from '../utils/soundEffects';
import { detectSoftwareGl, setupStudioEnvironment } from '../utils/threeHelpers';

interface CinematicIntroProps {
  onComplete: () => void;
}

// Custom GLSL Shaders for the converging 'AnK!' particle system
const vertexShader = `
  uniform float uTime;
  uniform float uProgress;
  attribute vec3 aTarget;
  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float p = clamp(uProgress, 0.0, 1.0);

    // Swirling kinetic curl during convergence phase
    float swirl = (1.0 - p) * sin(uTime * 2.5 + aPhase * 6.28) * 1.8;
    vec3 currentPos = mix(position, aTarget, p);
    currentPos.x += sin(currentPos.y * 1.5 + uTime) * swirl * 0.25;
    currentPos.y += cos(currentPos.x * 1.5 + uTime) * swirl * 0.25;
    currentPos.z += sin(uTime * 3.0 + aPhase) * (1.0 - p) * 0.8;

    vec4 mvPosition = modelViewMatrix * vec4(currentPos, 1.0);
    gl_PointSize = (aSize * (170.0 / -mvPosition.z)) * (0.8 + 0.3 * sin(uTime * 4.0 + aPhase));
    gl_Position = projectionMatrix * mvPosition;

    // Shift color between initial void state and converged brand state
    vColor = mix(aColor, vec3(0.66, 0.33, 0.97), p * 0.4);
    vAlpha = mix(0.4, 0.95, p);
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    float core = 1.0 - smoothstep(0.0, 0.5, dist);
    // Soft glowing falloff with hot white-violet center
    vec3 finalColor = mix(vColor, vec3(1.0), pow(core, 3.0) * 0.6);
    gl_FragColor = vec4(finalColor, core * vAlpha);
  }
`;

// Helper to generate target sample points that outline 'AnK!' and the 16-point starburst
function generateAnKPoints(count: number): { positions: Float32Array; targets: Float32Array; colors: Float32Array; sizes: Float32Array; phases: Float32Array } {
  const positions = new Float32Array(count * 3);
  const targets = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const phases = new Float32Array(count);

  const starburstPoints = 16;
  const starOuterR = 3.2;
  const starInnerR = 1.8;

  for (let i = 0; i < count; i++) {
    // 1. Initial Dispersed Cosmic Void Coordinates
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    const rad = 6.0 + Math.random() * 8.0;

    positions[i * 3] = rad * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = rad * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = rad * Math.cos(phi);

    // 2. Target Coordinates: Form the AnK! letterforms + 16-point Starburst
    const pType = i % 5;
    let tx = 0;
    let ty = 0;
    let tz = (Math.random() - 0.5) * 0.2;

    if (pType === 0) {
      // 16-Point Starburst Perimeter
      const sAngle = (i / count) * Math.PI * 2 * starburstPoints;
      const isTip = (i % 2 === 0);
      const r = isTip ? starOuterR : starInnerR;
      tx = Math.cos(sAngle) * (r + (Math.random() - 0.5) * 0.2);
      ty = Math.sin(sAngle) * (r + (Math.random() - 0.5) * 0.2);
    } else if (pType === 1) {
      // Letter 'A' (Left side)
      const t = Math.random();
      if (Math.random() > 0.4) {
        // Legs of A
        tx = -1.8 + (Math.random() > 0.5 ? 1 : -1) * (1.0 - t) * 0.6;
        ty = -1.2 + t * 2.4;
      } else {
        // Crossbar of A
        tx = -1.8 + (Math.random() - 0.5) * 0.7;
        ty = -0.1;
      }
    } else if (pType === 2) {
      // Letter 'n' (Center-left)
      const t = Math.random();
      if (Math.random() > 0.4) {
        // Vertical stems
        tx = -0.7 + (Math.random() > 0.5 ? 0.6 : 0);
        ty = -1.1 + t * 1.8;
      } else {
        // Arch of n
        const arc = t * Math.PI;
        tx = -0.4 + Math.cos(arc) * 0.3;
        ty = 0.5 + Math.sin(arc) * 0.25;
      }
    } else if (pType === 3) {
      // Letter 'K' (Center-right)
      const t = Math.random();
      if (Math.random() > 0.5) {
        // Stem of K
        tx = 0.4;
        ty = -1.2 + t * 2.4;
      } else {
        // Diagonals of K
        const isUpper = Math.random() > 0.5;
        tx = 0.4 + t * 0.8;
        ty = isUpper ? 0.0 + t * 1.2 : 0.0 - t * 1.2;
      }
    } else {
      // Exclamation Mark '!' (Right side with purple burst)
      const isDot = Math.random() > 0.75;
      if (isDot) {
        tx = 1.6 + (Math.random() - 0.5) * 0.25;
        ty = -1.0 + (Math.random() - 0.5) * 0.25;
      } else {
        const t = Math.random();
        tx = 1.6 + (Math.random() - 0.5) * 0.2;
        ty = -0.5 + t * 1.7;
      }
    }

    targets[i * 3] = tx;
    targets[i * 3 + 1] = ty;
    targets[i * 3 + 2] = tz;

    // Palette: Purple (#A855F7), Cyan (#06B6D4), Obsidian (#09090B), Gold (#F59E0B)
    const isPurple = Math.random() > 0.4;
    colors[i * 3] = isPurple ? 0.66 : 0.02;
    colors[i * 3 + 1] = isPurple ? 0.33 : 0.71;
    colors[i * 3 + 2] = isPurple ? 0.97 : 0.83;

    sizes[i] = 0.12 + Math.random() * 0.2;
    phases[i] = Math.random();
  }

  return { positions, targets, colors, sizes, phases };
}

export default function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [sceneStage, setSceneStage] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());
  const uniformsRef = useRef({
    uTime: { value: 0 },
    uProgress: { value: 0 },
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftware = detectSoftwareGl();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFAFAFC);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 11);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftware,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftware ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    setupStudioEnvironment(renderer, scene);

    // 1. Create Shader-Based Particle System
    const particleCount = isSoftware ? 800 : 2200;
    const { positions, targets, colors, sizes, phases } = generateAnKPoints(particleCount);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aTarget', new THREE.BufferAttribute(targets, 3));
    geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: uniformsRef.current,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    // 2. Central 3D Physical Starburst Emblem for High-Impact Climax
    const textureLoader = new THREE.TextureLoader();
    const logoTexture = textureLoader.load('/assets/aistudio/1792931151691_d855e005.png');
    logoTexture.colorSpace = THREE.SRGBColorSpace;

    const emblemGeo = new THREE.CylinderGeometry(1.9, 1.9, 0.14, 48);
    emblemGeo.rotateX(Math.PI / 2);
    const emblemMat = new THREE.MeshBasicMaterial({
      map: logoTexture,
      transparent: true,
    });
    const emblemMesh = new THREE.Mesh(emblemGeo, emblemMat);
    emblemMesh.scale.set(0.001, 0.001, 0.001);
    scene.add(emblemMesh);

    // 3. GSAP Physics-Based Entrance Timeline
    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      },
    });

    // Step 1: Cosmic Void & Particle awakening (0 - 1.2s)
    tl.to(
      {},
      {
        duration: 1.2,
        onStart: () => setSceneStage(1),
      }
    );

    // Step 2: High-impact physics convergence into 'AnK!' logo shape (1.2s - 3.2s)
    tl.to(
      uniformsRef.current.uProgress,
      {
        value: 1.0,
        duration: 1.8,
        ease: 'power4.inOut',
        onStart: () => {
          setSceneStage(2);
          sound.playSweep();
        },
      },
      '+=0.1'
    );

    // Step 3: Explosive Starburst Crystallization (3.2s - 4.4s)
    tl.to(
      emblemMesh.scale,
      {
        x: 1.0,
        y: 1.0,
        z: 1.0,
        duration: 1.0,
        ease: 'elastic.out(1.1, 0.4)',
        onStart: () => {
          setSceneStage(3);
          sound.playChime();
        },
      },
      '-=0.2'
    );

    // Step 4: Kinetic Brand Text Reveal (4.4s - 5.8s)
    tl.to(
      {},
      {
        duration: 1.4,
        onStart: () => setSceneStage(4),
      }
    );

    // Step 5: Smooth Outward Push into Homepage (5.8s - 6.5s)
    tl.to(
      camera.position,
      {
        z: 4.5,
        duration: 0.8,
        ease: 'power2.in',
        onStart: () => setSceneStage(5),
      }
    );
    tl.call(() => {
      onComplete();
    });

    // 4. Lossless Render Loop
    let animId: number;
    let clock = new THREE.Clock();

    const tick = () => {
      const elapsed = clock.getElapsedTime();
      uniformsRef.current.uTime.value = elapsed;

      particleSystem.rotation.y = elapsed * 0.08;
      emblemMesh.rotation.z = Math.sin(elapsed * 1.5) * 0.05;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      tl.kill();
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onComplete]);

  const toggleSound = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#FAFAFC] select-none">
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* Top HUD */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-6 sm:px-12">
        <div className="flex items-center gap-3">
          <img
            src="/assets/aistudio/1792931151691_d855e005.png"
            alt="AnK Logo"
            className="w-9 h-9 object-contain drop-shadow-sm rounded-lg"
          />
          <span className="font-display font-black text-sm tracking-widest uppercase text-slate-900">
            AnK! <span className="font-normal text-slate-500">Creative Mind</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="p-2.5 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-sm border border-slate-200/80 transition-all hover:scale-105 active:scale-95"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-purple-600" />}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onComplete();
            }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-wider uppercase text-slate-800 bg-white/90 hover:bg-white border border-slate-200 shadow-sm rounded-full transition-all hover:scale-105 active:scale-95"
          >
            <span>Skip Intro</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Center Kinetic Typography & Stage Description */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none px-6">
        {sceneStage === 1 && (
          <div className="text-center animate-in fade-in duration-500">
            <p className="text-xs uppercase tracking-[0.35em] font-mono text-purple-600 font-semibold mb-2">
              Shader Particle System Initializing
            </p>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Cosmic Void in Motion
            </h2>
          </div>
        )}

        {sceneStage === 2 && (
          <div className="text-center animate-in fade-in zoom-in-95 duration-500">
            <p className="text-xs uppercase tracking-[0.35em] font-mono text-indigo-600 font-bold mb-2">
              GLSL Morphing Engine · GSAP Physics
            </p>
            <h2 className="font-display text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Particles Converging Into &apos;AnK!&apos;
            </h2>
          </div>
        )}

        {sceneStage >= 3 && (
          <div className="text-center flex flex-col items-center animate-in fade-in duration-600">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-widest uppercase text-purple-600 mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Dimensional Synthesis Complete</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-slate-900 mb-3">
              <span className="bg-gradient-to-r from-slate-900 via-purple-700 to-indigo-600 bg-clip-text text-transparent">
                AnK Creative Mind
              </span>
            </h1>

            <p className="text-sm sm:text-lg text-slate-600 font-medium max-w-lg mx-auto">
              Immersive 3D · Kinetic Motion · Unforgettable Experiences
            </p>
          </div>
        )}
      </div>

      {/* Bottom Stage Progress Bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 w-full max-w-xs px-6">
        <div className="w-full bg-slate-200/80 rounded-full h-1 overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 transition-all duration-300 ease-out"
            style={{ width: `${(sceneStage / 5) * 100}%` }}
          />
        </div>
        <div className="flex items-center justify-between w-full text-[11px] font-mono text-slate-500 uppercase tracking-wider">
          <span>GLSL Shader Stage 0{sceneStage}</span>
          <span>GSAP Choreography</span>
        </div>
      </div>
    </div>
  );
}
