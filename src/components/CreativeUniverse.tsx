import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { detectSoftwareGl, setupStudioEnvironment, createContactShadowPlane } from '../utils/threeHelpers';
import { sound } from '../utils/soundEffects';
import { ChevronDown, ChevronUp, RotateCw, Eye, Layers, Sparkles, Sliders } from 'lucide-react';

type ModelType = 'prism' | 'gyro' | 'lattice' | 'torus';
type FinishType = 'glass' | 'platinum' | 'iridescent' | 'ceramic';
type LightingType = 'studio' | 'violet' | 'sunset';

export default function CreativeUniverse() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [modelType, setModelType] = useState<ModelType>('prism');
  const [finishType, setFinishType] = useState<FinishType>('glass');
  const [lightingType, setLightingType] = useState<LightingType>('studio');
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [rotationSpeed, setRotationSpeed] = useState<number>(1);
  const [separation, setSeparation] = useState<number>(0); // 0 to 1
  const [isDockCollapsed, setIsDockCollapsed] = useState<boolean>(false);

  // Three.js mutable state refs
  const stateRef = useRef({
    modelType,
    finishType,
    lightingType,
    isWireframe,
    rotationSpeed,
    separation,
  });

  useEffect(() => {
    stateRef.current = {
      modelType,
      finishType,
      lightingType,
      isWireframe,
      rotationSpeed,
      separation,
    };
  }, [modelType, finishType, lightingType, isWireframe, rotationSpeed, separation]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftware = detectSoftwareGl();
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xF8F9FC);
    scene.fog = new THREE.Fog(0xF8F9FC, 10, 28);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 1.2, 6.5);

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

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 14;
    controls.minDistance = 3;
    controls.maxPolarAngle = Math.PI / 2 + 0.05; // don't go below ground

    // Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x06B6D4, 1.8);
    fillLight.position.set(-6, -2, 4);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x7C3AED, 3.0, 15);
    rimLight.position.set(0, 5, -5);
    scene.add(rimLight);

    // Root Group for Sculptures
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Grounding Contact Shadow Plane
    const contactShadow = createContactShadowPlane(3.2);
    contactShadow.position.y = -1.8;
    rootGroup.add(contactShadow);

    // Sub-groups for the 4 procedural models
    const prismGroup = new THREE.Group();
    const gyroGroup = new THREE.Group();
    const latticeGroup = new THREE.Group();
    const torusGroup = new THREE.Group();

    rootGroup.add(prismGroup);
    rootGroup.add(gyroGroup);
    rootGroup.add(latticeGroup);
    rootGroup.add(torusGroup);

    // Material Generator function based on finish
    const createMaterial = (finish: FinishType, wireframe: boolean, baseColorHex = 0xffffff) => {
      if (finish === 'glass') {
        return new THREE.MeshPhysicalMaterial({
          color: baseColorHex,
          metalness: 0.1,
          roughness: 0.05,
          transmission: isSoftware ? 0 : 0.88,
          transparent: true,
          opacity: isSoftware ? 0.45 : 0.95,
          ior: 1.6,
          reflectivity: 0.9,
          clearcoat: 1.0,
          wireframe,
        });
      } else if (finish === 'platinum') {
        return new THREE.MeshPhysicalMaterial({
          color: 0xE2E8F0,
          metalness: 0.96,
          roughness: 0.14,
          clearcoat: 0.8,
          clearcoatRoughness: 0.1,
          wireframe,
        });
      } else if (finish === 'iridescent') {
        return new THREE.MeshPhysicalMaterial({
          color: 0x818CF8,
          metalness: 0.8,
          roughness: 0.2,
          clearcoat: 1.0,
          emissive: 0x312E81,
          emissiveIntensity: 0.2,
          wireframe,
        });
      } else {
        // Ceramic
        return new THREE.MeshPhysicalMaterial({
          color: 0xFAFAFC,
          metalness: 0.05,
          roughness: 0.2,
          clearcoat: 1.0,
          clearcoatRoughness: 0.05,
          wireframe,
        });
      }
    };

    // 1. Build PRISM Model (Composite: Core facet + nested inner octahedron + 2 floating shield plates)
    const prismCoreGeo = new THREE.IcosahedronGeometry(1.2, 0);
    const prismCore = new THREE.Mesh(prismCoreGeo, createMaterial('glass', false, 0xEEF2FF));
    prismGroup.add(prismCore);

    const prismInnerGeo = new THREE.OctahedronGeometry(0.65, 0);
    const prismInnerMat = new THREE.MeshStandardMaterial({
      color: 0x7C3AED,
      emissive: 0x4F46E5,
      emissiveIntensity: 0.5,
      metalness: 0.8,
      roughness: 0.2,
    });
    const prismInner = new THREE.Mesh(prismInnerGeo, prismInnerMat);
    prismGroup.add(prismInner);

    const prismShieldGeo = new THREE.TorusGeometry(1.7, 0.06, 16, 48);
    const prismShield1 = new THREE.Mesh(prismShieldGeo, createMaterial('platinum', false, 0x06B6D4));
    prismShield1.rotation.x = Math.PI / 3;
    prismGroup.add(prismShield1);

    const prismShield2 = new THREE.Mesh(prismShieldGeo, createMaterial('platinum', false, 0xF59E0B));
    prismShield2.rotation.y = Math.PI / 4;
    prismGroup.add(prismShield2);

    // 2. Build GYRO Model (3 Concentric Gimbal Rings + center floating sphere)
    const gyroRingGeo1 = new THREE.TorusGeometry(1.7, 0.08, 24, 64);
    const gyroRing1 = new THREE.Mesh(gyroRingGeo1, createMaterial('platinum', false, 0x4F46E5));
    gyroGroup.add(gyroRing1);

    const gyroRingGeo2 = new THREE.TorusGeometry(1.3, 0.07, 24, 64);
    const gyroRing2 = new THREE.Mesh(gyroRingGeo2, createMaterial('iridescent', false, 0x06B6D4));
    gyroGroup.add(gyroRing2);

    const gyroRingGeo3 = new THREE.TorusGeometry(0.9, 0.06, 24, 64);
    const gyroRing3 = new THREE.Mesh(gyroRingGeo3, createMaterial('ceramic', false, 0xF59E0B));
    gyroGroup.add(gyroRing3);

    const gyroCenterGeo = new THREE.SphereGeometry(0.45, 32, 32);
    const gyroCenter = new THREE.Mesh(gyroCenterGeo, createMaterial('glass', false, 0x8B5CF6));
    gyroGroup.add(gyroCenter);

    // 3. Build LATTICE Model (Instanced nodes and connecting rods)
    const latticeNodesGroup = new THREE.Group();
    const nodeGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const nodeMat = createMaterial('platinum', false, 0x6366F1);
    const nodeCount = 14;
    const nodeMeshes: THREE.Mesh[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const mesh = new THREE.Mesh(nodeGeo, nodeMat);
      const u = i / nodeCount;
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      mesh.position.set(
        1.3 * Math.cos(theta) * Math.sin(phi),
        1.3 * Math.sin(theta) * Math.sin(phi),
        1.3 * Math.cos(phi)
      );
      latticeNodesGroup.add(mesh);
      nodeMeshes.push(mesh);
    }
    latticeGroup.add(latticeNodesGroup);

    const latticeCoreGeo = new THREE.DodecahedronGeometry(0.8, 0);
    const latticeCore = new THREE.Mesh(latticeCoreGeo, createMaterial('glass', false, 0x38BDF8));
    latticeGroup.add(latticeCore);

    // 4. Build TORUS Model (Undulating Torus Knot with outer orbit ribbon)
    const torusKnotGeo = new THREE.TorusKnotGeometry(1.0, 0.32, 120, 24, 2, 3);
    const torusKnot = new THREE.Mesh(torusKnotGeo, createMaterial('iridescent', false, 0x7C3AED));
    torusGroup.add(torusKnot);

    const torusHaloGeo = new THREE.TorusGeometry(1.85, 0.04, 16, 64);
    const torusHalo = new THREE.Mesh(torusHaloGeo, createMaterial('platinum', false, 0x06B6D4));
    torusHalo.rotation.x = Math.PI / 2.2;
    torusGroup.add(torusHalo);

    let frameId = 0;
    let lastTime = performance.now();

    function tick(now: number) {
      const dt = Math.min((now - lastTime) * 0.001, 0.1);
      lastTime = now;

      const { modelType: curModel, finishType: curFinish, lightingType: curLight, isWireframe: curWire, rotationSpeed: curRot, separation: curSep } = stateRef.current;

      // Update Lighting based on preset
      if (curLight === 'studio') {
        scene.background = new THREE.Color(0xF8F9FC);
        scene.fog?.color.setHex(0xF8F9FC);
        keyLight.color.setHex(0xffffff);
        fillLight.color.setHex(0x06B6D4);
        rimLight.color.setHex(0x7C3AED);
      } else if (curLight === 'violet') {
        scene.background = new THREE.Color(0xF5F3FF);
        scene.fog?.color.setHex(0xF5F3FF);
        keyLight.color.setHex(0x8B5CF6);
        fillLight.color.setHex(0x3B82F6);
        rimLight.color.setHex(0xEC4899);
      } else {
        // Sunset
        scene.background = new THREE.Color(0xFFF7ED);
        scene.fog?.color.setHex(0xFFF7ED);
        keyLight.color.setHex(0xF59E0B);
        fillLight.color.setHex(0xFB7185);
        rimLight.color.setHex(0x6366F1);
      }

      // Visibility toggling
      prismGroup.visible = curModel === 'prism';
      gyroGroup.visible = curModel === 'gyro';
      latticeGroup.visible = curModel === 'lattice';
      torusGroup.visible = curModel === 'torus';

      // Animate active model
      const rotDelta = dt * curRot;

      if (curModel === 'prism') {
        prismCore.rotation.y += rotDelta * 0.8;
        prismCore.rotation.x += rotDelta * 0.4;
        prismInner.rotation.y -= rotDelta * 1.2;
        prismShield1.rotation.z += rotDelta * 0.9;
        prismShield2.rotation.y -= rotDelta * 0.7;

        // Separation / Explode effect
        prismShield1.position.y = curSep * 0.9;
        prismShield2.position.y = -curSep * 0.9;
        prismCore.scale.setScalar(1 + curSep * 0.2);
      } else if (curModel === 'gyro') {
        gyroRing1.rotation.x += rotDelta * 1.1;
        gyroRing2.rotation.y += rotDelta * 1.4;
        gyroRing3.rotation.z += rotDelta * 1.7;
        gyroCenter.rotation.y += rotDelta * 0.6;

        gyroRing1.scale.setScalar(1 + curSep * 0.5);
        gyroRing2.scale.setScalar(1 + curSep * 0.3);
        gyroCenter.position.y = Math.sin(now * 0.002) * (0.1 + curSep * 0.4);
      } else if (curModel === 'lattice') {
        latticeNodesGroup.rotation.y += rotDelta * 0.6;
        latticeNodesGroup.rotation.x += rotDelta * 0.3;
        latticeCore.rotation.y -= rotDelta * 0.9;

        nodeMeshes.forEach((m, idx) => {
          m.position.normalize().multiplyScalar(1.3 + curSep * 0.8 + Math.sin(now * 0.003 + idx) * 0.05);
        });
      } else if (curModel === 'torus') {
        torusKnot.rotation.y += rotDelta * 0.7;
        torusKnot.rotation.x += rotDelta * 0.5;
        torusHalo.rotation.z -= rotDelta * 0.8;
        torusHalo.position.y = curSep * 0.6;
      }

      // Gentle floating of entire root
      rootGroup.position.y = Math.sin(now * 0.0012) * 0.08;

      controls.update();
      renderer.render(scene, camera);

      frameId = requestAnimationFrame(tick);
    }

    frameId = requestAnimationFrame(tick);

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
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section id="universe" className="relative py-24 bg-[#FAFAFC] border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-indigo-600 tracking-widest uppercase mb-2">
              <span>Interactive 3D Engine</span>
              <span aria-hidden="true" className="text-slate-300">/</span>
              <span>Procedural Geometry</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              CREATIVE UNIVERSE
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-600 max-w-md">
            Directly manipulate real-time procedural Three.js artifacts. Inspect materials, lighting rigs, exploded mechanics, and shaders.
          </p>
        </div>
      </div>

      {/* 3D Viewport with Collapsible Bottom Dock (Zero Viewport Occlusion) */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="relative w-full h-[620px] rounded-3xl overflow-hidden glass-panel border border-slate-200 shadow-sm">
          {/* WebGL Canvas */}
          <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Minimal Top-Left Spec Badge */}
          <div className="absolute top-5 left-5 z-20 flex items-center gap-3 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/80 text-xs font-mono text-slate-700 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            <span className="font-semibold uppercase tracking-wider">{modelType}</span>
            <span className="text-slate-400">·</span>
            <span>{finishType}</span>
          </div>

          {/* Collapsible Bottom Control Dock */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-[840px] flex flex-col items-center">
            {/* Collapse / Expand Toggle Tab */}
            <button
              onClick={() => {
                sound.playClick();
                setIsDockCollapsed(!isDockCollapsed);
              }}
              className="mb-2 px-4 py-1 rounded-full bg-white/95 border border-slate-200 text-xs font-medium text-slate-700 shadow-sm hover:text-indigo-600 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
            >
              {isDockCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              <span>{isDockCollapsed ? 'Show Controls' : 'Hide Controls'}</span>
            </button>

            {/* Main Dock Body */}
            {!isDockCollapsed && (
              <div className="w-full bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xl p-4 sm:p-5 flex flex-col gap-4">
                {/* Row 1: Model Geometry Selectors & Material Finishes */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3">
                  {/* Model Selector Buttons */}
                  <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl">
                    {(['prism', 'gyro', 'lattice', 'torus'] as ModelType[]).map((m) => (
                      <button
                        key={m}
                        onClick={() => {
                          sound.playClick();
                          setModelType(m);
                        }}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                          modelType === m
                            ? 'bg-white text-indigo-600 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>

                  {/* Material Finish Buttons */}
                  <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl">
                    {(['glass', 'platinum', 'iridescent', 'ceramic'] as FinishType[]).map((f) => (
                      <button
                        key={f}
                        onClick={() => {
                          sound.playClick();
                          setFinishType(f);
                        }}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${
                          finishType === f
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Row 2: Fine Sliders & Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center text-xs">
                  {/* Explode / Layer Separation Slider */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-mono shrink-0 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-indigo-500" />
                      Explode
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={separation}
                      onChange={(e) => setSeparation(parseFloat(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                    <span className="font-mono text-slate-700 w-8 tabular-nums">
                      {Math.round(separation * 100)}%
                    </span>
                  </div>

                  {/* Rotation Speed Slider */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-mono shrink-0 flex items-center gap-1">
                      <RotateCw className="w-3.5 h-3.5 text-indigo-500" />
                      Spin
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="3"
                      step="0.1"
                      value={rotationSpeed}
                      onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                    <span className="font-mono text-slate-700 w-6 tabular-nums">
                      {rotationSpeed.toFixed(1)}x
                    </span>
                  </div>

                  {/* Lighting Preset & Wireframe Toggle */}
                  <div className="flex items-center justify-end gap-2">
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                      {(['studio', 'violet', 'sunset'] as LightingType[]).map((l) => (
                        <button
                          key={l}
                          onClick={() => {
                            sound.playClick();
                            setLightingType(l);
                          }}
                          className={`px-2 py-1 text-[11px] font-medium rounded capitalize ${
                            lightingType === l ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                          }`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        sound.playClick();
                        setIsWireframe(!isWireframe);
                      }}
                      className={`px-2.5 py-1 text-[11px] font-medium rounded-lg border transition-colors ${
                        isWireframe
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-600'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Wireframe
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
