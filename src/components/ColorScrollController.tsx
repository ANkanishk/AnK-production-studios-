import React, { useState, useEffect } from 'react';
import { sound } from '../utils/soundEffects';

interface SectionColor {
  id: string;
  name: string;
  primaryColor: string;
  gradient: string;
  accentBg: string;
}

const sectionColors: SectionColor[] = [
  {
    id: 'home',
    name: '3D AnK! Void',
    primaryColor: '#7C3AED',
    gradient: 'from-purple-600 to-indigo-600',
    accentBg: 'rgba(124, 58, 237, 0.12)',
  },
  {
    id: 'slideshow',
    name: '3D Slideshow',
    primaryColor: '#06B6D4',
    gradient: 'from-cyan-500 to-blue-600',
    accentBg: 'rgba(6, 182, 212, 0.12)',
  },
  {
    id: 'universe',
    name: 'Creative 3D Lab',
    primaryColor: '#F59E0B',
    gradient: 'from-amber-500 to-purple-600',
    accentBg: 'rgba(245, 158, 11, 0.12)',
  },
  {
    id: 'services',
    name: 'Capabilities',
    primaryColor: '#10B981',
    gradient: 'from-emerald-500 to-cyan-500',
    accentBg: 'rgba(16, 185, 129, 0.12)',
  },
  {
    id: 'projects',
    name: 'Project Gallery',
    primaryColor: '#D946EF',
    gradient: 'from-fuchsia-500 to-indigo-600',
    accentBg: 'rgba(217, 70, 239, 0.12)',
  },
  {
    id: 'robot',
    name: 'Robot Mascot',
    primaryColor: '#8B5CF6',
    gradient: 'from-purple-500 to-cyan-400',
    accentBg: 'rgba(139, 92, 246, 0.12)',
  },
  {
    id: 'project-lab',
    name: 'Initiate Brief',
    primaryColor: '#4338CA',
    gradient: 'from-indigo-600 to-purple-600',
    accentBg: 'rgba(67, 56, 202, 0.12)',
  },
];

export default function ColorScrollController() {
  const [activeSection, setActiveSection] = useState<SectionColor>(sectionColors[0]);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progress = totalScroll > 0 ? (currentScroll / totalScroll) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, Math.round(progress))));

      // Find which section is currently centered in viewport
      const scrollPos = window.scrollY + window.innerHeight * 0.4;
      for (const section of sectionColors) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    sound.playClick();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Floating Color Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-slate-200/50">
        <div
          className="h-full transition-all duration-150 ease-out"
          style={{
            width: `${scrollProgress}%`,
            background: `linear-gradient(to right, #7C3AED, ${activeSection.primaryColor})`,
          }}
        />
      </div>

      {/* Dynamic Ambient Background Color Light Aura on Scroll */}
      <div
        className="fixed inset-0 pointer-events-none -z-20 transition-all duration-1000 ease-in-out opacity-25"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${activeSection.accentBg} 0%, transparent 70%)`,
        }}
      />

      {/* Floating Right Scroll Navigation Bar with Dynamic Color Indicator */}
      <div className="fixed right-5 top-1/2 -translate-y-1/2 z-30 hidden xl:flex flex-col items-center gap-3 p-2 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/90 shadow-md">
        {sectionColors.map((s) => {
          const isActive = s.id === activeSection.id;
          return (
            <button
              key={s.id}
              onClick={() => scrollToSection(s.id)}
              aria-label={`Scroll to ${s.name}`}
              className="relative group p-1 flex items-center justify-center focus:outline-none"
            >
              {/* Tooltip on Hover */}
              <span className="absolute right-8 px-2.5 py-1 rounded-md bg-slate-900 text-white text-[11px] font-mono whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-sm">
                {s.name}
              </span>

              {/* Indicator Dot */}
              <div
                className={`transition-all duration-300 rounded-full ${
                  isActive ? 'w-3 h-3 scale-110 shadow-sm' : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                }`}
                style={{
                  backgroundColor: isActive ? s.primaryColor : undefined,
                }}
              />
            </button>
          );
        })}

        <div className="pt-1 border-t border-slate-200 text-[10px] font-mono text-slate-400 tabular-nums">
          {scrollProgress}%
        </div>
      </div>
    </>
  );
}
