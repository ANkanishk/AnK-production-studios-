import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { detectSoftwareGl, setupStudioEnvironment, createContactShadowPlane } from '../utils/threeHelpers';

export default function HeroScene3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftware = detectSoftwareGl();
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene & Fog matching bright white/offwhite backdrop
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xFAFAFB, 8, 25);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 50);
    camera.position.set(0, 0.5, 7.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftware,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftware ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // Studio Environment Reflections
    setupStudioEnvironment(renderer, scene);

    // Lighting rig: Warm directional key, cool hemisphere fill, chromatic rim lights
    const hemiLight = new THREE.HemisphereLight(0xF8FAFC, 0xE2E8F0, 1.2);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0x6366F1, 2.8); // electric violet/indigo
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x06B6D4, 2.0); // cyan fill
    fillLight.position.set(-5, -2, 4);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xF59E0B, 2.5, 12); // subtle warm gold rim
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    // Composite 3D Hero Sculpture (Composite 3-12 parts)
    const heroGroup = new THREE.Group();
    heroGroup.position.set(0, 0, 0);
    scene.add(heroGroup);

    // Part 1: Central Prismatic Gem (Icosahedron with transmission glass & clearcoat)
    const gemGeo = new THREE.IcosahedronGeometry(1.25, 0);
    const gemMat = new THREE.MeshPhysicalMaterial({
      color: 0xEEF2FF,
      metalness: 0.12,
      roughness: 0.08,
      transmission: isSoftware ? 0 : 0.85,
      transparent: true,
      opacity: isSoftware ? 0.6 : 0.95,
      ior: 1.65,
      thickness: 1.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const centralGem = new THREE.Mesh(gemGeo, gemMat);
    heroGroup.add(centralGem);

    // Part 2: Inner Kinetic Core (Octahedron glowing core)
    const coreGeo = new THREE.OctahedronGeometry(0.65, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x7C3AED,
      emissive: 0x4338CA,
      emissiveIntensity: 0.6,
      metalness: 0.8,
      roughness: 0.2,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    heroGroup.add(coreMesh);

    // Part 3: Concentric Equatorial Ring (Brushed Titanium)
    const eqRingGeo = new THREE.TorusGeometry(1.9, 0.07, 24, 72);
    const eqRingMat = new THREE.MeshPhysicalMaterial({
      color: 0x38BDF8, // cyan accent
      metalness: 0.95,
      roughness: 0.12,
      clearcoat: 0.9,
    });
    const eqRing = new THREE.Mesh(eqRingGeo, eqRingMat);
    eqRing.rotation.x = Math.PI / 2.3;
    heroGroup.add(eqRing);

    // Part 4: Tilted Polar Ring (Rose Gold / Subtle Orange)
    const polRingGeo = new THREE.TorusGeometry(2.3, 0.05, 24, 72);
    const polRingMat = new THREE.MeshPhysicalMaterial({
      color: 0xF59E0B, // warm orange accent
      metalness: 0.9,
      roughness: 0.18,
    });
    const polRing = new THREE.Mesh(polRingGeo, polRingMat);
    polRing.rotation.y = Math.PI / 3;
    heroGroup.add(polRing);

    // Part 5: Floating satellite spheres (Glass and Metallic marbles)
    const satellites: THREE.Mesh[] = [];
    const satCount = 4;
    for (let i = 0; i < satCount; i++) {
      const radius = 0.25 + (i % 2) * 0.12;
      const satGeo = new THREE.SphereGeometry(radius, 24, 24);
      const satMat = new THREE.MeshPhysicalMaterial({
        color: i % 2 === 0 ? 0x818CF8 : 0x06B6D4,
        metalness: i % 2 === 0 ? 0.9 : 0.2,
        roughness: 0.1,
        clearcoat: 1.0,
      });
      const sat = new THREE.Mesh(satGeo, satMat);
      heroGroup.add(sat);
      satellites.push(sat);
    }

    // Part 6: Ambient floating particles around centerpiece
    const dustCount = isSoftware ? 40 : 120;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      const dist = 2.2 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      dustPos[i * 3] = dist * Math.cos(phi) * Math.cos(theta);
      dustPos[i * 3 + 1] = dist * Math.sin(phi);
      dustPos[i * 3 + 2] = dist * Math.cos(phi) * Math.sin(theta);

      const col = (i % 3 === 0) ? new THREE.Color(0x7C3AED) : (i % 3 === 1) ? new THREE.Color(0x06B6D4) : new THREE.Color(0xF59E0B);
      dustColors[i * 3] = col.r;
      dustColors[i * 3 + 1] = col.g;
      dustColors[i * 3 + 2] = col.b;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    dustGeo.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));

    const dustMat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    heroGroup.add(dustParticles);

    // Grounding Contact Shadow
    const contactShadow = createContactShadowPlane(2.8);
    contactShadow.position.y = -2.2;
    heroGroup.add(contactShadow);

    // Pointer Parallax Event Handlers
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      const x = (clientX / window.innerWidth) * 2 - 1;
      const y = -(clientY / window.innerHeight) * 2 + 1;
      mousePos.current.targetX = x * 0.8;
      mousePos.current.targetY = y * 0.6;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    // Animation Loop with Exponential Damping & Software WebGL pacing
    let frameId = 0;
    let lastTime = performance.now();

    function tick(now: number) {
      const dt = Math.min((now - lastTime) * 0.001, 0.1);
      lastTime = now;

      // Exponential damping on mouse coordinates
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * (1 - Math.exp(-6 * dt));
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * (1 - Math.exp(-6 * dt));

      // Rotate central gem and rings
      centralGem.rotation.y += 0.008;
      centralGem.rotation.x += 0.004;

      coreMesh.rotation.y -= 0.015;
      coreMesh.rotation.z += 0.01;

      eqRing.rotation.z += 0.012;
      eqRing.rotation.y += 0.006;

      polRing.rotation.x += 0.009;
      polRing.rotation.z -= 0.008;

      // Orbit satellites
      satellites.forEach((sat, i) => {
        const angle = now * 0.001 * (0.8 + i * 0.3) + (i * Math.PI) / 2;
        const rad = 2.4 + (i % 2) * 0.6;
        sat.position.set(
          Math.cos(angle) * rad,
          Math.sin(angle * 1.3) * 0.9,
          Math.sin(angle) * rad
        );
      });

      // Gently rotate dust
      dustParticles.rotation.y = now * 0.0003;

      // Parallax rotation & gentle undulation of the whole sculpture
      heroGroup.rotation.y = mousePos.current.x * 0.45;
      heroGroup.rotation.x = -mousePos.current.y * 0.35;
      heroGroup.position.y = Math.sin(now * 0.0015) * 0.12;

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
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-h-[460px] sm:min-h-[560px] relative pointer-events-auto cursor-grab active:cursor-grabbing"
      aria-label="Interactive 3D Holographic Sculpture - move pointer to rotate"
    />
  );
}
