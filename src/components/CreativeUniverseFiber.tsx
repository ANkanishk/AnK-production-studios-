import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Float, 
  MeshTransmissionMaterial, 
  ContactShadows, 
  Environment,
  Sparkles
} from '@react-three/drei';
import * as THREE from 'three';
import { ChevronDown, ChevronUp, RotateCw, Layers, Sliders } from 'lucide-react';
import { sound } from '../utils/soundEffects';

type ModelType = 'prism' | 'gyro' | 'lattice' | 'torus';
type FinishType = 'glass' | 'platinum' | 'iridescent' | 'ceramic';
type LightingType = 'studio' | 'violet' | 'sunset';

interface ModelProps {
  finish: FinishType;
  wireframe: boolean;
  separation: number;
  rotationSpeed: number;
}

// 1. Prism Model
function PrismModel({ finish, wireframe, separation, rotationSpeed }: ModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const s1Ref = useRef<THREE.Mesh>(null);
  const s2Ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    const rot = delta * rotationSpeed;
    if (coreRef.current) {
      coreRef.current.rotation.y += rot * 0.8;
      coreRef.current.rotation.x += rot * 0.4;
    }
    if (s1Ref.current) s1Ref.current.rotation.z += rot * 0.9;
    if (s2Ref.current) s2Ref.current.rotation.y -= rot * 0.7;
  });

  return (
    <group ref={groupRef}>
      {/* Central Prism */}
      <mesh scale={1 + separation * 0.2}>
        <icosahedronGeometry args={[1.2, 0]} />
        {finish === 'glass' ? (
          <MeshTransmissionMaterial
            backside
            samples={6}
            thickness={1.4}
            roughness={0.06}
            ior={1.6}
            chromaticAberration={0.15}
            color="#EEF2FF"
            wireframe={wireframe}
          />
        ) : (
          <meshPhysicalMaterial
            color={finish === 'platinum' ? '#E2E8F0' : finish === 'iridescent' ? '#818CF8' : '#FAFAFC'}
            metalness={finish === 'platinum' ? 0.95 : finish === 'iridescent' ? 0.85 : 0.05}
            roughness={finish === 'ceramic' ? 0.2 : 0.12}
            clearcoat={1.0}
            wireframe={wireframe}
          />
        )}
      </mesh>

      {/* Inner Glowing Core */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.65, 0]} />
        <meshStandardMaterial
          color="#7C3AED"
          emissive="#4F46E5"
          emissiveIntensity={1.0}
          wireframe={wireframe}
        />
      </mesh>

      {/* Orbital Shield 1 */}
      <mesh ref={s1Ref} position={[0, separation * 0.9, 0]} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.7, 0.06, 16, 48]} />
        <meshPhysicalMaterial
          color="#06B6D4"
          metalness={0.9}
          roughness={0.15}
          wireframe={wireframe}
        />
      </mesh>

      {/* Orbital Shield 2 */}
      <mesh ref={s2Ref} position={[0, -separation * 0.9, 0]} rotation={[0, Math.PI / 4, 0]}>
        <torusGeometry args={[1.7, 0.06, 16, 48]} />
        <meshPhysicalMaterial
          color="#F59E0B"
          metalness={0.9}
          roughness={0.18}
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}

