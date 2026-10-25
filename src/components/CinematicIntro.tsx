import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { detectSoftwareGl, setupStudioEnvironment } from '../utils/threeHelpers';
import { sound } from '../utils/soundEffects';
import { Volume2, VolumeX, ArrowRight, Sparkles } from 'lucide-react';

interface CinematicIntroProps {
  onComplete: () => void;
}

export default function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [sceneStage, setSceneStage] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftware = detectSoftwareGl();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFAFAFC);
    scene.fog = new THREE.FogExp2(0xFAFAFC, 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 13);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftware,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftware ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    setupStudioEnvironment(renderer, scene);

    // Studio Lighting for Black/Purple/White AnK Comic Aesthetic
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(5, 7, 7);
    scene.add(keyLight);

    const purpleKey = new THREE.PointLight(0xA855F7, 6.0, 18); // Electric purple light
    purpleKey.position.set(-4, 3, 4);
    scene.add(purpleKey);

    const cyanRim = new THREE.PointLight(0x06B6D4, 3.5, 15);
    cyanRim.position.set(4, -3, 3);
    scene.add(cyanRim);

    // Group for intro elements
    const introGroup = new THREE.Group();
    scene.add(introGroup);

    // 1. Floating Particles & Ink Debris in 3D
    const particleCount = isSoftware ? 60 : 180;
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);

    const palette = [
      new THREE.Color(0x09090B), // Ink black
      new THREE.Color(0x7C3AED), // Violet
      new THREE.Color(0xA855F7), // Purple
      new THREE.Color(0x06B6D4), // Cyan
      new THREE.Color(0x18181B), // Charcoal
    ];

    for (let i = 0; i < particleCount; i++) {
      posArray[i * 3] = (Math.random() - 0.5) * 26;
      posArray[i * 3 + 1] = (Math.random() - 0.5) * 18;
      posArray[i * 3 + 2] = (Math.random() - 0.5) * 18;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colorArray[i * 3] = col.r;
      colorArray[i * 3 + 1] = col.g;
      colorArray[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    introGroup.add(particles);

    // 2. Centerpiece: 3D Procedural AnK! Comic Starburst & Logo
    const starburstGroup = new THREE.Group();
    starburstGroup.scale.set(0.001, 0.001, 0.001);
    introGroup.add(starburstGroup);

    // Procedural 16-point jagged comic burst shape
    const starShape = new THREE.Shape();
    const points = 16;
    for (let i = 0; i < points * 2; i++) {
      const angle = (i / (points * 2)) * Math.PI * 2;
      const jitter = (i % 3 === 0 ? 0.35 : i % 2 === 0 ? -0.2 : 0.1);
      const r = (i % 2 === 0 ? 2.5 + jitter : 1.5 + jitter * 0.5);
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (i === 0) starShape.moveTo(x, y);
      else starShape.lineTo(x, y);
    }
    starShape.closePath();

    const extrudeSettings = {
      depth: 0.35,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 0.1,
      bevelThickness: 0.1,
    };
    const starGeo = new THREE.ExtrudeGeometry(starShape, extrudeSettings);
    starGeo.center();

    // Obsidian black metallic finish
    const starMat = new THREE.MeshPhysicalMaterial({
      color: 0x18181B,
      metalness: 0.8,
      roughness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const starMesh = new THREE.Mesh(starGeo, starMat);
    starMesh.position.z = -0.2;
    starburstGroup.add(starMesh);

    // Purple Glowing Accent Wireframe Rim
    const starRimMat = new THREE.MeshStandardMaterial({
      color: 0x7C3AED,
      emissive: 0x6D28D9,
      emissiveIntensity: 0.5,
      wireframe: true,
    });
    const starRim = new THREE.Mesh(starGeo, starRimMat);
    starRim.scale.set(1.03, 1.03, 1.08);
    starburstGroup.add(starRim);

    // Front Emblem Texture Plate featuring the authentic user logo
    const textureLoader = new THREE.TextureLoader();
    const logoTexture = textureLoader.load('/assets/aistudio/1792931151691_d855e005.png', () => {
      renderer.render(scene, camera);
    });
    logoTexture.colorSpace = THREE.SRGBColorSpace;

    const emblemGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.16, 48);
    emblemGeo.rotateX(Math.PI / 2);

    const emblemMatFront = new THREE.MeshBasicMaterial({
      map: logoTexture,
      transparent: true,
    });
    const emblemMatSide = new THREE.MeshPhysicalMaterial({
      color: 0x7C3AED, // purple extruded side
      metalness: 0.85,
      roughness: 0.15,
    });
    const emblemMesh = new THREE.Mesh(emblemGeo, [emblemMatSide, emblemMatFront, emblemMatSide]);
    emblemMesh.position.z = 0.25;
    starburstGroup.add(emblemMesh);

    // Kinetic Outer Orbit Rings
    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(3.1, 0.05, 16, 64),
      new THREE.MeshStandardMaterial({ color: 0xA855F7, metalness: 0.9, roughness: 0.1 })
    );
    ring1.rotation.x = Math.PI / 2.5;
    starburstGroup.add(ring1);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(3.6, 0.04, 16, 64),
      new THREE.MeshStandardMaterial({ color: 0x06B6D4, metalness: 0.9, roughness: 0.1 })
    );
    ring2.rotation.y = Math.PI / 3;
    starburstGroup.add(ring2);

    // Ink Droplet Splash Group
    const splashes: THREE.Mesh[] = [];
    const splashCount = isSoftware ? 20 : 45;
    for (let i = 0; i < splashCount; i++) {
      const radius = 0.05 + Math.random() * 0.14;
      const splashGeo = new THREE.DodecahedronGeometry(radius, 1);
      const isPurple = Math.random() > 0.7;
      const splashMat = new THREE.MeshPhysicalMaterial({
        color: isPurple ? 0xA855F7 : 0x09090B,
        metalness: isPurple ? 0.7 : 0.2,
        roughness: 0.1,
        clearcoat: 1.0,
      });
      const splash = new THREE.Mesh(splashGeo, splashMat);

      const angle = (i / splashCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const dist = 2.4 + Math.random() * 1.8;
      splash.position.set(Math.cos(angle) * dist, Math.sin(angle) * dist, (Math.random() - 0.5) * 0.8);

      starburstGroup.add(splash);
      splashes.push(splash);
    }

    let animationFrameId: number;
    const startTime = performance.now();
    const totalDuration = 6500;

    function tick(now: number) {
      const elapsed = now - startTime;
      const progressFraction = Math.min(elapsed / totalDuration, 1);
      setProgress(Math.floor(progressFraction * 100));

      if (elapsed < 1200) {
        setSceneStage(1); // The White Void
      } else if (elapsed < 2600) {
        setSceneStage(2); // Objects & Particles in Motion
      } else if (elapsed < 4200) {
        setSceneStage(3); // 3D AnK Starburst Crystallization
      } else if (elapsed < 5800) {
        setSceneStage(4); // Brand Reveal
      } else {
        setSceneStage(5); // Transition into Homepage
      }

      // Rotate background particles
      particles.rotation.y = now * 0.0003;
      particles.rotation.x = now * 0.0002;

      // Animate Starburst Assembly
      if (elapsed >= 1200) {
        const revealFactor = Math.min((elapsed - 1200) / 1600, 1);
        const easeOutBack = (x: number) => {
          const c1 = 1.70158;
          const c3 = c1 + 1;
          return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
        };
        const currentScale = THREE.MathUtils.lerp(0.001, 1.0, easeOutBack(revealFactor));
        starburstGroup.scale.set(currentScale, currentScale, currentScale);

        starburstGroup.rotation.y = Math.sin(now * 0.0012) * 0.25;
        starburstGroup.rotation.x = Math.cos(now * 0.0015) * 0.15;
        ring1.rotation.z += 0.015;
        ring2.rotation.z -= 0.02;

        splashes.forEach((s, idx) => {
          s.rotation.x += 0.01;
          s.rotation.y += 0.015;
          const wobble = Math.sin(now * 0.004 + idx) * 0.1;
          s.position.x += wobble * 0.01;
        });
      }

      // Light Sweep
      purpleKey.position.x = 6 * Math.sin(now * 0.002);
      purpleKey.position.y = 4 * Math.cos(now * 0.0018);

      // Camera push in
      if (elapsed < 5600) {
        camera.position.z = 13 - (elapsed / 5600) * 3.5;
      } else {
        // Expand outward in stage 5
        const exp = (elapsed - 5600) / 900;
        camera.position.z = 9.5 - exp * 6;
        starburstGroup.scale.multiplyScalar(1 + exp * 0.05);
      }

      renderer.render(scene, camera);

      if (elapsed < totalDuration) {
        animationFrameId = requestAnimationFrame(tick);
      } else {
        onComplete();
      }
    }

    animationFrameId = requestAnimationFrame(tick);

    const soundTimer = setTimeout(() => {
      sound.playChime();
    }, 1500);

    const resizeHandler = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', resizeHandler);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(soundTimer);
      window.removeEventListener('resize', resizeHandler);
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

      {/* Center Cinematic Kinetic Text Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none px-6">
        <AnimatePresence mode="wait">
          {sceneStage <= 2 && (
            <motion.div
              key="intro-stage-1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <p className="text-xs uppercase tracking-[0.35em] font-mono text-purple-600 font-semibold mb-2">
                Initiating 3D Studio Void
              </p>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Where Ideas Erupt in 3D
              </h2>
            </motion.div>
          )}

          {sceneStage === 3 && (
            <motion.div
              key="intro-stage-3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <p className="text-xs uppercase tracking-[0.35em] font-mono text-indigo-600 font-bold mb-2">
                3D Starburst Synthesis
              </p>
              <h2 className="font-display text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Sculpting the Dimensional Identity
              </h2>
            </motion.div>
          )}

          {sceneStage >= 4 && (
            <motion.div
              key="intro-stage-4"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.15 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-center flex flex-col items-center"
            >
              <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-widest uppercase text-purple-600 mb-2">
                <Sparkles className="w-4 h-4" />
                <span>AnK Creative Mind</span>
              </div>

              <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-slate-900 mb-3">
                <span className="bg-gradient-to-r from-slate-900 via-purple-700 to-indigo-600 bg-clip-text text-transparent">
                  AnK Creative Mind
                </span>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="text-sm sm:text-lg text-slate-600 font-medium max-w-lg mx-auto"
              >
                Immersive 3D · Kinetic Motion · Unforgettable Experiences
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Progress Bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 w-full max-w-xs px-6">
        <div className="w-full bg-slate-200/80 rounded-full h-1 overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between w-full text-[11px] font-mono text-slate-500 uppercase tracking-wider">
          <span>Scene 0{sceneStage}</span>
          <span>{progress}% Loaded</span>
        </div>
      </div>
    </div>
  );
}
