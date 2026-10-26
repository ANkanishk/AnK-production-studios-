import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Service3DCanvasProps {
  serviceId: string;
  accentColor: string;
  className?: string;
  interactive?: boolean;
}

export default function Service3DCanvas({
  serviceId,
  accentColor,
  className = 'w-full h-44',
  interactive = true,
}: Service3DCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animId: number;
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 180;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(0, 0, 5);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      container.appendChild(renderer.domElement);
    } catch {
      return;
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dir1 = new THREE.DirectionalLight(0xffffff, 1.8);
    dir1.position.set(4, 5, 4);
    scene.add(dir1);

    const dir2 = new THREE.DirectionalLight(new THREE.Color(accentColor), 2.0);
    dir2.position.set(-4, -2, 3);
    scene.add(dir2);

    const group = new THREE.Group();
    scene.add(group);

    // Build specific 3D geometry per service requirement
    if (serviceId === 'branding-identity') {
      // Rotating 3D logo sculpture (chrome/glass AnK starburst)
      const starShape = new THREE.Shape();
      const points = 16;
      for (let i = 0; i < points * 2; i++) {
        const r = i % 2 === 0 ? 1.35 : 0.85;
        const a = (i / (points * 2)) * Math.PI * 2;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r;
        if (i === 0) starShape.moveTo(x, y);
        else starShape.lineTo(x, y);
      }
      starShape.closePath();

      const geom = new THREE.ExtrudeGeometry(starShape, {
        depth: 0.35,
        bevelEnabled: true,
        bevelSegments: 3,
        bevelSize: 0.08,
        bevelThickness: 0.08,
      });
      geom.center();
      const mat = new THREE.MeshPhysicalMaterial({
        color: 0xf5f3ff,
        metalness: 0.85,
        roughness: 0.15,
        clearcoat: 1.0,
      });
      group.add(new THREE.Mesh(geom, mat));

      const ringGeom = new THREE.TorusGeometry(1.8, 0.035, 16, 48);
      const ringMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(accentColor), metalness: 0.9, roughness: 0.1 });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.rotation.x = Math.PI / 3;
      group.add(ring);
    } else if (serviceId === 'website-design') {
      // Layered floating website panels in 3D glass space
      for (let i = 0; i < 3; i++) {
        const panelGeom = new THREE.BoxGeometry(2.0 - i * 0.25, 1.3 - i * 0.15, 0.04);
        const panelMat = new THREE.MeshPhysicalMaterial({
          color: i === 0 ? 0xffffff : new THREE.Color(accentColor),
          transmission: 0.65,
          transparent: true,
          opacity: 0.9,
          roughness: 0.15,
          metalness: 0.2,
        });
        const panel = new THREE.Mesh(panelGeom, panelMat);
        panel.position.set((i - 1) * 0.35, (1 - i) * 0.25, (1 - i) * 0.5);
        panel.rotation.y = -0.25 + i * 0.1;
        panel.rotation.x = 0.15;
        group.add(panel);

        if (i === 0) {
          const barGeom = new THREE.BoxGeometry(1.7, 0.15, 0.05);
          const barMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, metalness: 0.7, roughness: 0.2 });
          const bar = new THREE.Mesh(barGeom, barMat);
          bar.position.set(0, 0.45, 0.03);
          panel.add(bar);
        }
      }
    } else if (serviceId === '3d-graphics-animation') {
      // Colorful abstract sculpture with animated lighting
      const knotGeom = new THREE.TorusKnotGeometry(0.85, 0.28, 96, 20, 2, 3);
      const knotMat = new THREE.MeshPhysicalMaterial({
        color: 0x3b82f6,
        emissive: 0x1d4ed8,
        emissiveIntensity: 0.25,
        roughness: 0.12,
        metalness: 0.8,
        clearcoat: 1.0,
      });
      group.add(new THREE.Mesh(knotGeom, knotMat));

      for (let i = 0; i < 4; i++) {
        const sGeom = new THREE.SphereGeometry(0.12, 16, 16);
        const sMat = new THREE.MeshStandardMaterial({ color: i % 2 === 0 ? 0x8b5cf6 : 0x06b6d4, metalness: 0.9, roughness: 0.1 });
        const s = new THREE.Mesh(sGeom, sMat);
        const angle = (i / 4) * Math.PI * 2;
        s.position.set(Math.cos(angle) * 1.5, Math.sin(angle) * 1.5, Math.sin(i) * 0.4);
        group.add(s);
      }
    } else if (serviceId === 'creative-design') {
      // Floating artistic shapes, typography, and color fields
      const icoGeom = new THREE.IcosahedronGeometry(0.9, 0);
      const icoMat = new THREE.MeshPhysicalMaterial({
        color: 0x6366f1,
        roughness: 0.2,
        metalness: 0.4,
        transmission: 0.3,
        transparent: true,
        opacity: 0.95,
      });
      group.add(new THREE.Mesh(icoGeom, icoMat));

      const ringGeom = new THREE.TorusGeometry(1.4, 0.05, 16, 48);
      const ringMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, metalness: 0.7, roughness: 0.3 });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.rotation.x = Math.PI / 2.5;
      group.add(ring);

      const cubeGeom = new THREE.BoxGeometry(0.38, 0.38, 0.38);
      const cubeMat = new THREE.MeshStandardMaterial({ color: 0xec4899, metalness: 0.8, roughness: 0.2 });
      const cube = new THREE.Mesh(cubeGeom, cubeMat);
      cube.position.set(1.1, 0.5, 0.3);
      group.add(cube);
    } else if (serviceId === 'video-motion-design') {
      // Animated ribbons and moving geometric objects
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.6, -0.7, -0.3),
        new THREE.Vector3(-0.7, 0.8, 0.4),
        new THREE.Vector3(0.5, -0.5, 0.4),
        new THREE.Vector3(1.6, 0.7, -0.3),
      ]);
      const tubeGeom = new THREE.TubeGeometry(curve, 48, 0.12, 12, false);
      const tubeMat = new THREE.MeshPhysicalMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.2,
        metalness: 0.85,
        roughness: 0.2,
        clearcoat: 1.0,
      });
      group.add(new THREE.Mesh(tubeGeom, tubeMat));

      const ringGeom = new THREE.TorusGeometry(1.2, 0.04, 16, 40);
      const ringMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.9, roughness: 0.1 });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.rotation.y = Math.PI / 4;
      group.add(ring);
    } else {
      // AI Creative Concepts: Luminous abstract intelligence sculpture (demo visual)
      const coreGeom = new THREE.SphereGeometry(0.72, 28, 28);
      const coreMat = new THREE.MeshPhysicalMaterial({
        color: 0x8b5cf6,
        emissive: 0x6d28d9,
        emissiveIntensity: 0.45,
        roughness: 0.1,
        transmission: 0.65,
        transparent: true,
        opacity: 0.9,
      });
      group.add(new THREE.Mesh(coreGeom, coreMat));

      const cageGeom = new THREE.IcosahedronGeometry(1.25, 1);
      const cageMat = new THREE.MeshBasicMaterial({ color: 0xc084fc, wireframe: true, transparent: true, opacity: 0.45 });
      group.add(new THREE.Mesh(cageGeom, cageMat));

      const nodeGroup = new THREE.Group();
      for (let i = 0; i < 6; i++) {
        const nGeom = new THREE.SphereGeometry(0.06, 10, 10);
        const nMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
        const n = new THREE.Mesh(nGeom, nMat);
        const ang = (i / 6) * Math.PI * 2;
        n.position.set(Math.cos(ang) * 1.4, Math.sin(ang) * 1.4, Math.sin(ang * 2) * 0.25);
        nodeGroup.add(n);
      }
      group.add(nodeGroup);
    }

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.6;
      targetY = y * 0.4;
    };

    const handleMouseLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    if (interactive) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      mouseX += (targetX - mouseX) * 0.08;
      mouseY += (targetY - mouseY) * 0.08;

      group.rotation.y = t * 0.45 + mouseX;
      group.rotation.x = Math.sin(t * 0.35) * 0.12 + mouseY;
      group.position.y = Math.sin(t * 1.2) * 0.07;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 300;
      const h = container.clientHeight || 180;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [serviceId, accentColor, interactive]);

  return (
    <div
      ref={mountRef}
      className={`relative rounded-2xl overflow-hidden pointer-events-auto bg-gradient-to-b from-slate-50/70 to-purple-50/20 border border-slate-100 ${className}`}
      aria-label={`Interactive 3D preview for ${serviceId}`}
    />
  );
}
