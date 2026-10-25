import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  renderType: 'prism' | 'brand' | 'kinetic' | 'torus' | 'spatial';
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
    overview: 'Our studio flagship brand emblem sculpted into an interactive 3D physical installation. Features jagged obsidian facets, extruded purple letter depth, and floating ink particles that react to cursor kinematics.',
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
    overview: 'An ethereal digital gallery exploring continuous spectral refraction. Visitors navigate through faceted quartz prisms, orbiting gyroscopes, and real-time volumetric light beams.',
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
    overview: 'A high-performance digital flagship built with compositor-only animations. Demonstrates magnetic cursor tracking, organic elastic drawers, and frictionless navigation rhythms.',
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

interface CardSlideshow3DProps {
  onSelectSlideForProject?: (title: string) => void;
}

export default function CardSlideshow3D({ onSelectSlideForProject }: CardSlideshow3DProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeModalSlide, setActiveModalSlide] = useState<ShowcaseSlide | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = showcaseSlides.length;

  const nextSlide = () => {
    sound.playClick();
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    sound.playClick();
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (idx: number) => {
    sound.playClick();
    setCurrentIndex(idx);
  };

  // Autoplay handler
  useEffect(() => {
    if (isPlaying && !activeModalSlide) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
      }, 5500);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, activeModalSlide, totalSlides]);

  const activeSlide = showcaseSlides[currentIndex];

  return (
    <section id="slideshow" className="py-24 bg-[#FAFAFC] relative overflow-hidden border-t border-slate-200/80">
      {/* Background Animated Color Glow reflecting active slide */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full blur-[140px] pointer-events-none transition-colors duration-1000 -z-10 opacity-30"
        style={{ backgroundColor: activeSlide.accentColor }}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header with Text Animation */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-indigo-600 tracking-widest uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>3D Showcase Slideshow</span>
              <span aria-hidden="true" className="text-slate-300">/</span>
              <span>Perspective Carousel</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              INTERACTIVE 3D SLIDESHOW
            </h2>
          </div>

          {/* Autoplay & Navigation Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.playClick();
                setIsPlaying(!isPlaying);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-medium text-slate-700 bg-white border border-slate-200/90 rounded-full shadow-xs hover:bg-slate-50 transition-colors"
            >
              {isPlaying ? <Pause className="w-3 h-3 text-indigo-600" /> : <Play className="w-3 h-3 text-indigo-600" />}
              <span>{isPlaying ? 'Autoplay On' : 'Paused'}</span>
            </button>

            <div className="flex items-center gap-1.5">
              <button
                onClick={prevSlide}
                aria-label="Previous Slide"
                className="p-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-xs hover:border-indigo-300 transition-all hover:scale-105 active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next Slide"
                className="p-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-xs hover:border-indigo-300 transition-all hover:scale-105 active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 3D Perspective Carousel Container */}
        <div className="relative h-[480px] sm:h-[540px] w-full flex items-center justify-center [perspective:1400px]">
          {showcaseSlides.map((slide, idx) => {
            const offset = (idx - currentIndex + totalSlides) % totalSlides;
            let transformStyle = '';
            let zIndex = 10;
            let opacity = 0;
            let pointerEvents = 'none';

            if (offset === 0) {
              // Center Active Card
              transformStyle = 'translateX(0%) translateZ(0px) rotateY(0deg) scale(1)';
              zIndex = 30;
              opacity = 1;
              pointerEvents = 'auto';
            } else if (offset === 1) {
              // Right Card
              transformStyle = 'translateX(65%) translateZ(-160px) rotateY(-32deg) scale(0.85)';
              zIndex = 20;
              opacity = 0.8;
              pointerEvents = 'auto';
            } else if (offset === totalSlides - 1) {
              // Left Card
              transformStyle = 'translateX(-65%) translateZ(-160px) rotateY(32deg) scale(0.85)';
              zIndex = 20;
              opacity = 0.8;
              pointerEvents = 'auto';
            } else {
              // Hidden outer cards
              transformStyle = offset < totalSlides / 2 
                ? 'translateX(120%) translateZ(-300px) rotateY(-45deg) scale(0.7)'
                : 'translateX(-120%) translateZ(-300px) rotateY(45deg) scale(0.7)';
              zIndex = 5;
              opacity = 0;
              pointerEvents = 'none';
            }

            return (
              <div
                key={slide.id}
                onClick={() => {
                  if (offset !== 0) goToSlide(idx);
                }}
                style={{
                  transform: transformStyle,
                  zIndex,
                  opacity,
                  pointerEvents: pointerEvents as 'auto' | 'none',
                }}
                className={`absolute w-[92%] sm:w-[580px] lg:w-[680px] h-[440px] sm:h-[480px] rounded-3xl bg-white border border-slate-200/90 shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden cursor-pointer flex flex-col justify-between ${
                  offset === 0 ? 'ring-2 ring-indigo-500/20' : 'filter brightness-95'
                }`}
              >
                {/* Card Artwork Banner */}
                <div className={`relative h-[230px] sm:h-[260px] w-full bg-gradient-to-tr ${slide.gradient} p-6 flex flex-col justify-between text-white overflow-hidden`}>
                  {/* Subtle Grid Pattern Overlay */}
                  <div className="absolute inset-0 bg-grid-pattern opacity-15" />

                  {/* Top Bar inside Card Banner */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-black/40 backdrop-blur-md">
                      {slide.num} / 05
                    </span>
                    <span className="font-mono text-xs text-white/80 uppercase tracking-wider">
                      {slide.category}
                    </span>
                  </div>

                  {/* Center Emblem/Symbol in 3D */}
                  <div className="relative z-10 flex items-center justify-center my-auto">
                    {slide.renderType === 'brand' ? (
                      <div className="relative group/logo">
                        <div className="absolute -inset-4 bg-purple-500/30 blur-xl rounded-full" />
                        <img
                          src="/assets/aistudio/1792931151691_d855e005.png"
                          alt="AnK 3D Logo"
                          className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-2xl relative transition-transform duration-500 hover:scale-110"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/10 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-2xl">
                        <Box className="w-10 h-10 text-white/90" />
                      </div>
                    )}
                  </div>

                  {/* Bottom Indicator inside Banner */}
                  <div className="relative z-10 flex items-center justify-between text-xs text-white/90">
                    <span className="font-display font-semibold">{slide.subtitle}</span>
                    <span className="font-mono text-[11px] opacity-80">3D Interactive</span>
                  </div>
                </div>

                {/* Card Content & Metrics */}
                <div className="p-6 sm:p-7 flex flex-col justify-between flex-grow bg-white">
                  <div>
                    <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
                      {slide.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
                      {slide.tagline}
                    </p>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-slate-100">
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

                  {/* Bottom Card Actions */}
                  <div className="pt-4 flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.playClick();
                        setActiveModalSlide(slide);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect 3D Blueprint</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.playClick();
                        if (onSelectSlideForProject) {
                          onSelectSlideForProject(slide.title);
                        }
                      }}
                      className="inline-flex items-center gap-1 px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-indigo-600 rounded-full transition-colors active:scale-95"
                    >
                      <span>Inquire</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Slideshow Pagination Indicator & Kinetic Text Strip */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200/70">
          <div className="flex items-center gap-2">
            {showcaseSlides.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => goToSlide(dotIdx)}
                aria-label={`Go to slide ${dotIdx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === dotIdx
                    ? 'w-8 bg-indigo-600'
                    : 'w-2 bg-slate-200 hover:bg-slate-300'
                }`}
              />
            ))}
          </div>

          <div className="text-xs font-mono text-slate-500 flex items-center gap-3">
            <span>Slide 0{currentIndex + 1} of 05</span>
            <span className="text-slate-300">/</span>
            <span className="text-indigo-600 font-semibold">{activeSlide.title}</span>
          </div>
        </div>
      </div>

      {/* Blueprint Detail Modal */}
      {activeModalSlide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                {activeModalSlide.category} · Blueprint 0{currentIndex + 1}
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
                className="px-6 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-md"
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
