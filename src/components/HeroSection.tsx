import React from 'react';
import HeroScene3D from './HeroScene3D';
import { ArrowDown, Sparkles, ArrowUpRight } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface HeroSectionProps {
  onExploreClick: () => void;
  onStartProjectClick: () => void;
}

export default function HeroSection({ onExploreClick, onStartProjectClick }: HeroSectionProps) {
  return (
    <section id="home" className="relative min-h-screen pt-28 pb-16 flex flex-col justify-center overflow-hidden bg-[#FAFAFC]">
      {/* Background ambient lighting subtle gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-indigo-200/25 via-purple-100/30 to-cyan-100/25 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full">
        {/* Split Hero Layout: Editorial Typography on Left, Real 3D Sculpture Centerpiece on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Typography & CTAs (6 cols) */}
          <div className="lg:col-span-6 flex flex-col z-10">
            {/* Clean unboxed category kicker without pill box */}
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-indigo-600 tracking-widest uppercase mb-4">
              <span>AnK Creative Mind</span>
              <span aria-hidden="true" className="text-slate-300">/</span>
              <span>Next-Gen 3D Studio</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl sm:text-6xl lg:text-6.5xl font-black tracking-tight text-slate-900 leading-[1.08] mb-6 text-balance">
              WE TURN <span className="holographic-gradient-text">IMAGINATION</span> INTO EXPERIENCE.
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-xl text-slate-600 font-normal leading-relaxed mb-8 max-w-xl">
              Creative thinking. Immersive design. Digital experiences built to make your ideas unforgettable.
            </p>

            {/* Call To Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                onClick={() => {
                  sound.playClick();
                  onExploreClick();
                }}
                className="group flex items-center gap-2.5 px-7 py-3.5 text-sm font-semibold text-white bg-slate-900 hover:bg-indigo-600 rounded-full shadow-lg shadow-slate-900/10 hover:shadow-indigo-500/25 transition-all duration-300 active:scale-95 whitespace-nowrap"
              >
                <span>Explore Our Universe</span>
                <ArrowDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onStartProjectClick();
                }}
                className="group flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-full shadow-sm hover:border-indigo-300 transition-all duration-200 active:scale-95 whitespace-nowrap"
              >
                <span>Start a Project</span>
                <ArrowUpRight className="w-4 h-4 text-indigo-500 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>

            {/* Micro Interaction Hint */}
            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-50 text-indigo-600">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span>Move pointer or touch the 3D sculpture to inspect real-time physics</span>
            </div>
          </div>

          {/* Right Column: Interactive 3D Holographic Centerpiece (6 cols) */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Subtle glass pedestal container */}
            <div className="w-full relative rounded-3xl overflow-hidden glass-panel p-2">
              <HeroScene3D />

              {/* Minimal floating spec label on bottom edge of canvas */}
              <div className="absolute bottom-4 right-4 z-10 px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-md border border-slate-200/80 text-[11px] font-mono text-slate-600 shadow-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                <span>PBR Studio Rig · Three.js r183</span>
              </div>
            </div>
          </div>
        </div>

        {/* Studio Impact & Credibility Strip (Adjacent proof) */}
        <div className="mt-16 pt-10 border-t border-slate-200/70 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight tabular-nums">
              120+
            </div>
            <div className="text-xs text-slate-500 mt-1">Immersive Projects Delivered</div>
          </div>

          <div>
            <div className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight tabular-nums">
              99.8%
            </div>
            <div className="text-xs text-slate-500 mt-1">Client Satisfaction Rating</div>
          </div>

          <div>
            <div className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight tabular-nums">
              14
            </div>
            <div className="text-xs text-slate-500 mt-1">Design & Tech Distinctions</div>
          </div>

          <div>
            <div className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight tabular-nums">
              60 FPS
            </div>
            <div className="text-xs text-slate-500 mt-1">Lossless WebGL Pacing</div>
          </div>
        </div>
      </div>
    </section>
  );
}
