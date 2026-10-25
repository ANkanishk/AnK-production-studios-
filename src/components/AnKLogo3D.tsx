import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { detectSoftwareGl, setupStudioEnvironment, createContactShadowPlane } from '../utils/threeHelpers';

interface AnKLogo3DProps {
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onBurst?: () => void;
}

export default function AnKLogo3D({ interactive = true, size = 'lg', onBurst }: AnKLogo3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const isHovered = useRef(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftware = detectSoftwareGl();
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    const cameraDistance = size === 'lg' ? 6.8 : size === 'md' ? 8.2 : 10;
    camera.position.set(0, 0, cameraDistance);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftware,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftware ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    setupStudioEnvironment(renderer, scene);

    // Studio Lighting tailored to black/white/purple AnK! logo aesthetic
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(4, 6, 6);
    scene.add(keyLight);

    // Signature Electric Purple Rim Light matching the AnK exclamation mark
    const purpleRimLight = new THREE.PointLight(0xA855F7, 5.0, 16);
    purpleRimLight.position.set(-3, 3, 2);
    scene.add(purpleRimLight);

    const cyanAccentLight = new THREE.PointLight(0x06B6D4, 3.5, 14);
    cyanAccentLight.position.set(4, -3, 3);
    scene.add(cyanAccentLight);

    // Root Group for 3D Logo Assembly
    const logoGroup = new THREE.Group();
    scene.add(logoGroup);

    // Soft Contact Shadow Grounding
    const contactShadow = createContactShadowPlane(3.5);
    contactShadow.position.y = -2.2;
    scene.add(contactShadow);

    // 1. Procedural 3D Starburst Comic Backing Shape (Matching the logo's jagged faceted starburst)
    const starShape = new THREE.Shape();
    const numPoints = 16;
    const outerRadius = 2.1;
    const innerRadius = 1.35;

    for (let i = 0; i < numPoints * 2; i++) {
      const angle = (i / (numPoints * 2)) * Math.PI * 2;
      // Add slight organic comic variation to each spike
      const jitter = (i % 3 === 0 ? 0.25 : i % 2 === 0 ? -0.15 : 0.1);
      const r = (i % 2 === 0 ? outerRadius + jitter : innerRadius + jitter * 0.5);
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (i === 0) starShape.moveTo(x, y);
      else starShape.lineTo(x, y);
    }
    starShape.closePath();

    const extrudeSettings = {
      depth: 0.28,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    };

    const starGeo = new THREE.ExtrudeGeometry(starShape, extrudeSettings);
    starGeo.center();

    // Dark obsidian / comic textured metallic material with purple specular
    const starMat = new THREE.MeshPhysicalMaterial({
      color: 0x18181B, // Zinc-900 obsidian black
      metalness: 0.75,
      roughness: 0.25,
      clearcoat: 0.9,
      clearcoatRoughness: 0.15,
    });
    const starMesh = new THREE.Mesh(starGeo, starMat);
    starMesh.position.z = -0.15;
    logoGroup.add(starMesh);

    // 2. Beveled Golden/Cyan Edge Rim for the Starburst (Composite accent layer)
    const starRimMat = new THREE.MeshStandardMaterial({
      color: 0x7C3AED, // Electric purple rim
      emissive: 0x4C1D95,
      emissiveIntensity: 0.35,
      metalness: 0.9,
      roughness: 0.2,
      wireframe: true,
    });
    const starRimMesh = new THREE.Mesh(starGeo, starRimMat);
    starRimMesh.scale.set(1.02, 1.02, 1.05);
    starRimMesh.position.z = -0.16;
    logoGroup.add(starRimMesh);

    // 3. Central Brand Face Plate with the user's authentic high-res logo
    const textureLoader = new THREE.TextureLoader();
    const logoTexture = textureLoader.load('/assets/aistudio/1792931151691_d855e005.png', () => {
      renderer.render(scene, camera);
    });
    logoTexture.colorSpace = THREE.SRGBColorSpace;
    logoTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // 3D Extruded circular / organic medallion displaying the emblem
    const faceplateGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.14, 48);
    faceplateGeo.rotateX(Math.PI / 2);

    const faceplateMatFront = new THREE.MeshBasicMaterial({
      map: logoTexture,
      transparent: true,
    });
    const faceplateMatSide = new THREE.MeshPhysicalMaterial({
      color: 0x7C3AED, // Violet side extrusion
      metalness: 0.8,
      roughness: 0.2,
    });
    const faceplate = new THREE.Mesh(faceplateGeo, [
      faceplateMatSide,
      faceplateMatFront,
      faceplateMatSide,
    ]);
    faceplate.position.z = 0.2;
    logoGroup.add(faceplate);

    // 4. Ink Splatter Particles in 3D (Matching the logo's dynamic black ink splashes)
    const splashCount = isSoftware ? 25 : 55;
    const splashGroup = new THREE.Group();
    logoGroup.add(splashGroup);

    const splashMeshes: Array<{
      mesh: THREE.Mesh;
      initialPos: THREE.Vector3;
      velocity: THREE.Vector3;
      rotSpeed: THREE.Vector3;
    }> = [];

    const dropMat = new THREE.MeshPhysicalMaterial({
      color: 0x09090B, // ink black
      metalness: 0.3,
      roughness: 0.1,
      clearcoat: 1.0,
    });

    const purpleGlowMat = new THREE.MeshPhysicalMaterial({
      color: 0xA855F7, // bright purple droplet
      emissive: 0x7C3AED,
      emissiveIntensity: 0.4,
      metalness: 0.6,
      roughness: 0.2,
    });

    for (let i = 0; i < splashCount; i++) {
      const radius = 0.04 + Math.random() * 0.12;
      const dropGeo = new THREE.DodecahedronGeometry(radius, 1);
      const isPurple = Math.random() > 0.75;
      const drop = new THREE.Mesh(dropGeo, isPurple ? purpleGlowMat : dropMat);

      const angle = (i / splashCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const dist = 1.9 + Math.random() * 1.5;
      const zOffset = (Math.random() - 0.5) * 0.8;

      drop.position.set(Math.cos(angle) * dist, Math.sin(angle) * dist, zOffset);

      splashGroup.add(drop);
      splashMeshes.push({
        mesh: drop,
        initialPos: drop.position.clone(),
        velocity: new THREE.Vector3(Math.cos(angle) * 0.2, Math.sin(angle) * 0.2, (Math.random() - 0.5) * 0.2),
        rotSpeed: new THREE.Vector3(Math.random() * 0.02, Math.random() * 0.02, Math.random() * 0.02),
      });
    }

    // 5. Kinetic 3D Orbit Rings around Logo
    const orbitRingGeo = new THREE.TorusGeometry(2.6, 0.03, 16, 64);
    const orbitRingMat = new THREE.MeshStandardMaterial({
      color: 0xA855F7,
      metalness: 0.9,
      roughness: 0.15,
      transparent: true,
      opacity: 0.85,
    });
    const orbitRing = new THREE.Mesh(orbitRingGeo, orbitRingMat);
    orbitRing.rotation.x = Math.PI / 2.8;
    logoGroup.add(orbitRing);

    // Pointer Parallax & Interactive burst
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!interactive) return;
      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      const rect = container.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((clientY - rect.top) / rect.height) * 2 - 1);
      mousePos.current.targetX = Math.max(-1, Math.min(1, x)) * 0.8;
      mousePos.current.targetY = Math.max(-1, Math.min(1, y)) * 0.6;
    };

    const handleMouseEnter = () => {
      isHovered.current = true;
    };

    const handleMouseLeave = () => {
      isHovered.current = false;
      mousePos.current.targetX = 0;
      mousePos.current.targetY = 0;
    };

    container.addEventListener('mousemove', handlePointerMove, { passive: true });
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('touchmove', handlePointerMove, { passive: true });

    // Animation Loop with Spring Kinematics
    let frameId = 0;
    let lastTime = performance.now();

    function tick(now: number) {
      const dt = Math.min((now - lastTime) * 0.001, 0.1);
      lastTime = now;

      // Exponential damping on mouse coordinates
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * (1 - Math.exp(-7 * dt));
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * (1 - Math.exp(-7 * dt));

      // 3D Logo Gentle Floating & Spring Tilt
      logoGroup.rotation.y = mousePos.current.x * 0.55 + Math.sin(now * 0.001) * 0.08;
      logoGroup.rotation.x = -mousePos.current.y * 0.45 + Math.cos(now * 0.0012) * 0.06;
      logoGroup.position.y = Math.sin(now * 0.002) * 0.1;

      // Orbit Ring Spin
      orbitRing.rotation.z += 0.01;
      orbitRing.rotation.y += 0.005;

      // Animate ink splash particles (breathing expansion and spin)
      splashMeshes.forEach((item, idx) => {
        item.mesh.rotation.x += item.rotSpeed.x;
        item.mesh.rotation.y += item.rotSpeed.y;

        const pulse = Math.sin(now * 0.003 + idx * 0.3) * 0.15;
        item.mesh.position.x = item.initialPos.x * (1 + pulse);
        item.mesh.position.y = item.initialPos.y * (1 + pulse);
      });

      // Light Sweep
      purpleRimLight.position.x = 4 * Math.sin(now * 0.002);
      purpleRimLight.position.y = 3 * Math.cos(now * 0.0015);

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
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [interactive, size]);

  return (
    <div
      ref={mountRef}
      onClick={onBurst}
      className="w-full h-full min-h-[360px] sm:min-h-[460px] relative pointer-events-auto cursor-grab active:cursor-grabbing flex items-center justify-center"
      aria-label="3D AnK! Logo with procedural comic burst shield and ink particles"
    />
  );
}
