import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, RotateCcw, Menu, X, ArrowUpRight } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface NavbarProps {
  onReplayIntro: () => void;
  onOpenProjectLab: () => void;
}

export default function Navbar({ onReplayIntro, onOpenProjectLab }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSound = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
  };

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'Projects', href: '#projects' },
    { label: '3D Lab', href: '#universe' },
    { label: 'Mascot', href: '#robot' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    sound.playClick();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-sm py-3.5'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between gap-8">
          {/* Zone 1: Single element brand wordmark with logo */}
          <a
            href="#home"
            onClick={(e) => handleLinkClick(e, '#home')}
            className="flex items-center gap-3 shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg"
          >
            <img
              src="/assets/aistudio/1792931151691_d855e005.png"
              alt="AnK Logo"
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
            />
            <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-slate-900 whitespace-nowrap">
              AnK <span className="font-medium text-slate-600">Creative Mind</span>
            </span>
          </a>

          {/* Zone 2: 5-6 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                onMouseEnter={() => sound.playHover()}
                className="whitespace-nowrap shrink-0 transition-colors hover:text-indigo-600 relative py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: 1 primary action + minimal utility toggles */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={toggleSound}
              aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              className="hidden sm:inline-flex p-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100/80 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-indigo-600" />}
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onReplayIntro();
              }}
              aria-label="Replay Cinematic Intro"
              title="Replay Cinematic Intro"
              className="hidden sm:inline-flex p-2 text-slate-500 hover:text-indigo-600 rounded-full hover:bg-slate-100/80 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onOpenProjectLab();
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-indigo-600 rounded-full shadow-sm transition-all duration-200 hover:shadow-indigo-500/20 whitespace-nowrap shrink-0 active:scale-95"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => {
                sound.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              aria-label="Toggle Navigation Menu"
              className="md:hidden p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-white/95 backdrop-blur-xl md:hidden pt-24 px-6 pb-8 flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <div className="text-xs font-mono uppercase text-indigo-600 tracking-wider mb-2">Navigation</div>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-xl font-display font-semibold text-slate-800 hover:text-indigo-600 py-2 border-b border-slate-100 flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-3 pt-6 border-t border-slate-200">
            <button
              onClick={() => {
                sound.playClick();
                setMobileMenuOpen(false);
                onOpenProjectLab();
              }}
              className="w-full py-3 text-center text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md"
            >
              Start a Project
            </button>
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
              <button onClick={toggleSound} className="flex items-center gap-1.5 py-1">
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-indigo-600" />}
                <span>{isMuted ? 'Sound Muted' : 'Sound Active'}</span>
              </button>
              <button onClick={() => { setMobileMenuOpen(false); onReplayIntro(); }} className="flex items-center gap-1.5 py-1">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Replay Intro</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