// 2. Gyro Model
function GyroModel({ finish, wireframe, separation, rotationSpeed }: ModelProps) {
  const r1 = useRef<THREE.Mesh>(null);
  const r2 = useRef<THREE.Mesh>(null);
  const r3 = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    const rot = delta * rotationSpeed;
    if (r1.current) r1.current.rotation.x += rot * 1.1;
    if (r2.current) r2.current.rotation.y += rot * 1.3;
    if (r3.current) r3.current.rotation.z += rot * 1.6;
  });

  return (
    <group>
      <mesh ref={r1} scale={1 + separation * 0.5}>
        <torusGeometry args={[1.7, 0.08, 24, 64]} />
        <meshPhysicalMaterial
          color="#4F46E5"
          metalness={finish === 'ceramic' ? 0.1 : 0.95}
          roughness={0.14}
          clearcoat={1.0}
          wireframe={wireframe}
        />
      </mesh>

      <mesh ref={r2} scale={1 + separation * 0.3}>
        <torusGeometry args={[1.3, 0.07, 24, 64]} />
        <meshPhysicalMaterial
          color="#06B6D4"
          metalness={finish === 'ceramic' ? 0.1 : 0.9}
          roughness={0.16}
          clearcoat={0.9}
          wireframe={wireframe}
        />
      </mesh>

      <mesh ref={r3} scale={1 + separation * 0.15}>
        <torusGeometry args={[0.9, 0.06, 24, 64]} />
        <meshPhysicalMaterial
          color="#F59E0B"
          metalness={finish === 'ceramic' ? 0.1 : 0.88}
          roughness={0.2}
          clearcoat={0.8}
          wireframe={wireframe}
        />
      </mesh>

      {/* Center Floating Sphere */}
      <mesh>
        <sphereGeometry args={[0.45, 32, 32]} />
        <MeshTransmissionMaterial
          backside
          samples={6}
          thickness={1.2}
          roughness={0.08}
          ior={1.6}
          color="#8B5CF6"
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}

// 3. Lattice Model
function LatticeModel({ finish, wireframe, separation, rotationSpeed }: ModelProps) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * rotationSpeed * 0.6;
      group.current.rotation.x += delta * rotationSpeed * 0.3;
    }
  });

  const nodePositions = React.useMemo(() => {
    const pts: [number, number, number][] = [];
    const count = 14;
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      pts.push([
        1.3 * Math.cos(theta) * Math.sin(phi),
        1.3 * Math.sin(theta) * Math.sin(phi),
        1.3 * Math.cos(phi),
      ]);
    }
    return pts;
  }, []);

  return (
    <group ref={group}>
      <mesh>
        <dodecahedronGeometry args={[0.8, 0]} />
        <MeshTransmissionMaterial
          backside
          samples={6}
          thickness={1.3}
          roughness={0.05}
          ior={1.6}
          color="#38BDF8"
          wireframe={wireframe}
        />
      </mesh>

      {nodePositions.map((pos, idx) => (
        <mesh
          key={idx}
          position={[
            pos[0] * (1 + separation * 0.5),
            pos[1] * (1 + separation * 0.5),
            pos[2] * (1 + separation * 0.5),
          ]}
        >
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshPhysicalMaterial
            color="#6366F1"
            metalness={0.9}
            roughness={0.15}
            clearcoat={1.0}
            wireframe={wireframe}
          />
        </mesh>
      ))}
    </group>
  );
}

// 4. Torus Model
function TorusModel({ finish, wireframe, separation, rotationSpeed }: ModelProps) {
  const knot = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    const rot = delta * rotationSpeed;
    if (knot.current) {
      knot.current.rotation.y += rot * 0.7;
      knot.current.rotation.x += rot * 0.4;
    }
    if (halo.current) halo.current.rotation.z -= rot * 0.8;
  });

  return (
    <group>
      <mesh ref={knot}>
        <torusKnotGeometry args={[1.0, 0.32, 120, 24, 2, 3]} />
        <meshPhysicalMaterial
          color="#7C3AED"
          emissive="#312E81"
          emissiveIntensity={0.3}
          metalness={finish === 'ceramic' ? 0.05 : 0.88}
          roughness={finish === 'ceramic' ? 0.2 : 0.15}
          clearcoat={1.0}
          wireframe={wireframe}
        />
      </mesh>

      <mesh ref={halo} position={[0, separation * 0.6, 0]} rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[1.85, 0.04, 16, 64]} />
        <meshPhysicalMaterial
          color="#06B6D4"
          metalness={0.95}
          roughness={0.1}
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}

