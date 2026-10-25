import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { detectSoftwareGl, setupStudioEnvironment, createContactShadowPlane } from '../utils/threeHelpers';

export type RobotMood = 'curious' | 'happy' | 'thinking' | 'wink' | 'celebrate';

interface Robot3DProps {
  mood?: RobotMood;
  interactive?: boolean;
}

export default function Robot3D({ mood = 'curious', interactive = true }: Robot3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const moodRef = useRef<RobotMood>(mood);

  useEffect(() => {
    moodRef.current = mood;
  }, [mood]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftware = detectSoftwareGl();
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xFAFAFC, 8, 22);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 40);
    camera.position.set(0, 0.3, 5.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftware,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftware ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    setupStudioEnvironment(renderer, scene);

    // Studio Lighting
    const hemiLight = new THREE.HemisphereLight(0xF8FAFC, 0xE2E8F0, 1.4);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(4, 7, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x06B6D4, 2.2); // cyan fill
    fillLight.position.set(-5, -1, 4);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x7C3AED, 3.5, 12); // violet rim
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    // Robot Root Group
    const robotRoot = new THREE.Group();
    robotRoot.position.set(0, 0, 0);
    scene.add(robotRoot);

    // Grounding Contact Shadow Plane
    const contactShadow = createContactShadowPlane(2.5);
    contactShadow.position.y = -1.95;
    robotRoot.add(contactShadow);

    // Floating Mascot Body Assembly (THREE.Group)
    const mascotGroup = new THREE.Group();
    robotRoot.add(mascotGroup);

    // Materials
    const ceramicMat = new THREE.MeshPhysicalMaterial({
      color: 0xFAFAFE,
      metalness: 0.1,
      roughness: 0.18,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
    });

    const platinumMat = new THREE.MeshPhysicalMaterial({
      color: 0xE2E8F0,
      metalness: 0.94,
      roughness: 0.12,
      clearcoat: 0.8,
    });

    const glassVisorMat = new THREE.MeshPhysicalMaterial({
      color: 0x0F172A,
      metalness: 0.8,
      roughness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
    });

    const glowCyanMat = new THREE.MeshBasicMaterial({
      color: 0x06B6D4,
    });

    const glowVioletMat = new THREE.MeshBasicMaterial({
      color: 0xA855F7,
    });

    // 1. Torso / Chassis
    const torsoGeo = new THREE.CylinderGeometry(0.55, 0.45, 0.9, 32);
    const torsoMesh = new THREE.Mesh(torsoGeo, ceramicMat);
    torsoMesh.position.y = -0.3;
    mascotGroup.add(torsoMesh);

    // Torso Core Arc Reactor (Glowing emblem on chest)
    const coreReactorGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.05, 32);
    coreReactorGeo.rotateX(Math.PI / 2);
    const coreReactorMesh = new THREE.Mesh(coreReactorGeo, glowCyanMat);
    coreReactorMesh.position.set(0, -0.2, 0.48);
    mascotGroup.add(coreReactorMesh);

    const coreRingGeo = new THREE.TorusGeometry(0.22, 0.025, 16, 32);
    const coreRingMesh = new THREE.Mesh(coreRingGeo, platinumMat);
    coreRingMesh.position.set(0, -0.2, 0.49);
    mascotGroup.add(coreRingMesh);

    // 2. Head Assembly (Rotates with mouse tracking)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.55, 0);
    mascotGroup.add(headGroup);

    // Sleek Aerodynamic Helmet Outer Shell (Pure White Glazed Ceramic)
    const helmetGeo = new THREE.SphereGeometry(0.68, 36, 32);
    helmetGeo.scale(1.0, 0.94, 0.92);
    const helmetMesh = new THREE.Mesh(helmetGeo, ceramicMat);
    headGroup.add(helmetMesh);

    // Visor Screen (Sleek dark curved panoramic glass visor centered on +Z)
    const visorGeo = new THREE.SphereGeometry(0.65, 36, 24, -Math.PI * 0.42, Math.PI * 0.84, Math.PI * 0.32, Math.PI * 0.36);
    const visorMesh = new THREE.Mesh(visorGeo, glassVisorMat);
    visorMesh.rotation.y = Math.PI / 2;
    visorMesh.position.set(0, 0.02, 0.01);
    headGroup.add(visorMesh);

    // Ear Sensor Nodules on left & right sides
    const earGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.08, 24);
    earGeo.rotateZ(Math.PI / 2);
    const leftEar = new THREE.Mesh(earGeo, platinumMat);
    leftEar.position.set(-0.67, 0, 0);
    headGroup.add(leftEar);

    const rightEar = new THREE.Mesh(earGeo, platinumMat);
    rightEar.position.set(0.67, 0, 0);
    headGroup.add(rightEar);

    const earRingGeo = new THREE.TorusGeometry(0.11, 0.02, 16, 24);
    earRingGeo.rotateY(Math.PI / 2);
    const leftEarRing = new THREE.Mesh(earRingGeo, glowCyanMat);
    leftEarRing.position.set(-0.72, 0, 0);
    headGroup.add(leftEarRing);

    const rightEarRing = new THREE.Mesh(earRingGeo, glowCyanMat);
    rightEarRing.position.set(0.72, 0, 0);
    headGroup.add(rightEarRing);

    // 3. Dynamic Expressive LED Eyes (Eye Canvas Texture)
    const eyeCanvas = document.createElement('canvas');
    eyeCanvas.width = 256;
    eyeCanvas.height = 128;
    const eyeCtx = eyeCanvas.getContext('2d');

    const eyeTexture = new THREE.CanvasTexture(eyeCanvas);
    eyeTexture.colorSpace = THREE.SRGBColorSpace;

    const eyeDisplayGeo = new THREE.PlaneGeometry(0.68, 0.34);
    const eyeDisplayMat = new THREE.MeshBasicMaterial({
      map: eyeTexture,
      transparent: true,
      depthWrite: false,
    });
    const eyeDisplayMesh = new THREE.Mesh(eyeDisplayGeo, eyeDisplayMat);
    eyeDisplayMesh.position.set(0, 0.03, 0.63);
    headGroup.add(eyeDisplayMesh);

    // Function to render expressive eyes onto dynamic canvas texture
    const renderEyes = (currentMood: RobotMood, blinkProgress: number) => {
      if (!eyeCtx) return;
      eyeCtx.clearRect(0, 0, 256, 128);

      const eyeColor = '#06B6D4'; // electric cyan
      const eyeGlow = '#8B5CF6'; // violet shadow
      eyeCtx.fillStyle = eyeColor;
      eyeCtx.shadowColor = eyeGlow;
      eyeCtx.shadowBlur = 12;

      const leftEyeX = 75;
      const rightEyeX = 181;
      const eyeY = 64;

      if (blinkProgress > 0.8) {
        // Blink: thin horizontal slit
        eyeCtx.fillRect(50, 62, 50, 4);
        eyeCtx.fillRect(156, 62, 50, 4);
      } else if (currentMood === 'happy' || currentMood === 'celebrate') {
        // Happy inverted arcs ^ ^
        eyeCtx.lineWidth = 10;
        eyeCtx.strokeStyle = eyeColor;
        eyeCtx.beginPath();
        eyeCtx.arc(leftEyeX, 75, 22, Math.PI * 1.1, Math.PI * 1.9, false);
        eyeCtx.stroke();

        eyeCtx.beginPath();
        eyeCtx.arc(rightEyeX, 75, 22, Math.PI * 1.1, Math.PI * 1.9, false);
        eyeCtx.stroke();
      } else if (currentMood === 'wink') {
        // Left eye open, right eye wink
        eyeCtx.beginPath();
        eyeCtx.roundRect(leftEyeX - 18, eyeY - 20, 36, 40, 14);
        eyeCtx.fill();

        eyeCtx.lineWidth = 8;
        eyeCtx.strokeStyle = eyeColor;
        eyeCtx.beginPath();
        eyeCtx.arc(rightEyeX, 72, 18, Math.PI * 1.1, Math.PI * 1.9, false);
        eyeCtx.stroke();
      } else if (currentMood === 'thinking') {
        // Left eye looking up, right eye smaller
        eyeCtx.beginPath();
        eyeCtx.roundRect(leftEyeX - 16, eyeY - 26, 32, 34, 12);
        eyeCtx.fill();

        eyeCtx.beginPath();
        eyeCtx.roundRect(rightEyeX - 14, eyeY - 22, 28, 30, 10);
        eyeCtx.fill();
      } else {
        // Curious / Idle default: friendly rounded rectangles
        eyeCtx.beginPath();
        eyeCtx.roundRect(leftEyeX - 18, eyeY - 20, 36, 40, 14);
        eyeCtx.fill();

        eyeCtx.beginPath();
        eyeCtx.roundRect(rightEyeX - 18, eyeY - 20, 36, 40, 14);
        eyeCtx.fill();
      }

      eyeTexture.needsUpdate = true;
    };

    // 4. Floating Antenna / Sensor Halo on Head
    const antennaGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.28, 16);
    const antennaMesh = new THREE.Mesh(antennaGeo, platinumMat);
    antennaMesh.position.set(0, 0.75, 0);
    headGroup.add(antennaMesh);

    const antennaTipGeo = new THREE.SphereGeometry(0.07, 16, 16);
    const antennaTipMesh = new THREE.Mesh(antennaTipGeo, glowVioletMat);
    antennaTipMesh.position.set(0, 0.9, 0);
    headGroup.add(antennaTipMesh);

    // 5. Articulated Floating Shoulders & Arms
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.75, -0.15, 0);
    mascotGroup.add(leftArmGroup);

    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.75, -0.15, 0);
    mascotGroup.add(rightArmGroup);

    // Shoulders
    const shoulderGeo = new THREE.SphereGeometry(0.18, 20, 20);
    const leftShoulder = new THREE.Mesh(shoulderGeo, ceramicMat);
    leftArmGroup.add(leftShoulder);
    const rightShoulder = new THREE.Mesh(shoulderGeo, ceramicMat);
    rightArmGroup.add(rightShoulder);

    // Forearms
    const armGeo = new THREE.CapsuleGeometry(0.1, 0.35, 12, 16);
    const leftArm = new THREE.Mesh(armGeo, ceramicMat);
    leftArm.position.set(-0.1, -0.3, 0.1);
    leftArmGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, ceramicMat);
    rightArm.position.set(0.1, -0.3, 0.1);
    rightArmGroup.add(rightArm);

    // Glowing fingertips
    const tipGeo = new THREE.SphereGeometry(0.05, 12, 12);
    const leftTip = new THREE.Mesh(tipGeo, glowCyanMat);
    leftTip.position.set(-0.1, -0.55, 0.1);
    leftArmGroup.add(leftTip);

    const rightTip = new THREE.Mesh(tipGeo, glowCyanMat);
    rightTip.position.set(0.1, -0.55, 0.1);
    rightArmGroup.add(rightTip);

    // 6. Magnetic Repulsor Base (Concentric hovering thruster rings)
    const baseGroup = new THREE.Group();
    baseGroup.position.set(0, -0.85, 0);
    mascotGroup.add(baseGroup);

    const baseRing1 = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.04, 16, 32), platinumMat);
    baseRing1.rotation.x = Math.PI / 2;
    baseGroup.add(baseRing1);

    const baseRing2 = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.03, 16, 32), glowCyanMat);
    baseRing2.rotation.x = Math.PI / 2;
    baseRing2.position.y = -0.12;
    baseGroup.add(baseRing2);

    // Pointer Parallax Handlers
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
      const x = (clientX / window.innerWidth) * 2 - 1;
      const y = -(clientY / window.innerHeight) * 2 + 1;
      mousePos.current.targetX = x * 0.9;
      mousePos.current.targetY = y * 0.7;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    let frameId = 0;
    let lastTime = performance.now();
    let blinkTimer = 0;
    let blinkProgress = 0;

    function tick(now: number) {
      const dt = Math.min((now - lastTime) * 0.001, 0.1);
      lastTime = now;

      // Exponential damping on pointer look-at
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * (1 - Math.exp(-6 * dt));
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * (1 - Math.exp(-6 * dt));

      // Natural blink cycle
      blinkTimer += dt;
      if (blinkTimer > 3.5) {
        blinkProgress += dt * 8;
        if (blinkProgress >= 1) {
          blinkProgress = 0;
          blinkTimer = 0;
        }
      } else {
        blinkProgress = 0;
      }

      renderEyes(moodRef.current, blinkProgress);

      // Smooth idle floating oscillation
      const floatY = Math.sin(now * 0.002) * 0.12;
      mascotGroup.position.y = floatY;

      // Head tracks mouse with realistic neck limits
      headGroup.rotation.y = mousePos.current.x * 0.6;
      headGroup.rotation.x = -mousePos.current.y * 0.4;
      headGroup.rotation.z = -mousePos.current.x * 0.15; // subtle tilt

      // Torso follows slightly for anatomical realism
      torsoMesh.rotation.y = mousePos.current.x * 0.2;
      torsoMesh.rotation.x = -mousePos.current.y * 0.1;

      // Arm subtle gestures
      leftArmGroup.rotation.z = Math.sin(now * 0.002) * 0.1;
      rightArmGroup.rotation.z = -Math.sin(now * 0.002) * 0.1;

      if (moodRef.current === 'celebrate') {
        leftArmGroup.rotation.z = Math.PI / 1.8 + Math.sin(now * 0.006) * 0.2;
        rightArmGroup.rotation.z = -Math.PI / 1.8 - Math.sin(now * 0.006) * 0.2;
        headGroup.rotation.z = Math.sin(now * 0.005) * 0.2;
      }

      // Repulsor ring spin
      baseRing1.rotation.z += 0.02;
      baseRing2.rotation.z -= 0.03;

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
  }, [interactive]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-h-[420px] sm:min-h-[520px] relative pointer-events-auto cursor-pointer"
      aria-label="3D Robot Mascot - AnK Creative Companion"
    />
  );
}
