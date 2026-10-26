import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { 
  X, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  User, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Github,
  Chrome
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface AuthModal3DProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; email: string }) => void;
}

export default function AuthModal3D({ isOpen, onClose, onLoginSuccess }: AuthModal3DProps) {
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Calculate password strength for register mode
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'Too short', color: 'bg-slate-200' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, label: 'Weak', color: 'bg-rose-500' };
      case 2:
        return { score: 50, label: 'Fair', color: 'bg-amber-500' };
      case 3:
        return { score: 75, label: 'Good', color: 'bg-indigo-500' };
      case 4:
        return { score: 100, label: 'Ultra Strong', color: 'bg-emerald-500' };
      default:
        return { score: 15, label: 'Too short', color: 'bg-rose-400' };
    }
  };

  const strength = getPasswordStrength(password);

  // 3D Companion Scene in Left Column
  useEffect(() => {
    if (!isOpen) return;
    const container = canvasContainerRef.current;
    if (!container) return;

    let animId: number;
    const width = container.clientWidth || 320;
    const height = container.clientHeight || 480;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(0, 0, 4.5);

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

    // Lights
    const amb = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(amb);
    const d1 = new THREE.DirectionalLight(0xffffff, 2.0);
    d1.position.set(3, 4, 3);
    scene.add(d1);
    const d2 = new THREE.DirectionalLight(0x7c3aed, 2.5);
    d2.position.set(-3, -2, 2);
    scene.add(d2);

    // 3D Floating Companion: Iridescent Chrome Core with Orbiting Quantum Rings
    const group = new THREE.Group();
    scene.add(group);

    // Central Sphere
    const coreGeom = new THREE.SphereGeometry(0.85, 32, 32);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0xf3e8ff,
      metalness: 0.85,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 0.95,
    });
    const core = new THREE.Mesh(coreGeom, coreMat);
    group.add(core);

    // Halo Rings
    const ring1Geom = new THREE.TorusGeometry(1.35, 0.03, 16, 64);
    const ring1Mat = new THREE.MeshStandardMaterial({ color: 0x7c3aed, metalness: 0.9, roughness: 0.1 });
    const ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    group.add(ring1);

    const ring2Geom = new THREE.TorusGeometry(1.55, 0.025, 16, 64);
    const ring2Mat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, metalness: 0.9, roughness: 0.1 });
    const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    group.add(ring2);

    // Floating particles
    const particleCount = 40;
    const pGeom = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 4;
      pPos[i + 1] = (Math.random() - 0.5) * 4;
      pPos[i + 2] = (Math.random() - 0.5) * 3;
    }
    pGeom.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color: 0xc084fc, size: 0.05, transparent: true, opacity: 0.7 });
    const particles = new THREE.Points(pGeom, pMat);
    group.add(particles);

    // Mouse tracking
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.5;
      targetY = y * 0.4;
    };

    container.addEventListener('mousemove', onMouseMove);

    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;

      group.rotation.y = t * 0.5 + curX;
      group.rotation.x = Math.sin(t * 0.4) * 0.15 + curY;
      ring1.rotation.z = t * 0.6;
      ring2.rotation.x = t * -0.4;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousemove', onMouseMove);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    if (mode === 'register' && !name) {
      setErrorMsg('Please provide your name.');
      return;
    }

    setIsLoading(true);
    sound.playClick();

    setTimeout(() => {
      setIsLoading(false);
      sound.playChime();
      setSuccessMsg(mode === 'signin' ? 'Welcome back to AnK Studio!' : 'Account created successfully!');
      
      setTimeout(() => {
        onLoginSuccess({
          name: name || (email.split('@')[0] || 'Creative Partner'),
          email: email,
        });
        onClose();
      }, 1000);
    }, 1200);
  };

  const handleQuickDemo = (provider: string) => {
    sound.playClick();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      sound.playChime();
      onLoginSuccess({
        name: `${provider} Creator`,
        email: `creator@${provider.toLowerCase()}.demo`,
      });
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-white/95 rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden grid grid-cols-1 lg:grid-cols-12 backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 z-20 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: 3D Companion Sphere & Visual Universe (5 cols) */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-8 bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950 text-white relative overflow-hidden">
          {/* Chromatic ambient glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Tag */}
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-purple-300 uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>AnK Studio Portal</span>
            </div>
            <h3 className="font-display text-2xl font-black tracking-tight text-white">
              ACCESS 3D REALM
            </h3>
            <p className="text-xs text-purple-200/80 mt-1 leading-relaxed">
              Synchronize your design tokens, project briefs, and 3D assets in one place.
            </p>
          </div>

          {/* 3D Interactive Viewport */}
          <div ref={canvasContainerRef} className="relative w-full h-56 my-auto" />

          {/* Bottom Security Assurance */}
          <div className="relative z-10 flex items-center gap-2.5 text-xs text-purple-200/70 border-t border-purple-800/40 pt-4">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Encrypted client-side simulated auth session</span>
          </div>
        </div>

        {/* Right Column: Glassmorphic Form (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-white">
          <div>
            {/* Demo Notice Banner */}
            <div className="mb-6 p-2.5 rounded-xl bg-purple-50 border border-purple-100/90 flex items-center justify-between text-xs text-purple-800">
              <span className="font-mono font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                Frontend Demo Auth
              </span>
              <span className="text-[11px] text-purple-600/80">No server required</span>
            </div>

            {/* Tab Switcher */}
            <div className="flex items-center p-1 bg-slate-100 rounded-2xl mb-6">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setMode('signin');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  mode === 'signin'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setMode('register');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  mode === 'register'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error or Success notification */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 font-mono">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Anamika K."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 font-mono">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="creator@ankcreative.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 font-mono">
                    Password
                  </label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => alert('Demo Reset Link: In a live app, password reset instructions are dispatched to your verified email.')}
                      className="text-xs font-medium text-purple-600 hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password strength bar for registration */}
                {mode === 'register' && password.length > 0 && (
                  <div className="mt-2.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1">
                      <span>Strength: {strength.label}</span>
                      <span>{strength.score}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full ${strength.color} transition-all duration-300`}
                        style={{ width: `${strength.score}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span>Remember session</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-6 rounded-2xl font-bold text-sm text-white bg-slate-900 hover:bg-purple-600 active:scale-98 transition-all duration-200 shadow-md shadow-slate-900/10 hover:shadow-purple-500/20 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{mode === 'signin' ? 'Sign In to Studio' : 'Create Free Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Options */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <p className="text-center text-xs font-mono text-slate-400 mb-3 uppercase tracking-wider">
                Or quick test with
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('Google')}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Chrome className="w-3.5 h-3.5 text-blue-500" />
                  <span>Google Demo</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('GitHub')}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Github className="w-3.5 h-3.5 text-slate-900" />
                  <span>GitHub Demo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
