import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, ArrowUpRight, Sparkles, Box, Eye, Layers } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface ShowcaseSlide {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  category: string;
  tagline: string;
  gradient: string;
  accentColor: string;
  renderType: 'brand' | 'prism' | 'kinetic' | 'torus' | 'spatial';
  metrics: { label: string; value: string }[];
  overview: string;
}

const showcaseSlides: ShowcaseSlide[] = [
  {
    id: 'slide-ank-world',
    num: '01',
    title: 'AnK! Dimensional Starburst',
    subtitle: 'Signature Brand Identity Experience',
    category: '3D Brand Systems',
    tagline: 'Procedural 16-point comic starburst with extruded typography and dynamic ink debris.',
    gradient: 'from-slate-950 via-purple-950 to-indigo-900',
    accentColor: '#A855F7',
    renderType: 'brand',
    metrics: [
      { label: 'Burst Geometry', value: '16 Points' },
      { label: 'Materials', value: 'Obsidian PBR' },
      { label: 'Frame Pacing', value: '60 FPS' },
    ],
    overview: 'Our studio flagship brand emblem sculpted into an interactive 3D physical installation. Features jagged obsidian facets, extruded purple letter depth, and floating ink particles.',
  },
  {
    id: 'slide-chroma',
    num: '02',
    title: 'Chroma Spatial Pavilion',
    subtitle: 'Real-Time WebGL Optical Gallery',
    category: 'Spatial Web & Shaders',
    tagline: 'Spectral chromatic dispersion with multi-layer transmission glass at zero network latency.',
    gradient: 'from-indigo-900 via-violet-800 to-cyan-600',
    accentColor: '#06B6D4',
    renderType: 'prism',
    metrics: [
      { label: 'Transmission', value: '94% Glass' },
      { label: 'Shader Passes', value: '1 Single-Pass' },
      { label: 'Shadow Type', value: 'Soft Contact' },
    ],
    overview: 'An ethereal digital gallery exploring continuous spectral refraction. Visitors navigate through faceted quartz prisms, orbiting gyroscopes, and volumetric light beams.',
  },
  {
    id: 'slide-aether',
    num: '03',
    title: 'Aether Kinetic Interface',
    subtitle: 'High-Velocity UI Choreography',
    category: 'Interactive Web',
    tagline: 'Spring physics micro-interactions and tactile typography responsive at 120Hz.',
    gradient: 'from-cyan-950 via-blue-900 to-slate-900',
    accentColor: '#38BDF8',
    renderType: 'kinetic',
    metrics: [
      { label: 'Interaction Latency', value: '< 14ms' },
      { label: 'Layout Shift (CLS)', value: '0.000' },
      { label: 'Lighthouse Score', value: '100 / 100' },
    ],
    overview: 'A high-performance digital flagship built with compositor-only animations. Demonstrates magnetic cursor tracking, organic elastic drawers, and frictionless navigation.',
  },
  {
    id: 'slide-vortex',
    num: '04',
    title: 'Vortex Synesthetic Soundscape',
    subtitle: 'Procedural Audio Reactive Engine',
    category: 'Motion & Sound',
    tagline: 'Procedural Web Audio API harmonic synthesis coupled to mathematical vertex deformation.',
    gradient: 'from-purple-950 via-fuchsia-900 to-amber-900',
    accentColor: '#EC4899',
    renderType: 'torus',
    metrics: [
      { label: 'Audio Voices', value: '4 Polyphonic' },
      { label: 'FFT Analysis', value: 'Real-Time' },
      { label: 'External Files', value: '0 KB (Code)' },
    ],
    overview: 'An audiovisual installation generating harmonic major chords through native browser oscillators, directly displacing geometric meshes with frequency wave data.',
  },
  {
    id: 'slide-companion',
    num: '05',
    title: 'AnK Robot Companion',
    subtitle: 'Original 3D Character Mascot',
    category: '3D Character Craft',
    tagline: 'Glazed ceramic helmet, panoramic glass visor, dynamic expressive LED eyes, and magnetic base.',
    gradient: 'from-slate-900 via-indigo-950 to-slate-950',
    accentColor: '#8B5CF6',
    renderType: 'spatial',
    metrics: [
      { label: 'Emotions', value: '5 Presets' },
      { label: 'Eye Engine', value: 'Dynamic Canvas' },
      { label: 'Look-At', value: 'Cursor Kinematics' },
    ],
    overview: 'Our studio mascot engineered as a 3D character with anatomical floating limbs, glowing cyan chest reactor, ear sensors, and procedural eye expressions for natural client dialogue.',
  },
];

