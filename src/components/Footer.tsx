import React from 'react';
import { ArrowUp, RotateCcw } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface FooterProps {
  onReplayIntro: () => void;
}

export default function Footer({ onReplayIntro }: FooterProps) {
  const scrollToTop = () => {
    sound.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'Projects', href: '#projects' },
    { label: '3D Lab', href: '#universe' },
    { label: 'Mascot', href: '#robot' },
    { label: 'Project Lab', href: '#project-lab' },
    { label: 'Contact', href: '#contact' },
  ];

  const serviceLinks = [
    'Creative Design',
    'Branding & Visual Identity',
    'Website Design',
    '3D Graphics & Animation',
    'AI-Powered Creative Concepts',
    'Video & Motion Design',
    'Digital Experiences',
  ];

  const socials = [
    { label: 'X / Twitter', href: '#' },
    { label: 'Instagram', href: '#' },
    { label: 'LinkedIn', href: '#' },
    { label: 'Dribbble', href: '#' },
    { label: 'GitHub', href: '#' },
  ];

  return (
    <footer className="bg-white border-t border-slate-200/80 pt-20 pb-12 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          {/* Brand Col (2 cols) */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/assets/aistudio/1792931151691_d855e005.png"
                  alt="AnK Creative Mind Logo"
                  className="w-10 h-10 object-contain drop-shadow-sm rounded-lg"
                />
                <span className="font-display font-extrabold text-xl tracking-tight text-slate-900">
                  AnK <span className="font-medium text-slate-600">Creative Mind</span>
                </span>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed max-w-sm mb-6">
                We turn imagination into experience through immersive 3D technology, architectural design systems, and unforgettable digital experiences.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onReplayIntro}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
                <span>Replay 3D Intro</span>
              </button>

              <button
                onClick={scrollToTop}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors active:scale-95"
              >
                <ArrowUp className="w-3.5 h-3.5 text-indigo-600" />
                <span>Back to Top</span>
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase text-slate-900 tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
              {navLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={() => sound.playHover()}
                    className="hover:text-indigo-600 transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Links */}
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase text-slate-900 tracking-wider mb-4">
              Capabilities
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
              {serviceLinks.map((s) => (
                <li key={s}>
                  <a
                    href="#services"
                    onClick={() => sound.playHover()}
                    className="hover:text-indigo-600 transition-colors"
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase text-slate-900 tracking-wider mb-4">
              Network
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
              {socials.map((soc) => (
                <li key={soc.label}>
                  <a
                    href={soc.href}
                    onClick={(e) => {
                      e.preventDefault();
                      sound.playClick();
                    }}
                    className="hover:text-indigo-600 transition-colors"
                  >
                    {soc.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} AnK Creative Mind. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <span>Crafted with Three.js & React</span>
            <span>·</span>
            <span>Bright Studio Edition</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
