import React, { useState } from 'react';
import Robot3D, { RobotMood } from './Robot3D';
import { Bot, Sparkles, MessageSquare, X, ArrowUpRight, Smile, Lightbulb, Compass, Award } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface RobotMascotSectionProps {
  onStartProject: (ideaPrompt?: string) => void;
}

interface RobotDialogue {
  prompt: string;
  response: string;
  mood: RobotMood;
  soundCue: 'chime' | 'sweep' | 'click';
}

const robotDialogues: RobotDialogue[] = [
  {
    prompt: 'What kind of 3D experiments can AnK build for us?',
    response: 'We specialize in zero-404 procedural WebGL models, physical transmission glass, real-time lighting choreography, and interactive product viewports optimized for 60fps across phones and desktops!',
    mood: 'curious',
    soundCue: 'chime',
  },
  {
    prompt: 'How does AnK balance luxury aesthetics with high performance?',
    response: 'Every line of code obeys strict spatial math: compositor-only animations (transform & opacity), ACES Filmic tone mapping, and disciplined typography hierarchy without generic templates.',
    mood: 'thinking',
    soundCue: 'sweep',
  },
  {
    prompt: 'Can we build custom branding and holographic design tokens?',
    response: 'Absolutely! We forge dimensional brand worlds—from responsive vector marks to chromatic foil packaging and generative motion style guides that scale across print and 3D web.',
    mood: 'happy',
    soundCue: 'chime',
  },
  {
    prompt: 'Show me your signature celebration pose!',
    response: 'Mission accomplished! When a project goes live and client expectations are shattered, this is how the entire AnK Creative Mind studio celebrates!',
    mood: 'celebrate',
    soundCue: 'chime',
  },
];

export default function RobotMascotSection({ onStartProject }: RobotMascotSectionProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [currentMood, setCurrentMood] = useState<RobotMood>('curious');
  const [activeDialogue, setActiveDialogue] = useState<RobotDialogue | null>(null);

  const handleOpenPanel = () => {
    sound.playClick();
    sound.playChime();
    setIsPanelOpen(true);
    setCurrentMood('curious');
  };

  const handleMoodSelect = (mood: RobotMood) => {
    sound.playClick();
    setCurrentMood(mood);
    if (mood === 'celebrate') {
      sound.playChime();
    } else if (mood === 'thinking') {
      sound.playSweep();
    }
  };

  const handleDialogueSelect = (item: RobotDialogue) => {
    sound.playClick();
    setActiveDialogue(item);
    setCurrentMood(item.mood);
    if (item.soundCue === 'chime') sound.playChime();
    else if (item.soundCue === 'sweep') sound.playSweep();
  };

  return (
    <section id="robot" className="py-28 bg-[#FAFAFC] relative overflow-hidden border-t border-slate-200/80">
      {/* Background soft ambient gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-indigo-100/40 via-purple-100/30 to-cyan-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: 3D Robot Mascot Viewport (6 cols) */}
          <div className="lg:col-span-6 relative flex items-center justify-center order-2 lg:order-1">
            <div className="w-full relative rounded-3xl overflow-hidden glass-panel p-4">
              <Robot3D mood={currentMood} interactive={true} />

              {/* Status Badge */}
              <div className="absolute bottom-5 left-5 z-10 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 text-xs font-mono text-slate-700 shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-none"></span>
                <span>AnK Companion · Mood: {currentMood}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Copy & "Meet the Robot" Primary Action (6 cols) */}
          <div className="lg:col-span-6 flex flex-col z-10 order-1 lg:order-2">
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-indigo-600 tracking-widest uppercase mb-3">
              <span>Studio Mascot</span>
              <span aria-hidden="true" className="text-slate-300">/</span>
              <span>AnK Creative Entity</span>
            </div>

            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
              MEET YOUR CREATIVE COMPANION
            </h2>

            <p className="text-base sm:text-xl text-slate-600 font-normal leading-relaxed mb-8">
              Every great idea begins with a conversation. Let&apos;s explore what we can create together.
            </p>

            {/* Quick Mood Preview Buttons */}
            <div className="mb-8">
              <div className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-3">
                Change Mascot Emotion:
              </div>
              <div className="flex flex-wrap gap-2">
                {(['curious', 'happy', 'thinking', 'wink', 'celebrate'] as RobotMood[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => handleMoodSelect(m)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full capitalize transition-all active:scale-95 ${
                      currentMood === m
                        ? 'bg-indigo-600 text-white shadow-sm scale-105'
                        : 'bg-white text-slate-700 border border-slate-200/90 hover:border-indigo-300 hover:bg-slate-50'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleOpenPanel}
                className="group flex items-center gap-2.5 px-8 py-4 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-lg shadow-indigo-500/25 transition-all duration-200 active:scale-95"
              >
                <Bot className="w-4 h-4 text-cyan-300" />
                <span>Meet the Robot</span>
                <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Mascot Companion Panel (Modal) */}
      {isPanelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => {
                sound.playClick();
                setIsPanelOpen(false);
              }}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Panel Header */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                  AnK Creative Companion
                </h3>
                <span className="text-xs text-slate-500">
                  Interactive Frontend Personality Engine · Visual Demonstration
                </span>
              </div>
            </div>

            {/* Mood selector inside panel */}
            <div className="my-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-600">Emotional Expression:</span>
              <div className="flex items-center gap-1.5">
                {(['curious', 'happy', 'thinking', 'wink', 'celebrate'] as RobotMood[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => handleMoodSelect(m)}
                    className={`px-2.5 py-1 text-xs rounded-lg capitalize transition-colors ${
                      currentMood === m
                        ? 'bg-slate-900 text-white font-medium'
                        : 'text-slate-600 hover:bg-slate-200/70'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Dialogue Response Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/60 border border-indigo-100 mb-6">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-indigo-600 uppercase mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Companion Insight:</span>
              </div>
              <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-normal">
                {activeDialogue
                  ? activeDialogue.response
                  : '“Welcome to AnK Creative Mind! Pick any question below to explore our 3D craft, architectural disciplines, and creative philosophy.”'}
              </p>
            </div>

            {/* Interactive Questions list */}
            <div className="mb-6">
              <div className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-3">
                Ask the Companion:
              </div>
              <div className="space-y-2.5">
                {robotDialogues.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDialogueSelect(item)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between group ${
                      activeDialogue?.prompt === item.prompt
                        ? 'bg-indigo-50/80 border-indigo-300 text-indigo-950 font-semibold'
                        : 'bg-white border-slate-200/80 text-slate-700 hover:border-indigo-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <MessageSquare className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span>{item.prompt}</span>
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Transparent Demo Notice */}
            <div className="text-[11px] font-mono text-slate-400 mb-6">
              Note: This is a frontend-only interactive mascot experience designed for AnK Creative Mind. It operates without backend AI inference or server calls.
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setIsPanelOpen(false)}
                className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setIsPanelOpen(false);
                  onStartProject(activeDialogue ? activeDialogue.prompt : undefined);
                }}
                className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
              >
                <span>Take This Idea to Project Lab</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
