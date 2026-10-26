import React, { useState } from 'react';
import HeroFiberScene from './HeroFiberScene';
import { ArrowDown, ArrowUpRight, Layers } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface HeroSectionProps {
  onExploreSlideshow: () => void;
  onExploreUniverse: () => void;
  onStartProjectClick: () => void;
}

export default function HeroSection({
  onExploreSlideshow,
  onExploreUniverse,
  onStartProjectClick,
}: HeroSectionProps) {
  const [active3DMode, setActive3DMode] = useState<'ank-logo' | 'prismatic-crystal'>('ank-logo');

  return (
    <section id="home" className="relative min-h-[92vh] pt-28 pb-16 flex flex-col justify-center overflow-hidden bg-[#FAFAFC]">
      {/* Background ambient lighting with purple-cyan chromatic aura matching AnK logo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-gradient-to-tr from-purple-200/30 via-indigo-100/35 to-cyan-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full">
        {/* Split Hero: Bold Editorial Kinetic Typography on Left, R3F 3D Scene on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Kinetic Headlines & Actions (6 cols) */}
          <div className="lg:col-span-6 flex flex-col z-10">
            {/* Unboxed Brand Kicker */}
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-600 tracking-widest uppercase mb-4">
              <span className="w-2 h-2 rounded-full bg-purple-600"></span>
              <span>AnK Creative Mind</span>
              <span aria-hidden="true" className="text-slate-300">/</span>
              <span>R3F & Drei 3D Studio</span>
            </div>

            {/* Kinetic Typography Headline matching logo's punchy comic 3D energy */}
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.04] mb-6">
              <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent hover:brightness-110 transition-all cursor-default">
                IMAGINATION,
              </span>{' '}
              MADE REAL.
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-xl text-slate-600 font-normal leading-relaxed mb-8 max-w-xl">
              We create bold visual identities, immersive 3D worlds, and unforgettable digital experiences.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 mb-10">
              <button
                onClick={() => {
                  sound.playClick();
                  onExploreSlideshow();
                }}
                className="group flex items-center gap-2.5 px-7 py-4 text-sm font-bold text-white bg-slate-900 hover:bg-purple-600 rounded-full shadow-lg shadow-slate-900/10 hover:shadow-purple-500/25 transition-all duration-300 active:scale-95 whitespace-nowrap"
              >
                <Layers className="w-4 h-4 text-purple-300 transition-transform group-hover:rotate-12" />
                <span>Explore 3D Slideshow</span>
                <ArrowDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onStartProjectClick();
                }}
                className="group flex items-center gap-2 px-6 py-4 text-sm font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-full shadow-xs hover:border-purple-300 transition-all duration-200 active:scale-95 whitespace-nowrap"
              >
                <span>Start a Project</span>
                <ArrowUpRight className="w-4 h-4 text-purple-600 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>

            {/* 3D Scene Switcher Toggle on Left */}
            <div className="flex items-center gap-3 p-2 rounded-2xl bg-white border border-slate-200/80 shadow-xs max-w-sm">
              <span className="text-[11px] font-mono text-slate-500 pl-2">3D Subject:</span>
              <button
                onClick={() => {
                  sound.playClick();
                  setActive3DMode('ank-logo');
                }}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  active3DMode === 'ank-logo'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3D AnK! Starburst
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setActive3DMode('prismatic-crystal');
                }}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  active3DMode === 'prismatic-crystal'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Prism Crystal
              </button>
            </div>
          </div>

          {/* Right Column: React Three Fiber Canvas with Transmission & Environment (6 cols) */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="w-full relative rounded-3xl overflow-hidden glass-panel p-2">
              <HeroFiberScene mode={active3DMode} />

              {/* Minimal floating spec label */}
              <div className="absolute bottom-4 right-4 z-10 px-3.5 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/90 text-[11px] font-mono text-slate-700 shadow-sm flex items-center gap-2 pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                <span>@react-three/fiber · Drei PBR Studio</span>
              </div>
            </div>
          </div>
        </div>

        {/* Studio Proof Strip */}
        <div className="mt-16 pt-10 border-t border-slate-200/70 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight tabular-nums">
              120+
            </div>
            <div className="text-xs text-slate-500 mt-1">Immersive Projects Delivered</div>
          </div>

          <div>
            <div className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight tabular-nums">
              99.8%
            </div>
            <div className="text-xs text-slate-500 mt-1">Client Satisfaction Rating</div>
          </div>

          <div>
            <div className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight tabular-nums">
              16 Points
            </div>
            <div className="text-xs text-slate-500 mt-1">Procedural 3D Logo Mesh</div>
          </div>

          <div>
            <div className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight tabular-nums">
              60 FPS
            </div>
            <div className="text-xs text-slate-500 mt-1">Lossless WebGL Pacing</div>
          </div>
        </div>
      </div>
    </section>
  );
}
