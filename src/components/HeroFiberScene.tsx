import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Float, 
  MeshTransmissionMaterial, 
  ContactShadows, 
  Environment, 
  Sparkles,
  useTexture
} from '@react-three/drei';
import * as THREE from 'three';

// Procedural 16-point comic starburst shape generator for AnK logo backing
function createStarburstGeometry() {
  const shape = new THREE.Shape();
  const numPoints = 16;
  const outerRadius = 2.2;
  const innerRadius = 1.4;

  for (let i = 0; i < numPoints * 2; i++) {
    const angle = (i / (numPoints * 2)) * Math.PI * 2;
    const jitter = i % 3 === 0 ? 0.3 : i % 2 === 0 ? -0.15 : 0.1;
    const r = i % 2 === 0 ? outerRadius + jitter : innerRadius + jitter * 0.5;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();

  return new THREE.ExtrudeGeometry(shape, {
    depth: 0.32,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.08,
    bevelThickness: 0.08,
  });
}

// 3D AnK Starburst with R3F & Drei
function AnKStarburstModel() {
  const starburstRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const logoTexture = useTexture('/assets/aistudio/1792931151691_d855e005.png');

  const starGeo = useMemo(() => {
    const geo = createStarburstGeometry();
    geo.center();
    return geo;
  }, []);

  useFrame((state, delta) => {
    if (!starburstRef.current) return;
    const { pointer } = state;
    // Mouse parallax tracking
    starburstRef.current.rotation.y = THREE.MathUtils.damp(starburstRef.current.rotation.y, pointer.x * 0.55, 6, delta);
    starburstRef.current.rotation.x = THREE.MathUtils.damp(starburstRef.current.rotation.x, -pointer.y * 0.45, 6, delta);

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.6;
      ringRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={starburstRef}>
      {/* 1. Main Obsidian Comic Starburst Body */}
      <mesh geometry={starGeo} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#121216"
          metalness={0.8}
          roughness={0.2}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* 2. Electric Purple Wireframe Rim Accent */}
      <mesh geometry={starGeo} scale={[1.03, 1.03, 1.06]}>
        <meshStandardMaterial
          color="#8B5CF6"
          emissive="#6D28D9"
          emissiveIntensity={0.6}
          wireframe
        />
      </mesh>

      {/* 3. Embossed Emblem Faceplate with Authentic Logo */}
      <mesh position={[0, 0, 0.22]}>
        <cylinderGeometry args={[1.65, 1.65, 0.12, 48]} />
        <meshPhysicalMaterial
          color="#7C3AED"
          metalness={0.9}
          roughness={0.15}
        />
        {/* Front Decal with Logo */}
        <mesh position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.7, 2.7]} />
          <meshBasicMaterial
            map={logoTexture}
            transparent
            polygonOffset
            polygonOffsetFactor={-1}
          />
        </mesh>
      </mesh>

      {/* 4. Kinetic Glowing Orbit Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2.7, 0, 0]}>
        <torusGeometry args={[2.8, 0.04, 16, 64]} />
        <meshStandardMaterial
          color="#A855F7"
          emissive="#7C3AED"
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
}

// Prismatic Crystal Sculpture with Advanced Light Transmission
function PrismaticCrystalModel() {
  const crystalRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!crystalRef.current) return;
    const { pointer } = state;
    crystalRef.current.rotation.y = THREE.MathUtils.damp(crystalRef.current.rotation.y, pointer.x * 0.5, 6, delta);
    crystalRef.current.rotation.x = THREE.MathUtils.damp(crystalRef.current.rotation.x, -pointer.y * 0.4, 6, delta);

    if (coreRef.current) {
      coreRef.current.rotation.y -= delta * 0.8;
      coreRef.current.rotation.x += delta * 0.4;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.5;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x += delta * 0.4;
    }
  });

  return (
    <group ref={crystalRef}>
      {/* 1. Transmissive Faceted Outer Crystal Gem */}
      <mesh>
        <icosahedronGeometry args={[1.35, 0]} />
        <MeshTransmissionMaterial
          backside
          samples={8}
          thickness={1.6}
          roughness={0.05}
          ior={1.65}
          chromaticAberration={0.12}
          anisotropy={0.3}
          distortion={0.2}
          distortionScale={0.3}
          temporalDistortion={0.1}
          color="#EEF2FF"
          attenuationColor="#6366F1"
          attenuationDistance={1.2}
        />
      </mesh>

      {/* 2. Inner Glowing Core */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial
          color="#7C3AED"
          emissive="#4F46E5"
          emissiveIntensity={1.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* 3. Concentric Equatorial Titanium Ring */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 2.3, 0, 0]}>
        <torusGeometry args={[1.9, 0.06, 24, 64]} />
        <meshPhysicalMaterial
          color="#38BDF8"
          metalness={0.95}
          roughness={0.12}
          clearcoat={1.0}
        />
      </mesh>

      {/* 4. Tilted Rose-Gold Polar Ring */}
      <mesh ref={ring2Ref} rotation={[0, Math.PI / 3, 0]}>
        <torusGeometry args={[2.3, 0.05, 24, 64]} />
        <meshPhysicalMaterial
          color="#F59E0B"
          metalness={0.92}
          roughness={0.16}
          clearcoat={0.9}
        />
      </mesh>
    </group>
  );
}

interface HeroFiberSceneProps {
  mode: 'ank-logo' | 'prismatic-crystal';
}

export default function HeroFiberScene({ mode }: HeroFiberSceneProps) {
  return (
    <div className="w-full h-full min-h-[460px] sm:min-h-[560px] relative pointer-events-auto cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 6.8], fov: 38 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
      >
        <color attach="background" args={['#FAFAFC']} />
        <fog attach="fog" args={['#FAFAFC', 8, 22]} />

        {/* Ambient & Studio Directional Lighting */}
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 7, 6]} intensity={2.6} color="#ffffff" castShadow />
        <directionalLight position={[-5, -2, 4]} intensity={1.8} color="#06B6D4" />
        <pointLight position={[0, 4, -4]} intensity={3.5} color="#A855F7" />

        {/* Studio HDRI Environment for realistic metallic & glass reflections */}
        <Environment preset="city" />

        {/* Ambient Sparkles */}
        <Sparkles count={mode === 'ank-logo' ? 40 : 60} scale={7} size={2.5} speed={0.4} color="#8B5CF6" />

        <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.2} position={[0, -0.15, 0]}>
          {mode === 'ank-logo' ? <AnKStarburstModel /> : <PrismaticCrystalModel />}
        </Float>

        {/* Contact Shadow Grounding */}
        <ContactShadows
          position={[0, -2.4, 0]}
          opacity={0.45}
          scale={7.5}
          blur={2.5}
          far={4}
          color="#1E1B4B"
        />
      </Canvas>
    </div>
  );
}