// Single 3D Card with local Mouse-Tilt and Holographic Border Lighting
interface Card3DProps {
  slide: ShowcaseSlide;
  index: number;
  currentIndex: number;
  totalSlides: number;
  rotationOffset: number;
  onSelect: () => void;
  onInspect: () => void;
  onInquire: () => void;
}

function Card3D({
  slide,
  index,
  currentIndex,
  totalSlides,
  rotationOffset,
  onSelect,
  onInspect,
  onInquire,
}: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0, isHovered: false });

  // Calculate carousel positioning
  const cardAngle = (index / totalSlides) * 360;
  const netAngle = (cardAngle + rotationOffset) % 360;
  const normalizedAngle = netAngle > 180 ? netAngle - 360 : netAngle < -180 ? netAngle + 360 : netAngle;
  const isActive = Math.abs(normalizedAngle) < 25;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normX = (x / rect.width - 0.5) * 2;
    const normY = (y / rect.height - 0.5) * 2;

    setTilt({
      x: -normY * 14,
      y: normX * 14,
    });
    setCursorPos({ x, y, isHovered: true });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setCursorPos((prev) => ({ ...prev, isHovered: false }));
  };

  // Cylinder radius for 3D carousel
  const carouselRadius = 520;
  const carouselTransform = `rotateY(${cardAngle + rotationOffset}deg) translateZ(${carouselRadius}px)`;

  return (
    <div
      style={{
        transform: carouselTransform,
        transformStyle: 'preserve-3d',
        opacity: Math.cos((normalizedAngle * Math.PI) / 180) > 0.1 ? 1 : 0.15,
        zIndex: isActive ? 40 : 10,
      }}
      className="absolute w-[90%] sm:w-[540px] lg:w-[620px] transition-opacity duration-300 pointer-events-auto"
    >
      {/* Tilt Container with Holographic Border Light */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onSelect}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(${isActive ? 1 : 0.88}, ${isActive ? 1 : 0.88}, 1)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.15s ease-out, box-shadow 0.3s ease',
        }}
        className={`relative rounded-3xl bg-white border overflow-hidden cursor-pointer shadow-2xl flex flex-col justify-between ${
          isActive
            ? 'border-transparent ring-2 ring-purple-500/40 shadow-purple-900/15'
            : 'border-slate-200/90 shadow-slate-900/10 filter brightness-95'
        }`}
      >
        {/* Holographic Border Lighting (Follows Cursor Coordinates) */}
        {cursorPos.isHovered && (
          <div
            className="absolute inset-0 pointer-events-none rounded-3xl z-30 transition-opacity duration-200"
            style={{
              background: `radial-gradient(400px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(168, 85, 247, 0.4), rgba(6, 182, 212, 0.25), rgba(245, 158, 11, 0.15), transparent 70%)`,
              mixBlendMode: 'color-dodge',
            }}
          />
        )}

        {/* Dynamic Holographic Border Highlight */}
        {cursorPos.isHovered && (
          <div
            className="absolute -inset-[1px] rounded-3xl pointer-events-none z-20"
            style={{
              background: `radial-gradient(220px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(168, 85, 247, 0.9), rgba(6, 182, 212, 0.8), transparent 75%)`,
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              padding: '1.5px',
            }}
          />
        )}

        {/* Card Artwork Banner */}
        <div className={`relative h-[210px] sm:h-[240px] w-full bg-gradient-to-tr ${slide.gradient} p-6 flex flex-col justify-between text-white overflow-hidden`}>
          <div className="absolute inset-0 bg-grid-pattern opacity-15" />

          {/* Top Info inside Banner */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-black/40 backdrop-blur-md">
              {slide.num} / 05
            </span>
            <span className="font-mono text-xs text-white/80 uppercase tracking-wider">
              {slide.category}
            </span>
          </div>

          {/* Center 3D Symbol / Authentic Logo */}
          <div className="relative z-10 flex items-center justify-center my-auto">
            {slide.renderType === 'brand' ? (
              <div className="relative group/logo">
                <div className="absolute -inset-4 bg-purple-500/35 blur-xl rounded-full" />
                <img
                  src="/assets/aistudio/1792931151691_d855e005.png"
                  alt="AnK 3D Logo"
                  className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-2xl relative transition-transform duration-300 hover:scale-110"
                />
              </div>
            ) : (
              <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-2xl bg-white/10 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-2xl">
                <Box className="w-10 h-10 text-white/90" />
              </div>
            )}
          </div>

          <div className="relative z-10 flex items-center justify-between text-xs text-white/90">
            <span className="font-display font-semibold">{slide.subtitle}</span>
            <span className="font-mono text-[11px] opacity-80">3D Velocity Carousel</span>
          </div>
        </div>

        {/* Card Content & Metrics */}
        <div className="p-6 sm:p-7 flex flex-col justify-between flex-grow bg-white">
          <div>
            <h3 className="font-display text-2xl sm:text-3xl font-black text-slate-900 mb-2">
              {slide.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
              {slide.tagline}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100">
            {slide.metrics.map((m, mIdx) => (
              <div key={mIdx} className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-center">
                <span className="font-display text-sm font-bold text-slate-900 block tabular-nums">
                  {m.value}
                </span>
                <span className="text-[10px] text-slate-400 font-mono block truncate">
                  {m.label}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onInspect();
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Inspect 3D Blueprint</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onInquire();
              }}
              className="inline-flex items-center gap-1 px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-purple-600 rounded-full transition-colors active:scale-95"
            >
              <span>Inquire</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CardSlideshow3DProps {
  onSelectSlideForProject?: (title: string) => void;
}

export default function CardSlideshow3D({ onSelectSlideForProject }: CardSlideshow3DProps) {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeModalSlide, setActiveModalSlide] = useState<ShowcaseSlide | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const velocityRef = useRef(0);
  const lastScrollY = useRef(0);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartAngle = useRef(0);

  const totalSlides = showcaseSlides.length;
  const anglePerSlide = 360 / totalSlides;

  // Active slide calculation based on current angle
  const activeIndex = Math.round((-rotationAngle / anglePerSlide) % totalSlides + totalSlides) % totalSlides;
  const activeSlide = showcaseSlides[activeIndex];

  // 1. Scroll-Velocity Tracking to rotate 3D carousel
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const deltaY = currentY - lastScrollY.current;
      lastScrollY.current = currentY;

      // Add angular velocity proportional to scroll velocity
      if (Math.abs(deltaY) > 0.5) {
        velocityRef.current += deltaY * 0.08;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Mouse Wheel over Carousel
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      velocityRef.current += e.deltaY * 0.12;
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  // 3. 60FPS Inertia & Momentum Physics Loop
  useEffect(() => {
    let animId: number;

    const tick = () => {
      if (!isDragging.current) {
        // Apply velocity with exponential friction decay
        if (Math.abs(velocityRef.current) > 0.01) {
          setRotationAngle((prev) => prev - velocityRef.current);
          velocityRef.current *= 0.92; // friction
        } else if (isPlaying) {
          // Slow steady rotation during autoplay
          setRotationAngle((prev) => prev - 0.25);
        }
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  // Pointer drag controls
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartAngle.current = rotationAngle;
    velocityRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - dragStartX.current;
    const newAngle = dragStartAngle.current + deltaX * 0.35;
    setRotationAngle(newAngle);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const deltaX = e.clientX - dragStartX.current;
    velocityRef.current = -deltaX * 0.15;
  };

  const nextSlide = () => {
    sound.playClick();
    velocityRef.current = 15;
  };

  const prevSlide = () => {
    sound.playClick();
    velocityRef.current = -15;
  };

  const snapToSlide = (idx: number) => {
    sound.playClick();
    const targetAngle = -idx * anglePerSlide;
    setRotationAngle(targetAngle);
    velocityRef.current = 0;
  };

  return (
    <section id="slideshow" className="py-24 bg-[#FAFAFC] relative overflow-hidden border-t border-slate-200/80">
      {/* Background Animated Color Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full blur-[140px] pointer-events-none transition-colors duration-1000 -z-10 opacity-30"
        style={{ backgroundColor: activeSlide.accentColor }}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-purple-600 tracking-widest uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>3D Carousel Structure</span>
              <span aria-hidden="true" className="text-slate-300">/</span>
              <span>Scroll Velocity Responsive</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              INTERACTIVE 3D SLIDESHOW
            </h2>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.playClick();
                setIsPlaying(!isPlaying);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-medium text-slate-700 bg-white border border-slate-200/90 rounded-full shadow-xs hover:bg-slate-50 transition-colors"
            >
              {isPlaying ? <Pause className="w-3 h-3 text-purple-600" /> : <Play className="w-3 h-3 text-purple-600" />}
              <span>{isPlaying ? 'Autoplay On' : 'Paused'}</span>
            </button>

            <div className="flex items-center gap-1.5">
              <button
                onClick={prevSlide}
                aria-label="Previous Slide"
                className="p-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-xs hover:border-purple-300 transition-all hover:scale-105 active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next Slide"
                className="p-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-xs hover:border-purple-300 transition-all hover:scale-105 active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 3D Cylindrical Carousel Viewport */}
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="relative h-[500px] sm:h-[560px] w-full flex items-center justify-center [perspective:1400px] select-none cursor-grab active:cursor-grabbing"
        >
          {/* Rotating 3D Ring Stage */}
          <div
            style={{
              transformStyle: 'preserve-3d',
            }}
            className="relative w-full h-full flex items-center justify-center pointer-events-none"
          >
            {showcaseSlides.map((slide, idx) => (
              <Card3D
                key={slide.id}
                slide={slide}
                index={idx}
                currentIndex={activeIndex}
                totalSlides={totalSlides}
                rotationOffset={rotationAngle}
                onSelect={() => snapToSlide(idx)}
                onInspect={() => {
                  sound.playClick();
                  setActiveModalSlide(slide);
                }}
                onInquire={() => {
                  sound.playClick();
                  if (onSelectSlideForProject) onSelectSlideForProject(slide.title);
                }}
              />
            ))}
          </div>
        </div>

        {/* Carousel Footer Pagination & Kinetic Text */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200/70">
          <div className="flex items-center gap-2">
            {showcaseSlides.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => snapToSlide(dotIdx)}
                aria-label={`Go to slide ${dotIdx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIndex === dotIdx
                    ? 'w-8 bg-purple-600'
                    : 'w-2 bg-slate-200 hover:bg-slate-300'
                }`}
              />
            ))}
          </div>

          <div className="text-xs font-mono text-slate-500 flex items-center gap-3">
            <span>Scroll or drag to rotate 3D cards</span>
            <span className="text-slate-300">/</span>
            <span>Active: <strong className="text-purple-600">{activeSlide.title}</strong></span>
          </div>
        </div>
      </div>

      {/* Blueprint Detail Modal */}
      {activeModalSlide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs font-semibold text-purple-600 uppercase tracking-wider">
                {activeModalSlide.category} · Blueprint {activeModalSlide.num}
              </span>
              <button
                onClick={() => setActiveModalSlide(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                ✕
              </button>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
              {activeModalSlide.title}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              {activeModalSlide.overview}
            </p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {activeModalSlide.metrics.map((m, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <span className="font-display text-base font-bold text-slate-900 block tabular-nums">
                    {m.value}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">{m.label}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setActiveModalSlide(null)}
                className="px-5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-full"
              >
                Close
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  const title = activeModalSlide.title;
                  setActiveModalSlide(null);
                  if (onSelectSlideForProject) {
                    onSelectSlideForProject(title);
                  }
                }}
                className="px-6 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-full shadow-md"
              >
                Start Project With This Blueprint
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