export default function CreativeUniverseFiber() {
  const [modelType, setModelType] = useState<ModelType>('prism');
  const [finishType, setFinishType] = useState<FinishType>('glass');
  const [lightingType, setLightingType] = useState<LightingType>('studio');
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [rotationSpeed, setRotationSpeed] = useState<number>(1);
  const [separation, setSeparation] = useState<number>(0);
  const [isDockCollapsed, setIsDockCollapsed] = useState<boolean>(false);

  const envPreset = lightingType === 'sunset' ? 'sunset' : lightingType === 'violet' ? 'night' : 'city';

  return (
    <section id="universe" className="py-24 bg-[#FAFAFC] relative border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-purple-600 tracking-widest uppercase mb-2">
              <span>Fiber & Drei 3D Engine</span>
              <span aria-hidden="true" className="text-slate-300">/</span>
              <span>Procedural Geometry</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              CREATIVE UNIVERSE
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-600 max-w-md">
            Directly manipulate real-time procedural Three.js artifacts. Inspect materials, lighting rigs, exploded mechanics, and shaders.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="relative w-full h-[620px] rounded-3xl overflow-hidden glass-panel border border-slate-200 shadow-sm">
          {/* React Three Fiber Canvas */}
          <Canvas
            camera={{ position: [0, 1.2, 6.5], fov: 40 }}
            gl={{
              antialias: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.15,
            }}
          >
            <color attach="background" args={['#F8F9FC']} />
            <fog attach="fog" args={['#F8F9FC', 10, 26]} />

            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 8, 6]} intensity={2.4} color="#ffffff" castShadow />
            <directionalLight position={[-6, -2, 4]} intensity={1.8} color="#06B6D4" />
            <pointLight position={[0, 5, -5]} intensity={3.0} color="#7C3AED" />

            <Environment preset={envPreset} />
            <Sparkles count={45} scale={6} size={2} speed={0.3} color="#8B5CF6" />

            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.25}>
              {modelType === 'prism' && (
                <PrismModel finish={finishType} wireframe={isWireframe} separation={separation} rotationSpeed={rotationSpeed} />
              )}
              {modelType === 'gyro' && (
                <GyroModel finish={finishType} wireframe={isWireframe} separation={separation} rotationSpeed={rotationSpeed} />
              )}
              {modelType === 'lattice' && (
                <LatticeModel finish={finishType} wireframe={isWireframe} separation={separation} rotationSpeed={rotationSpeed} />
              )}
              {modelType === 'torus' && (
                <TorusModel finish={finishType} wireframe={isWireframe} separation={separation} rotationSpeed={rotationSpeed} />
              )}
            </Float>

            <ContactShadows position={[0, -1.8, 0]} opacity={0.4} scale={6.5} blur={2.4} far={4} color="#1E1B4B" />
            <OrbitControls enableDamping dampingFactor={0.05} maxDistance={14} minDistance={3} maxPolarAngle={Math.PI / 2 + 0.05} />
          </Canvas>

          {/* Minimal Spec Badge */}
          <div className="absolute top-5 left-5 z-20 flex items-center gap-3 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/80 text-xs font-mono text-slate-700 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-purple-600"></span>
            <span className="font-semibold uppercase tracking-wider">{modelType}</span>
            <span className="text-slate-400">·</span>
            <span>{finishType}</span>
          </div>

          {/* Collapsible Bottom Control Dock */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-[840px] flex flex-col items-center">
            <button
              onClick={() => {
                sound.playClick();
                setIsDockCollapsed(!isDockCollapsed);
              }}
              className="mb-2 px-4 py-1 rounded-full bg-white/95 border border-slate-200 text-xs font-medium text-slate-700 shadow-sm hover:text-purple-600 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
            >
              {isDockCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              <span>{isDockCollapsed ? 'Show Controls' : 'Hide Controls'}</span>
            </button>

            {!isDockCollapsed && (
              <div className="w-full bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xl p-4 sm:p-5 flex flex-col gap-4">
                {/* Row 1: Model Selection & Material Finishes */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3">
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
                            ? 'bg-white text-purple-600 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>

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

                {/* Row 2: Sliders & Lighting */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-mono shrink-0 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-purple-500" />
                      Explode
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={separation}
                      onChange={(e) => setSeparation(parseFloat(e.target.value))}
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                    <span className="font-mono text-slate-700 w-8 tabular-nums">
                      {Math.round(separation * 100)}%
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-mono shrink-0 flex items-center gap-1">
                      <RotateCw className="w-3.5 h-3.5 text-purple-500" />
                      Spin
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="3"
                      step="0.1"
                      value={rotationSpeed}
                      onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                    <span className="font-mono text-slate-700 w-6 tabular-nums">
                      {rotationSpeed.toFixed(1)}x
                    </span>
                  </div>

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
                          ? 'bg-purple-50 border-purple-300 text-purple-600'
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
