import React, { useState } from 'react';
import { Sparkles, ArrowUpRight, X, ExternalLink, Box, Code2, Layers, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface Project {
  id: string;
  title: string;
  category: '3d-spatial' | 'brand-systems' | 'interactive-web' | 'motion-design';
  categoryLabel: string;
  year: string;
  tagline: string;
  heroGradient: string;
  visualType: 'prism' | 'kinetic' | 'editorial' | 'torus' | 'brand' | 'spatial';
  overview: string;
  challenge: string;
  solution: string;
  deliverables: string[];
  metrics: { label: string; value: string }[];
  tags: string[];
}

const projectsData: Project[] = [
  {
    id: 'project-chroma',
    title: 'Chroma Spatial Pavilion',
    category: '3d-spatial',
    categoryLabel: '3D & Spatial',
    year: '2026',
    tagline: 'Real-time WebGL chromatic dispersion & spatial gallery architecture.',
    heroGradient: 'from-violet-600 via-indigo-600 to-cyan-400',
    visualType: 'prism',
    overview: 'An experimental 3D virtual pavilion built to explore spectral light refraction, procedural crystal growth, and physical raymarching in real-time browser environments.',
    challenge: 'Simulate realistic spectral chromatic dispersion and multi-layer transmission glass at 60fps across low-power mobile devices without server rendering.',
    solution: 'Engineered custom Three.js physical materials with custom GLSL refraction approximations and procedural contact grounding geometry.',
    deliverables: ['Real-Time 3D Pavilion Experience', 'Custom Shader Pipeline', 'Spatial Spatial Sound Matrix', 'Responsive Viewport HUD'],
    metrics: [
      { label: 'Render Latency', value: '< 16.4ms' },
      { label: 'Asset Payload', value: '0 External KB' },
      { label: 'Device Support', value: '100% WebGL2' },
    ],
    tags: ['Three.js', 'GLSL Shaders', 'Transmission Glass', 'Spatial Audio'],
  },
  {
    id: 'project-lumina',
    title: 'Lumina Brand Matrix',
    category: 'brand-systems',
    categoryLabel: 'Brand Systems',
    year: '2026',
    tagline: 'Dimensional holographic design tokens for next-generation technology.',
    heroGradient: 'from-slate-900 via-purple-900 to-indigo-600',
    visualType: 'brand',
    overview: 'A complete typographic and dimensional identity system engineered for a spatial computing hardware venture, spanning holographic foils, custom type specimens, and responsive vectors.',
    challenge: 'Create a visual language that transitions seamlessly between ultra-clean white physical ceramics and luminescent high-contrast digital interfaces.',
    solution: 'Designed a dual-polarity token framework with calibrated PBR lighting swatches and custom vector marks that retain optical legibility at 12px and 2000px.',
    deliverables: ['Adaptive Brand Guidelines', 'Custom Vector Typographic Lockups', 'Holographic Foil Production Specs', 'Kinetic Motion Toolkit'],
    metrics: [
      { label: 'Style System Tokens', value: '140+' },
      { label: 'Contrast Ratio', value: '7.8 : 1' },
      { label: 'Resolution Agnostic', value: 'SVG / Vector' },
    ],
    tags: ['Brand Identity', 'Holographic Systems', 'Design Tokens', 'Typography'],
  },
  {
    id: 'project-aether',
    title: 'Aether Kinematics Web',
    category: 'interactive-web',
    categoryLabel: 'Interactive Web',
    year: '2026',
    tagline: 'Visceral fluid interactions and kinetic UI typography at lightning speeds.',
    heroGradient: 'from-cyan-500 via-blue-600 to-indigo-700',
    visualType: 'kinetic',
    overview: 'A high-speed interactive web experience combining frictionless micro-interactions, spring kinematics, and mathematical layout rhythms.',
    challenge: 'Deliver silky-smooth 120Hz micro-interactions and magnetic cursor tracking while maintaining strict zero-slop layout discipline and accessibility.',
    solution: 'Leveraged CSS hardware-accelerated compositor transforms and lightweight spring physics, eliminating heavy animation libraries.',
    deliverables: ['Full-Stack React Experience', 'Spring Physics Cursor Engine', 'Zero-Layout-Shift Structure', 'Accessible ARIA Navigation'],
    metrics: [
      { label: 'Core Web Vitals', value: '100 / 100' },
      { label: 'Interaction Response', value: '< 80ms' },
      { label: 'Lighthouse Score', value: '99' },
    ],
    tags: ['React 19', 'Tailwind CSS', 'Micro-Interactions', 'Web Performance'],
  },
  {
    id: 'project-vortex',
    title: 'Vortex Synesthetic Audio',
    category: 'motion-design',
    categoryLabel: 'Motion Design',
    year: '2026',
    tagline: 'Procedural sound synthesis paired with real-time audio-reactive 3D waves.',
    heroGradient: 'from-amber-500 via-purple-600 to-indigo-900',
    visualType: 'torus',
    overview: 'An audiovisual laboratory exploring synesthesia by linking procedural Web Audio harmonic oscillators directly to vertex displacement in 3D geometries.',
    challenge: 'Perform real-time Fast Fourier Transform (FFT) analysis on user-generated sound frequencies without stuttering the Three.js render loop.',
    solution: 'Decoupled audio analysis onto worker threads and piped low/mid/high frequency bands into shader uniforms for zero-copy vertex displacement.',
    deliverables: ['Web Audio Synthesizer Engine', 'Audio-Reactive Shader Material', 'Frequency Band Inspector', 'Dynamic Color Harmonics'],
    metrics: [
      { label: 'FFT Sample Rate', value: '48 kHz' },
      { label: 'Audio Latency', value: '< 12ms' },
      { label: 'Harmonic Layers', value: '4 Voices' },
    ],
    tags: ['Web Audio API', 'Frequency Analysis', 'Motion Choreography', 'Vertex Shaders'],
  },
  {
    id: 'project-nova',
    title: 'Nova Spatial Architecture',
    category: '3d-spatial',
    categoryLabel: '3D & Spatial',
    year: '2026',
    tagline: 'Architectural parametric sculpture in pristine white travertine and sapphire glass.',
    heroGradient: 'from-blue-600 via-indigo-600 to-emerald-500',
    visualType: 'spatial',
    overview: 'A virtual exhibition celebrating brutalist and futuristic architectural forms through interactive light choreography and dimensional depth.',
    challenge: 'Render realistic architectural soft shadow occlusion in an open white studio void without crushing performance.',
    solution: 'Designed multi-layer procedural contact grounding planes with soft gradient falloffs and directional key lighting.',
    deliverables: ['Interactive 3D Architectural Scene', 'Daylight Simulation Controls', 'Material Finish Switcher', 'Exploded Wireframe Mode'],
    metrics: [
      { label: 'Procedural Polygons', value: '42,000' },
      { label: 'Shadow Passes', value: '1 Studio Pass' },
      { label: 'Memory Footprint', value: '18 MB' },
    ],
    tags: ['Architectural 3D', 'Three.js', 'Studio Lighting', 'Parametric Forms'],
  },
  {
    id: 'project-prism-editorial',
    title: 'Solstice Editorial System',
    category: 'interactive-web',
    categoryLabel: 'Interactive Web',
    year: '2026',
    tagline: 'Minimalist luxury editorial digital publication with asymmetrical typography.',
    heroGradient: 'from-slate-800 via-indigo-950 to-slate-900',
    visualType: 'editorial',
    overview: 'A digital broadsheet showcasing contemporary generative philosophy, editorial type specimen design, and distraction-free visual storytelling.',
    challenge: 'Honor the dignity of long-form typography while providing intuitive gesture-friendly reading modes for mobile screens.',
    solution: 'Implemented mathematical vertical rhythm, optical kerning compensation, and single-level elevation containers.',
    deliverables: ['Digital Publication Template', 'Editorial Font System Integration', 'Reading Time Calculator', 'Clean Metadata Architecture'],
    metrics: [
      { label: 'Reading Legibility', value: 'WCAG AAA' },
      { label: 'Typographic Scale', value: 'Modular 1.25' },
      { label: 'Bounce Rate (Demo)', value: '14%' },
    ],
    tags: ['Editorial Design', 'Typography', 'Minimalism', 'Content Architecture'],
  },
];

interface ProjectsGalleryProps {
  onStartProject: (initialScope?: string) => void;
}

export default function ProjectsGallery({ onStartProject }: ProjectsGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const filteredProjects = selectedCategory === 'all'
    ? projectsData
    : projectsData.filter((p) => p.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: '3d-spatial', label: '3D & Spatial' },
    { id: 'brand-systems', label: 'Brand Systems' },
    { id: 'interactive-web', label: 'Interactive Web' },
    { id: 'motion-design', label: 'Motion Design' },
  ];

  return (
    <section id="projects" className="py-28 bg-[#FAFAFC] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header & Category Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-indigo-600 tracking-widest uppercase mb-2">
              <span>Showcase</span>
              <span aria-hidden="true" className="text-slate-300">/</span>
              <span>AnK Creative Lab Experiments</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              PROJECT GALLERY
            </h2>
          </div>

          {/* Functional Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedCategory(cat.id);
                }}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Clear Demonstration Note for Transparency */}
        <div className="mb-10 px-4 py-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              <strong>AnK Creative Mind Showcase:</strong> Procedural and interactive experimental prototypes demonstrating our studio visual capabilities and technical standards.
            </span>
          </div>
          <span className="font-mono text-[11px] text-indigo-700 hidden sm:inline-block">Lab Prototypes</span>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => {
                sound.playClick();
                setActiveProject(project);
              }}
              onMouseEnter={() => sound.playHover()}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-2xl hover:border-indigo-300 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              {/* Visual Card Artwork with CSS/SVG procedural graphic preview */}
              <div className="relative h-60 w-full overflow-hidden bg-slate-950 flex items-center justify-center p-6">
                <div className={`absolute inset-0 bg-gradient-to-tr ${project.heroGradient} opacity-85 group-hover:opacity-95 group-hover:scale-105 transition-all duration-500`} />

                {/* Geometric Pattern Overlay */}
                <div className="absolute inset-0 bg-grid-pattern opacity-20" />

                {/* Procedural Visual Artifact representation */}
                <div className="relative z-10 w-28 h-28 rounded-2xl bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                  {project.visualType === 'prism' && (
                    <div className="w-16 h-16 border-2 border-white/80 rotate-45 flex items-center justify-center bg-cyan-400/20 shadow-inner">
                      <div className="w-8 h-8 bg-white/60 rounded-full blur-xs" />
                    </div>
                  )}
                  {project.visualType === 'brand' && (
                    <img
                      src="/assets/aistudio/1792931151691_d855e005.png"
                      alt="AnK Logo"
                      className="w-16 h-16 object-contain drop-shadow-md"
                    />
                  )}
                  {project.visualType === 'kinetic' && (
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <div className="absolute inset-0 border-2 border-cyan-300/80 rounded-full animate-spin duration-1000" />
                      <div className="w-8 h-8 bg-white rounded-full shadow-lg" />
                    </div>
                  )}
                  {project.visualType === 'torus' && (
                    <div className="w-16 h-16 border-4 border-amber-300/80 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-purple-300/80 rounded-full" />
                    </div>
                  )}
                  {project.visualType === 'spatial' && (
                    <div className="w-14 h-14 border border-white/80 flex flex-col justify-between p-2">
                      <div className="w-full h-1 bg-white/80" />
                      <div className="w-2/3 h-1 bg-cyan-300/80" />
                      <div className="w-full h-1 bg-white/80" />
                    </div>
                  )}
                  {project.visualType === 'editorial' && (
                    <div className="font-display font-black text-2xl text-white tracking-widest">
                      AnK
                    </div>
                  )}
                </div>

                {/* Top Corner Badge: Unboxed Year */}
                <div className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-md bg-black/40 backdrop-blur-sm text-[11px] font-mono text-white/90">
                  {project.year}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-7 flex flex-col justify-between flex-grow">
                <div>
                  {/* Clean unboxed category with separator */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-2.5">
                    <span className="text-indigo-600 font-semibold">{project.categoryLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>AnK Lab</span>
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">
                    {project.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6 line-clamp-2">
                    {project.tagline}
                  </p>
                </div>

                {/* Card Action Link */}
                <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                    <span>{project.tags.slice(0, 2).join(' · ')}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
                    <span>View Case Study</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cinematic Project Detail Overlay Modal */}
      {activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col">
            {/* Modal Header Banner */}
            <div className={`relative h-64 sm:h-72 w-full bg-gradient-to-r ${activeProject.heroGradient} p-8 flex flex-col justify-between text-white shrink-0`}>
              {/* Close Button */}
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveProject(null);
                }}
                className="absolute top-6 right-6 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-white/80">
                <span>{activeProject.categoryLabel}</span>
                <span>/</span>
                <span>AnK Creative Prototype {activeProject.year}</span>
              </div>

              <div>
                <h3 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
                  {activeProject.title}
                </h3>
                <p className="text-sm sm:text-base text-white/90 max-w-xl">
                  {activeProject.tagline}
                </p>
              </div>
            </div>

            {/* Modal Content Scroll Area */}
            <div className="p-6 sm:p-10 overflow-y-auto space-y-8">
              {/* Overview */}
              <div>
                <h4 className="text-xs font-mono font-semibold uppercase text-slate-400 tracking-wider mb-2">
                  Project Concept & Overview
                </h4>
                <p className="text-base text-slate-700 leading-relaxed">
                  {activeProject.overview}
                </p>
              </div>

              {/* Challenge vs Solution Split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div>
                  <h5 className="font-display text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    The Creative Challenge
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {activeProject.challenge}
                  </p>
                </div>
                <div>
                  <h5 className="font-display text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    The Dimensional Solution
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {activeProject.solution}
                  </p>
                </div>
              </div>

              {/* Verified Performance Metrics Strip */}
              <div>
                <h4 className="text-xs font-mono font-semibold uppercase text-slate-400 tracking-wider mb-3">
                  Verified Technical Metrics
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  {activeProject.metrics.map((m, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                      <div className="font-display text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">
                        {m.value}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deliverables & Technology Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-mono font-semibold uppercase text-slate-400 tracking-wider mb-3">
                    Key Deliverables
                  </h4>
                  <div className="space-y-2">
                    {activeProject.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-mono font-semibold uppercase text-slate-400 tracking-wider mb-3">
                    Technology Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeProject.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 text-xs font-mono text-slate-700 bg-slate-100 rounded-lg">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer CTA */}
              <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-slate-500">
                  Demonstration prototype engineered by AnK Creative Mind.
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setActiveProject(null);
                    }}
                    className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      const projTitle = activeProject.title;
                      setActiveProject(null);
                      onStartProject(`I am interested in a project similar to ${projTitle}.`);
                    }}
                    className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
                  >
                    <span>Inquire About Similar Project</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
