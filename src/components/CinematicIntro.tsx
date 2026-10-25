import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { detectSoftwareGl, setupStudioEnvironment } from '../utils/threeHelpers';
import { sound } from '../utils/soundEffects';
import { Volume2, VolumeX, ArrowRight } from 'lucide-react';

interface CinematicIntroProps {
  onComplete: () => void;
}

export default function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [sceneStage, setSceneStage] = useState<number>(1); // 1: Void, 2: Motion, 3: 3D Reveal, 4: Brand Reveal, 5: Transition
  const [progress, setProgress] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftware = detectSoftwareGl();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFDFDFE);
    scene.fog = new THREE.FogExp2(0xFDFDFE, 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftware,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftware ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    setupStudioEnvironment(renderer, scene);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x7C3AED, 2.5); // electric violet
    keyLight.position.set(5, 8, 7);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x06B6D4, 2.0); // cyan fill
    fillLight.position.set(-6, -4, 5);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xF59E0B, 3.0, 20); // warm accent
    rimLight.position.set(0, 6, -5);
    scene.add(rimLight);

    // Group for floating scene elements
    const introGroup = new THREE.Group();
    scene.add(introGroup);

    // 1. Floating particles
    const particleCount = isSoftware ? 80 : 220;
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);

    const palette = [
      new THREE.Color(0x7C3AED), // violet
      new THREE.Color(0x3B82F6), // electric blue
      new THREE.Color(0x06B6D4), // cyan
      new THREE.Color(0xF59E0B), // subtle warm orange
      new THREE.Color(0xEC4899), // magenta
    ];

    for (let i = 0; i < particleCount; i++) {
      posArray[i * 3] = (Math.random() - 0.5) * 28;
      posArray[i * 3 + 1] = (Math.random() - 0.5) * 20;
      posArray[i * 3 + 2] = (Math.random() - 0.5) * 20;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colorArray[i * 3] = col.r;
      colorArray[i * 3 + 1] = col.g;
      colorArray[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    introGroup.add(particles);

    // 2. Multi-part floating geometric objects (glass spheres, metallic rings, prisms, cubes)
    const objects: Array<{
      mesh: THREE.Object3D;
      rotSpeed: { x: number; y: number; z: number };
      driftSpeed: { x: number; y: number; z: number };
      initPos: THREE.Vector3;
    }> = [];

    // Metallic ring
    const ringGeo = new THREE.TorusGeometry(2.4, 0.16, 24, 64);
    const ringMat = new THREE.MeshPhysicalMaterial({
      color: 0x6366F1,
      metalness: 0.9,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(-3.5, 1.5, -2);
    introGroup.add(ring);
    objects.push({
      mesh: ring,
      rotSpeed: { x: 0.012, y: 0.018, z: 0.005 },
      driftSpeed: { x: 0.003, y: 0.002, z: 0.001 },
      initPos: ring.position.clone(),
    });

    // Glass Icosahedron Prism
    const prismGeo = new THREE.IcosahedronGeometry(1.6, 0);
    const prismMat = new THREE.MeshPhysicalMaterial({
      color: 0xE0E7FF,
      metalness: 0.1,
      roughness: 0.05,
      transmission: isSoftware ? 0 : 0.88,
      transparent: true,
      opacity: isSoftware ? 0.45 : 0.95,
      ior: 1.6,
      reflectivity: 0.9,
    });
    const prism = new THREE.Mesh(prismGeo, prismMat);
    prism.position.set(3.8, -1.2, -1);
    introGroup.add(prism);
    objects.push({
      mesh: prism,
      rotSpeed: { x: 0.015, y: -0.01, z: 0.008 },
      driftSpeed: { x: -0.002, y: 0.003, z: 0 },
      initPos: prism.position.clone(),
    });

    // Central Monolith / 3D Structure that forms in Scene 3
    const centerStructure = new THREE.Group();
    centerStructure.position.set(0, 0, 0);
    centerStructure.scale.set(0.001, 0.001, 0.001); // starts collapsed
    introGroup.add(centerStructure);

    // Inner glowing geometric core
    const coreGeo = new THREE.OctahedronGeometry(1.4, 2);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x8B5CF6,
      metalness: 0.3,
      roughness: 0.2,
      emissive: 0x4338CA,
      emissiveIntensity: 0.4,
      clearcoat: 0.8,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    centerStructure.add(coreMesh);

    // Orbiting concentric rings around core
    const innerRingGeo = new THREE.TorusGeometry(2.0, 0.06, 16, 48);
    const innerRingMat = new THREE.MeshStandardMaterial({
      color: 0x06B6D4,
      metalness: 0.95,
      roughness: 0.1,
    });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    centerStructure.add(innerRing);

    const outerRingGeo = new THREE.TorusGeometry(2.7, 0.04, 16, 48);
    const outerRingMat = new THREE.MeshStandardMaterial({
      color: 0xF59E0B,
      metalness: 0.9,
      roughness: 0.2,
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.rotation.x = Math.PI / 3;
    centerStructure.add(outerRing);

    // Additional floating crystal cubes
    for (let i = 0; i < 6; i++) {
      const cubeSize = 0.4 + Math.random() * 0.5;
      const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
      const cubeMat = new THREE.MeshPhysicalMaterial({
        color: i % 2 === 0 ? 0x818CF8 : 0x38BDF8,
        metalness: 0.8,
        roughness: 0.2,
        clearcoat: 1.0,
      });
      const cube = new THREE.Mesh(cubeGeo, cubeMat);
      const angle = (i / 6) * Math.PI * 2;
      const dist = 4.5 + Math.random() * 2;
      cube.position.set(Math.cos(angle) * dist, Math.sin(angle) * dist * 0.7, (Math.random() - 0.5) * 4);
      introGroup.add(cube);
      objects.push({
        mesh: cube,
        rotSpeed: { x: 0.02 * (Math.random() - 0.5), y: 0.02 * (Math.random() - 0.5), z: 0.01 },
        driftSpeed: { x: 0.001, y: -0.001, z: 0.001 },
        initPos: cube.position.clone(),
      });
    }

    let animationFrameId: number;
    const startTime = performance.now();
    const totalDuration = 7000; // 7 seconds full cinematic experience

    function tick(now: number) {
      const elapsed = now - startTime;
      const progressFraction = Math.min(elapsed / totalDuration, 1);
      setProgress(Math.floor(progressFraction * 100));

      // Determine scene stage based on elapsed time
      if (elapsed < 1400) {
        setSceneStage(1); // The White Void
      } else if (elapsed < 3000) {
        setSceneStage(2); // Objects in Motion
      } else if (elapsed < 4600) {
        setSceneStage(3); // Cinematic 3D Reveal
      } else if (elapsed < 6200) {
        setSceneStage(4); // Brand Reveal
      } else {
        setSceneStage(5); // Smooth Transition Out
      }

      // Rotate objects
      objects.forEach((obj, idx) => {
        obj.mesh.rotation.x += obj.rotSpeed.x;
        obj.mesh.rotation.y += obj.rotSpeed.y;
        obj.mesh.rotation.z += obj.rotSpeed.z;

        // Subtle undulating drift
        const t = (now * 0.001) + idx;
        obj.mesh.position.y = obj.initPos.y + Math.sin(t) * 0.4;
        obj.mesh.position.x = obj.initPos.x + Math.cos(t * 0.8) * 0.3;
      });

      // Animate center structure crystallization
      if (elapsed >= 1400) {
        const revealFactor = Math.min((elapsed - 1400) / 1800, 1);
        const easeOutBack = (x: number) => {
          const c1 = 1.70158;
          const c3 = c1 + 1;
          return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
        };
        const currentScale = THREE.MathUtils.lerp(0.001, 1.0, easeOutBack(revealFactor));
        centerStructure.scale.set(currentScale, currentScale, currentScale);

        coreMesh.rotation.y += 0.02;
        coreMesh.rotation.x += 0.01;
        innerRing.rotation.z += 0.025;
        innerRing.rotation.y += 0.015;
        outerRing.rotation.x += 0.018;
        outerRing.rotation.y -= 0.012;
      }

      // Animate light sweep across scene
      keyLight.position.x = 8 * Math.cos(now * 0.0015);
      keyLight.position.z = 6 + 3 * Math.sin(now * 0.0015);

      // Camera gentle push in
      if (elapsed < 6000) {
        camera.position.z = 14 - (elapsed / 6000) * 3;
      } else {
        // Stage 5: camera moves through and objects expand outward
        const expandFactor = (elapsed - 6000) / 1000;
        camera.position.z = 11 - expandFactor * 6;
        introGroup.scale.multiplyScalar(1 + expandFactor * 0.04);
      }

      renderer.render(scene, camera);

      if (elapsed < totalDuration) {
        animationFrameId = requestAnimationFrame(tick);
      } else {
        // Automatically complete
        onComplete();
      }
    }

    animationFrameId = requestAnimationFrame(tick);

    // Audio cue trigger
    const soundTimer = setTimeout(() => {
      sound.playChime();
    }, 1800);

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
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* Subtle holographic ambient vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(241,245,249,0.7)_100%)]" />

      {/* Top HUD: Brand mark, Sound toggle & Skip button */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-6 sm:px-12">
        <div className="flex items-center gap-3">
          <img
            src="/assets/aistudio/1792931151691_d855e005.png"
            alt="AnK Logo"
            className="w-9 h-9 object-contain drop-shadow-sm rounded-lg"
          />
          <span className="font-display font-bold text-sm tracking-widest uppercase text-slate-800">
            AnK Creative Mind
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="p-2.5 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-sm border border-slate-200/80 transition-all hover:scale-105 active:scale-95"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-indigo-600" />}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onComplete();
            }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-wider uppercase text-slate-700 bg-white/85 hover:bg-white border border-slate-200 shadow-sm rounded-full transition-all hover:scale-105 active:scale-95"
          >
            <span>Skip Intro</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Centre Cinematic Overlay Text */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none px-6">
        <AnimatePresence mode="wait">
          {sceneStage <= 2 && (
            <motion.div
              key="stage-1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <p className="text-xs uppercase tracking-[0.3em] font-mono text-indigo-600 font-semibold mb-2">
                Creative Technology & Design
              </p>
              <h2 className="font-display text-2xl sm:text-4xl font-light text-slate-700 tracking-tight">
                Entering the Creative Space
              </h2>
            </motion.div>
          )}

          {sceneStage === 3 && (
            <motion.div
              key="stage-3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              <p className="text-xs uppercase tracking-[0.3em] font-mono text-cyan-600 font-semibold mb-2">
                Forming Dimensional Core
              </p>
              <h2 className="font-display text-2xl sm:text-4xl font-medium text-slate-800 tracking-tight">
                Where Imagination Takes Physical Form
              </h2>
            </motion.div>
          )}

          {sceneStage >= 4 && (
            <motion.div
              key="stage-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center flex flex-col items-center"
            >
              {/* Authentic AnK Brand Logo Asset */}
              <motion.div
                initial={{ scale: 0.6, rotate: -8, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
                className="mb-5 relative"
              >
                <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full" />
                <img
                  src="/assets/aistudio/1792931151691_d855e005.png"
                  alt="AnK Authentic Logo"
                  className="w-24 h-24 sm:w-28 sm:h-28 object-contain relative drop-shadow-xl"
                />
              </motion.div>

              <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-3">
                <span className="holographic-gradient-text">AnK Creative Mind</span>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-sm sm:text-lg text-slate-600 font-normal max-w-lg mx-auto"
              >
                Immersive 3D · High-End Design · Digital Experiences
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Progress Bar & Stage Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 w-full max-w-xs px-6">
        <div className="w-full bg-slate-200/80 rounded-full h-1 overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 transition-all duration-100 ease-out"
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
